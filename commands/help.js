const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');

module.exports = {
    name: 'help',
    aliases: ['h', 'aide'],
    description: 'Affiche la liste des commandes disponibles',
    async execute(message, args, client) {
        const config = client.config;
        
        const helpEmbed = new EmbedBuilder()
            .setColor(config.bot.embedColor)
            .setTitle('🛒 Moon Shop - Commandes')
            .setDescription('Voici toutes les commandes disponibles pour notre shop :')
            .addFields(
                { name: '🛒 **Shop**', value: '`!shop` - Affiche le menu du shop\n`!ticket` - Crée un ticket de support', inline: true },
                                            { name: '🛠️ **Modération**', value: '`!ban` - Bannir un utilisateur\n`!kick` - Expulser un utilisateur\n`!unban` - Débannir un utilisateur\n`!renew` - Recréer le salon actuel', inline: true },
                { name: '📢 **Communication**', value: '`!dm` - Envoyer un message privé\n`!all` - Mentionner tous les membres', inline: true },
                { name: '⚙️ **Configuration**', value: '`!setup` - Configurer le bot\n`!embed` - Créer un embed personnalisé', inline: true }
            )
            .addFields(
                { name: '📋 **Informations**', value: '`!ping` - Vérifier la latence du bot\n`!info` - Informations sur le serveur\n`!status` - Gérer le statut du bot', inline: true },
                { name: '🎫 **Tickets**', value: '`!ticket` - Ouvrir un ticket\n`!close` - Fermer un ticket', inline: true },
                { name: '👋 **Bienvenue**', value: '`!welcome` - Configurer le salon de bienvenue', inline: true },

            )
            .setFooter({ text: config.bot.embedFooter, iconURL: config.bot.embedFooterIcon })
            .setTimestamp();

        // Menu déroulant pour les catégories
        const selectMenu = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('help_menu')
                    .setPlaceholder('Sélectionnez une catégorie pour plus d\'infos')
                    .addOptions([
                        new StringSelectMenuOptionBuilder()
                            .setLabel('🛒 Shop')
                            .setDescription('Commandes liées au shop')
                            .setValue('shop_help'),
                        new StringSelectMenuOptionBuilder()
                            .setLabel('🛠️ Modération')
                            .setDescription('Commandes de modération')
                            .setValue('mod_help'),
                        new StringSelectMenuOptionBuilder()
                            .setLabel('📢 Communication')
                            .setDescription('Commandes de communication')
                            .setValue('com_help'),
                        new StringSelectMenuOptionBuilder()
                            .setLabel('⚙️ Configuration')
                            .setDescription('Commandes de configuration')
                            .setValue('config_help')
                    ])
            );

        await message.reply({ embeds: [helpEmbed], components: [selectMenu] });
    }
}; 