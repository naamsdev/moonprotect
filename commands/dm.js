const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'dm',
    aliases: ['mp', 'message'],
    description: 'Envoyer un message privé à un utilisateur',
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
        if (args.length < 2) {
            const errorEmbed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('❌ Arguments manquants')
                .setDescription('Veuillez spécifier un utilisateur et un message.\nUsage: `!dm @utilisateur <message>`')
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

        const dmMessage = args.slice(1).join(' ');

        try {
            const dmEmbed = new EmbedBuilder()
                .setColor(config.bot.embedColor)
                .setTitle('📢 Message de Moon Shop')
                .setDescription(dmMessage)
                .addFields(
                    { name: '📤 Expéditeur', value: `${message.guild.name}`, inline: true },
                    { name: '👤 Modérateur', value: `${message.author.tag}`, inline: true }
                )
                .setFooter({ text: config.bot.embedFooter, iconURL: config.bot.embedFooterIcon })
                .setTimestamp();

            await user.send({ embeds: [dmEmbed] });

            const successEmbed = new EmbedBuilder()
                .setColor('#00FF00')
                .setTitle('✅ Message envoyé')
                .setDescription(`Le message a été envoyé avec succès à ${user.tag}.`)
                .addFields(
                    { name: '👤 Destinataire', value: `${user.tag} (${user.id})`, inline: true },
                    { name: '📝 Message', value: dmMessage.substring(0, 100) + (dmMessage.length > 100 ? '...' : ''), inline: true }
                )
                .setFooter({ text: config.bot.embedFooter, iconURL: config.bot.embedFooterIcon })
                .setTimestamp();

            await message.reply({ embeds: [successEmbed] });

        } catch (error) {
            console.error('Erreur lors de l\'envoi du DM:', error);
            const errorEmbed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('❌ Erreur')
                .setDescription(`Impossible d'envoyer un message privé à ${user.tag}. L'utilisateur a peut-être désactivé les messages privés.`)
                .setFooter({ text: config.bot.embedFooter, iconURL: config.bot.embedFooterIcon })
                .setTimestamp();
            
            await message.reply({ embeds: [errorEmbed] });
        }
    }
}; 