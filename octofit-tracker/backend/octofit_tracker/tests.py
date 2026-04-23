from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from .models import Team, Activity, Leaderboard, Workout
from django.contrib.auth import get_user_model

User = get_user_model()

class APITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.team = Team.objects.create(name="Marvel")
        self.user = User.objects.create_user(username="ironman", email="ironman@marvel.com", password="testpass")
        self.activity = Activity.objects.create(user="ironman", type="run", duration=30, team="Marvel")
        self.leaderboard = Leaderboard.objects.create(team="Marvel", points=100)
        self.workout = Workout.objects.create(name="Pushups", difficulty="Easy")

    def test_api_root(self):
        response = self.client.get(reverse('api-root'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_team_list(self):
        response = self.client.get('/api/teams/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_activity_list(self):
        response = self.client.get('/api/activities/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_leaderboard_list(self):
        response = self.client.get('/api/leaderboard/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_workout_list(self):
        response = self.client.get('/api/workouts/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_user_list(self):
        response = self.client.get('/api/users/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
