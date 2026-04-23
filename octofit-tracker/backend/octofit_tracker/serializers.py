from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Team, Activity, Leaderboard, Workout
from bson import ObjectId

class ObjectIdField(serializers.Field):
    def to_representation(self, value):
        return str(value) if isinstance(value, ObjectId) else value
    def to_internal_value(self, data):
        return ObjectId(data)

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    id = ObjectIdField(source='_id', read_only=True)
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'is_active', 'is_staff']

class TeamSerializer(serializers.ModelSerializer):
    id = ObjectIdField(source='_id', read_only=True)
    class Meta:
        model = Team
        fields = ['id', 'name']

class ActivitySerializer(serializers.ModelSerializer):
    id = ObjectIdField(source='_id', read_only=True)
    class Meta:
        model = Activity
        fields = ['id', 'user', 'type', 'duration', 'team']

class LeaderboardSerializer(serializers.ModelSerializer):
    id = ObjectIdField(source='_id', read_only=True)
    class Meta:
        model = Leaderboard
        fields = ['id', 'team', 'points']

class WorkoutSerializer(serializers.ModelSerializer):
    id = ObjectIdField(source='_id', read_only=True)
    class Meta:
        model = Workout
        fields = ['id', 'name', 'difficulty']
