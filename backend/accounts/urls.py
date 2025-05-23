# accounts/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.login_view, name='login'),
    path('register/', views.register_view, name='register'),
    path('check_authentication/', views.check_authentication, name='check_authentication'),
    path('logout/', views.logout_view, name='logout'),
    path('get_current_user/', views.get_current_user, name='get_current_user'),
    path('update/', views.update_profile, name='update_profile'),
    path('get_csrf_cookie/', views.get_csrf_cookie, name='get_csrf_cookie'),
]
