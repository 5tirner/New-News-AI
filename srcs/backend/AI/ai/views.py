from rest_framework import response, status, decorators

@decorators.api_view(['GET'])
def chatbot(req):
    return response.Response({'Hii': 'Hi'}, status=status.HTTP_200_OK)