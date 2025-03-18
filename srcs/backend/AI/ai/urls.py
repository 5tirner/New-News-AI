from django.urls import path
from .views import chatbot, get_convertation, add_conversation

urlpatterns = [
    path('chat', chatbot, name="Chat with Journalist"),
    path('setConv', add_conversation, name="New convirsation with Jornalis"),
    path('getConv', get_convertation, name="list conversation"),
]