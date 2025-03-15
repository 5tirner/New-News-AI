import requests
import google.generativeai as gemini

gemini.configure(api_key='AIzaSyBIx8pIoooU2afHeYkOt93xb_Oi4PXB7mo')
aimodel = gemini.GenerativeModel('gemini-1.5-flash')

url = 'https://newsapi.org/v2/everything'
params = {'q': 'football', 'language': 'en', 'sortBy': 'publishedAt', 'apiKey': "6a3ac6539c9d49a594562beb82aad3b2", 'pageSize': 1}

response = requests.get(url, params=params)
if response.status_code == 200:
    article = response.json()['articles'][0]
    title = article['title']
    subj = article['description']
    print(f"Title: {title}")
    print(f"Sunject:\n{subj}")
    if title is not None:
        try:
            prompt = f"Discribe this topic `{subj}` more"
            response = aimodel.generate_content(prompt)
            summary = response.text.strip()
            print("Journalist Thinking...")
            print(summary)
        except Exception as e:
            print(f"Error summarizing with Gemini: {e}")