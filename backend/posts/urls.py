# urls.py
from django.urls import path
from .views import create_post, like_post, fetch_posts


urlpatterns = [
    path('create/', create_post, name='create_post'),
    path('like/', like_post, name='like_post'),
    path('fetch_posts/', fetch_posts, name='fetch_posts'),

]
