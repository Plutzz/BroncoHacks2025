from rest_framework.decorators import api_view
from rest_framework.response import Response
from posts.models import Post, PostLike
from posts.serializers import PostSerializer
from .serializers import UserSerializer

@api_view(['GET'])
def user_profile_data(request):
    if request.user.is_authenticated:
        # Fetch liked posts
        liked_posts = PostLike.objects.filter(user=request.user).select_related('posts')
        liked_posts_data = PostSerializer([like.post for like in liked_posts], many=True).data

        # Fetch user's own posts
        user_posts = Post.objects.filter(user=request.user)
        user_posts_data = PostSerializer(user_posts, many=True).data

        # Fetch username
        username = request.user.username

        # Combine all data into a single response
        return Response({
            'username': username,
            'liked_posts': liked_posts_data,
            'your_posts': user_posts_data,
        })

    return Response({'error': 'Unauthorized'}, status=401)