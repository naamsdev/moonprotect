const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'kick',
    aliases: ['expulser'],
    description: 'Expulser un utilisateur du serveur',
    async execute(message, args, client) {
        const config = client.config;
        
        // Vérifier les permissions
        if (!message.member.permissions.has('KickMembers')) {
            const errorEmbed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('❌ Permissions insuffisantes')
                .setDescription('Vous n\'avez pas la permission d\'expulser des utilisateurs.')
                .setFooter({ text: config.bot.embedFooter, iconURL: config.bot.embedFooterIcon })
                .setTimestamp();
            
            return message.reply({ embeds: [errorEmbed] });
        }

        // Vérifier les arguments
        if (!args[0]) {
            const errorEmbed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('❌ Utilisateur manquant')
                .setDescription('Veuillez spécifier un utilisateur à expulser.\nUsage: `!kick @utilisateur [raison]`')
                .setFooter({ text: config.bot.embedFooter, iconURL: config.bot.embedFooterIcon })
                .setTimestamp();
            
            return message.reply({ embeds: [errorEmbed] });
        }

        const user = message.mentions.users.first() || await client.users.fetch(args[0]).catch(() => null);
        
        if (!user) {
            const errorEmbed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('❌ Utilisateur introuvable')
                .setDescription('L\'utilisateur spécifié n\'a pas été trouvé.')
                .setFooter({ text: config.bot.embedFooter, iconURL: config.bot.embedFooterIcon })
                .setTimestamp();
            
            return message.reply({ embeds: [errorEmbed] });
        }

        const member = message.guild.members.cache.get(user.id);
        
        if (!member) {
            const errorEmbed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('❌ Membre introuvable')
                .setDescription('Cet utilisateur n\'est pas membre de ce serveur.')
                .setFooter({ text: config.bot.embedFooter, iconURL: config.bot.embedFooterIcon })
                .setTimestamp();
            
            return message.reply({ embeds: [errorEmbed] });
        }

        // Vérifier si on peut expulser cet utilisateur
        if (!member.kickable) {
            const errorEmbed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('❌ Impossible d\'expulser')
                .setDescription('Je ne peux pas expulser cet utilisateur (rôle plus élevé ou propriétaire du serveur).')
                .setFooter({ text: config.bot.embedFooter, iconURL: config.bot.embedFooterIcon })
                .setTimestamp();
            
            return message.reply({ embeds: [errorEmbed] });
        }

        const reason = args.slice(1).join(' ') || 'Aucune raison spécifiée';

        try {
            await member.kick(`${reason} - Expulsé par ${message.author.tag}`);

            const kickEmbed = new EmbedBuilder()
                .setColor('#FFA500')
                .setTitle('👢 Utilisateur expulsé')
                .setDescription(`${user.tag} a été expulsé du serveur.`)
                .addFields(
                    { name: '👤 Utilisateur', value: `${user.tag} (${user.id})`, inline: true },
                    { name: '🛠️ Modérateur', value: `${message.author.tag}`, inline: true },
                    { name: '📝 Raison', value: reason, inline: true }
                )
                .setThumbnail(user.displayAvatarURL())
                .setFooter({ text: config.bot.embedFooter, iconURL: config.bot.embedFooterIcon })
                .setTimestamp();

            await message.reply({ embeds: [kickEmbed] });

        } catch (error) {
            console.error('Erreur lors de l\'expulsion:', error);
            const errorEmbed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('❌ Erreur')
                .setDescription('Une erreur est survenue lors de l\'expulsion.')
                .setFooter({ text: config.bot.embedFooter, iconURL: config.bot.embedFooterIcon })
                .setTimestamp();
            
            await message.reply({ embeds: [errorEmbed] });
        }
    }
}; 