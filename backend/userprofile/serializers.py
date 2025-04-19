from django.contrib.auth import get_user_model
from rest_framework import serializers

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        # include whatever profile fields you added on CustomUser:
        fields = ['id', 'username', 'email', 'bio', 'occupation', 'avatar']