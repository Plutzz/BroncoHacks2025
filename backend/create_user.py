from accounts.models import CustomUser

# Create a new user
user = CustomUser.objects.create_user(
    username="newuser",  # Username for the new user
    password="password123",  # User's password (it will be hashed)
    email="newuser@example.com"  # User's email
)

# You can also set additional fields
user.first_name = "New"
user.last_name = "User"
user.save()

# Check the new user's details
print(user.username, user.email)
