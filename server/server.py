# server.py
from flask import Flask, request, send_from_directory
from flask_cors import CORS
import os

from deserialiser import sparx_request_deserialiser, run_end_to_end

BUILD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), "../build")

app = Flask(__name__, static_folder=BUILD_FOLDER)
CORS(app)


@app.route("/api/sparx", methods=["POST"])
def sparx():
    """Sparx API."""
    config = sparx_request_deserialiser(request.json)
    return run_end_to_end(config)


@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve(path):
    if path != "" and os.path.exists(os.path.join(BUILD_FOLDER, path)):
        return send_from_directory(BUILD_FOLDER, path)
    else:
        return send_from_directory(BUILD_FOLDER, "index.html")


if __name__ == "__main__":
    app.run()
