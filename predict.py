import sys
import pickle
import warnings

# Ignore warnings
warnings.filterwarnings("ignore")

try:
    # Get input data passed from Node.js
    input_data = [float(x) for x in sys.argv[1:]]

    # Load the trained model
    model = pickle.load(open('heart_disease_model.pkl', 'rb'))

    # Make a prediction (0 = No Heart Disease, 1 = Heart Disease)
    prediction = model.predict([input_data])

    # Print the result so Node.js can read it
    print(prediction[0])

except Exception as e:
    print("Error:", e)