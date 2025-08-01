const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'renew',
    aliases: ['refresh', 'recreate'],
    description: 'Recrée le salon actuel en supprimant l\'ancien',
    async execute(message, args, client) {
        const config = client.config;

        // Vérifier les permissions
        if (!message.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
            const errorEmbed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('❌ Permissions insuffisantes')
                .setDescription('Vous devez avoir la permission "Gérer les salons" pour utiliser cette commande.')
                .setFooter({ text: config.bot.embedFooter, iconURL: config.bot.embedFooterIcon })
                .setTimestamp();
            
            return message.reply({ embeds: [errorEmbed] });
        }

        const channel = message.channel;

        // Vérifier que ce n'est pas un salon système
        if (channel.type !== 0) { // 0 = GuildText
            const errorEmbed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('❌ Salon non supporté')
                .setDescription('Cette commande ne peut être utilisée que dans un salon texte.')
                .setFooter({ text: config.bot.embedFooter, iconURL: config.bot.embedFooterIcon })
                .setTimestamp();
            
            return message.reply({ embeds: [errorEmbed] });
        }

        try {
            // Informer que le salon va être recréé
            const infoEmbed = new EmbedBuilder()
                .setColor('#FFA500')
                .setTitle('🔄 Recréation du salon')
                .setDescription(`Le salon **${channel.name}** va être recréé dans 5 secondes...\n\n⚠️ **Attention :** Tous les messages seront perdus !`)
                .addFields(
                    { name: '📋 Informations', value: `Nom: ${channel.name}\nCatégorie: ${channel.parent ? channel.parent.name : 'Aucune'}\nPosition: ${channel.position}`, inline: true },
                    { name: '⏱️ Délai', value: '5 secondes', inline: true }
                )
                .setFooter({ text: config.bot.embedFooter, iconURL: config.bot.embedFooterIcon })
                .setTimestamp();

            await message.reply({ embeds: [infoEmbed] });

            // Attendre 5 secondes
            await new Promise(resolve => setTimeout(resolve, 5000));

            // Sauvegarder les informations du salon
            const channelName = channel.name;
            const channelTopic = channel.topic;
            const channelParent = channel.parent;
            const channelPosition = channel.position;
            const channelPermissions = channel.permissionOverwrites.cache;
            const channelNSFW = channel.nsfw;
            const channelSlowmode = channel.rateLimitPerUser;

            // Supprimer l'ancien salon
            await channel.delete();

            // Créer le nouveau salon avec les mêmes paramètres
            const newChannel = await message.guild.channels.create({
                name: channelName,
                type: 0, // GuildText
                topic: channelTopic,
                parent: channelParent,
                position: channelPosition,
                nsfw: channelNSFW,
                rateLimitPerUser: channelSlowmode,
                permissionOverwrites: Array.from(channelPermissions.values())
            });

            // Message de confirmation
            const successEmbed = new EmbedBuilder()
                .setColor('#00FF00')
                .setTitle('✅ Salon recréé avec succès')
                .setDescription(`Le salon **${newChannel.name}** a été recréé avec succès !`)
                .addFields(
                    { name: '📋 Détails', value: `Nom: ${newChannel.name}\nID: ${newChannel.id}\nCatégorie: ${newChannel.parent ? newChannel.parent.name : 'Aucune'}`, inline: true },
                    { name: '🔧 Configuration', value: `NSFW: ${newChannel.nsfw ? 'Oui' : 'Non'}\nSlowmode: ${newChannel.rateLimitPerUser}s\nPermissions: ${channelPermissions.size}`, inline: true }
                )
                .setFooter({ text: config.bot.embedFooter, iconURL: config.bot.embedFooterIcon })
                .setTimestamp();

            await newChannel.send({ embeds: [successEmbed] });

        } catch (error) {
            console.error('Erreur lors de la recréation du salon:', error);
            
            const errorEmbed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('❌ Erreur')
                .setDescription('Une erreur est survenue lors de la recréation du salon.')
                .addFields(
                    { name: '🔍 Détails', value: error.message, inline: false }
                )
                .setFooter({ text: config.bot.embedFooter, iconURL: config.bot.embedFooterIcon })
                .setTimestamp();
            
            // Essayer d'envoyer dans le salon original, sinon en DM
            try {
                await message.reply({ embeds: [errorEmbed] });
            } catch {
                await message.author.send({ embeds: [errorEmbed] });
            }
        }
    }
}; 