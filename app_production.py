from flask import Flask, render_template, request, redirect, url_for, flash, jsonify
import os
import json
from datetime import datetime
import urllib.parse
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

app = Flask(__name__)

# Configuration avec variables d'environnement
app.secret_key = os.getenv('SECRET_KEY', 'tchid_connect_secret_key')

# Configuration pour la production
app.config['TEMPLATES_AUTO_RELOAD'] = False
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 31536000  # 1 an

# Configuration SMTP depuis les variables d'environnement
SMTP_SERVER = os.getenv('SMTP_SERVER', 'smtp.lws.fr')
SMTP_PORT = int(os.getenv('SMTP_PORT', '587'))
SMTP_USERNAME = os.getenv('SMTP_USERNAME', 'contact@votre-domaine.com')
SMTP_PASSWORD = os.getenv('SMTP_PASSWORD', 'VOTRE_MOT_DE_PASSE_EMAIL')
SMTP_USE_TLS = True

# Configuration MySQL depuis les variables d'environnement
MYSQL_HOST = os.getenv('MYSQL_HOST', 'localhost')
MYSQL_DATABASE = os.getenv('MYSQL_DATABASE', 'votre_nom_de_base')
MYSQL_USER = os.getenv('MYSQL_USER', 'votre_utilisateur_mysql')
MYSQL_PASSWORD = os.getenv('MYSQL_PASSWORD', 'votre_mot_de_passe_mysql')

# Fonction pour envoyer un email
def send_email(name, email, subject, message, phone=None):
    """
    Envoie un email structuré à contacts@tchid-connect.com
    """
    try:
        # Créer le message
        msg = MIMEMultipart()
        msg['From'] = SMTP_USERNAME
        msg['To'] = SMTP_USERNAME
        msg['Subject'] = f"[TCHID Connect] {subject}"
        
        # Corps du message
        body = f"""
Nouveau message depuis TCHID Connect

Nom: {name}
Email: {email}
Téléphone: {phone if phone else 'Non renseigné'}

Message:
{message}

---
Envoyé depuis le site TCHID Connect
        """
        
        msg.attach(MIMEText(body, 'plain', 'utf-8'))
        
        # Connexion au serveur SMTP
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        if SMTP_USE_TLS:
            server.starttls()
        server.login(SMTP_USERNAME, SMTP_PASSWORD)
        
        # Envoi du message
        text = msg.as_string()
        server.sendmail(SMTP_USERNAME, SMTP_USERNAME, text)
        server.quit()
        
        return True
        
    except Exception as e:
        print(f"Erreur envoi email: {e}")
        return False

# Données des produits IT Store (comme dans votre version originale)
IT_STORE_PRODUCTS = [
    # Vos 34 produits ici - copiez depuis votre app.py original
    {"id": 1, "name": "ADAPTATEUR USB-C VERS HDMI", "image": "adaptateur-usb-c-hdmi.jpg"},
    {"id": 2, "name": "ALIMENTATION UNIVERSELLE 90W", "image": "alimentation-universelle-90w.jpg"},
    # ... ajoutez tous vos autres produits
]

# Données des formations TCHID Academy (comme dans votre version originale)
TCHID_ACADEMY_FORMATIONS = [
    # Vos formations ici - copiez depuis votre app.py original
    {
        "id": 1,
        "title": "Maintenance Informatique",
        "price": "35,000",
        "original_price": "70,000",
        "image": "maintenance-informatique.jpg",
        "description": "Formation complète en maintenance informatique",
        "skills": ["Diagnostic matériel", "Réparation logicielle", "Optimisation système"]
    },
    # ... ajoutez toutes vos autres formations
]

# Routes de votre application (copiez toutes vos routes depuis app.py original)
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/services')
def services():
    return render_template('services.html')

@app.route('/contact', methods=['GET', 'POST'])
def contact():
    if request.method == 'POST':
        name = request.form.get('name')
        email = request.form.get('email')
        phone = request.form.get('phone')
        subject = request.form.get('subject', 'Contact depuis le site')
        message = request.form.get('message')
        
        if send_email(name, email, subject, message, phone):
            flash('Votre message a été envoyé avec succès!', 'success')
        else:
            flash('Erreur lors de l\'envoi du message. Veuillez réessayer.', 'error')
        
        return redirect(url_for('contact'))
    
    return render_template('contact.html')

@app.route('/it-store')
def it_store():
    return render_template('it_store.html', products=IT_STORE_PRODUCTS)

@app.route('/tchid-academy')
def tchid_academy():
    return render_template('tchid_academy.html', formations=TCHID_ACADEMY_FORMATIONS)

# Ajoutez toutes vos autres routes ici...

if __name__ == '__main__':
    # En production, cette partie ne sera pas exécutée
    # L'application sera lancée par passenger_wsgi.py
    app.run(debug=False)
