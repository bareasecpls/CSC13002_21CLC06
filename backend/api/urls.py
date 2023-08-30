from django.urls import path
from api.views import (
	RegisterAPIView,
	LoginAPIView,
	LogoutAPIView,
 	UserAPIView,
)


urlpatterns = [
    path('register/', RegisterAPIView.as_view(), name='register'),
    path('login/', LoginAPIView.as_view(), name='login'),
    path('logout/', LogoutAPIView.as_view(), name='logout'),
    path('users/', UserAPIView.as_view(), name='users'),
]