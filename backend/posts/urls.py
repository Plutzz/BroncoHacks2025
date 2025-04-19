# urls.py
from django.urls import path
from . import views


urlpatterns = [
    path('create/', views.create_post, name='create_post'),
    path('like/', views.toggle_like, name='like_post'),
    path('fetch_posts/', views.fetch_posts, name='fetch_posts'),
    path('delete_post/', views.delete_post, name='delete_post'),
    path('search/', views.search_posts, name='search_posts'),
    path('comment/', views.create_comment, name='comment'),
    path('fetch_comments/', views.fetch_comments, name='fetch_comment'),
    path('<int:id>/update/', views.update_post, name='update_post'),
    path('<int:id>/', views.get_post, name='get_post'),
    path('view_post/', views.view_post, name='view_post'),
]
