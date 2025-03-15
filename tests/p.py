import requests
import google.generativeai as gemini
import dotenv

dotenv.load_dotenv()

gemini.configure(api_key='API')
aimodel = gemini.GenerativeModel('URL')

url = 'URL'
params = {'q': 'football', 'language': 'en', 'sortBy': 'publishedAt', 'apiKey': 'API', 'pageSize': 1}

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