const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');

module.exports = {
    name: 'shop',
    aliases: ['boutique', 'store'],
    description: 'Affiche le menu du shop avec toutes les catégories',
    async execute(message, args, client) {
        const config = client.config;
        
        const shopEmbed = new EmbedBuilder()
            .setColor(config.bot.embedColor)
            .setTitle('🛒 Moon Shop - Boutique')
            .setDescription('Bienvenue dans notre boutique ! Sélectionnez une catégorie ci-dessous pour voir nos produits :')
            .addFields(
                { name: '🎮 Accounts Gaming', value: 'Steam, Epic, Origin, etc.', inline: true },
                { name: '⚡ Nitro Discord', value: 'Nitro Classic et Boost', inline: true },
                { name: '🚀 Server Boosts', value: 'Boosts de serveurs', inline: true },
                { name: '💳 Panel CC', value: 'Cartes de crédit', inline: true },
                { name: '🔧 Services', value: 'Autres services', inline: true }
            )
            .addFields(
                { name: '💳 Paiement', value: 'Crypto-monnaies, PayPal, etc.', inline: true },
                { name: '⏱️ Livraison', value: 'Instantannée après paiement', inline: true },
                { name: '🛡️ Garantie', value: 'Support 24/7 inclus', inline: true }
            )
            .setFooter({ text: config.bot.embedFooter, iconURL: config.bot.embedFooterIcon })
            .setTimestamp();

        // Menu déroulant avec toutes les catégories
        const selectMenu = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('shop_menu')
                    .setPlaceholder('Sélectionnez une catégorie de produits')
                    .addOptions(
                        config.shop.categories.map(category => 
                            new StringSelectMenuOptionBuilder()
                                .setLabel(category.name)
                                .setDescription(category.description)
                                .setValue(category.value)
                        )
                    )
            );

        await message.reply({ embeds: [shopEmbed], components: [selectMenu] });
    }
}; 