const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');

module.exports = {
    name: 'ticket',
    aliases: ['support', 'help'],
    description: 'Créer un système de tickets avec menu déroulant',
    async execute(message, args, client) {
        const config = client.config;
        
        // Vérifier les permissions
        if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) {
            const errorEmbed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('❌ Permissions insuffisantes')
                .setDescription('Vous devez être administrateur pour utiliser cette commande.')
                .setFooter({ text: config.bot.embedFooter, iconURL: config.bot.embedFooterIcon })
                .setTimestamp();
            
            return message.reply({ embeds: [errorEmbed] });
        }

        try {
            // Créer l'embed principal
            const ticketEmbed = new EmbedBuilder()
                .setColor(config.bot.embedColor)
                .setTitle('🎫 Système de Support')
                .setDescription('Welcome to our support system!\n\nChoose the type of ticket you want to create:')
                .addFields(
                    { 
                        name: '🆘 Help', 
                        value: 'For help, open a ticket. Pour obtenir de l\'aide, ouvrez un ticket.', 
                        inline: true 
                    },
                    { 
                        name: '🛒 Buy', 
                        value: 'For buy a product, open a ticket. Pour acheter un produit, ouvrez un ticket.', 
                        inline: true 
                    },
                    { 
                        name: '📦 Slot', 
                        value: 'For buy a slot, open a ticket. Pour acheter un slot, ouvrez un ticket.', 
                        inline: true 
                    }
                )

                .setFooter({ text: config.bot.embedFooter, iconURL: config.bot.embedFooterIcon })
                .setTimestamp();

            // Créer le menu déroulant
            const selectMenu = new StringSelectMenuBuilder()
                .setCustomId('ticket_menu')
                .setPlaceholder('Choisissez le type de ticket...')
                .addOptions(
                    new StringSelectMenuOptionBuilder()
                        .setLabel('🆘 Help - Support')
                        .setDescription('For help, open a ticket. Pour obtenir de l\'aide, ouvrez un ticket.')
                        .setValue('help')
                        .setEmoji('🆘'),
                    new StringSelectMenuOptionBuilder()
                        .setLabel('🛒 Buy - Achat')
                        .setDescription('For buy a product, open a ticket. Pour acheter un produit, ouvrez un ticket.')
                        .setValue('buy')
                        .setEmoji('🛒'),
                    new StringSelectMenuOptionBuilder()
                        .setLabel('📦 Slot - Slot')
                        .setDescription('For buy a slot, open a ticket. Pour acheter un slot, ouvrez un ticket.')
                        .setValue('slot')
                        .setEmoji('📦')
                );  

            const row = new ActionRowBuilder().addComponents(selectMenu);

            // Envoyer le message avec l'embed et le menu
            await message.channel.send({
                embeds: [ticketEmbed],
                components: [row]
            });

            // Confirmation
            const successEmbed = new EmbedBuilder()
                .setColor('#00FF00')
                .setTitle('✅ Système de tickets créé')
                .setDescription('Le système de tickets avec menu déroulant a été créé avec succès !')
                .addFields(
                    { name: '📊 Types de tickets', value: '3 types disponibles (Help, Buy, Slot)', inline: true },
                    { name: '🎯 Fonctionnalité', value: 'Menu déroulant interactif', inline: true }
                )
                .setFooter({ text: config.bot.embedFooter, iconURL: config.bot.embedFooterIcon })
                .setTimestamp();

            await message.reply({ embeds: [successEmbed] });

        } catch (error) {
            console.error('Erreur lors de la création du système de tickets:', error);
            
            const errorEmbed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('❌ Erreur')
                .setDescription('Une erreur est survenue lors de la création du système de tickets.')
                .addFields(
                    { name: '🔍 Détails', value: error.message, inline: false }
                )
                .setFooter({ text: config.bot.embedFooter, iconURL: config.bot.embedFooterIcon })
                .setTimestamp();
            
            await message.reply({ embeds: [errorEmbed] });
        }
    }
};
