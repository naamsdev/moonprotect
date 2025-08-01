const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'unban',
    aliases: ['debannir'],
    description: 'Débannir un utilisateur du serveur',
    async execute(message, args, client) {
        const config = client.config;
        
        // Vérifier les permissions
        if (!message.member.permissions.has('BanMembers')) {
            const errorEmbed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('❌ Permissions insuffisantes')
                .setDescription('Vous n\'avez pas la permission de débannir des utilisateurs.')
                .setFooter({ text: config.bot.embedFooter, iconURL: config.bot.embedFooterIcon })
                .setTimestamp();
            
            return message.reply({ embeds: [errorEmbed] });
        }

        // Vérifier les arguments
        if (!args[0]) {
            const errorEmbed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('❌ ID utilisateur manquant')
                .setDescription('Veuillez spécifier l\'ID de l\'utilisateur à débannir.\nUsage: `!unban <ID_utilisateur>`')
                .setFooter({ text: config.bot.embedFooter, iconURL: config.bot.embedFooterIcon })
                .setTimestamp();
            
            return message.reply({ embeds: [errorEmbed] });
        }

        const userId = args[0];
        
        // Vérifier si l'ID est valide
        if (!/^\d+$/.test(userId)) {
            const errorEmbed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('❌ ID invalide')
                .setDescription('L\'ID utilisateur doit être un nombre.')
                .setFooter({ text: config.bot.embedFooter, iconURL: config.bot.embedFooterIcon })
                .setTimestamp();
            
            return message.reply({ embeds: [errorEmbed] });
        }

        try {
            // Récupérer les bans du serveur
            const bans = await message.guild.bans.fetch();
            const bannedUser = bans.get(userId);

            if (!bannedUser) {
                const errorEmbed = new EmbedBuilder()
                    .setColor('#FF0000')
                    .setTitle('❌ Utilisateur non banni')
                    .setDescription('Cet utilisateur n\'est pas banni de ce serveur.')
                    .setFooter({ text: config.bot.embedFooter, iconURL: config.bot.embedFooterIcon })
                    .setTimestamp();
                
                return message.reply({ embeds: [errorEmbed] });
            }

            // Débannir l'utilisateur
            await message.guild.members.unban(userId, `Débanni par ${message.author.tag}`);

            const unbanEmbed = new EmbedBuilder()
                .setColor('#00FF00')
                .setTitle('✅ Utilisateur débanni')
                .setDescription(`${bannedUser.user.tag} a été débanni du serveur.`)
                .addFields(
                    { name: '👤 Utilisateur', value: `${bannedUser.user.tag} (${userId})`, inline: true },
                    { name: '🛠️ Modérateur', value: `${message.author.tag}`, inline: true },
                    { name: '📝 Raison du ban', value: bannedUser.reason || 'Aucune raison spécifiée', inline: true }
                )
                .setThumbnail(bannedUser.user.displayAvatarURL())
                .setFooter({ text: config.bot.embedFooter, iconURL: config.bot.embedFooterIcon })
                .setTimestamp();

            await message.reply({ embeds: [unbanEmbed] });

        } catch (error) {
            console.error('Erreur lors du débannissement:', error);
            const errorEmbed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('❌ Erreur')
                .setDescription('Une erreur est survenue lors du débannissement.')
                .setFooter({ text: config.bot.embedFooter, iconURL: config.bot.embedFooterIcon })
                .setTimestamp();
            
            await message.reply({ embeds: [errorEmbed] });
        }
    }
}; 