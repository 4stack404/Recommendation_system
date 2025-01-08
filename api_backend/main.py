import pandas as pd
import pickle
from fastapi import FastAPI

# Load your datasets
dataset = pd.DataFrame(pickle.load(open('dataset.pkl', 'rb')))
movie_info = pd.DataFrame(pickle.load(open('movie_info.pkl', 'rb')))
movies = pickle.load(open('movies_list.pkl', 'rb'))

# Initialize FastAPI app
app = FastAPI()

# Recommendation function
def recommend(movie):
    movie_index = dataset[dataset['original_title'] == movie].index[0]
    movies_list = movies[movie_index]
    movies_index = []
    for i in movies_list[0:10]:
        movies_index.append(int(i[0]))
    return movies_index

# print(type(movie_info['tagline'][0]))

@app.get("/recommend/{movie}")
def recommendation(movie: str):
    try:
        indexs = recommend(movie)
        movs = []
        for index in indexs:
            info = {'id': int(movie_info['id'][index]),
                    'title': movie_info['original_title'][index],
                    'tagline': movie_info['tagline'][index],
                    'overview': movie_info['overview'][index],
                    'genres': movie_info['genres'][index],
                    'cast': movie_info['cast'][index],
                    'director': movie_info['director'][index],
                    'production_companies': movie_info['production_companies'][index],
                    'runtime': int(movie_info['runtime'][index]),
                    'popularity': int(movie_info['popularity'][index]),
                    'release_date': movie_info['release_date'][index],
                    'release_year': int(movie_info['release_year'][index]),
                    }
            movs.append(info)
        return {'recommendations': movs, 'status': True}
    
    except Exception as e:
        expt = e
        return{'status': False, 'exception': expt}




