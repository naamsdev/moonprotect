# 🛒 Moon Shop Bot Discord

Un bot Discord complet pour votre shop d'accounts, nitro, boosts, panel CC et autres services.

## ✨ Fonctionnalités

### 🛒 Shop
- Menu déroulant pour les catégories de produits
- Système de tickets personnalisable
- Embeds personnalisables pour chaque catégorie

### 🛠️ Modération
- `!ban` - Bannir un utilisateur
- `!kick` - Expulser un utilisateur  
- `!unban` - Débannir un utilisateur

### 📢 Communication
- `!dm` - Envoyer un message privé
- `!all` - Mentionner tous les membres
- `!embed` - Créer des embeds personnalisés

### 🎫 Système de Tickets
- Création automatique de tickets
- Boutons pour fermer les tickets
- Permissions personnalisables
- Support multi-catégories

### 👋 Système de Bienvenue Avancé
- Messages de bienvenue personnalisables avec embeds
- Affichage de la bannière du membre ou avatar en fallback
- Nom d'utilisateur affiché sur l'image
- Configuration flexible (image principale/thumbnail, préférence bannière/avatar)
- Support des variables {user}
- Commande `!welcome` pour tester et configurer

### ⚙️ Configuration
- `!setup` - Configurer le bot
- `!help` - Menu d'aide avec menu déroulant
- `!welcome` - Configurer le système de bienvenue
- `!ping` - Vérifier la latence
- `!info` - Informations du serveur

## 🚀 Installation

