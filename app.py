from flask import Flask, render_template, request, redirect, url_for, flash, jsonify
import os
import json
from datetime import datetime
import urllib.parse
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

app = Flask(__name__)
app.secret_key = 'tchid_connect_secret_key'

# Configuration pour le développement - désactiver le cache
app.config['TEMPLATES_AUTO_RELOAD'] = True
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0

# Configuration SMTP pour l'envoi d'emails
# IMPORTANT: Remplacez ces valeurs par celles de votre hébergeur LWS
SMTP_SERVER = 'smtp.lws.fr'  # Serveur SMTP de LWS
SMTP_PORT = 587  # Port SMTP (587 pour TLS, 465 pour SSL)
SMTP_USERNAME = 'contacts@tchid-connect.com'  # Votre adresse email
SMTP_PASSWORD = 'VOTRE_MOT_DE_PASSE_EMAIL'  # Mot de passe de l'email
SMTP_USE_TLS = True  # Utiliser TLS

# Fonction pour envoyer un email
def send_email(name, email, subject, message, phone=None):
    """
    Envoie un email structuré à contacts@tchid-connect.com
    """
    try:
        # Créer le message email
        msg = MIMEMultipart()
        msg['From'] = SMTP_USERNAME
        msg['To'] = 'contacts@tchid-connect.com'
        msg['Subject'] = f"Nouveau message de contact - {subject}"
        
        # Corps du message structuré
        email_body = f"""
        Vous avez reçu un nouveau message via le formulaire de contact du site web :
        
        ──────────────────────────────────────────────────
        📝 INFORMATIONS DU CONTACT
        ──────────────────────────────────────────────────
        
        👤 Nom complet     : {name}
        📧 Adresse email  : {email}
        📞 Téléphone      : {phone if phone else 'Non renseigné'}
        📝 Sujet          : {subject}
        🗺️ Date/Heure     : {datetime.now().strftime('%d/%m/%Y à %H:%M:%S')}
        
        ──────────────────────────────────────────────────
        💬 MESSAGE
        ──────────────────────────────────────────────────
        
        {message}
        
        ──────────────────────────────────────────────────
        
        Ce message a été envoyé automatiquement depuis le site web TCHID Connect.
        Pour répondre, utilisez directement l'adresse email : {email}
        """
        
        # Attacher le corps du message
        msg.attach(MIMEText(email_body, 'plain', 'utf-8'))
        
        # Envoyer l'email
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        if SMTP_USE_TLS:
            server.starttls()
        server.login(SMTP_USERNAME, SMTP_PASSWORD)
        server.send_message(msg)
        server.quit()
        
        return True
        
    except Exception as e:
        print(f"Erreur lors de l'envoi de l'email: {e}")
        return False

# Ajouter la variable datetime à tous les templates
@app.context_processor
def inject_now():
    return {'now': datetime.now()}

# Dossier pour stocker les messages de contact
CONTACT_DIR = 'data/contacts'

# Créer le dossier s'il n'existe pas
if not os.path.exists(CONTACT_DIR):
    os.makedirs(CONTACT_DIR, exist_ok=True)

