from rest_framework import serializers
from .models import Post, Comment

class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ['id', 'title', 'pitch', 'description', 'created_at']  # Include fields you want to expose

class CommentSerializer(serializers.ModelSerializer):
    author = serializers.CharField(source='user.username')

    class Meta:
        model = Comment
        fields = ['id', 'post', 'content', 'user', 'author', 'created_at']
