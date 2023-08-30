from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from django.contrib.auth import authenticate

from .models import CustomUser


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        style={"input_type": "password"},
        validators=[validate_password],
    )
    re_password = serializers.CharField(
        write_only=True, style={"input_type": "password"}
    )

    class Meta:
        model = CustomUser
        fields = ["email", "username", "fullname", "phone", "password", "re_password"]

    def validate(self, attrs):
        if attrs["password"] != attrs["re_password"]:
            raise serializers.ValidationError(
                {"error": "Password fields didn't match."}
            )
        return attrs

    def create(self, validated_data):
        user = self.Meta.model.objects.create(
            email=validated_data["email"],
            username=validated_data["username"],
            fullname=validated_data["fullname"],
            phone=validated_data.get("phone", None),
        )
        user.set_password(validated_data["password"])
        user.save()
        return user


class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField(max_length=50)
    password = serializers.CharField(write_only=True, style={"input_type": "password"})

    def check_user(self, data):
        user = authenticate(
            username=data["email"], password=data["password"]
        )
        return user


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ["id", "email", "username", "fullname", "phone"]
