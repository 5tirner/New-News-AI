from rest_framework import response, status, decorators
from zauth.views import is_auth_user
from .models import conversations
import google.generativeai as gemini
from django.conf import settings


@decorators.api_view(['POST'])
def chatbot(req):
    try:
        user_data = is_auth_user(req.headers.get('Access-Token'), req.headers.get('Refresh-Token'))
    except Exception as error:
        return response.Response({'Authentication': 'Permission Needed'},
                                 status=status.HTTP_404_NOT_FOUND)
    data = req.data
    question =  data.get('question')
    conv_id = data.get('conversation_id')
    gemini.configure(api_key=settings.GEMINI_API_KEY)
    aimodel = gemini.GenerativeModel(settings.GEMINI_MODEL)
    if question is None or conv_id is None:
        return response.Response({'question': 'Required Field', 'conversation_id': 'Required Field'}, status=status.HTTP_400_BAD_REQUEST)
    try:
        userTopics = conversations.objects.get(identity=user_data.identity)
        conv = userTopics.topics.get(conv_id)
        print(conv)
        prompt = f"There is a conversation between you and a client: {conv}, your messages appearing as: `your message nbr: message content`\nanalyze this conversation well\nAfter that answer this question of this client: {question}\nsearch on web or do any thing you want the impotant is to answer the question, your free to make mistakes"
        aires = aimodel.generate_content(prompt)
        print("Journalist Thinking...")
        summary = aires.text.strip()
        print(summary)
        lastIndex = len(conv.keys()) + 1
        conv.update({f"Client Message {lastIndex}": question})
        lastIndex += 1
        conv.update({f"Your Message {lastIndex}": summary})
        userTopics.save()
    except Exception as e:
        print(f"Error summarizing with Gemini: {e}")
        return  response.Response({'ai confused': 'AI failed to generate this content'}, status=status.HTTP_429_TOO_MANY_REQUESTS)
    return response.Response({'answer': summary}, status=status.HTTP_200_OK)

@decorators.api_view(['POST'])
def add_conversation(req):
    try:
        user_data = is_auth_user(req.headers.get('Access-Token'), req.headers.get('Refresh-Token'))
    except Exception as error:
        return response.Response({'Authentication': 'Permission Needed'},
                                 status=status.HTTP_404_NOT_FOUND)
    conv_id = req.data.get('conversation_id')
    message = req.data.get('message')
    userTopics = conversations.objects.get(identity=user_data.identity)
    if conv_id is None or message is None:
        return response.Response({'conversation_id': 'required field', 'message': 'requirde field'}, status=status.HTTP_400_BAD_REQUEST)
    theTopic = userTopics.topics.get(conv_id)
    if theTopic is None:
        print("New Topic")
        userTopics.topics[conv_id] = {f"Your Message 1": message}
    else:
        print("Existance topic")
        lastIndex = len(theTopic.keys()) + 1
        theTopic.update({f"Client Message {lastIndex}": message})
    userTopics.save()
    print(userTopics)
    return response.Response({'Topic': 'Updated'}, status=status.HTTP_200_OK)

@decorators.api_view(["GET"])
def get_convertation(req):
    try:
        user_data = is_auth_user(req.headers.get('Access-Token'), req.headers.get('Refresh-Token'))
    except Exception as error:
        return response.Response({'Authentication': 'Permission Needed'},
                                 status=status.HTTP_404_NOT_FOUND)
    conv_id = req.data.get('conversation_id')
    userTopics = conversations.objects.get(identity=user_data.identity)
    conv = userTopics.topics.get(conv_id)
    if conv is None:
        return response.Response({'conversation_id': 'Not Found'}, status=status.HTTP_400_BAD_REQUEST)
    return response.Response(conv, status=status.HTTP_200_OK)
