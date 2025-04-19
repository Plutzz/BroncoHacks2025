# urls.py
from django.urls import path
from .views import create_post, like_post


urlpatterns = [
    path('create/', create_post, name='create_post'),
    path('like/', like_post, name='like_post'),

]
