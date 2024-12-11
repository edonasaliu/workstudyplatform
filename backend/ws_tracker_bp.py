# backend/ws_tracker_bp.py
from flask import Blueprint, jsonify

ws_tracker_bp = Blueprint('ws_tracker', __name__)

@ws_tracker_bp.route('/ws_tracker', methods=['GET', 'POST'])
def ws_tracker():
    return jsonify({"message": "WS Tracker endpoint"})
