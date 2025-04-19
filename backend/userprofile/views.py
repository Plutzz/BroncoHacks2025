from rest_framework.decorators import api_view
from rest_framework.response import Response
from posts.models import Post, PostLike
from posts.serializers import PostSerializer
from accounts.models import CustomUser
from django.http import JsonResponse

@api_view(['GET'])
def user_profile_data(request):
    if request.user.is_authenticated:
        # Fetch liked posts
        liked_posts = PostLike.objects.filter(user=request.user).select_related('post')
        liked_posts_data = PostSerializer([like.post for like in liked_posts], many=True).data

        # Fetch user's own posts
        user_posts = Post.objects.filter(user=request.user)
        user_posts_data = PostSerializer(user_posts, many=True).data
        
        # Fetch user details
        user = CustomUser.objects.get(username=request.user.username)
        user_data = {
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'bio': user.bio,
            'profile_picture': user.avatar if user.avatar else None,
        }

        # Combine all data into a single response
        return Response({
            'username': user_data['username'],
            'name' : user_data['first_name'] + ' ' + user_data['last_name'],
            'avatar': user_data['profile_picture'] if user_data['profile_picture'] else None,
            'bio' : user_data['bio'],
            'tags': [t.name for t in user.tags.all()],
            'liked_posts': liked_posts_data,
            'your_posts': user_posts_data,
            **user_data,
        })

    return Response({'error': 'Unauthorized'}, status=401)

@api_view(['GET'])
def fetch_user_posts(request):
    """
    Return only the posts created by the current authenticated user.
    """
    user_posts = Post.objects.filter(user=request.user).order_by('-created_at')
    data = []
    for post in user_posts:
        data.append({
            'id': post.id,
            'title': post.title,
            'content': post.description,
            'author': post.user.username,
            'created_at': post.created_at.isoformat(),
            'tags': [t.name for t in post.tags.all()],
        })
    return JsonResponse({'data': data}, status=200)