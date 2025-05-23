from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_exempt
from accounts.models import CustomUser
from rest_framework import status
from posts.models import Tag
from django.http import JsonResponse
from .serializers import UserProfileSerializer
from rest_framework.permissions import IsAuthenticated

@ensure_csrf_cookie
@api_view(['POST'])
def login_view(request):
    if request.method == 'POST':
        print("REQUEST" + str(request.data))
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            return Response({'success': True, 'username': user.username})
        else:
            return Response({'success': False, 'error': 'Invalid credentials'}, status=401)
    
    # For GET requests, render the login template
    return render(request, '')

@api_view(['POST'])
def logout_view(request):
    print(request.user)
    logout(request)
    return Response({'success': True})

# Optional: Registration view
@api_view(['POST'])
def register_view(request):
    if request.method == 'POST':
        # Handle registration logic
        # This is simplified - you'd validate data and handle errors
        print("RECIEVED POST")
        username = request.data.get('username')
        password = request.data.get('password')
        email = request.data.get('email')
        tag_names = request.data.get('tags', [])

        try:
            user = CustomUser.objects.create_user(username, email, password)
            if tag_names:
               tag_qs = Tag.objects.filter(name__in=tag_names)
               user.tags.set(tag_qs)
            user.save()
            login(request, user)
            return Response({'success': True})
        except Exception as e:
            return Response({'success': False, 'error': str(e)}, status=400)
    
    return render(request, 'accounts/register.html')

@api_view(['GET'])
def check_authentication(request):
    print("Check Auth", request.user, request.user.is_authenticated)
    if request.user.is_authenticated:
        return Response({'authenticated': True, 'username': request.user.username})
    else:
        return Response({'authenticated': False})
    
@api_view(['GET'])
def get_current_user(request):
    if not request.user.is_authenticated:
        # anonymous → return null payload
        return JsonResponse({'user': None}, status=200)
    user = request.user
    return JsonResponse({
        'user': {
            'id': user.id,
            'username': user.username,
            'email': user.email,
        }
    }, status=200)

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_profile(request):
    user = request.user
    print(request.data)
    serializer = UserProfileSerializer(user, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()

        tag_names = request.data.get('tags')
        if tag_names:
            if isinstance(tag_names, str):
                tag_names = [t.strip() for t in tag_names.split(',')]

            tag_objs = []
            for name in tag_names:
                tag, created = Tag.objects.get_or_create(name=name)
                tag_objs.append(tag)

            user.tags.set(tag_objs)  # Replace existing tags
            user.save()

        return Response({'message': 'Profile updated successfully', 'user': serializer.data}, status=200)
    return Response(serializer.errors, status=400)

@api_view(['GET'])
@ensure_csrf_cookie
def get_csrf_cookie(request):
    return Response({'detail': 'CSRF cookie set'})