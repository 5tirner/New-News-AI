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
    topic_name = req.data.get('topic_name')
    message = req.data.get('message')
    userTopics = conversations.objects.get(identity=user_data.identity)
    if topic_name is None or message is None:
        return response.Response({'topic_name': 'required field', 'message': 'requirde field'}, status=status.HTTP_400_BAD_REQUEST)
    theTopic = userTopics.topics.get(topic_name)
    if theTopic is None:
        print("New Topic")
        userTopics.topics[topic_name] = {1: message}
    else:
        print("Existance topic")
        lastIndex = len(theTopic.keys()) + 1
        theTopic.update({lastIndex: message})
    userTopics.save()
    print(userTopics)
    return response.Response({'Topic': 'Updated'}, status=status.HTTP_200_OK)