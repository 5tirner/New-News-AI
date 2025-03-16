from channels.generic.websocket import AsyncJsonWebsocketConsumer
from django.conf import settings
import asyncio
from datetime import datetime
import requests
from zauth.views import is_auth_user
import random, string
import twikit

async def get_tweets(searchFor, cookies):
    FOOTBALL_TRUSTED_ACCOUNTS = [
    "SkySportsNews", "BBCFootball", "ESPNFC", "goal", "FabrizioRomano",
    "premierleague", "ChampionsLeague", "FIFAcom"
    ]
    IT_TRUSTED_ACCOUNTS = [
        "TechCrunch", "WIRED", "CNET", "TheVerge", "ZDNet",
        "Microsoft", "Google", "IBM"
    ]
    CYBERSECURITY_TRUSTED_ACCOUNTS = [
        "BrianKrebs", "CyberScoopNews", "DarkReading", "Threatpost",
        "NCSC", "CISAcyber", "SANSInstitute", "MalwareTechBlog"
    ]
    CRYPTO_TRUSTED_ACCOUNTS = [
        "CoinDesk", "Cointelegraph", "CryptoSlate", "krakenfx",
        "binance", "VitalikButerin", "Blockchain", "MessariCrypto"
    ]
    POLITICS_TRUSTED_ACCOUNTS = [
        "BBCNews", "CNNPolitics", "Reuters", "AP_Politics",
        "politico", "guardiannews", "nytimes", "AFP"
    ]
    AI_TRUSTED_ACCOUNTS = [
        "MIT_CSAIL", "DeepMind", "OpenAI", "GoogleAI",
        "AI_Safety", "AndrewYNg", "NvidiaAI", "StanfordAI"
    ]
    FIELD_CONFIG = {
        "Football": (FOOTBALL_TRUSTED_ACCOUNTS, "breaking OR news OR result OR goal OR transfer OR match OR injury OR signing"),
        "Information technology": (IT_TRUSTED_ACCOUNTS, "tech OR innovation OR software OR hardware OR IT OR update"),
        "Cybersecurity": (CYBERSECURITY_TRUSTED_ACCOUNTS, "cybersecurity OR hack OR breach OR security OR threat OR update"),
        "Crypto": (CRYPTO_TRUSTED_ACCOUNTS, "crypto OR bitcoin OR ethereum OR blockchain OR market OR update"),
        "Politics": (POLITICS_TRUSTED_ACCOUNTS, "politics OR election OR government OR policy OR breaking OR news"),
        "Artificial intelligence": (AI_TRUSTED_ACCOUNTS, "AI OR artificialintelligence OR machinelearning OR research OR update")
    }
    client = twikit.Client(language='en-US')
    try:
        client.set_cookies(cookies)
        print("Cookies Seted successfully.")
    except Exception as e:
        print(f"Failed to load cookies: {e}")
        return None
    try:
        trusted_accounts, keywords = FIELD_CONFIG.get(searchFor, (FOOTBALL_TRUSTED_ACCOUNTS, "breaking OR news OR result"))
        query = " OR ".join([f"from:{account}" for account in trusted_accounts]) + f" ({keywords}) -filter:retweets"
        tweets = await client.search_tweet(query=query, product='Top', count=10)
        print(f"Fetched {len(tweets)} tweets.")
    except Exception as e:
        print(f"Error fetching tweets: {e}")
        return None
    print("Tweets Matched:")
    AllTweets = []
    for tweet in tweets:
        tweet_time = datetime.strptime(tweet.created_at, '%a %b %d %H:%M:%S %z %Y')
        AllTweets.append({
            'formWhere': 'Twitter',
            'text': tweet.text,
            'username': tweet.user.screen_name,
            'likes': tweet.favorite_count,
            'created_at': tweet_time,
            'real_time': tweet.created_at
        })
    AllTweets.sort(key=lambda x: x['created_at'], reverse=True)
    if len(AllTweets) > 0:
        AllTweets[0].pop('created_at')
        return AllTweets[0]
    return None

async def get_google_news(params, newsurl):
    response = requests.get(newsurl, params=params)
    await asyncio.sleep(10)
    if response is None:
        return None
    if response.status_code == 200:
        articles = response.json()['articles']
        if len(articles) > 0:
            print("We have Some Google Arcticles")
            article = articles[0]
            source = article['source']['name']
            author = article['author']
            title = article['title']
            subj = article['description']
            newsUrl = article['url']
            newsImage = article['urlToImage']
            publishDate = article['publishedAt']
            # print(f"The New Article is: {article}")
            if author is None or newsUrl is None or source is None:
                print("Not Trusted")
            print(f"News Source: {source}\nDate: {publishDate}\nUrl: {newsUrl}\nImage: {newsImage}\nTitle: {title}\nSubject: {subj}")
            return {
                'formWhere': 'NEWS',
                'source': source,
                'author': author,
                'title': title,
                'subj': subj,
                'newsUrl': newsUrl,
                'newsImage': newsImage,
                'publishDate': publishDate,
                'conversation_id': ''.join(random.choices(string.ascii_uppercase+string.digits, k=10))
            }
        else:
            return None
    else:
        print(response.status_code)
        return None

class lastNews(AsyncJsonWebsocketConsumer):
    cookies = {
            "auth_token": settings.AUTH_TOKEN,
            "ct0": settings.CT0,
        }
    fields = ['Football', "Information technology", "Cybersecurity", "Crypto", "Politics", "Artificial intelligence"]
    newsapikey = settings.NEWS_API
    newsurl = settings.NEWS_URL
    delay = 60
    async def connect(self):
        print(f"The Headers {self.scope}")
        try:
            await self.accept()
            today = datetime.today().strftime('%Y-%m-%d')
            print(today)
            while True:
                for query in self.fields:
                    print(f"Field: {query}")
                    newsFromTweets = await get_tweets(query, self.cookies)
                    if newsFromTweets is not None:
                        print("We Have Som Tweets")
                        try:
                            await self.send_json(newsFromTweets)
                            await asyncio.sleep(self.delay)
                        except Exception as e:
                            print(f"Error: {e}")
                    print("Go To Google")
                    params = {'q': f"{query} News", 'language': 'en', 'sortBy': 'publishedAt', 'apiKey': self.newsapikey}
                    newsFromGoogling = await get_google_news(params, self.newsurl)
                    print("Google News Ready To Send")
                    if newsFromGoogling is not None:
                        await self.send_json(newsFromGoogling)
                        await asyncio.sleep(self.delay)

        except Exception as e:
            print(f"Error {e}")
    
    async def disconnect(self, code):
        try:
            print("Disconnect")
            await self.close()
        except:
            print("closing fail")