import os
import django

# Set the settings module (replace with your actual settings path)
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

from accounts.models import CustomUser

# Create a new user
user = CustomUser.objects.create_user(
    username="Ben",  # Username for the new user
    password="Ben123",  # User's password (it will be hashed)
	email="Ben@Ben.com"
)


user.save()

# Check the new user's details
print(user.username)
