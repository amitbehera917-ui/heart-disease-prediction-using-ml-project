import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score
import pickle
import warnings
import ssl

# Ignore warning messages
warnings.filterwarnings("ignore")

# Fix for SSL Certificate error to allow downloading data securely
ssl._create_default_https_context = ssl._create_unverified_context

print("1. Loading dataset from the internet...")
# Using the new working URL for the dataset
url = "https://raw.githubusercontent.com/amankharwal/Website-data/master/heart.csv"
heart_data = pd.read_csv(url)

# Splitting the data into features (X) and target (Y)
# FIX: Removed 'columns=' to avoid ValueError in new pandas version
X = heart_data.drop('target', axis=1)
Y = heart_data['target']

# Splitting the data into training data (80%) and testing data (20%)
X_train, X_test, Y_train, Y_test = train_test_split(X, Y, test_size=0.2, random_state=2)

print("2. Training the model...")
model = LogisticRegression(max_iter=1000)
model.fit(X_train, Y_train)

# Testing the model's performance
test_prediction = model.predict(X_test)
accuracy = accuracy_score(test_prediction, Y_test)

print("\n-------------------------------------")
print(f"Model Accuracy: {accuracy * 100:.2f} %")
print("-------------------------------------")

# Saving the trained model to a file
pickle.dump(model, open('heart_disease_model.pkl', 'wb'))
print("\nModel saved successfully as 'heart_disease_model.pkl'!")