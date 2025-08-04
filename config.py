# Configuration pour TCHID Connect
import os

class Config:
    """Configuration de base"""
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'tchid_connect_secret_key'
    
    # Configuration pour le développement
    TEMPLATES_AUTO_RELOAD = True
    SEND_FILE_MAX_AGE_DEFAULT = 0
    
    # Configuration SMTP
    SMTP_SERVER = os.environ.get('SMTP_SERVER') or 'smtp.lws.fr'
    SMTP_PORT = int(os.environ.get('SMTP_PORT') or 587)
    SMTP_USERNAME = os.environ.get('SMTP_USERNAME') or 'contacts@tchid-connect.com'
    SMTP_PASSWORD = os.environ.get('SMTP_PASSWORD') or 'VOTRE_MOT_DE_PASSE_EMAIL'
    SMTP_USE_TLS = os.environ.get('SMTP_USE_TLS', 'True').lower() == 'true'

class DevelopmentConfig(Config):
    """Configuration pour le développement"""
    DEBUG = True
    
class ProductionConfig(Config):
    """Configuration pour la production"""
    DEBUG = False
    # Désactiver le rechargement automatique des templates en production
    TEMPLATES_AUTO_RELOAD = False
    # Cache des fichiers statiques plus long en production
    SEND_FILE_MAX_AGE_DEFAULT = 31536000  # 1 an

# Configuration par défaut
config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}
