# 🚀 Guide d'Hébergement TCHID Connect sur LWS cPanel

## 📋 **ÉTAPES PRÉPARATOIRES**

### **1. Configuration Email (IMPORTANT)**
Avant l'hébergement, vous devez :

1. **Créer l'adresse email** `contacts@tchid-connect.com` dans votre cPanel LWS
2. **Récupérer les paramètres SMTP** de LWS :
   - Serveur SMTP : `smtp.lws.fr` (ou selon votre configuration LWS)
   - Port : `587` (TLS) ou `465` (SSL)
   - Nom d'utilisateur : `contacts@tchid-connect.com`
   - Mot de passe : Le mot de passe que vous avez défini

3. **Modifier le fichier `app.py`** lignes 18-22 :
```python
SMTP_SERVER = 'smtp.lws.fr'  # Remplacer par le serveur LWS
SMTP_PORT = 587
SMTP_USERNAME = 'contacts@tchid-connect.com'
SMTP_PASSWORD = 'VOTRE_VRAI_MOT_DE_PASSE'  # ⚠️ IMPORTANT
SMTP_USE_TLS = True
```

---

## 🌐 **HÉBERGEMENT SUR LWS CPANEL**

### **Étape 1 : Préparation des Fichiers**

1. **Créer un dossier** `tchid-connect-web` sur votre ordinateur
2.### **🎯 Réponses EXACTES pour LWS :**

| Champ LWS | Valeur à saisir |
|-----------|----------------|
| **Application root** | `/public_html/tchid-connect` |
| **Application URL** | `/` |
| **Application startup file** | `app.py` |
| **Application Entry point** | `app` |
| **Python version** | `3.8+` |

### **📁 Structure des fichiers sur le serveur :**
```
/public_html/tchid-connect/
├── app.py                 ← Fichier principal Flask
├── requirements.txt       ← Dépendances Python
├── static/
│   ├── css/
│   ├── img/
│   └── js/
├── templates/
└── data/
```

### **⚠️ IMPORTANT - Chemins corrigés :**
✅ **Tous les chemins dans le code sont déjà relatifs et compatibles hébergement**
- `app.py` : Utilise des chemins relatifs (`data/contacts`)
- Templates : Utilisent `url_for('static', filename='...')`
- JavaScript : Utilise `window.STATIC_URL` pour les chemins dynamiques

### **Étape 2 : Connexion cPanel LWS**

1. **Connectez-vous** à votre cPanel LWS
2. **Accédez** au gestionnaire de fichiers
3. **Naviguez** vers le dossier `public_html` (ou `www`)

### **Étape 3 : Upload des Fichiers**

1. **Créer un dossier** (ex: `tchid-connect`) dans `public_html`
2. **Uploader tous les fichiers** du projet dans ce dossier
3. **Vérifier** que la structure est correcte

### **Étape 4 : Configuration Python**

#### **Option A : Si LWS supporte Flask directement**
1. Dans cPanel, cherchez **"Python App"** ou **"Python Selector"**
2. **Créer une nouvelle application Python**
3. **Sélectionner Python 3.8+**
4. **Définir le répertoire** : `/public_html/tchid-connect`
5. **Fichier de démarrage** : `app.py`

#### **Option B : Conversion en PHP (Alternative)**
Si LWS ne supporte pas Flask, vous devrez convertir en PHP :

1. **Créer** `index.php` :
```php
<?php
// Redirection vers la page d'accueil
header('Location: home.php');
?>
```

2. **Convertir les templates** HTML en PHP
3. **Remplacer la logique Flask** par du PHP

### **Étape 5 : Configuration Base de Données (Optionnel)**

1. **Créer une base MySQL** dans cPanel
2. **Modifier** `app.py` pour utiliser MySQL au lieu des fichiers JSON
3. **Installer** `mysql-connector-python` dans requirements.txt

---

## ⚙️ **CONFIGURATION SPÉCIFIQUE LWS**

### **Paramètres Email LWS**
```python
# Configuration SMTP LWS (à vérifier avec votre hébergeur)
SMTP_SERVER = 'smtp.lws.fr'  # ou smtp.votre-domaine.com
SMTP_PORT = 587  # ou 465 pour SSL
SMTP_USERNAME = 'contacts@tchid-connect.com'
SMTP_PASSWORD = 'votre_mot_de_passe_email'
SMTP_USE_TLS = True  # ou False si SSL
```

### **Fichier .htaccess** (pour Apache)
Créer `.htaccess` dans le dossier racine :
```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ app.py/$1 [QSA,L]
```

---

## 🧪 **TESTS APRÈS HÉBERGEMENT**

### **1. Test du Site**
- Accédez à `https://votre-domaine.com/tchid-connect`
- Vérifiez toutes les pages
- Testez la navigation

### **2. Test du Formulaire de Contact**
1. Allez sur `/contact`
2. Remplissez le formulaire avec vos vraies données
3. Cliquez sur "Envoyer"
4. Vérifiez que vous recevez l'email sur `contacts@tchid-connect.com`

### **3. Test des Fonctionnalités**
- ✅ IT Store (ajout au panier, WhatsApp)
- ✅ TCHID Academy (affichage des formations)
- ✅ Pages de services
- ✅ Formulaire de contact

---

## 🚨 **PROBLÈMES COURANTS**

### **Erreur 500 - Internal Server Error**
- Vérifiez les permissions des fichiers (755 pour dossiers, 644 pour fichiers)
- Vérifiez les logs d'erreur dans cPanel
- Assurez-vous que Python est bien configuré

### **Emails non reçus**
- Vérifiez les paramètres SMTP
- Testez avec un client email (Thunderbird, Outlook)
- Vérifiez les logs email dans cPanel

### **Images non affichées**
- Vérifiez que le dossier `static/img/` est bien uploadé
- Vérifiez les permissions des fichiers images
- Testez les URLs directes des images

---

## 📞 **SUPPORT**

Si vous rencontrez des problèmes :

1. **Contactez le support LWS** pour :
   - Configuration Python/Flask
   - Paramètres SMTP
   - Permissions fichiers

2. **Vérifiez les logs** :
   - Logs d'erreur Apache
   - Logs email
   - Logs Python (si disponibles)

---

## ✅ **CHECKLIST FINALE**

Avant la mise en ligne :

- [ ] Adresse email `contacts@tchid-connect.com` créée
- [ ] Paramètres SMTP configurés dans `app.py`
- [ ] Tous les fichiers uploadés
- [ ] Permissions correctes
- [ ] Test du formulaire de contact
- [ ] Test de toutes les pages
- [ ] Vérification des images
- [ ] Test sur mobile et desktop

**🎉 Votre site TCHID Connect sera alors accessible depuis Internet !**
