from django.urls import path
from api.views import (
    RegisterAPIView,
    LoginAPIView,
    LogoutAPIView,
    UserAPIView,
    BookListView,
    CartListView,
    CartAddBookView,
    CartUpdateBookView,
    CartDeleteBookView,
    OrderListView,
    OrderCreateView,
)


urlpatterns = [
    # user
    path('register/', RegisterAPIView.as_view(), name='register'),
    path('login/', LoginAPIView.as_view(), name='login'),
    path('logout/', LogoutAPIView.as_view(), name='logout'),
    path('users/', UserAPIView.as_view(), name='list-users'),
    # book
    path('books/',  BookListView.as_view(), name='list-books'),
    # cart
    path('cart/<int:user_id>/', CartListView.as_view(), name='user-cart-list-books'),
    path('cart/<int:user_id>/add', CartAddBookView.as_view(), name='user-cart-add-book'),
    path('cart/<int:user_id>/update', CartUpdateBookView.as_view(), name='user-cart-update-book'),
    path('cart/<int:user_id>/delete/<int:book_id>', CartDeleteBookView.as_view(), name='user-cart-delete-book'),
    # order
    path('orders/<int:user_id>/', OrderListView.as_view(), name='user-list-orders'),
    path('orders/<int:user_id>/create', OrderCreateView.as_view(), name='user-create-order'),
]