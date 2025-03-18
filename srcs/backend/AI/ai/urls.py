from django.urls import path
from .views import chatbot, add_conversation, get_convertation

urlpatterns = [
    path('chat', chatbot, name="Chat with Journalist"),
    path('conversation', add_conversation, name="New convirsation with Jornalis"),
    path('getConv', get_convertation, name="list conversation")
]