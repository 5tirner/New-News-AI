from channels.middleware import BaseMiddleware
from zauth.models  import userFields, tokens_db
import os

os.environ["DJANGO_ALLOW_ASYNC_UNSAFE"] = "true"

def proccesFieelds(access):
    data = tokens_db.objects.get(access_token=access)
    try:
        fields = userFields.objects.get(identity=data.identity)
        return {'fields': fields.fields, 'identity': data.identity}
    except:
        return None

class wsAuth(BaseMiddleware):
    async def __call__(self, scope, receive, send):
        toDict:dict = dict(scope.get('headers'))
        access = toDict.get(b'cookie').decode('ascii')
        if access is None:
            raise Exception('Cookie: This header is missing')
        try:
            res = proccesFieelds(access)
        except:
            raise Exception("Cookie: Invalide header value")
        if res is None:
            raise Exception("Fields Empty")
        scope["fields"] = res.get('fields')
        scope["identity"] = res.get('identity')
        return await super().__call__(scope, receive, send)