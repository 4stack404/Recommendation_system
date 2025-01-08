import pandas as pd
import pickle as pkl
from fastapi import FastAPI

dataset = pkl.load(open('dataset.pkl', 'rb'))
similarity = pkl.load(open('similarity.pkl', 'rb'))

movies_data = pd.DataFrame(dataset)

def recommend(movie):
    recommendations = []
    movie_index = movies_data[movies_data['title'] == movie].index[0]
    distances = similarity[movie_index]
    movies_list = sorted(list(enumerate(distances)), reverse = True, key=lambda x:x[1])[1:11]
    for i in movies_list:
        recommendations.append(dataset['title'][i[0]])
    return recommendations

app = FastAPI()

@app.get("/recommend/{movie}")
def recommendation(movie: str):
    try:
        movies_list = recommend(movie)
        return {"recommendations": movies_list}
    except:
        return {'Error': 'Movie not found!'}
