const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const fs = require('fs');

module.exports = {
    name: 'setup',
    aliases: ['config', 'configuration'],
    description: 'Configurer le bot (tickets, bienvenue, etc.)',
    async execute(message, args, client) {
        const config = client.config;
        
        // Vérifier les permissions
        if (!message.member.permissions.has('Administrator')) {
            const errorEmbed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('❌ Permissions insuffisantes')
                .setDescription('Vous devez être administrateur pour utiliser cette commande.')
                .setFooter({ text: config.bot.embedFooter, iconURL: config.bot.embedFooterIcon })
                .setTimestamp();
            
            return message.reply({ embeds: [errorEmbed] });
        }

        if (!args[0]) {
            const setupEmbed = new EmbedBuilder()
                .setColor(config.bot.embedColor)
                .setTitle('⚙️ Configuration du Bot')
                .setDescription('Voici les options de configuration disponibles :')
                .addFields(
                    { name: '🎫 Tickets', value: '`!setup tickets <catégorie_id> <rôle_support_id>`', inline: true },

                    { name: '🛒 Shop', value: '`!setup shop` - Configurer le menu du shop', inline: true },
                    { name: '📊 Status', value: '`!setup status` - Voir la configuration actuelle', inline: true }
                )
                .addFields(
                    { name: '💡 Exemples', value: '`!setup tickets 123456789 987654321`', inline: false }
                )
                .setFooter({ text: config.bot.embedFooter, iconURL: config.bot.embedFooterIcon })
                .setTimestamp();
            
            return message.reply({ embeds: [setupEmbed] });
        }

        const option = args[0].toLowerCase();

        switch (option) {
            case 'tickets':
                if (args.length < 3) {
                    const errorEmbed = new EmbedBuilder()
                        .setColor('#FF0000')
                        .setTitle('❌ Arguments manquants')
                        .setDescription('Usage: `!setup tickets <catégorie_id> <rôle_support_id>`')
                        .setFooter({ text: config.bot.embedFooter, iconURL: config.bot.embedFooterIcon })
                        .setTimestamp();
                    
                    return message.reply({ embeds: [errorEmbed] });
                }

                const categoryId = args[1];
                const supportRoleId = args[2];

                // Vérifier si la catégorie existe
                const category = message.guild.channels.cache.get(categoryId);
                if (!category || category.type !== 4) {
                    const errorEmbed = new EmbedBuilder()
                        .setColor('#FF0000')
                        .setTitle('❌ Catégorie invalide')
                        .setDescription('L\'ID de catégorie spécifié n\'est pas valide.')
                        .setFooter({ text: config.bot.embedFooter, iconURL: config.bot.embedFooterIcon })
                        .setTimestamp();
                    
                    return message.reply({ embeds: [errorEmbed] });
                }

                // Vérifier si le rôle existe
                const supportRole = message.guild.roles.cache.get(supportRoleId);
                if (!supportRole) {
                    const errorEmbed = new EmbedBuilder()
                        .setColor('#FF0000')
                        .setTitle('❌ Rôle invalide')
                        .setDescription('L\'ID de rôle spécifié n\'est pas valide.')
                        .setFooter({ text: config.bot.embedFooter, iconURL: config.bot.embedFooterIcon })
                        .setTimestamp();
                    
                    return message.reply({ embeds: [errorEmbed] });
                }

                // Mettre à jour la configuration
                config.tickets.categoryId = categoryId;
                config.tickets.supportRoleId = supportRoleId;
                config.tickets.enabled = true;

                // Sauvegarder la configuration
                fs.writeFileSync('./config.json', JSON.stringify(config, null, 2));

                const successEmbed = new EmbedBuilder()
                    .setColor('#00FF00')
                    .setTitle('✅ Configuration des tickets mise à jour')
                    .setDescription('Le système de tickets a été configuré avec succès.')
                    .addFields(
                        { name: '📁 Catégorie', value: `${category.name} (${categoryId})`, inline: true },
                        { name: '👥 Rôle Support', value: `${supportRole.name} (${supportRoleId})`, inline: true }
                    )
                    .setFooter({ text: config.bot.embedFooter, iconURL: config.bot.embedFooterIcon })
                    .setTimestamp();

                await message.reply({ embeds: [successEmbed] });
                break;



            case 'status':
                const statusEmbed = new EmbedBuilder()
                    .setColor(config.bot.embedColor)
                    .setTitle('📊 Configuration actuelle')
                    .addFields(
                        { 
                            name: '🎫 Tickets', 
                            value: config.tickets.enabled ? 
                                `✅ Activé\n📁 Catégorie: ${config.tickets.categoryId || 'Non configurée'}\n👥 Rôle: ${config.tickets.supportRoleId || 'Non configuré'}` : 
                                '❌ Désactivé', 
                            inline: true 
                        },

                        { 
                            name: '🛒 Shop', 
                            value: `${config.shop.categories.length} catégories configurées`, 
                            inline: true 
                        }
                    )
                    .setFooter({ text: config.bot.embedFooter, iconURL: config.bot.embedFooterIcon })
                    .setTimestamp();

                await message.reply({ embeds: [statusEmbed] });
                break;

            default:
                const errorEmbed = new EmbedBuilder()
                    .setColor('#FF0000')
                    .setTitle('❌ Option invalide')
                    .setDescription('Options disponibles: `tickets`, `status`')
                    .setFooter({ text: config.bot.embedFooter, iconURL: config.bot.embedFooterIcon })
                    .setTimestamp();
                
                await message.reply({ embeds: [errorEmbed] });
        }
    }
}; 