### 1. Prérequis
- Node.js 16.9.0 ou supérieur
- npm ou yarn
- Un bot Discord (créé sur [Discord Developer Portal](https://discord.com/developers/applications))

### 2. Installation des dépendances
```bash
npm install
```

### 3. Configuration
1. Copiez le fichier `env.example` vers `.env`
2. Remplacez `YOUR_BOT_TOKEN` par le token de votre bot
3. Modifiez `config.json` selon vos besoins

### 4. Configuration du bot
1. Invitez le bot sur votre serveur avec les permissions nécessaires
2. Utilisez `!setup` pour configurer :
   - Le système de tickets : `!setup tickets <catégorie_id> <rôle_support_id>`
   - Le système de bienvenue : `!setup welcome <channel_id>`
   - Vérifier la configuration : `!setup status`

### 5. Lancement
```bash
# Mode développement (avec redémarrage automatique)
npm run dev

# Mode production
npm start
```

## 📋 Commandes

### 🛒 Shop
- `!shop` - Afficher le menu du shop
- `!ticket` - Créer un ticket de support

### 🛠️ Modération
- `!ban @utilisateur [raison]` - Bannir un utilisateur
- `!kick @utilisateur [raison]` - Expulser un utilisateur
- `!unban <ID_utilisateur>` - Débannir un utilisateur

### 📢 Communication
- `!dm @utilisateur <message>` - Envoyer un message privé
- `!all <message>` - Mentionner tous les membres
- `!embed <titre> | <description> | [couleur] | [image]` - Créer un embed

### ⚙️ Configuration
- `!setup` - Menu de configuration
- `!help` - Afficher l'aide
- `!welcome` - Configurer le système de bienvenue
- `!ping` - Vérifier la latence
- `!info` - Informations du serveur

## ⚙️ Configuration avancée

### config.json
```json
{
  "bot": {
    "prefix": "!",
    "embedColor": "#FF6B6B",
    "embedFooter": "Moon Shop Bot",
    "embedFooterIcon": "https://i.imgur.com/example.png"
  },
  "welcome": {
    "enabled": true,
    "channelId": "",
    "message": "🎉 Bienvenue {user} sur **Moon Shop** !",
    "embedColor": "#00FF88",
    "embedTitle": "👋 Nouveau membre !",
    "embedThumbnail": "https://i.imgur.com/example.png",
    "showMemberImage": true,
    "imageAsMain": true,
    "showUsernameField": true,
    "usernameFieldName": "👤 Membre",
    "preferBanner": true,
    "imageSize": 1024
  },
  "tickets": {
    "enabled": true,
    "categoryId": "",
    "supportRoleId": "",
    "ticketMessage": "🎫 **Système de Tickets Moon Shop**"
  },
  "shop": {
    "categories": [
      {
        "name": "🎮 Accounts Gaming",
        "value": "gaming",
        "description": "Accounts Steam, Epic, Origin, etc."
      }
    ]
  }
}
```

## 🎉 Système de Bienvenue Avancé

Le système de bienvenue a été considérablement amélioré avec les fonctionnalités suivantes :

### ✨ Fonctionnalités
- **Affichage de la bannière** : Récupère automatiquement la bannière du nouveau membre
- **Fallback vers l'avatar** : Si pas de bannière, utilise l'avatar du membre
- **Nom d'utilisateur** : Affiche le nom d'utilisateur dans un champ séparé
- **Configuration flexible** : Contrôle total sur l'affichage des images

### ⚙️ Options de configuration
```json
"welcome": {
  "showMemberImage": true,        // Afficher l'image du membre
  "imageAsMain": true,           // Utiliser l'image comme image principale
  "showUsernameField": true,     // Afficher le champ nom d'utilisateur
  "usernameFieldName": "👤 Membre", // Nom du champ
  "preferBanner": true,          // Préférer la bannière à l'avatar
  "imageSize": 1024              // Taille de l'image en pixels
}
```

### 🎮 Commandes de bienvenue
- `!welcome` - Afficher la configuration actuelle
- `!welcome test` - Tester le système de bienvenue
- `!welcome toggle` - Activer/désactiver le système

### 📸 Types d'affichage
1. **Image principale** (`imageAsMain: true`) : L'image du membre est affichée comme image principale de l'embed
2. **Thumbnail** (`imageAsMain: false`) : L'image du membre est affichée comme thumbnail
3. **Bannière préférée** (`preferBanner: true`) : Utilise la bannière si disponible, sinon l'avatar
4. **Avatar uniquement** (`preferBanner: false`) : Utilise toujours l'avatar

## 🔧 Permissions requises

Le bot nécessite les permissions suivantes :
- `Send Messages` - Envoyer des messages
- `Manage Messages` - Gérer les messages
- `Manage Channels` - Gérer les channels
- `Ban Members` - Bannir des membres
- `Kick Members` - Expulser des membres
- `Manage Roles` - Gérer les rôles
- `Embed Links` - Intégrer des liens
- `Use External Emojis` - Utiliser des emojis externes
- `Add Reactions` - Ajouter des réactions

## 🎨 Personnalisation

### Couleurs d'embeds
Vous pouvez utiliser :
- Noms de couleurs : `red`, `green`, `blue`, `yellow`, `purple`, `orange`, `pink`, `cyan`, `white`, `black`
- Codes hexadécimaux : `#FF0000`, `#00FF00`, etc.

### Messages de bienvenue
Utilisez `{user}` pour mentionner le nouvel utilisateur.

### Catégories du shop
Modifiez le fichier `config.json` pour ajouter/modifier les catégories de produits.

## 🐛 Dépannage

### Le bot ne répond pas
1. Vérifiez que le token est correct dans `.env`
2. Vérifiez que le bot a les bonnes permissions
3. Vérifiez que le préfixe est correct dans `config.json`

### Les tickets ne se créent pas
1. Utilisez `!setup tickets` pour configurer le système
2. Vérifiez que la catégorie et le rôle existent
3. Vérifiez les permissions du bot

### Le système de bienvenue ne fonctionne pas
1. Utilisez `!setup welcome` pour configurer le système
2. Vérifiez que le channel existe
3. Vérifiez que le bot a accès au channel

## 📝 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🤝 Support

Pour obtenir de l'aide :
1. Ouvrez un ticket sur le serveur Discord
2. Consultez la documentation
3. Vérifiez les logs d'erreur

---

**Moon Shop Bot** - Votre partenaire pour un shop Discord professionnel ! 🛒✨ 