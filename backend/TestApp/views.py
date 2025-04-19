from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db.models import Count
from posts.models import Post

@api_view(['GET'])
def get_message(request):
    return Response({'message': 'Hello from the backend!'})

def HelloWorld(request):
    return JsonResponse({'message': 'Hello, world!'})

def index(request):
    return render(request, 'index.html')

@api_view(['GET'])
def get_most_liked(request):
    most_liked_posts = Post.objects.annotate(like_count=Count('likes')).order_by('-like_count')[:5]

    response_data = [
        {
            'id': post.id,
            'title': post.title,
            'author': post.author.username,
            'content': post.content,
            'like_count': post.like_count,
        }
        for post in most_liked_posts
    ]

    return JsonResponse({'most_liked_posts': response_data}, status=200)