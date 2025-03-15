from channels.generic.websocket import AsyncJsonWebsocketConsumer
from django.conf import settings
import asyncio
import requests
class lastNews(AsyncJsonWebsocketConsumer):
    async def connect(self):
        try:
            await self.accept()
        except Exception as e:
            print(f"Error {e}")

    async def receive_json(self, content, **kwargs):
        while True:
            print(content)
            url = 'https://newsapi.org/v2/everything'
            params = {'q': 'football', 'language': 'en', 'sortBy': 'publishedAt', 'apiKey': "6a3ac6539c9d49a594562beb82aad3b2", 'pageSize': 1}
            response = requests.get(url, params=params)
            if response.status_code == 200:
                article = response.json()['articles'][0]
                title = article['title']
                subj = article['description']
                print(f"Title: {title}")
                print(f"Sunject:\n{subj}")
            else:
                print("=== Google News API FAIL ===")
            await asyncio.sleep(60)
    
    async def disconnect(self, code):
        try:
            await self.close()
        except:
            print("closing fail")