const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'embed',
    aliases: ['createembed'],
    description: 'Créer un embed personnalisé',
    async execute(message, args, client) {
        const config = client.config;
        
        // Vérifier les permissions
        if (!message.member.permissions.has('ManageMessages')) {
            const errorEmbed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('❌ Permissions insuffisantes')
                .setDescription('Vous devez avoir la permission "Gérer les messages" pour utiliser cette commande.')
                .setFooter({ text: config.bot.embedFooter, iconURL: config.bot.embedFooterIcon })
                .setTimestamp();
            
            return message.reply({ embeds: [errorEmbed] });
        }

        // Vérifier les arguments
        if (args.length < 1) {
            const helpEmbed = new EmbedBuilder()
                .setColor(config.bot.embedColor)
                .setTitle('📝 Création d\'Embed')
                .setDescription('Voici comment utiliser la commande embed :')
                .addFields(
                    { name: '📋 Syntaxe', value: '`!embed <titre> | <description> | [couleur] | [image]`', inline: false },
                    { name: '🎨 Couleurs disponibles', value: '`red`, `green`, `blue`, `yellow`, `purple`, `orange`, `pink`, `cyan`, `white`, `black`', inline: false },
                    { name: '📸 Image', value: 'Ajoutez une URL d\'image à la fin pour l\'afficher dans l\'embed', inline: false },
                    { name: '💡 Exemple', value: '`!embed Mon Titre | Ma description | blue | https://example.com/image.png`', inline: false }
                )
                .setFooter({ text: config.bot.embedFooter, iconURL: config.bot.embedFooterIcon })
                .setTimestamp();
            
            return message.reply({ embeds: [helpEmbed] });
        }

        const fullContent = args.join(' ');
        const parts = fullContent.split('|').map(part => part.trim());

        if (parts.length < 2) {
            const errorEmbed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('❌ Format invalide')
                .setDescription('Format requis : `!embed <titre> | <description> | [couleur] | [image]`')
                .setFooter({ text: config.bot.embedFooter, iconURL: config.bot.embedFooterIcon })
                .setTimestamp();
            
            return message.reply({ embeds: [errorEmbed] });
        }

        const title = parts[0];
        const description = parts[1];
        const color = parts[2] || config.bot.embedColor;
        const imageUrl = parts[3] || null;

        // Convertir les noms de couleurs en codes hex
        const colorMap = {
            'red': '#FF0000',
            'green': '#00FF00',
            'blue': '#0000FF',
            'yellow': '#FFFF00',
            'purple': '#800080',
            'orange': '#FFA500',
            'pink': '#FFC0CB',
            'cyan': '#00FFFF',
            'white': '#FFFFFF',
            'black': '#000000'
        };

        const embedColor = colorMap[color.toLowerCase()] || color;

        try {
            const customEmbed = new EmbedBuilder()
                .setColor(embedColor)
                .setTitle(title)
                .setDescription(description)
                .setFooter({ text: config.bot.embedFooter, iconURL: config.bot.embedFooterIcon })
                .setTimestamp();

            if (imageUrl && imageUrl.startsWith('http')) {
                customEmbed.setImage(imageUrl);
            }

            // Supprimer la commande originale
            await message.delete().catch(() => {});

            // Envoyer l'embed
            await message.channel.send({ embeds: [customEmbed] });

        } catch (error) {
            console.error('Erreur lors de la création de l\'embed:', error);
            const errorEmbed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('❌ Erreur')
                .setDescription('Une erreur est survenue lors de la création de l\'embed.')
                .setFooter({ text: config.bot.embedFooter, iconURL: config.bot.embedFooterIcon })
                .setTimestamp();
            
            await message.reply({ embeds: [errorEmbed] });
        }
    }
}; 