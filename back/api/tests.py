from django.test import TestCase

# Create your tests here.
from django.contrib.auth.models import User

print(User.objects.filter(email="admin@gmail.com").exists())

from django.contrib.auth import authenticate

user = authenticate(email="admin@gmail.com", password="qwerty")
print(user)