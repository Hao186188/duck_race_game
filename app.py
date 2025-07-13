from flask import Flask, render_template, request, jsonify
import json
import os

app = Flask(__name__)

SCORE_FILE = "scores.json"

# Khởi tạo file điểm nếu chưa có
if not os.path.exists(SCORE_FILE):
    with open(SCORE_FILE, "w") as f:
        json.dump({}, f)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/save_score", methods=["POST"])
def save_score():
    data = request.json
    winner = data["winner"]

    with open(SCORE_FILE, "r") as f:
        scores = json.load(f)

    scores[winner] = scores.get(winner, 0) + 1

    with open(SCORE_FILE, "w") as f:
        json.dump(scores, f)

    return jsonify(success=True, scores=scores)

@app.route("/get_scores", methods=["GET"])
def get_scores():
    with open(SCORE_FILE, "r") as f:
        scores = json.load(f)
    return jsonify(scores)

if __name__ == "__main__":
    app.run(debug=True)
