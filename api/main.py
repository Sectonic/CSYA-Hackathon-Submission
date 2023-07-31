from flask import Flask, request, jsonify
from flask_restful import Api, Resource, fields, marshal_with
from flask_sqlalchemy import SQLAlchemy
import requests
import os
from dotenv import load_dotenv
import json

app = Flask(__name__)
api = Api(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
db = SQLAlchemy(app)

class Meal(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    image_url = db.Column(db.String)
    notes = db.Column(db.String)
    calories = db.Column(db.Integer)
    foods = db.relationship('Food', backref='foods', lazy=True)

class Food(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    image_url = db.Column(db.String)
    food_id = db.Column(db.String)
    meal = db.Column(db.Integer, db.ForeignKey('meal.id'))

load_dotenv()
API_KEY = os.getenv('API_KEY')
APP_ID = os.getenv('APP_ID')
API_URL = 'https://api.edamam.com/api/food-database/v2'

resource_fields = {
    'id': fields.Integer,
    'title': fields.String,
    'subtitle': fields.String,
    'calories': fields.Integer,
    'image': fields.String
}

def toDict(row):
    d = {}
    for column in row.__table__.columns:
        d[column.name] = str(getattr(row, column.name))

    return d

class Meals(Resource):

    @marshal_with({ 'meals': fields.List(fields.Nested(resource_fields))})
    def get(self):
        all_meals = Meal.query.all()
        meals_dict = [{
            'id': meal.id,
            'title': meal.name,
            'subtitle': 'You',
            'calories': meal.calories,
            'image': meal.image_url
        } for meal in all_meals]
        return { 'meals': meals_dict }, 200
    
    def post(self):
        data = request.get_json()
        check_name = Meal.query.filter_by(name=data['name'])
        if check_name.count > 0:
            return {'message': 'Name already taken'}, 500
        new_meal = Meal(name=data['name'], image_url=data['image_url'], notes=data['notes'])
        db.session.add(new_meal)
        db.session.commit()
        return {'message': 'Successfully created meal'}, 200
    
    def put(self):
        data = request.get_json()
        current_meal = Meal.query.filter_by(id=data['id']).first()

        if data['name']:
            current_meal.name = data['name']

        if data['notes']:
            current_meal.notes = data['notes']

        if data['image_url']:
            current_meal.image_url = data['image_url']

        if data['foods']:
            current_foods = Food.query.filter_by(meal=current_meal.id)
            for food in current_foods:
                db.session.delete(food)
            for food in data['foods']:
                new_food = Food(name=food['name'], image_url=food['image'], food_id=food['food_id'], meal=data['id'])
                db.session.add(new_food)

        db.session.commit()
        return {'message': 'Successfully updated meal'}, 200
    
    def delete(self):
        mealId = request.args.get('mealId')
        meal = Meal.query.filter_by(id=mealId).first()
        db.session.delete(meal)
        db.session.commit()
        return {'message': 'Successfully deleted meal'}, 200

class OneMeal(Resource):

    def get(self):
        meal_query = Meal.query.filter_by(id=int(request.args.get('mealId'))).first()
        meal = { 'title': meal_query.name, 'notes': meal_query.notes, 'calories': meal_query.calories, 'image': meal_query.image_url }
        foods = Food.query.filter_by(meal=meal_query.id).all()
        foods_dict = [{ 'name': food.name, 'image': food.image_url, 'food_id': food.food_id } for food in foods]
        nutrients_info = {
            "totalNutrients": {},
            "totalDaily": {}
        }
        params = {
            'app_id': APP_ID,
            'app_key': API_KEY,
        }
        for food in foods:
            body = {
                "ingredients": [{
                    "foodId": food.food_id,
                    "quantity": 100,
                    "measureURI": "http://www.edamam.com/ontologies/edamam.owl#Measure_gram"
                }]
            }
            url = f"{API_URL}/nutrients"
            response = requests.post(url, params=params, json=body)
            data = response.json()
            for key in ["totalNutrients", "totalDaily"]:
                for k,v in data[key].items():
                    if k in nutrients_info[key]:
                        nutrients_info[key][k]['quantity'] += v['quantity']
                    else:
                        nutrients_info[key][k] = v
        return {'foods': foods_dict, 'meal': meal, 'nutrients': nutrients_info}
    
class Foods(Resource):

    def get(self):

        category_list = {
            'High Blood Sugar': 'low-sugar',
            'Overweight': 'low-fat-abs',
            'Vegetarian': 'vegetarian',
        }

        query = request.args.get('ingr')
        healthArr = []
        categories = request.args.get('categories').split(',') if request.args.get('categories') else []
        for category in categories:
            healthArr.append(category_list[category])

        params = {
            'app_id': APP_ID,
            'app_key': API_KEY,
            'ingr': query,
            'heath': healthArr,
        }
        url = f"{API_URL}/parser"
        response = requests.get(url, params=params)
        data = response.json()
        foods = []
        for food in data['hints']:
            foods.append({ 
                'id': food['food']['foodId'],
                'title': food['food']['label'],
                'subtitle': food['food']['brand'] if 'brand' in food['food'] else None,
                'calories': food['food']['nutrients']['ENERC_KCAL'],
                'image': food['food']['image'] if 'image' in food['food'] else None
            })
        return foods, 200
    
    def post(self):
        data = request.get_json()
        params = {
            'app_id': APP_ID,
            'app_key': API_KEY,
        }
        body = {
            "ingredients": [{
                "foodId": data['foodId'],
                "quantity": 100,
                "measureURI": "http://www.edamam.com/ontologies/edamam.owl#Measure_gram"
            }]
        }
        url = f"{API_URL}/nutrients"
        response = requests.post(url, params=params, json=body)
        data = response.json()
        return data, 200

api.add_resource(Meals, '/meals')
api.add_resource(OneMeal, '/meal')
api.add_resource(Foods, '/foods')

if __name__ == '__main__':
    app.run(host='10.0.0.58')