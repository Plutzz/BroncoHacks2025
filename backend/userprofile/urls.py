from django.urls import path
from .views import user_profile_data

urlpatterns = [
    path('profile-data/', user_profile_data, name='user_profile_data'),
]