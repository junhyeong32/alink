
import numpy as np 
import pandas as pd 
import matplotlib.pyplot as plt
from PIL import Image
from wordcloud import WordCloud, STOPWORDS
df = pd.read_csv('../input/hotel-reviews/Datafiniti_Hotel_Reviews_Jun19.csv')
df.head(3)
## head prints the first three rows
df['reviews.text']
df.info()

text = df['reviews.text'][1]
text
wordcloud = WordCloud()
print(wordcloud)
?WordCloud
wordcloud.generate(text)
plt.imshow(wordcloud, interpolation='bilinear')
plt.axis("off")
plt.show()
wordcloud.to_file('wordcloud.png')
text = " ".join(review for review in df['reviews.text'])
#text
from wordcloud import STOPWORDS

stopwords = set(STOPWORDS)
wordcloud = WordCloud(width = 3000, height = 2000,background_color='white',stopwords=stopwords)
wordcloud.generate(text)
plt.figure(figsize=(40, 30))
plt.imshow(wordcloud, interpolation='bilinear')
plt.axis("off")
plt.show()
wordcloud.to_file('wordcloud.png')
import numpy as np
from PIL import Image
mask = np.array(Image.open('../input/sofa-image/sofa.jpg'))
wordcloud = WordCloud(width = 3000, height = 2000, random_state=1,background_color='white', colormap='Set2', collocations=False, stopwords = STOPWORDS, mask=mask,max_words=100).generate(text)
plt.figure(figsize=(40, 30))
plt.imshow(wordcloud, interpolation='bilinear')
plt.axis("off")
plt.show()
3. wordcloud based on word frequencies
from collections import Counter
from nltk.stem import WordNetLemmatizer
import re

words = text.lower().split()
words = [re.sub("[.,!?:;-='...'@#_]", " ", s) for s in words]
words = [re.sub(r'\d+', '', w) for w in words]
words = [word.strip() for word in words if word not in stopwords]
words.remove('')

lemmatiser = WordNetLemmatizer()
lem_words = [lemmatiser.lemmatize(w, pos='v') for w in words]
words_counter = Counter(lem_words)
wordcloud = WordCloud(width = 3000, height = 2000,background_color='white')
wordcloud.generate_from_frequencies(words_counter)
plt.figure(figsize=(40, 30))
plt.imshow(wordcloud, interpolation='bilinear')
plt.axis("off")
plt.show()
wordcloud.to_file('wordcloud.png')
wordcloud = WordCloud(width = 3000, height = 2000, random_state=1,background_color='white', colormap='Set2', collocations=False, stopwords = STOPWORDS, mask=mask,max_words=20).generate_from_frequencies(words_counter)
plt.figure(figsize=(40, 30))
plt.imshow(wordcloud, interpolation='bilinear')
plt.axis("off")
plt.show()
5. word cloud with tf-idf
from nltk.tokenize import RegexpTokenizer

df["clean_text"] = df["reviews.text"].apply(lambda s: ' '.join(re.sub("[.,!?:;-='...'@#_]", " ", s).split()))
df["clean_text"] = df["clean_text"].apply(lambda s: ' '.join(re.sub(r'\d+', '', s).split()))
def rem_en(input_txt):
    words = input_txt.lower().split()
    noise_free_words = [word for word in words if word not in stopwords] 
    noise_free_text = " ".join(noise_free_words) 
    return noise_free_text

df["clean_text"] = df["clean_text"].apply(lambda s: rem_en(s))

lemmatiser = WordNetLemmatizer()
df["clean_text"] = df["clean_text"].apply(lambda row: [lemmatiser.lemmatize(r, pos='v') for r in row.split()])
df["clean_text"] = df["clean_text"].apply(lambda row: ' '.join(row))
df["clean_text"]
from sklearn.feature_extraction.text import TfidfVectorizer
vectorizer = TfidfVectorizer()
response = vectorizer.fit_transform(df["clean_text"])
df_tfidf_sklearn = pd.DataFrame(response.toarray(),columns=vectorizer.get_feature_names())
df_tfidf_sklearn
tf_idf_counter = df_tfidf_sklearn.T.sum(axis=1)
wordcloud = WordCloud(width = 3000, height = 2000,background_color='salmon', colormap='Pastel1')
wordcloud.generate_from_frequencies(tf_idf_counter)
plt.figure(figsize=(40, 30))
plt.imshow(wordcloud, interpolation='bilinear')
plt.axis("off")
plt.show()
wordcloud.to_file('wordcloud.png')
wordcloud = WordCloud(width = 3000, height = 2000, random_state=1,background_color='white', colormap='Set2', 
                      collocations=False, stopwords = STOPWORDS, mask=mask).generate_from_frequencies(tf_idf_counter)

plt.figure(figsize=(40, 30))
plt.imshow(wordcloud, interpolation='bilinear')
plt.axis("off")
plt.show()
wordcloud.to_file('wordcloud.png')
wordcloud = WordCloud(width = 3000, height = 2000, random_state=1,background_color='white', colormap='Set2', collocations=False, stopwords = STOPWORDS, mask=mask,max_words=20).generate_from_frequencies(tf_idf_counter)
plt.figure(figsize=(40, 30))
plt.imshow(wordcloud, interpolation='bilinear')
plt.axis("off")
plt.show()