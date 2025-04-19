from django.urls import path
from . import views
from django.contrib.auth import authenticate, login, logout
urlpatterns = [
    path('api/message/', views.get_message, name='get_message'),
]
