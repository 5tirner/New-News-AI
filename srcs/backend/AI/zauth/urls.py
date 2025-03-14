from django.urls import path
from .views import signin, signup, verify, profile_data

urlpatterns = [
    path('signup', signup, name="User Sign Up"),
    path('verify', verify, name="Account Verification"),
    path('signin', signin, name="User Sign In"),
    path('profile', profile_data, name="Get User Data")
]