from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models

# ==================== USER ====================


# Custom user will need a custom manager
# Ref: https://docs.djangoproject.com/en/4.2/topics/auth/customizing/#writing-a-manager-for-a-custom-user-model
class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None):
        if not email:
            raise ValueError("Email is required.")
        if not password:
            raise ValueError("Password is required.")
        email = self.normalize_email(email)
        user = self.model(email=email)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, password=None):
        if not email:
            raise ValueError("Email is required.")
        if not password:
            raise ValueError("Password is required.")
        user = self.create_user(email, password)
        user.is_superuser = True
        user.is_staff = True
        user.save()
        return user


class CustomUser(AbstractBaseUser, PermissionsMixin):
    # initial fields: id, password, last_login
    email = models.EmailField(max_length=50, unique=True)
    username = models.CharField(max_length=25)
    fullname = models.CharField(max_length=100)
    phone = models.CharField(max_length=15)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateField(auto_now_add=True)
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []
    objects = CustomUserManager()

    def __str__(self):
        return self.email


# ==================== BOOK ====================


class Category(models.Model):
    name = models.CharField(max_length=50)
    slug = models.SlugField(max_length=50)

    def __str__(self):
        return self.name


class Book(models.Model):
    image = models.ImageField(upload_to="books/", null=True, blank=True)
    title = models.CharField(max_length=100)
    author = models.CharField(max_length=100)
    category = models.ManyToManyField(Category)  # a book can have multiple categories
    price = models.DecimalField(max_digits=10, decimal_places=2)
    units_in_stock = models.PositiveIntegerField()
    description = models.TextField()

    def __str__(self):
        return self.title


# ==================== CART ====================


class Cart(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"In cart of {self.user.email}: {self.quantity} x {self.book.title}"


# ==================== ORDER ====================


class StatusChoice(models.TextChoices):
    PENDING = "P", "Pending"
    SHIPPED = "S", "Shipped"
    DELIVERY = "D", "Delivered"


class Order(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    status = models.CharField(
        max_length=2, choices=StatusChoice.choices, default=StatusChoice.PENDING
    )
    total_payment = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    recipient_name = models.CharField(max_length=100)
    phone = models.CharField(max_length=15)
    address = models.CharField(max_length=255)
    payment_method = models.CharField(max_length=50)
    shipping_method = models.CharField(max_length=50)

    def __str__(self):
        return f"Order #{self.id} - {self.user.email}"


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.quantity} x {self.book.title} in Order #{self.order.id}"
