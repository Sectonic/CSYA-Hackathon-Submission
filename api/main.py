from flask import Flask, request, jsonify
from flask_restful import Api, Resource
from flask_sqlalchemy import SQLAlchemy
import requests
import os
from dotenv import load_dotenv

app = Flask(__name__)
api = Api(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
db = SQLAlchemy(app)

class Meal(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    image_url = db.Column(db.String)
    notes = db.Column(db.String)
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

class Meals(Resource):

    def get(self):
        all_meals = Meal.query.all()
        return jsonify(all_meals), 200
    
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

        if 'name' in data:
            check_name = Meal.query.filter_by(name=data['name'])
            if check_name.count > 0:
                return {'message': 'Name already taken'}, 500
            current_meal.name = data['name']

        if 'notes' in data:
            current_meal.notes = data['notes']

        if 'image_url' in data:
            current_meal.image_url = data['image_url']

        if 'foods' in data:
            current_foods = Foods.query.filter_by(meal=current_meal.id)
            for food in current_foods:
                db.session.delete(food)
            for food in data['foods']:
                new_food = Food(name=food['name'], image_url=food['image_url'], food_id=food['food_id'], meal=data['id'])
                db.session.add(new_food)

        db.session.commit()
        return {'message': 'Successfully updated meal'}, 200
    
    def delete(self):
        mealId = request.args.get('mealId')
        meal = Meal.query.filter_by(id=mealId).first()
        db.session.delete(meal)
        db.session.commit()
        return {'message': 'Successfully deleted meal'}, 200
    
class Foods(Resource):

    def get(self):
        query = request.args.get('ingr')
        params = {
            'app_id': APP_ID,
            'app_key': API_KEY,
            'ingr': query,
            'category': ['generic-foods'],
        }
        url = f"{API_URL}/parser"
        response = requests.get(url, params=params)
        data = response.json()
        foods = []
        for food in data['hints']:
            foods.append({ 
                'id': food['food']['foodId'],
                'name': food['food']['label'],
                'known': food['food']['knownAs'],
                'nutrition': food['food']['nutrients'],
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
                "foodId": data['food_id'],
                "quantity": 100,
                "measureURI": "http://www.edamam.com/ontologies/edamam.owl#Measure_gram"
            }]
        }
        url = f"{API_URL}/nutrients"
        response = requests.post(url, params=params, json=body)
        data = response.json()
        return data, 200

api.add_resource(Meals, '/meals')
api.add_resource(Foods, '/foods')

if __name__ == '__main__':
    app.run()