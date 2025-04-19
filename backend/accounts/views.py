from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_exempt
from .models import CustomUser


@ensure_csrf_cookie
@api_view(['POST'])
def login_view(request):
    if request.method == 'POST':
        print("REQUEST" + str(request.data))
        username = request.data.get('username')
        password = request.data.get('password')
        email = request.data.get('email')

        print(username,password, email)

        user = authenticate(request, username=username, password=password)
        
        if user is not None:
            print("USER: ", user)
            login(request, user)
            return Response({'success': True, 'username': user.username})
        else:
            return Response({'success': False, 'error': 'Invalid credentials'}, status=401)
    
    # For GET requests, render the login template
    return render(request, 'accounts/login.html')

@api_view(['POST'])
def logout_view(request):
    logout(request)
    return Response({'success': True})

# Optional: Registration view
@api_view(['POST'])
def register_view(request):
    if request.method == 'POST':
        # Handle registration logic
        # This is simplified - you'd validate data and handle errors
        from django.contrib.auth.models import User
        username = request.data.get('username')
        password = request.data.get('password')
        email = request.data.get('email', '')
        
        try:
            user = CustomUser.objects.create_user(username, email, password)
            login(request, user)
            return Response({'success': True})
        except Exception as e:
            return Response({'success': False, 'error': str(e)}, status=400)
    
    return render(request, 'accounts/register.html')

