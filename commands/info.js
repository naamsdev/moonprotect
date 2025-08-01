const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'info',
    aliases: ['serverinfo', 'server'],
    description: 'Afficher les informations du serveur',
    async execute(message, args, client) {
        const config = client.config;
        const guild = message.guild;
        
        const owner = await guild.fetchOwner();
        const memberCount = guild.memberCount;
        const channelCount = guild.channels.cache.size;
        const roleCount = guild.roles.cache.size;
        const emojiCount = guild.emojis.cache.size;
        const boostLevel = guild.premiumTier;
        const boostCount = guild.premiumSubscriptionCount;

        const infoEmbed = new EmbedBuilder()
            .setColor(config.bot.embedColor)
            .setTitle(`📊 Informations sur ${guild.name}`)
            .setThumbnail(guild.iconURL({ dynamic: true }))
            .addFields(
                { name: '👑 Propriétaire', value: `${owner.user.tag}`, inline: true },
                { name: '📅 Créé le', value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:F>`, inline: true },
                { name: '🆔 ID Serveur', value: guild.id, inline: true },
                { name: '👥 Membres', value: `${memberCount}`, inline: true },
                { name: '📺 Channels', value: `${channelCount}`, inline: true },
                { name: '🎭 Rôles', value: `${roleCount}`, inline: true },
                { name: '😀 Emojis', value: `${emojiCount}`, inline: true },
                { name: '🚀 Niveau Boost', value: `Niveau ${boostLevel}`, inline: true },
                { name: '💎 Boosts', value: `${boostCount}`, inline: true }
            )
            .setFooter({ text: config.bot.embedFooter, iconURL: config.bot.embedFooterIcon })
            .setTimestamp();

        if (guild.description) {
            infoEmbed.setDescription(guild.description);
        }

        await message.reply({ embeds: [infoEmbed] });
    }
}; 