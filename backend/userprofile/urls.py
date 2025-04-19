from django.urls import path
from .views import user_profile_data, fetch_user_posts as user

urlpatterns = [
    path('profile-data/', user_profile_data, name='user_profile_data'),
    path('fetch-user-posts/', user, name='fetch_user_posts'),
]