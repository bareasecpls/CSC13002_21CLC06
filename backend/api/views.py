from django.contrib.auth import login, logout
from django.db.models import Q
from django.http import Http404
from rest_framework import status
from rest_framework.generics import (
    CreateAPIView,
    DestroyAPIView,
    GenericAPIView,
    ListAPIView,
    UpdateAPIView,
)
from rest_framework.permissions import AllowAny, IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Book, Cart, Category, CustomUser, Order, OrderItem
from .serializers import (
    BookSerializer,
    CartListSerializer,
    CartSerializer,
    CategorySerializer,
    OrderSerializer,
    UserLoginSerializer,
    UserRegistrationSerializer,
    UserSerializer,
)

# ==================== USER ====================


class RegisterAPIView(CreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = UserRegistrationSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginAPIView(GenericAPIView):
    permission_classes = [AllowAny]
    serializer_class = UserLoginSerializer

    def post(self, request):
        data = request.data
        serializer = self.serializer_class(data=data)
        if serializer.is_valid(raise_exception=True):
            user = serializer.check_user(data)
            if user:
                login(request, user)
                user_data = UserSerializer(user).data
                return Response(user_data, status=status.HTTP_200_OK)
            return Response(
                {"error": "Email or password is incorrect!"},
                status=status.HTTP_401_UNAUTHORIZED,
            )


class LogoutAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        logout(request)
        response = Response(status=status.HTTP_204_NO_CONTENT)
        return response


class UserAPIView(ListAPIView):
    permission_classes = [IsAuthenticated, IsAdminUser]
    serializer_class = UserSerializer
    queryset = CustomUser.objects.all()


# ==================== BOOK ====================


class CategoryListView(ListAPIView):
    permission_classes = [AllowAny]
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class BookListView(ListAPIView):
    permission_classes = [AllowAny]
    queryset = Book.objects.all()
    serializer_class = BookSerializer


class BookSearchView(ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = BookSerializer

    def get_queryset(self):
        keyword = self.request.query_params.get("q")

        if keyword:
            keyword = keyword.strip()
            # Perform case-insensitive search on title or author
            return Book.objects.filter(
                Q(title__icontains=keyword) | Q(author__icontains=keyword)
            )
        else:
            # Return all books if no keyword is provided
            return Book.objects.all()


# Add/Update/Delete book are supported by admin site


# ==================== CART ====================


class CartListView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CartListSerializer

    def get_queryset(self):
        user_id = self.kwargs.get("user_id")
        return Cart.objects.filter(user__id=user_id)


class CartAddBookView(CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CartSerializer

    def create(self, request, **kwargs):
        user_id = kwargs.get("user_id")
        book_id = request.data.get("book_id")
        quantity = int(request.data.get("quantity", 1))

        try:
            user = CustomUser.objects.get(pk=user_id)
            book = Book.objects.get(pk=book_id)
        except (CustomUser.DoesNotExist, Book.DoesNotExist):
            return Response(
                {"detail": "User or book not found."}, status=status.HTTP_404_NOT_FOUND
            )

        cart_item = Cart.objects.filter(user=user, book=book).first()
        if cart_item:
            if book.units_in_stock < cart_item.quantity + quantity:
                return Response(
                    {"error": "There are not enough items in stock."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            cart_item.quantity += quantity
            cart_item.save()
        else:
            if book.units_in_stock < quantity:
                return Response(
                    {"error": "There are not enough items in stock."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            cart_item = Cart.objects.create(user=user, book=book, quantity=quantity)

        book.units_in_stock -= quantity
        book.save()

        serializer = CartSerializer(cart_item)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class CartUpdateBookView(UpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CartSerializer

    def update(self, request, **kwargs):
        user_id = kwargs.get("user_id")
        book_id = request.data.get("book_id")
        new_quantity = int(request.data.get("quantity"))

        try:
            book = Book.objects.get(pk=book_id)
        except Book.DoesNotExist:
            return Response(
                {"detail": "Book not found."}, status=status.HTTP_404_NOT_FOUND
            )

        try:
            cart_item = Cart.objects.get(user__id=user_id, book=book)

            if int(new_quantity) <= 0:
                return Response(
                    {"detail": "Quantity must be greater than zero."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            if book.units_in_stock < new_quantity - cart_item.quantity:
                return Response(
                    {"error": "There are not enough items in stock."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            book.units_in_stock -= new_quantity - cart_item.quantity
            book.save()

            cart_item.quantity = new_quantity
            cart_item.save()

            serializer = CartSerializer(cart_item)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Cart.DoesNotExist:
            return Response(
                {"detail": "Cart or book not found."}, status=status.HTTP_404_NOT_FOUND
            )


class CartDeleteBookView(DestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CartSerializer

    def get_object(self):
        user_id = self.kwargs.get("user_id")
        book_id = self.kwargs.get("book_id")

        try:
            cart_item = Cart.objects.get(user__id=user_id, book__id=book_id)
            return cart_item
        except Cart.DoesNotExist:
            raise Http404("Cart item not found.")

    def perform_destroy(self, instance):
        book = instance.book
        book.units_in_stock += instance.quantity
        book.save()
        instance.delete()


# ==================== ORDER ====================


class OrderListView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = OrderSerializer

    def get_queryset(self):
        user_id = self.kwargs.get("user_id")
        return Order.objects.filter(user__id=user_id).prefetch_related("orderitem_set")


class OrderCreateView(CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = OrderSerializer

    def create(self, request, **kwargs):
        user_id = kwargs.get("user_id")

        try:
            user = CustomUser.objects.get(pk=user_id)
        except CustomUser.DoesNotExist:
            return Response(
                {"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND
            )

        cart = Cart.objects.filter(user=user)
        if cart.count() < 1:
            return Response(
                {"detail": "No items in cart."}, status=status.HTTP_204_NO_CONTENT
            )

        order = Order.objects.create(user=user, **request.data)
        for item in cart:
            book = item.book
            quantity = item.quantity
            subtotal = book.price * quantity
            OrderItem.objects.create(
                order=order, book=book, quantity=quantity, subtotal=subtotal
            )
        cart.delete()

        serializer = self.serializer_class(order)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
