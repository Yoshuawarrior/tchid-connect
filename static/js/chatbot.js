// Chatbot TCHID Connect - Intelligence Artificielle
class TCHIDChatbot {
    constructor() {
        this.isOpen = false;
        this.messages = [];
        this.isTyping = false;
        this.init();
        this.loadKnowledgeBase();
    }

    init() {
        this.createChatbotHTML();
        this.bindEvents();
        this.addWelcomeMessage();
    }

    loadKnowledgeBase() {
        this.knowledgeBase = {
            services: {
                keywords: ['service', 'services', 'infrastructure', 'réseau', 'vidéo', 'surveillance', 'géolocalisation', 'support', 'technique', 'maintenance'],
                responses: [
                    "TCHID Connect propose plusieurs services :\n• Installation et Maintenance des Infrastructures IT\n• Vidéo-surveillance et sécurité électronique\n• Géolocalisation et tracking GPS\n• Support technique et audit informatique\n\nVoulez-vous en savoir plus sur un service en particulier ?",
                    "Nos services couvrent tous vos besoins IT :\n✓ Réseaux LAN/WAN\n✓ Systèmes de sécurité\n✓ Solutions de géolocalisation\n✓ Support et maintenance\n\nQuel service vous intéresse le plus ?"
                ]
            },
            formations: {
                keywords: ['formation', 'formations', 'academy', 'tchid academy', 'cours', 'apprentissage', 'certification'],
                responses: [
                    "TCHID ACADEMY propose 5 formations professionnelles :\n• Maintenance Informatique\n• Administration Réseau\n• Configuration IP Phone\n• Câblage Réseau\n• CCTV - Vidéosurveillance\n\nToutes nos formations sont certifiantes. Laquelle vous intéresse ?",
                    "Nos formations sont conçues par des experts :\n🎓 Certification professionnelle\n🎓 Formation pratique et théorique\n🎓 Suivi personnalisé\n🎓 Équipements modernes\n\nSouhaitez-vous plus d'informations sur une formation spécifique ?"
                ]
            },
            contact: {
                keywords: ['contact', 'contacter', 'téléphone', 'email', 'adresse', 'localisation', 'rendez-vous'],
                responses: [
                    "Voici nos coordonnées :\n📞 +242 06 528 66 66\n📞 +242 05 047 18 18\n📧 contact@tchidconnect.com\n📍 Brazzaville, République du Congo\n\nNous sommes disponibles du lundi au vendredi de 8h à 18h.",
                    "Pour nous contacter :\n• Téléphone : +242 06 528 66 66\n• WhatsApp : +242 05 047 18 18\n• Email : contact@tchidconnect.com\n\nNotre équipe vous répond rapidement !"
                ]
            },
            prix: {
                keywords: ['prix', 'tarif', 'coût', 'devis', 'budget', 'facturation'],
                responses: [
                    "Nos tarifs sont personnalisés selon vos besoins. Pour obtenir un devis gratuit :\n• Décrivez votre projet\n• Nous analysons vos besoins\n• Devis détaillé sous 24h\n\nSouhaitez-vous demander un devis maintenant ?",
                    "Chaque projet est unique ! Nous proposons :\n💰 Devis gratuit et détaillé\n💰 Tarifs compétitifs\n💰 Solutions sur mesure\n💰 Paiement flexible\n\nContactez-nous pour votre devis personnalisé."
                ]
            },
            itstore: {
                keywords: ['store', 'boutique', 'produit', 'matériel', 'équipement', 'achat', 'commander'],
                responses: [
                    "Notre IT STORE propose du matériel professionnel :\n🛒 Équipements réseau\n🛒 Systèmes de sécurité\n🛒 Matériel informatique\n🛒 Outils techniques\n\nCommande facile via WhatsApp. Visitez notre boutique en ligne !",
                    "IT STORE - Votre partenaire matériel :\n• Produits certifiés\n• Garantie constructeur\n• Livraison rapide\n• Support technique inclus\n\nQue recherchez-vous comme équipement ?"
                ]
            },
            default: [
                "Je suis là pour vous aider ! Vous pouvez me poser des questions sur :\n• Nos services IT\n• Les formations TCHID ACADEMY\n• Notre IT STORE\n• Nos coordonnées\n• Demander un devis",
                "Comment puis-je vous aider aujourd'hui ? Je peux vous renseigner sur tous nos services, formations, produits et vous mettre en contact avec notre équipe.",
                "Bonjour ! Je suis l'assistant virtuel de TCHID Connect. Posez-moi vos questions sur nos services, formations ou produits. Je suis là pour vous aider !"
            ]
        };
    }

