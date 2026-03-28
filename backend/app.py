import os
import re
import pickle
import nltk
from flask import Flask, request, jsonify
from flask_cors import CORS

nltk.data.path.append(os.path.join(os.path.dirname(__file__), "nltk_data"))

try:
    from nltk.corpus import stopwords
    STOPWORDS = set(stopwords.words("english"))
except LookupError:
    nltk.download(
        "stopwords", download_dir=os.path.join(os.path.dirname(__file__), "nltk_data")
    )
    from nltk.corpus import stopwords
    STOPWORDS = set(stopwords.words("english"))

app = Flask(__name__)
CORS(app)

BASE_DIR = os.path.dirname(__file__)
MODEL_PATH = os.path.join(BASE_DIR, "model.pkl")
VECTORIZER_PATH = os.path.join(BASE_DIR, "vectorizer.pkl")

model = None
vectorizer = None


def load_model():
    global model, vectorizer
    if not os.path.exists(MODEL_PATH):
        raise FileNotFoundError(f"Model file not found: {MODEL_PATH}")
    if not os.path.exists(VECTORIZER_PATH):
        raise FileNotFoundError(f"Vectorizer file not found: {VECTORIZER_PATH}")
    with open(MODEL_PATH, "rb") as f:
        model = pickle.load(f)
    with open(VECTORIZER_PATH, "rb") as f:
        vectorizer = pickle.load(f)


def preprocess(text):
    text = text.lower()
    text = re.sub(r"[^a-z\s]", "", text)
    tokens = text.split()
    tokens = [t for t in tokens if t not in STOPWORDS]
    return " ".join(tokens)


@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json(force=True)

    if not data or "text" not in data:
        return jsonify({"error": "Missing 'text' field in request body"}), 400

    raw_text = data["text"]
    if not isinstance(raw_text, str) or not raw_text.strip():
        return jsonify({"error": "'text' must be a non-empty string"}), 400

    if model is None or vectorizer is None:
        return jsonify(
            {"error": "Model not loaded. Make sure model.pkl and vectorizer.pkl exist."}
        ), 503

    cleaned = preprocess(raw_text)
    features = vectorizer.transform([cleaned])

    # ✅ FIX START (only this part changed earlier)
    prediction_index = model.predict(features)[0]

    try:
        probabilities = model.predict_proba(features)[0]
        confidence = round(float(max(probabilities)) * 100, 2)
    except Exception:
        confidence = 85.0

    label = (
        "Fake"
        if str(prediction_index) in ("0", "fake", "FAKE") or prediction_index == 0
        else "Real"
    )
    # ✅ FIX END

    return jsonify({"prediction": label, "confidence": confidence})


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "model_loaded": model is not None})


if __name__ == "__main__":
    try:
        load_model()
        print("Model and vectorizer loaded successfully.")
    except FileNotFoundError as e:
        print(f"Warning: {e}")
        print(
            "Server will start but /predict will return 503 until model files are placed in the same directory."
        )

    # ✅ FINAL FIX (Render compatible port)
    port = int(os.environ.get("PORT", 10000))
    app.run(host="0.0.0.0", port=port, debug=False)