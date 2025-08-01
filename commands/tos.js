const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'tos',
    aliases: ['terms', 'conditions', 'terms-of-service'],
    description: 'Afficher les conditions d\'utilisation (TOS)',
    async execute(message, args, client) {
        const config = client.config;
        
        // Embed en français
        const tosEmbedFR = new EmbedBuilder()
            .setColor('#FF6B6B') // Rouge
            .setTitle('🇫🇷 Conditions d\'utilisation - MoonShop')
            .setDescription('**En effectuant un achat ou en utilisant notre shop, vous acceptez automatiquement ces conditions.**')
            .addFields(
                {
                    name: '💸 Paiements',
                    value: '- **Aucun remboursement**.\n- PayPal : *Famille & amis* uniquement + **0,50 € de frais**.\n- LTC : montant exact en € uniquement.',
                    inline: false
                },
                {
                    name: '📦 Produits & Garanties',
                    value: '- Produits vendus **tels quels**, sans garantie.\n- **1 seul remplacement** par achat si produit défectueux.\n- Aucun remplacement si le produit est révoqué.',
                    inline: false
                },
                {
                    name: '⚠️ Précommandes',
                    value: '- Remboursement partiel (50 %) uniquement si annulation.\n- Ressources réservées dès paiement.',
                    inline: false
                },
                {
                    name: '🚫 Comportement',
                    value: '- **Spam, pub ou fausse accusation = ban immédiat**.\n- Violations Discord = **exclusion sans préavis**.',
                    inline: false
                },
                {
                    name: '🧾 Clause de non-responsabilité',
                    value: '- Nous ne couvrons pas les pertes liées à des fournisseurs externes.\n- Mensonge ou tentative d\'arnaque = **blacklist**.',
                    inline: false
                }
            )
            .setFooter({ text: 'Merci de respecter les règles • MoonShop' })
            .setTimestamp();

        // Embed en anglais
        const tosEmbedEN = new EmbedBuilder()
            .setColor('#FF6B6B') // Rouge
            .setTitle('🇺🇸​ Terms of Service - MoonShop')
            .setDescription('**By making a purchase or using our shop, you automatically accept these terms.**')
            .addFields(
                {
                    name: '💸 Payments',
                    value: '- **No refunds**.\n- PayPal : *Friends & family* only + **€0.50 fees**.\n- LTC : exact amount in € only.',
                    inline: false
                },
                {
                    name: '📦 Products & Warranties',
                    value: '- Products sold **as is**, without warranty.\n- **1 replacement only** per purchase if defective product.\n- No replacement if the product is revoked.',
                    inline: false
                },
                {
                    name: '⚠️ Pre-orders',
                    value: '- Partial refund (50%) only if cancellation.\n- Resources reserved upon payment.',
                    inline: false
                },
                {
                    name: '🚫 Behavior',
                    value: '- **Spam, advertising or false accusation = immediate ban**.\n- Discord violations = **exclusion without notice**.',
                    inline: false
                },
                {
                    name: '🧾 Disclaimer',
                    value: '- We do not cover losses related to external providers.\n- Lying or attempted scam = **blacklist**.',
                    inline: false
                }
            )
            .setFooter({ text: 'Please respect the rules • MoonShop' })
            .setTimestamp();

        // Envoyer les deux embeds
        await message.channel.send({ embeds: [tosEmbedFR] });
        await message.channel.send({ embeds: [tosEmbedEN] });

        // Confirmation
        const successEmbed = new EmbedBuilder()
            .setColor('#00FF00')
            .setTitle('✅ TOS envoyé')
            .setDescription('Les conditions d\'utilisation ont été envoyées en français et en anglais.')
            .setFooter({ text: config.bot.embedFooter, iconURL: config.bot.embedFooterIcon })
            .setTimestamp();

        await message.reply({ embeds: [successEmbed] });
    }
}; 