#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script de test pour vérifier l'installation sur le serveur LWS
À uploader et exécuter sur le serveur
"""

import sys
import os

def test_environment():
    """Test de l'environnement serveur"""
    print("=== TEST ENVIRONNEMENT SERVEUR LWS ===\n")
    
    # Version Python
    print(f"Version Python: {sys.version}")
    print(f"Chemin Python: {sys.executable}")
    print(f"Répertoire actuel: {os.getcwd()}")
    
    # Test des imports essentiels
    packages = [
        'flask',
        'werkzeug', 
        'jinja2',
        'pymysql',
        'email_validator',
        'dotenv'
    ]
    
    print("\n=== TEST DES PACKAGES ===")
    success = 0
    
    for package in packages:
        try:
            __import__(package)
            print(f"[OK] {package}")
            success += 1
        except ImportError:
            print(f"[ERREUR] {package} - Non installé")
    
    print(f"\nPackages fonctionnels: {success}/{len(packages)}")
    
    # Test Flask
    print("\n=== TEST FLASK ===")
    try:
        from flask import Flask
        app = Flask(__name__)
        
        @app.route('/')
        def test():
            return "Flask fonctionne sur LWS!"
        
        print("[OK] Flask app créée avec succès")
        
        # Test import de votre app
        try:
            from app import app as tchid_app
            print("[OK] Import de app.py réussi")
        except Exception as e:
            print(f"[ERREUR] Import de app.py: {e}")
            
    except Exception as e:
        print(f"[ERREUR] Flask: {e}")
    
    # Vérification des fichiers
    print("\n=== VÉRIFICATION FICHIERS ===")
    required_files = [
        'app.py',
        'passenger_wsgi.py', 
        'requirements.txt',
        'static',
        'templates'
    ]
    
    for file_item in required_files:
        if os.path.exists(file_item):
            print(f"[OK] {file_item}")
        else:
            print(f"[MANQUANT] {file_item}")

if __name__ == "__main__":
    test_environment()
