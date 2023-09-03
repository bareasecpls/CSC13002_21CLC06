from django.urls import path
from api.views import (
	RegisterAPIView,
	LoginAPIView,
	LogoutAPIView,
 	# UserAPIView,
    BookListView,
    CartListBooksView,
    CartAddBookView,
    CartUpdateBookView,
    CartDeleteBookView,
)


urlpatterns = [
    # user
    path('register/', RegisterAPIView.as_view(), name='register'),
    path('login/', LoginAPIView.as_view(), name='login'),
    path('logout/', LogoutAPIView.as_view(), name='logout'),
    # path('users/', UserAPIView.as_view(), name='users'),
    # book
    path('books/',  BookListView.as_view(), name='list-books'),
    # cart
    path('cart/<int:user_id>/', CartListBooksView.as_view(), name='cart-list-books'),
    path('cart/<int:user_id>/add', CartAddBookView.as_view(), name='cart-add-book'),
    path('cart/<int:user_id>/update', CartUpdateBookView.as_view(), name='cart-update-book'),
    path('cart/<int:user_id>/delete/<int:book_id>', CartDeleteBookView.as_view(), name='cart-delete-book'),
    # order
]