# Données des produits IT Store
IT_STORE_PRODUCTS = [
    {'id': 1, 'name': 'Boitier d\'alimentation 4 sorties 12V', 'image': 'Boitier d\'alimentation 4 sorties 12V.jpg'},
    {'id': 2, 'name': 'Box Android complet', 'image': 'Box Android complet.jpg'},
    {'id': 3, 'name': 'Box Android', 'image': 'Box Android.jpg'},
    {'id': 4, 'name': 'Bureautique complet ACER VERITON Core I5', 'image': 'Bureautique complet ACER VERITON Core I5.jpg'},
    {'id': 5, 'name': 'Camera Dom IP Brickom VD-E200Nf-00', 'image': 'Camera Dom IP Brickom VD-E200Nf-00.jpg'},
    {'id': 6, 'name': 'Camera Dome analogique HIKVISION 5MP', 'image': 'Camera Dome analogique HIKVISION 5MP.jpg'},
    {'id': 7, 'name': 'Camera IP H.265+5MP', 'image': 'Camera IP H.265+5MP.jpg'},
    {'id': 8, 'name': 'Camera ampoule 3 MP.V380 Pro', 'image': 'Camera ampoule 3 MP.V380 Pro.jpg'},
    {'id': 9, 'name': 'Carte de controle d\'accès 13.5 MHZ', 'image': 'Carte de controle d\'accès 13.5 MHZ.jpg'},
    {'id': 10, 'name': 'Carton de 100 connecteurs Rj45', 'image': 'Carton de 100 connecteurs Rj45.jpg'},
    {'id': 11, 'name': 'Client leger Dell WYSE TXO.12V', 'image': 'Client leger Dell WYSE TXO.12V.jpg'},
    {'id': 12, 'name': 'Clé WIFI 801.11N', 'image': 'Clé WIFI 801.11N.jpg'},
    {'id': 13, 'name': 'Coffre fort electronique', 'image': 'Coffre fort electronique.jpg'},
    {'id': 14, 'name': 'Câble réseau Cat.6 UTP', 'image': 'Câble réseau Cat.6 UTP.jpg'},
    {'id': 15, 'name': 'KIT Alarme anti-intrusion', 'image': 'KIT Alarme anti-intrusion.jpg'},
    {'id': 16, 'name': 'Kit camera analogique ColorView 2MP', 'image': 'Kit camera analogique ColorView 2MP.jpg'},
    {'id': 17, 'name': 'Kit camera wifi SriHome 2MP', 'image': 'Kit camera wifi SriHome 2MP.jpg'},
    {'id': 18, 'name': 'Kit camera wifi Tuya smart 3 MP', 'image': 'Kit camera wifi Tuya smart 3 MP.jpg'},
    {'id': 19, 'name': 'LENOVO THINKPAD T440', 'image': 'LENOVO THINKPAD T440.jpg'},
    {'id': 20, 'name': 'Lecteur MP5 Pour Véhicule', 'image': 'Lecteur MP5 Pour Véhicule.jpg'},
    {'id': 21, 'name': 'Lecteur autonome ZKTeco F22', 'image': 'Lecteur autonome ZKTeco F22.jpg'},
    {'id': 22, 'name': 'Onduleur 5V, 9V, 12V', 'image': 'Onduleur 5V, 9V, 12V.jpg'},
    {'id': 23, 'name': 'Onduleur UPS 1KVA', 'image': 'Onduleur UPS 1KVA.jpg'},
    {'id': 24, 'name': 'Panneau de brassage 24 ports', 'image': 'Panneau de brassage 24 ports.jpg'},
    {'id': 25, 'name': 'Repeteur de signal WIFI TP-Link TL-WA850RE', 'image': 'Repeteur de signal WIFI TP-Link TL-WA850RE.jpg'},
    {'id': 26, 'name': 'Rouleau Imprimante thermique 80mm', 'image': 'Rouleau Imprimante thermique 80mm.jpg'},
    {'id': 27, 'name': 'Routeur Mikrotik Série RB051UI', 'image': 'Routeur Mikrotik Série RB051UI.jpg'},
    {'id': 28, 'name': 'Répéteur de signal WIFI', 'image': 'Répéteur de signal WIFI.jpg'},
    {'id': 29, 'name': 'Support PC', 'image': 'Support PC.jpg'},
    {'id': 30, 'name': 'Testeur de câble RJ45', 'image': 'Testeur de câble RJ45.jpg'},
    {'id': 31, 'name': 'Testeur multi-fonction CCTV', 'image': 'Testeur multi-fonction CCTV.jpg'},
    {'id': 32, 'name': 'Trouceau à outil pro', 'image': 'Trouceau à outil pro.jpg'},
    {'id': 33, 'name': 'Trousseau de technicien', 'image': 'Trouveau de technicien.jpg'},
    {'id': 34, 'name': 'Téléphone SIP CISCO CP-7821-K9', 'image': 'Téléphone SIP CISCO CP-7821-K9.jpg'}
]

