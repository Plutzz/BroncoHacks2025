from django.urls import path
from . import views

urlpatterns = [
    path('api/message/', views.get_message, name='get_message'),
]
