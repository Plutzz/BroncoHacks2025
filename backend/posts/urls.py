# urls.py
from django.urls import path
from . import views


urlpatterns = [
    path('create/', views.create_post, name='create_post'),
    path('like/', views.like_post, name='like_post'),
    path('fetch_posts/', views.fetch_posts, name='fetch_posts'),
    path('delete_post/', views.delete_post, name='delete_post'),
]
