import sys
import pickle
import warnings
from pathlib import Path

warnings.filterwarnings("ignore")

# Get project directory
BASE_DIR = Path(__file__).resolve().parent

# Model file path
MODEL_PATH = BASE_DIR / "heart_disease_model.pkl"

try:
    # Read input features from Node.js
    input_data = [float(x) for x in sys.argv[1:]]

    # Validate feature count
    if len(input_data) != 13:
        raise ValueError(
            f"Expected 13 features, received {len(input_data)}"
        )

    # Load trained ML model
    with open(MODEL_PATH, "rb") as file:
        model = pickle.load(file)

    # Generate prediction
    prediction = model.predict([input_data])

    # Print only prediction for Node.js
    print(int(prediction[0]))

except Exception as e:
    print(f"Prediction Error: {e}", file=sys.stderr)
    sys.exit(1)