    createChatbotHTML() {
        const chatbotHTML = `
            <div id="tchid-chatbot" class="chatbot-container">
                <div class="chatbot-header">
                    <div class="chatbot-avatar">
                        <i class="fas fa-robot"></i>
                    </div>
                    <div class="chatbot-info">
                        <h4>Assistant TCHID</h4>
                        <span class="status">En ligne</span>
                    </div>
                    <button class="chatbot-close" onclick="tchidChatbot.toggle()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="chatbot-messages" id="chatbot-messages"></div>
                <div class="chatbot-typing" id="chatbot-typing" style="display: none;">
                    <div class="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                    <span>Assistant TCHID écrit...</span>
                </div>
                <div class="chatbot-input">
                    <input type="text" id="chatbot-input" placeholder="Tapez votre message..." maxlength="500">
                    <button onclick="tchidChatbot.sendMessage()">
                        <i class="fas fa-paper-plane"></i>
                    </button>
                </div>
                <div class="chatbot-suggestions">
                    <button onclick="tchidChatbot.sendPredefinedMessage('Quels sont vos services ?')">Nos services</button>
                    <button onclick="tchidChatbot.sendPredefinedMessage('Formations disponibles ?')">Formations</button>
                    <button onclick="tchidChatbot.sendPredefinedMessage('Comment vous contacter ?')">Contact</button>
                </div>
            </div>
            <div class="chatbot-toggle" onclick="tchidChatbot.toggle()">
                <i class="fas fa-comments"></i>
                <div class="chatbot-notification" id="chatbot-notification">1</div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', chatbotHTML);
    }

    bindEvents() {
        const input = document.getElementById('chatbot-input');
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });

        // Auto-resize input
        input.addEventListener('input', (e) => {
            if (e.target.value.length > 0) {
                document.querySelector('.chatbot-suggestions').style.display = 'none';
            } else {
                document.querySelector('.chatbot-suggestions').style.display = 'flex';
            }
        });
    }

    toggle() {
        const chatbot = document.getElementById('tchid-chatbot');
        const notification = document.getElementById('chatbot-notification');
        
        this.isOpen = !this.isOpen;
        
        if (this.isOpen) {
            chatbot.classList.add('open');
            notification.style.display = 'none';
            document.getElementById('chatbot-input').focus();
        } else {
            chatbot.classList.remove('open');
        }
    }

    addWelcomeMessage() {
        setTimeout(() => {
            this.addMessage('bot', "👋 Bonjour ! Je suis l'assistant virtuel de TCHID Connect. Comment puis-je vous aider aujourd'hui ?");
            document.getElementById('chatbot-notification').style.display = 'block';
        }, 2000);
    }

    sendMessage() {
        const input = document.getElementById('chatbot-input');
        const message = input.value.trim();
        
        if (!message) return;
        
        this.addMessage('user', message);
        input.value = '';
        document.querySelector('.chatbot-suggestions').style.display = 'flex';
        
        this.showTyping();
        
        setTimeout(() => {
            this.hideTyping();
            const response = this.generateResponse(message);
            this.addMessage('bot', response);
        }, 1000 + Math.random() * 2000);
    }

    sendPredefinedMessage(message) {
        document.getElementById('chatbot-input').value = message;
        this.sendMessage();
    }

    addMessage(sender, text) {
        const messagesContainer = document.getElementById('chatbot-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const time = new Date().toLocaleTimeString('fr-FR', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        
        if (sender === 'bot') {
            messageDiv.innerHTML = `
                <div class="message-avatar">
                    <i class="fas fa-robot"></i>
                </div>
                <div class="message-content">
                    <div class="message-text">${text.replace(/\n/g, '<br>')}</div>
                    <div class="message-time">${time}</div>
                </div>
            `;
        } else {
            messageDiv.innerHTML = `
                <div class="message-content">
                    <div class="message-text">${text}</div>
                    <div class="message-time">${time}</div>
                </div>
            `;
        }
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        // Animation d'apparition
        setTimeout(() => messageDiv.classList.add('show'), 100);
    }

    showTyping() {
        this.isTyping = true;
        document.getElementById('chatbot-typing').style.display = 'flex';
        const messagesContainer = document.getElementById('chatbot-messages');
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    hideTyping() {
        this.isTyping = false;
        document.getElementById('chatbot-typing').style.display = 'none';
    }

    generateResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        // Recherche dans la base de connaissances
        for (const [category, data] of Object.entries(this.knowledgeBase)) {
            if (category === 'default') continue;
            
            const found = data.keywords.some(keyword => 
                lowerMessage.includes(keyword.toLowerCase())
            );
            
            if (found) {
                return data.responses[Math.floor(Math.random() * data.responses.length)];
            }
        }
        
        // Réponses spéciales pour certains mots-clés
        if (lowerMessage.includes('bonjour') || lowerMessage.includes('salut') || lowerMessage.includes('hello')) {
            return "Bonjour ! 😊 Je suis ravi de vous accueillir chez TCHID Connect. Comment puis-je vous aider aujourd'hui ?";
        }
        
        if (lowerMessage.includes('merci') || lowerMessage.includes('thank')) {
            return "Je vous en prie ! 😊 N'hésitez pas si vous avez d'autres questions. Notre équipe est toujours là pour vous aider.";
        }
        
        if (lowerMessage.includes('au revoir') || lowerMessage.includes('bye')) {
            return "Au revoir ! 👋 Merci d'avoir visité TCHID Connect. N'hésitez pas à revenir si vous avez besoin d'aide !";
        }
        
        // Réponse par défaut
        return this.knowledgeBase.default[Math.floor(Math.random() * this.knowledgeBase.default.length)];
    }
}

// Initialisation du chatbot
let tchidChatbot;
document.addEventListener('DOMContentLoaded', function() {
    tchidChatbot = new TCHIDChatbot();
});
