from django.db import models
from django.contrib.auth.models import AbstractUser
# Create your models here.


class Users(AbstractUser):
    email = models.EmailField(
        max_length=256, blank=True, null=True)
    USER_ROLE_CHOICES = [("donor", "Donor"), ("acceptor",
                                              "Acceptor")]
    role = models.CharField(
        max_length=20, choices=USER_ROLE_CHOICES, default="acceptor")
    username = models.CharField(max_length=25, unique=True)
    address = models.TextField()
    is_verified = models.BooleanField(default=False)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "Users"

    def __str__(self):
        return self.username


class Review(models.Model):
    donor = models.ForeignKey(
        Users, on_delete=models.CASCADE, related_name='donor')
    acceptor = models.ForeignKey(
        Users, on_delete=models.CASCADE,  related_name='acceptor')
    review = models.TextField(blank=False, null=False)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.review}"
