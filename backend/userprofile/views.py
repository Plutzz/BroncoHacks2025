from rest_framework.decorators import api_view
from django.contrib.auth.decorators import login_required
from rest_framework.response import Response
from posts.models import Post, PostLike, Tag
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
            'occupation': user.occupation,
            'profile_picture': user.avatar.url if user.avatar else None,
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

@login_required
@api_view(['GET'])
def fetch_user_posts(request):
    """
    Return only the posts created by the current authenticated user.
    """
    user_posts = Post.objects.filter(user=request.user).order_by('-created_at')
    data = [{
            'id': post.id,
            'title': post.title,
            'content': post.description,
            'tech_stack': post.tech_stack,
            'pitch': post.pitch,
            'github_link': post.github_link,
            'author': post.user.username,
            'avatar': post.user.avatar.url if post.user.avatar else None,
            'files': post.files.url if post.files else None,
            'created_at': post.created_at.isoformat(),
            'tags': [t.name for t in post.tags.all()],
            'likes_count': post.likes.count(),
            'comments_count': post.comments.count(),
            'view_count': post.view_count,
            'likes': list(post.likes.values_list('user_id', flat=True)),
            'comments': [
                {
                    'id': comment.id,
                    'content': comment.content,
                    'author': comment.user.username,
                    'created_at': comment.created_at.isoformat()
                } for comment in post.comments.all()
            ],
        }
        for post in user_posts
        ]
    return JsonResponse({'data': data}, status=200)

@login_required
@api_view(['PUT'])
def update_user_profile(request):
    if request.method == 'PUT' and request.user.is_authenticated:
        user = request.user
        data = request.data

        tag_names = data.get('tags', [])

        user.tags.set(
            [Tag.objects.get_or_create(name=n)[0] for n in tag_names]
        )
        # Handle profile picture upload
        if 'avatar' in request.FILES:
            user.avatar = request.FILES['avatar']
            
        # Update user profile fields
        user.username = data.get('username', user.username)
        user.bio = data.get('bio', user.bio)
        user.occupation = data.get('occupation', user.occupation)
        user.email = data.get('email', user.email)
        # Save the updated user instance
        user.save()

        return JsonResponse({'message': 'Profile updated successfully'}, status=200)

    return JsonResponse({'error': 'Unauthorized'}, status=401)