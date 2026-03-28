# Fake News Detection API

A Flask REST API for detecting fake news using a trained machine learning model.

## Setup

### 1. Install dependencies

```bash
pip install -r requirements.txt
```

### 2. Add your model files

Place your trained model files in the `fake-news-api/` directory:
- `model.pkl` — trained scikit-learn classifier
- `vectorizer.pkl` — fitted TF-IDF (or other) vectorizer

**For testing**, generate sample model files by running:

```bash
python generate_sample_model.py
```

### 3. Run the server

```bash
python app.py
```

The server starts on **http://localhost:5000**

---

## API Reference

### POST /predict

Classify a news article as Fake or Real.

**Request:**
```json
{
  "text": "Scientists discover a miracle cure for all diseases"
}
```

**Response:**
```json
{
  "prediction": "Fake",
  "confidence": 87.43
}
```

| Field        | Type   | Description                              |
|-------------|--------|------------------------------------------|
| `prediction` | string | `"Fake"` or `"Real"`                    |
| `confidence` | number | Confidence percentage (0.00 – 100.00)    |

**Error responses:**

| Status | Reason                                    |
|--------|-------------------------------------------|
| 400    | Missing or invalid `text` field           |
| 503    | Model files not found / not loaded        |

---

### GET /health

Check server and model status.

**Response:**
```json
{
  "status": "ok",
  "model_loaded": true
}
```

---

## Text Preprocessing

Before prediction, the input text is processed as follows:
1. Converted to lowercase
2. Special characters removed (keeps only letters and spaces)
3. English stopwords removed (using NLTK)

---

## Using Your Own Trained Model

Your model must be a scikit-learn-compatible classifier saved with `pickle`.  
The vectorizer must be a fitted transformer (e.g., `TfidfVectorizer`).

**Label convention:**
- `0` → Fake
- `1` → Real

Save them as:
```python
import pickle

with open("model.pkl", "wb") as f:
    pickle.dump(trained_model, f)

with open("vectorizer.pkl", "wb") as f:
    pickle.dump(fitted_vectorizer, f)
```
