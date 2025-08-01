const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'ping',
    aliases: ['latency'],
    description: 'Vérifier la latence du bot',
    async execute(message, args, client) {
        const config = client.config;
        
        const sent = await message.reply('🏓 Pinging...');
        const latency = sent.createdTimestamp - message.createdTimestamp;
        const apiLatency = Math.round(client.ws.ping);

        const pingEmbed = new EmbedBuilder()
            .setColor(config.bot.embedColor)
            .setTitle('🏓 Pong !')
            .addFields(
                { name: '📡 Latence Bot', value: `${latency}ms`, inline: true },
                { name: '🌐 Latence API', value: `${apiLatency}ms`, inline: true },
                { name: '📊 Status', value: apiLatency < 100 ? '🟢 Excellent' : apiLatency < 200 ? '🟡 Bon' : '🔴 Élevé', inline: true }
            )
            .setFooter({ text: config.bot.embedFooter, iconURL: config.bot.embedFooterIcon })
            .setTimestamp();

        await sent.edit({ content: null, embeds: [pingEmbed] });
    }
}; 