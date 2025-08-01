const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'all',
    aliases: ['everyone', 'mention'],
    description: 'Mentionner tous les membres du serveur',
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

        // Vérifier les arguments
        if (!args[0]) {
            const errorEmbed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('❌ Message manquant')
                .setDescription('Veuillez spécifier un message à envoyer.\nUsage: `!all <message>`')
                .setFooter({ text: config.bot.embedFooter, iconURL: config.bot.embedFooterIcon })
                .setTimestamp();
            
            return message.reply({ embeds: [errorEmbed] });
        }

        const announcementMessage = args.join(' ');

        try {
            const allEmbed = new EmbedBuilder()
                .setColor(config.bot.embedColor)
                .setTitle('📢 Annonce importante')
                .setDescription(announcementMessage)
                .addFields(
                    { name: '📤 Expéditeur', value: `${message.author.tag}`, inline: true },
                    { name: '📅 Date', value: new Date().toLocaleDateString('fr-FR'), inline: true },
                    { name: '⏰ Heure', value: new Date().toLocaleTimeString('fr-FR'), inline: true }
                )
                .setFooter({ text: config.bot.embedFooter, iconURL: config.bot.embedFooterIcon })
                .setTimestamp();

            // Envoyer le message avec la mention @everyone
            await message.channel.send({ content: '@everyone', embeds: [allEmbed] });

            const successEmbed = new EmbedBuilder()
                .setColor('#00FF00')
                .setTitle('✅ Annonce envoyée')
                .setDescription('L\'annonce a été envoyée avec succès à tous les membres.')
                .addFields(
                    { name: '📝 Message', value: announcementMessage.substring(0, 100) + (announcementMessage.length > 100 ? '...' : ''), inline: true },
                    { name: '👥 Destinataires', value: `${message.guild.memberCount} membres`, inline: true }
                )
                .setFooter({ text: config.bot.embedFooter, iconURL: config.bot.embedFooterIcon })
                .setTimestamp();

            await message.reply({ embeds: [successEmbed] });

        } catch (error) {
            console.error('Erreur lors de l\'envoi de l\'annonce:', error);
            const errorEmbed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('❌ Erreur')
                .setDescription('Une erreur est survenue lors de l\'envoi de l\'annonce.')
                .setFooter({ text: config.bot.embedFooter, iconURL: config.bot.embedFooterIcon })
                .setTimestamp();
            
            await message.reply({ embeds: [errorEmbed] });
        }
    }
}; 