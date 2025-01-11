import pandas as pd
import pickle
from fastapi import FastAPI
import random
from fastapi.middleware.cors import CORSMiddleware

dataset = pd.DataFrame(pickle.load(open('dataset.pkl', 'rb')))
movie_info = pd.DataFrame(pickle.load(open('movie_info.pkl', 'rb')))
movies = pickle.load(open('movies_list.pkl', 'rb'))

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def recommend(movie):
    movie_index = dataset[dataset['original_title'] == movie].index[0]
    movies_list = movies[movie_index]
    return [int(i[0]) for i in movies_list[:10]]

@app.get("/recommend/{movie}")
def recommendation(movie: str):
    try:
        movie_list = movie.split(",")
        num_movies = len(movie_list)
        recommendations = []

        if num_movies == 1:
            recommendations.extend(recommend(movie_list[0]))
        else:
            recs_per_movie = [10 // num_movies] * num_movies
            for i in range(10 % num_movies):
                recs_per_movie[i] += 1

            for i, mov in enumerate(movie_list):
                recs = random.sample(recommend(mov), recs_per_movie[i])
                recommendations.extend(recs)

        recommendations = list(dict.fromkeys(recommendations))
        recommendations = recommendations[:10]

        movs = []
        for index in recommendations:
            info = {
                'id': int(movie_info['id'][index]),
                'title': movie_info['original_title'][index],
                'tagline': movie_info['tagline'][index],
                'overview': movie_info['overview'][index],
                'genres': movie_info['genres'][index],
                'cast': movie_info['cast'][index],
                'director': movie_info['director'][index],
                'production_companies': movie_info['production_companies'][index],
                'runtime': int(movie_info['runtime'][index]),
                'rating': float(movie_info['vote_average'][index]),
                'release_date': movie_info['release_date'][index],
                'release_year': int(movie_info['release_year'][index]),
            }
            movs.append(info)

        return {'recommendations': movs, 'status': True}

    except Exception as e:
        return {'status': False, 'exception': str(e)}
