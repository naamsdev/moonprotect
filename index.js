const { Client, GatewayIntentBits, Collection, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ChannelType, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const config = require('./config.json');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildMessageReactions
    ],
    partials: ['MESSAGE', 'CHANNEL', 'REACTION']
});

client.commands = new Collection();
client.config = config;

// Chargement des commandes
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ('name' in command && 'execute' in command) {
        client.commands.set(command.name, command);
    }
}

// Événement ready
client.once('ready', async () => {
    console.log(`✅ ${client.user.tag} est connecté et prêt !`);
    
    // Système de statut rotatif
    const statuses = [
        { name: 'Cheap Services', type: 4 }, // PLAYING
        { name: '.gg/moonstore', type: 3 }, // PLAYING
        { name: 'Developer : Naams', type: 3 }, // PLAYING
        { name: 'SellAuth soon', type: 3 } // PLAYING
    ];
    
    let currentStatusIndex = 0;
    
    const updateStatus = () => {
        try {
            const status = statuses[currentStatusIndex];
            client.user.setPresence({
                activities: [{
                    name: status.name,
                    type: status.type
                }],
                status: 'online'
            });
            console.log(`🔄 Statut changé: "${status.name}"`);
            currentStatusIndex = (currentStatusIndex + 1) % statuses.length;
        } catch (error) {
            console.error('❌ Erreur lors du changement de statut:', error);
        }
    };
    
    // Définir le premier statut
    updateStatus();
    
    // Changer le statut toutes les 3 minutes (180000 ms)
    setInterval(updateStatus, 180000);
    
    console.log('✅ Système de statut rotatif activé (changement toutes les 3 minutes)');

    // Initialiser le cache des invitations
    try {
        client.invites = new Map();
        const guilds = client.guilds.cache;
        
        for (const [guildId, guild] of guilds) {
            try {
                const invites = await guild.invites.fetch();
                const inviteMap = new Map();
                
                for (const [code, invite] of invites) {
                    inviteMap.set(code, invite);
                }
                
                client.invites.set(guildId, inviteMap);
                console.log(`✅ Cache des invitations initialisé pour ${guild.name} (${inviteMap.size} invitations)`);
            } catch (error) {
                console.log(`⚠️ Impossible de récupérer les invitations pour ${guild.name}: ${error.message}`);
            }
        }
        
        console.log('✅ Cache des invitations initialisé pour tous les serveurs');
    } catch (error) {
        console.error('Erreur lors de l\'initialisation du cache des invitations:', error);
    }
});

// Gestion des messages
client.on('messageCreate', async message => {
    if (message.author.bot || !message.guild) return;

    const prefix = config.bot.prefix;
    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName) || 
                   client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;

    try {
        await command.execute(message, args, client);
    } catch (error) {
        console.error(error);
        const errorEmbed = new EmbedBuilder()
            .setColor('#FF0000')
            .setTitle('❌ Erreur')
            .setDescription('Une erreur est survenue lors de l\'exécution de la commande.')
            .setFooter({ text: config.bot.embedFooter, iconURL: config.bot.embedFooterIcon })
            .setTimestamp();
        
        message.reply({ embeds: [errorEmbed] });
    }
});



