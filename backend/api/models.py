from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models


# Customer user will need a custom manager
# Ref: https://docs.djangoproject.com/en/4.2/topics/auth/customizing/#writing-a-manager-for-a-custom-user-model
class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None):
        if not email:
            raise ValueError('Email is required.')
        if not password:
            raise ValueError('Password is required.')
        email = self.normalize_email(email)
        user = self.model(email=email)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, password=None):
        if not email:
            raise ValueError('Email is required.')
        if not password:
            raise ValueError('Password is required.')
        user = self.create_user(email, password)
        user.is_superuser = True
        user.is_staff = True
        user.save()
        return user


class CustomUser(AbstractBaseUser, PermissionsMixin):
    # initial fields: id, password, last_login
    email = models.EmailField(max_length=50, unique=True)
    username = models.CharField(max_length=25)
    fullname = models.CharField(max_length=150)
    phone = models.CharField(max_length=15)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateField(auto_now_add=True)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []
    objects = CustomUserManager()

    def __str__(self):
        return f"{self.username}: {self.email}"