# Données des formations TCHID Academy
TCHID_ACADEMY_FORMATIONS = [
    {
        'id': 1,
        'name': 'Maintenance Informatique',
        'duration': '3 mois',
        'price_promo': 35000,
        'price_original': 70000,
        'discount': 50,
        'image': 'MAINTENANCE INFORMATIQUE.jpg',
        'icon': 'fas fa-tools',
        'description': 'Apprenez à diagnostiquer, réparer et maintenir les équipements informatiques.',
        'skills': ['Diagnostic hardware', 'Réparation composants', 'Installation logiciels', 'Maintenance préventive']
    },
    {
        'id': 2,
        'name': 'Administration Réseau',
        'duration': '4 mois',
        'price_promo': 60000,
        'price_original': 120000,
        'discount': 50,
        'image': 'ADMINISTRATION RESEAU.jpg',
        'icon': 'fas fa-network-wired',
        'description': 'Maîtrisez la configuration et la gestion des infrastructures réseau.',
        'skills': ['Configuration routeurs/switches', 'Sécurité réseau', 'Supervision et monitoring']
    },
    {
        'id': 3,
        'name': 'Configuration IP Phone',
        'duration': '2 mois',
        'price_promo': 30000,
        'price_original': 60000,
        'discount': 50,
        'image': 'CONFIGURATION IP PHONE.jpg',
        'icon': 'fas fa-phone',
        'description': 'Spécialisez-vous dans l\'installation et la configuration des systèmes de téléphonie IP.',
        'skills': ['Protocoles VoIP', 'Configuration PABX', 'Installation téléphones IP', 'Dépannage systèmes']
    },
    {
        'id': 4,
        'name': 'Câblage Réseau',
        'duration': '2 mois',
        'price_promo': 30000,
        'price_original': 60000,
        'discount': 50,
        'image': 'CÂBLAGE RESEAU.jpg',
        'icon': 'fas fa-ethernet',
        'description': 'Apprenez les techniques professionnelles de câblage structuré et d\'installation réseau.',
        'skills': ['Normes de câblage', 'Installation câbles', 'Sertissage connecteurs', 'Tests et certification']
    },
    {
        'id': 5,
        'name': 'CCTV - Vidéosurveillance',
        'duration': '3 mois',
        'price_promo': 50000,
        'price_original': 100000,
        'discount': 50,
        'image': 'CCTV.jpg',
        'icon': 'fas fa-video',
        'description': 'Formation complète en installation et maintenance de systèmes de vidéosurveillance professionnels.',
        'skills': ['Installation caméras IP/analogiques', 'Configuration DVR/NVR', 'Systèmes d\'alarme', 'Maintenance préventive']
    }
]

# Routes principales
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/services')
def services():
    return render_template('services.html')

@app.route('/community')
def community():
    return render_template('community.html')

@app.route('/contact', methods=['GET', 'POST'])
def contact():
    if request.method == 'POST':
        # Récupérer les données du formulaire
        name = request.form.get('name', '').strip()
        email = request.form.get('email', '').strip()
        phone = request.form.get('phone', '').strip()
        subject = request.form.get('subject', '').strip()
        message = request.form.get('message', '').strip()
        
        # Vérification des champs obligatoires
        if not all([name, email, subject, message]):
            flash('Tous les champs obligatoires doivent être remplis (nom, email, sujet, message).', 'error')
            return redirect(url_for('contact'))
        
        # Créer un dictionnaire avec les données du contact (sauvegarde locale)
        contact_data = {
            'name': name,
            'email': email,
            'phone': phone,
            'subject': subject,
            'message': message,
            'date': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        }
        
        try:
            # Envoyer l'email
            email_sent = send_email(name, email, subject, message, phone)
            
            if email_sent:
                # Sauvegarder aussi localement (optionnel)
                try:
                    filename = f"{datetime.now().strftime('%Y%m%d%H%M%S')}_{email.replace('@', '_').replace('.', '_')}.json"
                    filepath = os.path.join(CONTACT_DIR, filename)
                    with open(filepath, 'w', encoding='utf-8') as f:
                        json.dump(contact_data, f, ensure_ascii=False, indent=4)
                except Exception as save_error:
                    print(f"Erreur lors de la sauvegarde locale: {save_error}")
                
                flash('Votre message a été envoyé avec succès ! Nous vous contacterons dans les plus brefs délais.', 'success')
            else:
                flash('Une erreur s\'est produite lors de l\'envoi de votre message. Veuillez réessayer ou nous contacter directement par téléphone.', 'error')
                
        except Exception as e:
            print(f"Erreur générale lors du traitement du contact: {e}")
            flash('Une erreur technique s\'est produite. Veuillez réessayer plus tard ou nous contacter par téléphone.', 'error')
        
        return redirect(url_for('contact'))
    
    return render_template('contact.html')

# Pages de services
@app.route('/services/infrastructure')
def infrastructure_services():
    return render_template('services/infrastructure.html')

@app.route('/services/video-surveillance')
def video_surveillance():
    return render_template('services/video_surveillance.html')

@app.route('/services/geolocation')
def geolocation():
    return render_template('services/geolocation.html')

@app.route('/services/it-support')
def it_support():
    return render_template('services/it_support.html')