// Système de bienvenue simple
client.on('guildMemberAdd', async member => {
    try {
        // Vérifier si le système de bienvenue est activé
        if (!config.welcome || !config.welcome.enabled) {
            return;
        }

        // Récupérer le salon de bienvenue
        const welcomeChannel = member.guild.channels.cache.get(config.welcome.channelId);
        if (!welcomeChannel) {
            console.log(`Salon de bienvenue non trouvé: ${config.welcome.channelId}`);
            return;
        }

        // Vérifier les permissions du bot
        if (!welcomeChannel.permissionsFor(member.guild.members.me).has('SendMessages')) {
            console.log(`Pas de permission pour envoyer des messages dans le salon de bienvenue`);
            return;
        }

        // Récupérer les invitations du serveur
        let inviter = null;
        let inviteCount = 0;
        let inviteCode = null;

        try {
            const invites = await member.guild.invites.fetch();
            console.log(`📋 ${invites.size} invitations trouvées pour ${member.guild.name}`);
            
            // Trouver l'invitation utilisée (comparaison avec le cache)
            if (client.invites && client.invites.has(member.guild.id)) {
                const guildInvites = client.invites.get(member.guild.id);
                console.log(`🔍 Comparaison avec le cache (${guildInvites.size} invitations en cache)`);
                
                for (const [code, invite] of invites) {
                    const cachedInvite = guildInvites.get(code);
                    if (cachedInvite && invite.uses > cachedInvite.uses) {
                        inviter = invite.inviter;
                        inviteCount = invite.uses;
                        inviteCode = code;
                        console.log(`✅ Invitation détectée: ${code} par ${inviter.tag} (${inviteCount} utilisations)`);
                        break;
                    }
                }
            }
            
            // Si on n'a pas trouvé l'invitation, on utilise la première disponible
            if (!inviter && invites.size > 0) {
                const firstInvite = invites.first();
                inviter = firstInvite.inviter;
                inviteCount = firstInvite.uses;
                inviteCode = firstInvite.code;
                console.log(`⚠️ Utilisation de la première invitation disponible: ${inviteCode} par ${inviter.tag}`);
            }
        } catch (error) {
            console.log(`Erreur lors de la récupération des invitations: ${error.message}`);
        }
        
        // Créer le message de bienvenue
        const welcomeEmbed = new EmbedBuilder()
        .setColor('#130F59')
        .setTitle('👋 Welcome on MoonStore #N1TR0 !')
        .setDescription(`> Hey ! ${member.user.username}, welcome to **${member.guild.name}** !   `)
                         .addFields(
             { 
                 name: '<:1377709433752125550:1400496371567558768> | User', 
                 value: member.user.toString(), 
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
            .setThumbnail(member.user.displayAvatarURL({ size: 1024, dynamic: true }))
            .setFooter({ text: config.bot.embedFooter, iconURL: config.bot.embedFooterIcon })
            .setTimestamp();
        
        // Ajouter les informations d'invitation
        if (inviter) {
            const inviteInfo = inviteCode ? 
                `${inviter.toString()} (${inviteCount} invitation${inviteCount > 1 ? 's' : ''})\nCode: \`${inviteCode}\`` :
                `${inviter.toString()} (${inviteCount} invitation${inviteCount > 1 ? 's' : ''})`;
            
            welcomeEmbed.addFields({
                name: '<:1377709418350907462:1400496369466081321> | Invite',
                value: inviteInfo,
                inline: false
            });
        } else {
            welcomeEmbed.addFields({
                name: '<:1377709418350907462:1400496369466081321> | Invite',
                value: 'Invitation non détectée\n*Le bot n\'a pas pu identifier l\'invitation utilisée*',
                inline: false
            });
        }
        
        // Envoyer le message
        await welcomeChannel.send({ embeds: [welcomeEmbed] });
        console.log(`Message de bienvenue envoyé pour ${member.user.tag} dans ${welcomeChannel.name}`);
        
    } catch (error) {
        console.error('Erreur lors de la création du message de bienvenue:', error);
    }
});

// Cache des invitations pour détecter les nouvelles invitations

// Mettre à jour le cache quand une invitation est créée
client.on('inviteCreate', async invite => {
    if (client.invites && client.invites.has(invite.guild.id)) {
        client.invites.get(invite.guild.id).set(invite.code, invite);
        console.log(`✅ Nouvelle invitation ajoutée au cache: ${invite.code} pour ${invite.guild.name}`);
    }
});

// Mettre à jour le cache quand une invitation est supprimée
client.on('inviteDelete', async invite => {
    if (client.invites && client.invites.has(invite.guild.id)) {
        client.invites.get(invite.guild.id).delete(invite.code);
        console.log(`🗑️ Invitation supprimée du cache: ${invite.code} pour ${invite.guild.name}`);
    }
});

// Gestion des interactions (boutons et menus)
client.on('interactionCreate', async interaction => {
    if (interaction.isButton()) {
        if (interaction.customId === 'close_ticket') {
            await handleTicketClose(interaction);
        }
    } else if (interaction.isStringSelectMenu()) {
        if (interaction.customId === 'ticket_menu') {
            await handleTicketMenu(interaction);
        } else if (interaction.customId === 'shop_menu') {
            await handleShopMenu(interaction);
        }
    }
});

// Système de stockage des rôles par réaction
client.reactionRoles = new Map();

// Gestion des réactions pour les rôles
client.on('messageReactionAdd', async (reaction, user) => {
    if (user.bot) return;
    
    try {
        console.log(`🔍 Réaction détectée: ${reaction.emoji.name} par ${user.tag}`);
        
        const guild = reaction.message.guild;
        if (!guild) {
            console.log('❌ Pas de serveur trouvé');
            return;
        }
        
        const member = await guild.members.fetch(user.id);
        const emoji = reaction.emoji.name;
        const messageId = reaction.message.id;
        
        console.log(`📋 Message ID: ${messageId}, Émoji: ${emoji}`);
        console.log(`🗂️ Rôles configurés:`, client.reactionRoles.has(messageId) ? 'Oui' : 'Non');
        
        // Vérifier si ce message a des rôles configurés
        if (client.reactionRoles.has(messageId)) {
            const roleMap = client.reactionRoles.get(messageId);
            const roleId = roleMap.get(emoji);
            
            console.log(`🔍 Rôle ID trouvé: ${roleId}`);
            
            if (roleId) {
                const role = guild.roles.cache.get(roleId);
                if (role) {
                    console.log(`✅ Rôle trouvé: ${role.name}`);
                    
                    if (!member.roles.cache.has(roleId)) {
                        await member.roles.add(role);
                        console.log(`🟢 Rôle ajouté via réaction: ${user.tag} -> ${role.name} (${emoji})`);
                    } else {
                        console.log(`ℹ️ L'utilisateur a déjà le rôle ${role.name}`);
                    }
                } else {
                    console.log(`❌ Rôle avec ID ${roleId} non trouvé dans le cache`);
                }
            } else {
                console.log(`❌ Aucun rôle configuré pour l'émoji ${emoji}`);
            }
        } else {
            console.log(`❌ Aucune configuration de rôles pour le message ${messageId}`);
        }
    } catch (error) {
        console.error('Erreur lors de l\'ajout du rôle via réaction:', error);
    }
});

client.on('messageReactionRemove', async (reaction, user) => {
    if (user.bot) return;
    
    try {
        const guild = reaction.message.guild;
        if (!guild) return;
        
        const member = await guild.members.fetch(user.id);
        const emoji = reaction.emoji.name;
        const messageId = reaction.message.id;
        
        // Vérifier si ce message a des rôles configurés
        if (client.reactionRoles.has(messageId)) {
            const roleMap = client.reactionRoles.get(messageId);
            const roleId = roleMap.get(emoji);
            
            if (roleId) {
                const role = guild.roles.cache.get(roleId);
                if (role && member.roles.cache.has(roleId)) {
                    await member.roles.remove(role);
                    console.log(`🔴 Rôle retiré via réaction: ${user.tag} -> ${role.name} (${emoji})`);
                }
            }
        } else {
            // Fallback: essayer de trouver le rôle par nom
            const role = guild.roles.cache.find(r => {
                const roleName = r.name.toLowerCase();
                return (emoji === '✅' && roleName.includes('membre')) ||
                       (emoji === '⭐' && roleName.includes('vip')) ||
                       (emoji === '👑' && roleName.includes('admin')) ||
                       (emoji === '🎮' && roleName.includes('gamer')) ||
                       (emoji === '📢' && roleName.includes('annonce')) ||
                       roleName.includes(emoji.toLowerCase());
            });
            
            if (role && member.roles.cache.has(role.id)) {
                await member.roles.remove(role);
                console.log(`🔴 Rôle retiré via réaction (fallback): ${user.tag} -> ${role.name} (${emoji})`);
            }
        }
    } catch (error) {
        console.error('Erreur lors du retrait du rôle via réaction:', error);
    }
});

async function handleTicketMenu(interaction) {
    try {
        const selectedValue = interaction.values[0];
        const guild = interaction.guild;
        
        // Définir les configurations pour chaque type de ticket
        const ticketConfigs = {
            help: {
                name: 'help',
                emoji: '🆘',
                title: 'Support - Aide',
                description: 'Besoin d\'aide avec nos services ? Notre équipe est là pour vous aider !',
                color: '#3498db'
            },
            buy: {
                name: 'buy',
                emoji: '🛒',
                title: 'Achat - Services',
                description: 'Vous souhaitez acheter nos services ? Notre équipe commerciale vous accompagne !',
                color: '#2ecc71'
            },
            slot: {
                name: 'slot',
                emoji: '🎮',
                title: 'Slot - Jeux',
                description: 'Questions sur les slots ou les jeux ? Nos experts sont à votre disposition !',
                color: '#e74c3c'
            }
        };
        
        const ticketConfig = ticketConfigs[selectedValue];
        if (!ticketConfig) {
            return interaction.reply({ content: '❌ Type de ticket invalide.', ephemeral: true });
        }
        
        // Créer le salon de ticket
        const ticketChannel = await guild.channels.create({
            name: `${ticketConfig.name}-${interaction.user.username}`,
            type: ChannelType.GuildText,
            permissionOverwrites: [
                {
                    id: guild.id,
                    deny: [PermissionFlagsBits.ViewChannel],
                },
                {
                    id: interaction.user.id,
                    allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory],
                },
                {
                    id: guild.members.me.id,
                    allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ManageChannels],
                }
            ],
        });
        
        // Créer l'embed du ticket
        const ticketEmbed = new EmbedBuilder()
            .setColor(ticketConfig.color)
            .setTitle(`${ticketConfig.emoji} ${ticketConfig.title}`)
            .setDescription(ticketConfig.description)
            .addFields(
                { name: '👤 Utilisateur', value: interaction.user.toString(), inline: true },
                { name: '📅 Créé le', value: new Date().toLocaleDateString('fr-FR', { 
                    day: '2-digit', 
                    month: '2-digit', 
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                }), inline: true },
                { name: '🎫 Type', value: ticketConfig.title, inline: true }
            )
            .addFields(
                { name: '📋 Instructions', value: '• Décrivez votre problème ou demande\n• Soyez patient, notre équipe vous répondra\n• Pour fermer le ticket, utilisez le bouton ci-dessous', inline: false }
            )
            .setFooter({ text: 'Moon Shop Bot', iconURL: 'https://cdn.discordapp.com/attachments/1234567890/1234567890/moon.png' })
            .setTimestamp();
        
        // Créer le bouton de fermeture
        const closeButton = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('close_ticket')
                    .setLabel('🔒 Fermer le ticket')
                    .setStyle(ButtonStyle.Danger)
            );
        
        // Envoyer le message dans le ticket
        await ticketChannel.send({ embeds: [ticketEmbed], components: [closeButton] });
        
        // Confirmation à l'utilisateur
        const successEmbed = new EmbedBuilder()
            .setColor('#00FF00')
            .setTitle('✅ Ticket créé')
            .setDescription(`Votre ticket ${ticketConfig.emoji} **${ticketConfig.title}** a été créé avec succès !`)
            .addFields(
                { name: '🔗 Accès', value: `[Cliquez ici pour accéder au ticket](${ticketChannel.url})`, inline: false }
            )
            .setFooter({ text: 'Moon Shop Bot', iconURL: 'https://cdn.discordapp.com/attachments/1234567890/1234567890/moon.png' })
            .setTimestamp();
        
        await interaction.reply({ embeds: [successEmbed], ephemeral: true });
        
        console.log(`🎫 Ticket créé: ${interaction.user.tag} -> ${ticketConfig.title} (${ticketChannel.name})`);
        
    } catch (error) {
        console.error('Erreur lors de la création du ticket:', error);
        await interaction.reply({ 
            content: '❌ Une erreur est survenue lors de la création du ticket.', 
            ephemeral: true 
        });
    }
}

