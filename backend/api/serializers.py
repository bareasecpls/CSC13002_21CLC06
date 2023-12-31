from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from rest_framework.serializers import ModelSerializer, Serializer
from django.contrib.auth import authenticate

from .models import CustomUser, Book, Cart, Order, OrderItem, Category


class UserRegistrationSerializer(ModelSerializer):
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


class UserLoginSerializer(Serializer):
    email = serializers.EmailField(max_length=50)
    password = serializers.CharField(write_only=True, style={"input_type": "password"})

    def check_user(self, data):
        user = authenticate(username=data["email"], password=data["password"])
        return user


class UserSerializer(ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ["id", "email", "username", "fullname", "phone"]


class CategorySerializer(ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"


class BookSerializer(ModelSerializer):
    class Meta:
        model = Book
        fields = "__all__"


class CartSerializer(ModelSerializer):
    book = BookSerializer(read_only=True)

    class Meta:
        model = Cart
        fields = ["book", "quantity"]


class OrderItemSerializer(ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ["id", "order_id", "book_id", "quantity", "subtotal"]


class OrderSerializer(ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = "__all__"
        extra_fields = ["items"]
