import sys
from backend import create_app

# Initialize the Flask application with the appropriate configuration
if '--test' in sys.argv:
    app = create_app('testing')
    debug_mode = True
else:
    app = create_app('development')
    debug_mode = True

if __name__ == "__main__":
    app.run(debug=debug_mode, host='0.0.0.0', port=8080)