async function handleTicketClose(interaction) {
    const channel = interaction.channel;
    
    // Vérifier si c'est un ticket (commence par help-, buy-, ou slot-)
    if (!channel.name.match(/^(help|buy|slot)-/)) {
        return interaction.reply({ content: '❌ Cette commande ne peut être utilisée que dans un ticket.', ephemeral: true });
    }

    await interaction.reply('🔒 Fermeture du ticket dans 5 secondes...');
    
    setTimeout(async () => {
        try {
            await channel.delete();
            console.log(`🗑️ Ticket fermé: ${channel.name}`);
        } catch (error) {
            console.error('Erreur lors de la fermeture du ticket:', error);
        }
    }, 5000);
}

async function handleShopMenu(interaction) {
    const selectedValue = interaction.values[0];
    const category = config.shop.categories.find(cat => cat.value === selectedValue);
    
    if (!category) {
        return interaction.reply({ content: '❌ Catégorie non trouvée.', ephemeral: true });
    }

    const shopEmbed = new EmbedBuilder()
        .setColor(config.bot.embedColor)
        .setTitle(`🛒 ${category.name}`)
        .setDescription(category.description)
        .addFields(
            { name: '📋 Comment commander', value: 'Ouvrez un ticket avec la commande `!ticket` pour passer votre commande.' },
            { name: '💳 Paiement', value: 'Nous acceptons les paiements en crypto-monnaies et autres méthodes sécurisées.' },
            { name: '⏱️ Délai', value: 'Livraison instantanée après validation du paiement.' }
        )
        .setFooter({ text: config.bot.embedFooter, iconURL: config.bot.embedFooterIcon })
        .setTimestamp();

    await interaction.reply({ embeds: [shopEmbed], ephemeral: true });
}



// Connexion du bot
client.login(process.env.TOKEN); 