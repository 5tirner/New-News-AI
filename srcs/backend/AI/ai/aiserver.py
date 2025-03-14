from channels.generic.websocket import AsyncJsonWebsocketConsumer

class lastNews(AsyncJsonWebsocketConsumer):
    async def connect(self):
        try:
            await self.accept()
        except Exception as e:
            print(f"Error {e}")

    async def receive_json(self, content, **kwargs):
        print(content)
    
    async def disconnect(self, code):
        try:
            await self.close()
        except:
            print("closing fail")