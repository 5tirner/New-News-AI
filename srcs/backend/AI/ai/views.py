from rest_framework import response, status, decorators
from zauth.views import is_auth_user

@decorators.api_view(['GET'])
def chatbot(req):
    try:
        user_data = is_auth_user(req.headers.get('Access-Token'), req.headers.get('Refresh-Token'))
    except Exception as error:
        return response.Response({'Authentication': 'Permission Needed'},
                                 status=status.HTTP_404_NOT_FOUND)
    return response.Response({'Hii': 'Hi'}, status=status.HTTP_200_OK)