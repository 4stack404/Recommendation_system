import sys
import pandas as pd
from groq import Groq

def load_dataset():
    # Load the dataset
    file_path = '/Users/harshpandey/PycharmProjects/Bots/dataset.csv'
    dataset = pd.read_csv(file_path)
    return dataset

def recommend_movie(preferences, dataset):
    """Recommends a movie based on user preferences."""
    recommendations = []
    for _, row in dataset.iterrows():
        match_score = 0

        # Match tags with user preferences
        for key, value in preferences.items():
            if value and str(value).lower() in str(row['tags']).lower():
                match_score += 1

        if match_score > 0:
            recommendations.append((row['title'], match_score))

    # Sort recommendations by match score
    recommendations.sort(key=lambda x: x[1], reverse=True)
    return recommendations[:3]  # Return top 3 recommendations

def main():
    client = Groq(api_key="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")

    # Load the movie dataset
    dataset = load_dataset()

    messages = [
        {
            "role": "system",
            "content": (
                "You are an emotionally intelligent movie recommendation bot. You will ask users a series of predefined questions to understand their mood, preferences, and needs, and then suggest a movie, TV show, or documentary accordingly."
            )
        }
    ]

    print("Assistant: Hi! I’m here to find the perfect movie for you. Let’s get started!")

    question_set = [
        "How are you feeling today? (e.g., happy, sad, nostalgic, adventurous)",
        "What kind of story are you in the mood for? (e.g., feel-good, thrilling, reflective)",
        "How intense do you want the experience to be? (light, medium, very intense)",
        "Do you have a favorite actor or director?",
        "Do you have a preference for a specific language or cultural cinema?",
        "Is there a specific platform you'd prefer? (e.g., Netflix, Hulu, Prime Video)"
    ]

    user_preferences = {}

    try:
        for i, question in enumerate(question_set):
            print(f"Assistant: {question}")
            user_input = input("User: ").strip()

            if user_input.lower() in ["exit", "quit"]:
                print("Assistant: Take care! I hope you find a great movie to enjoy.")
                sys.exit(0)

            # Store the user's response
            user_preferences[f"question_{i+1}"] = user_input
            messages.append({"role": "user", "content": user_input})

        # Generate recommendations based on user preferences
        recommendations = recommend_movie(user_preferences, dataset)

        if recommendations:
            print("Assistant: Based on your preferences, here are some movie recommendations:")
            for title, score in recommendations:
                print(f"- {title} (Relevance: {score})")
        else:
            print("Assistant: I couldn’t find an exact match, but feel free to explore trending movies.")

    except KeyboardInterrupt:
        print("\nExiting chat. Take care and happy watching!")
        sys.exit(0)

if __name__ == "__main__":
    main()
