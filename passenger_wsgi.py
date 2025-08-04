import sys
import os

# Ajoute le dossier courant au path si besoin
sys.path.insert(0, os.path.dirname(__file__))

from app import app as application  # <-- 'app' est le nom de ton objet Flask dans app.py