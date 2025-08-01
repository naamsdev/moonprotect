const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');

module.exports = {
    name: 'welcome',
    aliases: ['welcome-setup', 'setup-welcome'],
    description: 'Configurer le salon de bienvenue',
    async execute(message, args, client) {
        const config = client.config;
        
        // Vérifier les permissions
        if (!message.member.permissions.has(PermissionFlagsBits.ManageGuild)) {
            const errorEmbed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('❌ Permissions insuffisantes')
                .setDescription('Vous devez avoir la permission "Gérer le serveur" pour utiliser cette commande.')
                .setFooter({ text: config.bot.embedFooter, iconURL: config.bot.embedFooterIcon })
                .setTimestamp();
            
            return message.reply({ embeds: [errorEmbed] });
        }

        if (!args[0]) {
            const welcomeEmbed = new EmbedBuilder()
                .setColor(config.bot.embedColor)
                .setTitle('👋 Configuration du système de bienvenue')
                .setDescription('Configurez le salon où les messages de bienvenue seront envoyés.')
                .addFields(
                    { name: '📝 Usage', value: '`!welcome <channel_id>`', inline: true },
                    { name: '💡 Exemple', value: '`!welcome 123456789`', inline: true }
                )
                .addFields(
                    { name: '📋 Fonctionnalités', value: '• Affiche le nom du nouveau membre\n• Date et heure d\'arrivée\n• Avatar du membre\n• Personne qui a invité (si détectée)\n• Nombre d\'invitations de l\'inviteur', inline: false }
                )
                .addFields(
                    { name: '🧪 Test', value: '`!welcome test` - Tester le système de bienvenue', inline: false }
                )
                .setFooter({ text: config.bot.embedFooter, iconURL: config.bot.embedFooterIcon })
                .setTimestamp();
            
            return message.reply({ embeds: [welcomeEmbed] });
        }

        if (args[0] === 'test') {
            // Tester le système de bienvenue
            const testEmbed = new EmbedBuilder()
                .setColor('#130F59')
                .setTitle('👋 Welcome on MoonStore #N1TR0 !')
                .setDescription(`> Hey ! ${message.author.username}, welcome to **${message.guild.name}** !   `)
                                 .addFields(
                     { 
                         name: '<:1377709433752125550:1400496371567558768> | User', 
                         value: message.author.toString(), 
                         inline: true 
                     },
                     { 
                         name: '<:1377709435828441312:1400496368438480916> | Joined On', 
                         value: new Date().toLocaleDateString('fr-FR', { 
                             weekday: 'long', 
                             year: 'numeric', 
                             month: 'long', 
                             day: 'numeric',
                             hour: '2-digit',
                             minute: '2-digit'
                         }), 
                         inline: true 
                     }
                 )
                 .addFields(
                     { 
                         name: '<:1377709418350907462:1400496369466081321> | Invitation', 
                         value: 'Test - Invitation simulée', 
                         inline: false 
                     }
                 )
                .setThumbnail(message.author.displayAvatarURL({ size: 1024, dynamic: true }))
                .setFooter({ text: config.bot.embedFooter, iconURL: config.bot.embedFooterIcon })
                .setTimestamp();

            await message.reply({ embeds: [testEmbed] });
            return;
        }

        const channelId = args[0];
        const channel = message.guild.channels.cache.get(channelId);

        if (!channel || channel.type !== 0) {
            const errorEmbed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('❌ Salon invalide')
                .setDescription('L\'ID de salon spécifié n\'est pas valide ou n\'est pas un salon texte.')
                .setFooter({ text: config.bot.embedFooter, iconURL: config.bot.embedFooterIcon })
                .setTimestamp();
            
            return message.reply({ embeds: [errorEmbed] });
        }

        // Vérifier les permissions du bot dans ce salon
        if (!channel.permissionsFor(message.guild.members.me).has('SendMessages')) {
            const errorEmbed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('❌ Permissions insuffisantes')
                .setDescription('Je n\'ai pas la permission d\'envoyer des messages dans ce salon.')
                .setFooter({ text: config.bot.embedFooter, iconURL: config.bot.embedFooterIcon })
                .setTimestamp();
            
            return message.reply({ embeds: [errorEmbed] });
        }

        // Ajouter la configuration du salon de bienvenue
        if (!config.welcome) {
            config.welcome = {};
        }
        
        config.welcome.channelId = channelId;
        config.welcome.enabled = true;

        // Sauvegarder la configuration
        fs.writeFileSync('./config.json', JSON.stringify(config, null, 2));
        
        // Mettre à jour la configuration en mémoire
        client.config = config;

        const successEmbed = new EmbedBuilder()
            .setColor('#00FF00')
            .setTitle('✅ Salon de bienvenue configuré')
            .setDescription(`Le salon de bienvenue a été configuré avec succès !`)
            .addFields(
                { name: '📢 Salon', value: `${channel.name} (${channelId})`, inline: true },
                { name: '✅ Statut', value: 'Activé', inline: true }
            )
            .addFields(
                { name: '🎯 Prochain nouveau membre', value: 'Le message de bienvenue sera envoyé dans ce salon.', inline: false }
            )
            .setFooter({ text: config.bot.embedFooter, iconURL: config.bot.embedFooterIcon })
            .setTimestamp();

        await message.reply({ embeds: [successEmbed] });
    }
}; 