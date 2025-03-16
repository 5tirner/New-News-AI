from rest_framework import response, status, decorators
from zauth.views import is_auth_user
from .models import conversations

@decorators.api_view(['GET'])
def chatbot(req):
    try:
        user_data = is_auth_user(req.headers.get('Access-Token'), req.headers.get('Refresh-Token'))
    except Exception as error:
        return response.Response({'Authentication': 'Permission Needed'},
                                 status=status.HTTP_404_NOT_FOUND)
    return response.Response({'Hii': 'Hi'}, status=status.HTTP_200_OK)

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
        userTopics.topics[conv_id] = {1: message}
    else:
        print("Existance topic")
        lastIndex = len(theTopic.keys()) + 1
        theTopic.update({lastIndex: message})
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

