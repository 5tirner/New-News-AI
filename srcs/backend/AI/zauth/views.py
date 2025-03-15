from rest_framework import status, response, decorators
from .serialz import auth_db_serial, tokens_db_serial, verify_serializer
from .models import auth_db, tokens_db, verificationSystem
from django.core import mail
from django.conf import settings
from .isStrong import validate_passwd
import bcrypt, string, random
from ai.models import conversations

def is_auth_user(access_token, refresh_token):
    try:
        user_data = tokens_db.objects.get(access_token=access_token)
        return user_data
    except:
        try:
            refresh = tokens_db.objects.get(refresh_token=refresh_token)
            refresh.access_token = ''.join(random.choices(
                string.ascii_uppercase + string.ascii_lowercase + string.digits, k=100))
            refresh.save()
            return refresh
        except:
            raise Exception("")

def generate_tokens(email):
    access_token = ''.join(random.choices
                           (string.digits + string.ascii_uppercase + string.ascii_lowercase, k=100))
    refresh_token = ''.join(random.choices
                           (string.digits + string.ascii_uppercase + string.ascii_lowercase, k=100))
    return {'identity': email, 'access_token': access_token, 'refresh_token': refresh_token}

@decorators.api_view(["POST"])
def signup(req):
    serial = auth_db_serial(data=req.data)
    if serial.is_valid():

        password_status = validate_passwd(serial.validated_data['password'])
        if (password_status != 'Strong'):
            return response.Response({'Weak Password': password_status},
                                     status=status.HTTP_400_BAD_REQUEST)
        
        hash_pass = bcrypt.hashpw(serial.validated_data['password'].encode('ASCII'),
                                  bcrypt.gensalt())
        serial.validated_data['password'] = hash_pass.decode('ASCII')
        tokens = generate_tokens(serial.validated_data['email'])
        tokens_serial = tokens_db_serial(data=tokens)
        if tokens_serial.is_valid():
            tokens_serial.save()
        try:
            code = ''.join(random.choices(string.digits + string.ascii_letters, k=8))
            verification_serial = verify_serializer(data={
                                            'identity': serial.validated_data['email'],
                                            'ActivationCode': code })
            if verification_serial.is_valid():
                verification_serial.save()
            else:
                return response.Response(verification_serial.errors,
                                         status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            mail.send_mail('New News Ai - ACTIVATION', f"Hello {serial.validated_data['email']}\nYour Activation Code is: {code}\nBest Regards,\nNew News Ai team.",
                           settings.EMAIL_HOST_USER, [serial.validated_data['email']])
        except Exception as e:
            print(f"RED: Failed Cuase: {e}")
            return response.Response({'Verefication': 'Fail to send the verefication mail'},
                                     status=status.HTTP_504_GATEWAY_TIMEOUT)
        serial.save()
        return response.Response(status=status.HTTP_201_CREATED)
    return response.Response(serial.errors, status=status.HTTP_400_BAD_REQUEST)

@decorators.api_view(["POST"])
def verify(req):
    try:
        user = verificationSystem.objects.get(identity=req.data.get('email'))
        code = req.data.get('verification_code')
        if code is None:
            raise Exception("")
        if user.ActivationCode == req.data.get('verification_code'):
            activateUser = auth_db.objects.get(email=user.identity)
            activateUser.activation = True
            activateUser.save()
            user.delete()
            try:
                AddUserTopics = conversations.objects.create(identity=req.data.get('email'), topics=dict())
                AddUserTopics.save()
            except Exception as e:
                print(e)
            return response.Response({
                'Activation': 'Succefull Activation', 'Email': activateUser.email},
                status=status.HTTP_200_OK)
        else:
            return response.Response({'verification_code': 'Invalid Code'},
                                     status=status.HTTP_400_BAD_REQUEST)
    except:
        pass
    return response.Response({'Activation Failed': 'Invalid Information',
                              'email': 'This Field Reqiured',
                              'verification_code': 'This Field Reqiured'
                              }
                              , status=status.HTTP_400_BAD_REQUEST)

@decorators.api_view(["POST"])
def signin(req):
    try:
        email, password = req.data.get('email'), req.data.get('password').encode('ASCII')
        user = auth_db.objects.get(email=email)
        if user.activation == False:
            return response.Response({'email': 'Email Activation Required'},
                                     status=status.HTTP_401_UNAUTHORIZED)
        if bcrypt.checkpw(password, user.password.encode('ASCII')):
            user_tokens = tokens_db.objects.get(identity=email)
            return response.Response(
                {
                    'active_user': user.activation,
                    'Access-Token': user_tokens.access_token,
                    'Refresh-Token': user_tokens.refresh_token
                }, status=status.HTTP_200_OK)
    except:
        pass
    return response.Response({'Error': 'Invalid Informations'}, status=status.HTTP_404_NOT_FOUND)

@decorators.api_view(['GET'])
def profile_data(req):
    try:
        user_data = is_auth_user(req.headers.get('Access-Token'), req.headers.get('Refresh-Token'))
    except Exception as error:
        return response.Response({'Authentication': 'Permission Needed'},
                                 status=status.HTTP_404_NOT_FOUND)
    infos = auth_db.objects.get(email=user_data.identity)
    return response.Response({'Email': infos.email,'Activation': infos.activation},
                             status=status.HTTP_200_OK)