# TCHID Academy
@app.route('/tchid-academy')
def tchid_academy():
    return render_template('tchid_academy.html', formations=TCHID_ACADEMY_FORMATIONS)

# Formations TCHID Academy - Routes spécifiques
@app.route('/tchid-academy/maintenance-informatique')
def formation_maintenance():
    return render_template('formations/maintenance_informatique.html')

@app.route('/tchid-academy/administration-reseau')
def formation_admin_reseau():
    return render_template('formations/administration_reseau.html')

@app.route('/tchid-academy/configuration-ip-phone')
def formation_ip_phone():
    return render_template('formations/configuration_ip_phone.html')

@app.route('/tchid-academy/cablage-reseau')
def formation_cablage():
    return render_template('formations/cablage_reseau.html')

@app.route('/tchid-academy/cctv')
def formation_cctv():
    return render_template('formations/cctv.html')

# IT Store
@app.route('/it-store')
def it_store():
    return render_template('it_store.html', products=IT_STORE_PRODUCTS)

@app.route('/api/cart/add', methods=['POST'])
def add_to_cart():
    data = request.get_json()
    product_id = data.get('product_id')
    quantity = data.get('quantity', 1)
    
    # Trouver le produit
    product = next((p for p in IT_STORE_PRODUCTS if p['id'] == product_id), None)
    if not product:
        return jsonify({'success': False, 'message': 'Produit non trouvé'})
    
    return jsonify({'success': True, 'message': 'Produit ajouté au panier'})

@app.route('/api/cart/order', methods=['POST'])
def create_order():
    data = request.get_json()
    cart_items = data.get('items', [])
    
    if not cart_items:
        return jsonify({'success': False, 'message': 'Panier vide'})
    
    # Créer le message WhatsApp
    message = "Bonjour TCHID Connect,\n\nJe souhaite commander les articles suivants :\n\n"
    total = 0
    
    for item in cart_items:
        product = next((p for p in IT_STORE_PRODUCTS if p['id'] == item['id']), None)
        if product:
            subtotal = product['price'] * item['quantity']
            total += subtotal
            message += f"- {product['name']} x{item['quantity']} = {subtotal:,} FCFA\n"
    
    message += f"\nTotal : {total:,} FCFA\n\nMerci de me contacter pour finaliser la commande."
    
    # Encoder le message pour WhatsApp
    encoded_message = urllib.parse.quote(message)
    whatsapp_url = f"https://wa.me/242050471818?text={encoded_message}"
    
    return jsonify({'success': True, 'whatsapp_url': whatsapp_url})

# Route pour les devis
@app.route('/quote/<service>')
def request_quote(service):
    return redirect(url_for('contact'))

# S'assurer que le dossier de contacts existe
if not os.path.exists(CONTACT_DIR):
    os.makedirs(CONTACT_DIR, exist_ok=True)

# Admin routes for IT Store
@app.route('/admin-store')
def admin_store():
    # Simple session check (replace with proper authentication)
    return render_template('admin_store.html')

@app.route('/api/admin/login', methods=['POST'])
def admin_login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    # Simple authentication (replace with database check)
    if email == 'admin@tchidconnect.com' and password == 'admin123':
        return {'success': True, 'message': 'Connexion réussie'}
    else:
        return {'success': False, 'message': 'Identifiants incorrects'}, 401

# Route de test pour vérifier les modifications
@app.route('/test-prix')
def test_prix():
    return '''
    <h1>Test des prix TCHID Academy</h1>
    <p>Maintenance Informatique: 35,000 FCFA (au lieu de 70,000 FCFA)</p>
    <p>Administration Réseau: 60,000 FCFA (au lieu de 120,000 FCFA)</p>
    <p>Configuration IP Phone: 30,000 FCFA (au lieu de 60,000 FCFA)</p>
    <p>Câblage Réseau: 30,000 FCFA (au lieu de 60,000 FCFA)</p>
    <p>CCTV: 50,000 FCFA (au lieu de 100,000 FCFA)</p>
    <p>Promo vacances -50% appliquée !</p>
    <a href="/tchid-academy">Voir TCHID Academy</a>
    '''

@app.route('/test-academy')
def test_academy():
    return render_template('test_academy.html')

@app.route('/test-dynamic')
def test_dynamic():
    return render_template('tchid_academy_dynamic.html', formations=TCHID_ACADEMY_FORMATIONS)

if __name__ == '__main__':
    app.run(debug=True)
