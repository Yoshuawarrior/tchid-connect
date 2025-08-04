# Guide de Correction des Problèmes d'Affichage - TCHID Connect

## 🔍 Problèmes Identifiés

1. **Pages ne s'affichent pas** : Problème de routes Flask
2. **Design différent** : Fichiers CSS/JS/images ne se chargent pas correctement
3. **Ressources statiques manquantes** : Chemins incorrects sur l'hébergeur

## ✅ Solutions Appliquées

### 1. Correction des Routes Flask

**Problème** : Les routes dynamiques causaient des conflits
**Solution** : Retour aux routes spécifiques et stables

```python
# ✅ Routes corrigées dans app.py
@app.route('/services/infrastructure')
def infrastructure_services():
    return render_template('services/infrastructure.html')

@app.route('/tchid-academy/maintenance-informatique')
def formation_maintenance():
    return render_template('formations/maintenance_informatique.html')
```

### 2. Fichiers Créés pour l'Hébergement

#### A. `wsgi.py` - Point d'entrée pour la production
```python
from app import app
application = app
```

#### B. `.htaccess` - Configuration Apache
- Cache des fichiers statiques
- Compression des ressources
- Sécurité renforcée

#### C. `config.py` - Configuration centralisée
- Paramètres de développement/production
- Variables d'environnement

## 🚀 Instructions de Déploiement

### Étape 1 : Vérification Locale
```bash
cd c:\xampp\htdocs\tchid-connect
python app.py
```
Testez : http://127.0.0.1:5000

### Étape 2 : Upload sur LWS
1. **Uploadez TOUS les fichiers** vers votre hébergement
2. **Vérifiez la structure** :
   ```
   public_html/
   ├── app.py
   ├── wsgi.py
   ├── .htaccess
   ├── requirements.txt
   ├── static/
   │   ├── css/
   │   ├── js/
   │   └── img/
   └── templates/
   ```

### Étape 3 : Configuration Python App (cPanel)
1. Allez dans **Python App** dans cPanel
2. **Application Root** : `/public_html`
3. **Application URL** : `/` (ou votre sous-domaine)
4. **Application Startup File** : `wsgi.py`
5. **Application Entry Point** : `application`

### Étape 4 : Installation des Dépendances
Dans le terminal cPanel :
```bash
pip install -r requirements.txt
```

### Étape 5 : Vérification des Permissions
```bash
chmod 644 *.py
chmod 644 .htaccess
chmod -R 644 static/*
chmod -R 644 templates/*
```

## 🔧 Diagnostic des Problèmes

### Si les pages ne s'affichent toujours pas :

1. **Vérifiez les logs d'erreur** dans cPanel
2. **Testez les routes individuellement** :
   - `/` (page d'accueil)
   - `/about`
   - `/services/infrastructure`
   - `/tchid-academy`

3. **Vérifiez les fichiers statiques** :
   - `votre-site.com/static/css/style.css`
   - `votre-site.com/static/js/main.js`
   - `votre-site.com/static/img/logo TCHID Connect.png`

### Si le design ne s'affiche pas :

1. **Vérifiez les chemins dans base.html** :
   ```html
   <link rel="stylesheet" href="{{ url_for('static', filename='css/style.css') }}">
   ```

2. **Testez l'accès direct aux CSS** :
   - Ouvrez `votre-site.com/static/css/style.css` dans le navigateur
   - Si erreur 404 → problème de structure de dossiers
   - Si erreur 403 → problème de permissions

3. **Vérifiez la console du navigateur** (F12) pour les erreurs

## 📞 Support

Si les problèmes persistent :
1. Vérifiez les logs d'erreur de votre hébergeur
2. Contactez le support LWS avec les détails techniques
3. Partagez les messages d'erreur exacts

## 🎯 Points Clés à Retenir

- ✅ Utilisez `wsgi.py` comme point d'entrée
- ✅ Vérifiez que tous les dossiers `static/` sont uploadés
- ✅ Testez les URLs une par une
- ✅ Consultez les logs d'erreur
- ✅ Vérifiez les permissions des fichiers
