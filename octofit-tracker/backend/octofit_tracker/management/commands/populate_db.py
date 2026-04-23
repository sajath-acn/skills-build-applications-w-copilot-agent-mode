from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from djongo import models

# Define models for demonstration (in real app, use models.py)
class Team(models.Model):
    name = models.CharField(max_length=100, unique=True)
    class Meta:
        app_label = 'octofit_tracker'

class Activity(models.Model):
    user = models.CharField(max_length=100)
    type = models.CharField(max_length=100)
    duration = models.IntegerField()
    team = models.CharField(max_length=100)
    class Meta:
        app_label = 'octofit_tracker'

class Leaderboard(models.Model):
    team = models.CharField(max_length=100)
    points = models.IntegerField()
    class Meta:
        app_label = 'octofit_tracker'

class Workout(models.Model):
    name = models.CharField(max_length=100)
    difficulty = models.CharField(max_length=50)
    class Meta:
        app_label = 'octofit_tracker'

class Command(BaseCommand):
    help = 'Populate the octofit_db database with test data'

    def handle(self, *args, **kwargs):
        User = get_user_model()
        # Clear data
        User.objects.all().delete()
        Team.objects.all().delete()
        Activity.objects.all().delete()
        Leaderboard.objects.all().delete()
        Workout.objects.all().delete()

        # Teams
        marvel = Team.objects.create(name='Marvel')
        dc = Team.objects.create(name='DC')

        # Users
        users = [
            User.objects.create_user(username='ironman', email='ironman@marvel.com', password='pass'),
            User.objects.create_user(username='captainamerica', email='cap@marvel.com', password='pass'),
            User.objects.create_user(username='batman', email='batman@dc.com', password='pass'),
            User.objects.create_user(username='superman', email='superman@dc.com', password='pass'),
        ]

        # Activities
        Activity.objects.create(user='ironman', type='run', duration=30, team='Marvel')
        Activity.objects.create(user='batman', type='cycle', duration=45, team='DC')

        # Leaderboard
        Leaderboard.objects.create(team='Marvel', points=100)
        Leaderboard.objects.create(team='DC', points=80)

        # Workouts
        Workout.objects.create(name='Pushups', difficulty='Easy')
        Workout.objects.create(name='Deadlift', difficulty='Hard')

        self.stdout.write(self.style.SUCCESS('octofit_db populated with test data.'))
