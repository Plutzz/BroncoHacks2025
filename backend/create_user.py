import os
import django

# Set the settings module (replace with your actual settings path)
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

from accounts.models import CustomUser

# Create a new user
user = CustomUser.objects.create_user(
    username="testusername",  # Username for the new user
    password="testpassword123",  # User's password (it will be hashed)
)


user.save()

# Check the new user's details
print(user.username)
