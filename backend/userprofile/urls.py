from django.urls import path
from .views import user_profile_data, fetch_user_posts, fetch_user_analytics

urlpatterns = [
    path('profile-data/', user_profile_data, name='user_profile_data'),
    path('fetch-user-posts/', fetch_user_posts, name='fetch_user_posts'),
    path('fetch-user-analytics/', fetch_user_analytics, name='fetch_user_analytics'),
]