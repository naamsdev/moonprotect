const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'reactionrole',
    aliases: ['rr', 'rolereaction'],
    description: 'Créer un système de rôles par réaction avec un message existant',
    async execute(message, args, client) {
        const config = client.config;
        
        // Vérifier les permissions
        if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) {
            const errorEmbed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('❌ Permissions insuffisantes')
                .setDescription('Vous devez être administrateur pour utiliser cette commande.')
                .setFooter({ text: config.bot.embedFooter, iconURL: config.bot.embedFooterIcon })
                .setTimestamp();
            
            return message.reply({ embeds: [errorEmbed] });
        }

        // Vérifier les arguments
        if (args.length !== 2) {
            const helpEmbed = new EmbedBuilder()
                .setColor('#FFA500')
                .setTitle('❓ Usage de la commande reactionrole')
                .setDescription('Configurez un système de rôles par réaction avec un message existant')
                .addFields(
                    { name: '📝 Syntaxe', value: '`!reactionrole <message_id> <rôle:émoji>`', inline: false },
                    { name: '📋 Exemples', value: '`!reactionrole 1234567890123456789 "Membre:✅"`\n`!reactionrole 1234567890123456789 "1234567890123456789:✅"`', inline: false },
                    { name: '💡 Astuce', value: 'Pour les rôles avec caractères spéciaux, utilisez l\'ID du rôle directement.', inline: false },
                    { name: '⚠️ Important', value: 'Un seul rôle par message. Le message doit exister et le bot doit avoir les permissions pour ajouter des réactions.', inline: false }
                )
                .setFooter({ text: config.bot.embedFooter, iconURL: config.bot.embedFooterIcon })
                .setTimestamp();
            
            return message.reply({ embeds: [helpEmbed] });
        }

        try {
            // Extraire l'ID du message
            const messageId = args[0];
            
            // Vérifier si l'ID est valide
            if (!/^\d+$/.test(messageId)) {
                const errorEmbed = new EmbedBuilder()
                    .setColor('#FF0000')
                    .setTitle('❌ ID de message invalide')
                    .setDescription('L\'ID du message doit être un nombre valide.')
                    .setFooter({ text: config.bot.embedFooter, iconURL: config.bot.embedFooterIcon })
                    .setTimestamp();
                
                return message.reply({ embeds: [errorEmbed] });
            }
            
            // Récupérer le message
            let targetMessage;
            try {
                targetMessage = await message.channel.messages.fetch(messageId);
            } catch (error) {
                const errorEmbed = new EmbedBuilder()
                    .setColor('#FF0000')
                    .setTitle('❌ Message non trouvé')
                    .setDescription('Le message avec cet ID n\'a pas été trouvé dans ce salon.')
                    .setFooter({ text: config.bot.embedFooter, iconURL: config.bot.embedFooterIcon })
                    .setTimestamp();
                
                return message.reply({ embeds: [errorEmbed] });
            }
            
            // Extraire le rôle et l'émoji
            const roleEmojiPair = args[1];
            const [roleName, emoji] = roleEmojiPair.split(':');
            
            if (!roleName || !emoji) {
                const errorEmbed = new EmbedBuilder()
                    .setColor('#FF0000')
                    .setTitle('❌ Format invalide')
                    .setDescription('Le format doit être: `rôle:émoji`')
                    .setFooter({ text: config.bot.embedFooter, iconURL: config.bot.embedFooterIcon })
                    .setTimestamp();
                
                return message.reply({ embeds: [errorEmbed] });
            }
            
            console.log(`🔍 Recherche du rôle: "${roleName}" avec émoji: "${emoji}"`);
            console.log(`📋 Rôles disponibles dans le serveur:`);
            message.guild.roles.cache.forEach(r => {
                console.log(`  - ${r.name} (ID: ${r.id})`);
            });
            
            // Trouver le rôle avec plusieurs méthodes
            let role = null;
            let methodUsed = '';
            
            // 1. Recherche exacte par nom
            role = message.guild.roles.cache.find(r => 
                r.name.toLowerCase() === roleName.toLowerCase()
            );
            if (role) {
                methodUsed = 'nom exact';
                console.log(`✅ Rôle trouvé par nom exact: ${role.name}`);
            }
            
            // 2. Recherche par ID
            if (!role) {
                role = message.guild.roles.cache.find(r => 
                    r.id === roleName
                );
                if (role) {
                    methodUsed = 'ID';
                    console.log(`✅ Rôle trouvé par ID: ${role.name}`);
                }
            }
            
            // 3. Recherche par mention
            if (!role) {
                const mentionMatch = roleName.match(/<@&(\d+)>/);
                if (mentionMatch) {
                    role = message.guild.roles.cache.get(mentionMatch[1]);
                    if (role) {
                        methodUsed = 'mention';
                        console.log(`✅ Rôle trouvé par mention: ${role.name}`);
                    }
                }
            }
            
            // 4. Recherche partielle (plus stricte)
            if (!role) {
                const matchingRoles = message.guild.roles.cache.filter(r => 
                    r.name.toLowerCase().includes(roleName.toLowerCase())
                );
                
                if (matchingRoles.size === 1) {
                    role = matchingRoles.first();
                    methodUsed = 'recherche partielle (unique)';
                    console.log(`✅ Rôle trouvé par recherche partielle: ${role.name}`);
                } else if (matchingRoles.size > 1) {
                    console.log(`⚠️ Plusieurs rôles trouvés pour "${roleName}":`);
                    matchingRoles.forEach(r => console.log(`   - ${r.name} (ID: ${r.id})`));
                    
                    // Demander confirmation ou utiliser le premier
                    role = matchingRoles.first();
                    methodUsed = 'recherche partielle (premier trouvé)';
                    console.log(`⚠️ Utilisation du premier rôle trouvé: ${role.name}`);
                }
            }
            
            // 5. Méthode spéciale pour les rôles avec caractères spéciaux
            if (!role) {
                const matchingRoles = message.guild.roles.cache.filter(r => {
                    const cleanRoleName = r.name.replace(/[^\w\s]/g, '').toLowerCase().trim();
                    const cleanSearchName = roleName.replace(/[^\w\s]/g, '').toLowerCase().trim();
                    return cleanRoleName.includes(cleanSearchName) || cleanSearchName.includes(cleanRoleName);
                });
                
                if (matchingRoles.size === 1) {
                    role = matchingRoles.first();
                    methodUsed = 'nettoyage caractères spéciaux (unique)';
                    console.log(`✅ Rôle trouvé par nettoyage: ${role.name}`);
                } else if (matchingRoles.size > 1) {
                    console.log(`⚠️ Plusieurs rôles trouvés après nettoyage pour "${roleName}":`);
                    matchingRoles.forEach(r => console.log(`   - ${r.name} (ID: ${r.id})`));
                    
                    role = matchingRoles.first();
                    methodUsed = 'nettoyage caractères spéciaux (premier trouvé)';
                    console.log(`⚠️ Utilisation du premier rôle trouvé: ${role.name}`);
                }
            }
            
            if (!role) {
                console.log(`❌ Rôle non trouvé: "${roleName}"`);
                console.log(`   Tentatives: exact, ID, partiel`);
                
                const errorEmbed = new EmbedBuilder()
                    .setColor('#FF0000')
                    .setTitle('❌ Rôle non trouvé')
                    .setDescription(`Le rôle "${roleName}" n'a pas été trouvé dans ce serveur.`)
                    .setFooter({ text: config.bot.embedFooter, iconURL: config.bot.embedFooterIcon })
                    .setTimestamp();
                
                return message.reply({ embeds: [errorEmbed] });
            }
            
            console.log(`✅ Rôle trouvé: ${role.name} (ID: ${role.id}) - Méthode: ${methodUsed}`);
            
            // Stocker l'association rôle-émoji
            if (!client.reactionRoles) {
                client.reactionRoles = new Map();
            }
            
            const roleMap = new Map();
            roleMap.set(emoji, role.id);
            client.reactionRoles.set(messageId, roleMap);
            
            console.log(`💾 Configuration stockée:`);
            console.log(`   Message ID: ${messageId}`);
            console.log(`   Émoji: ${emoji}`);
            console.log(`   Rôle ID: ${role.id}`);
            console.log(`   Rôle nom: ${role.name}`);
            console.log(`   Total configs: ${client.reactionRoles.size}`);
            
            // Ajouter la réaction au message
            try {
                await targetMessage.react(emoji);
                console.log(`✅ Réaction ajoutée: ${emoji} pour le rôle ${role.name} (ID: ${role.id})`);
            } catch (error) {
                console.error(`❌ Erreur lors de l'ajout de la réaction ${emoji}:`, error);
                
                const errorEmbed = new EmbedBuilder()
                    .setColor('#FF0000')
                    .setTitle('❌ Erreur de réaction')
                    .setDescription('Impossible d\'ajouter la réaction au message.')
                    .setFooter({ text: config.bot.embedFooter, iconURL: config.bot.embedFooterIcon })
                    .setTimestamp();
                
                return message.reply({ embeds: [errorEmbed] });
            }
            
            // Confirmation
            const successEmbed = new EmbedBuilder()
                .setColor('#00FF00')
                .setTitle('✅ Système de rôles configuré')
                .setDescription(`Le système de rôles par réaction a été configuré avec succès !`)
                .addFields(
                    { name: '📊 Rôle configuré', value: role.name, inline: true },
                    { name: '🔗 Message', value: `[Cliquez ici](${targetMessage.url})`, inline: true },
                    { name: '📋 Configuration', value: `${emoji} ${role.name}`, inline: false },
                    { name: '🔍 Méthode de détection', value: methodUsed, inline: false }
                )
                .setFooter({ text: config.bot.embedFooter, iconURL: config.bot.embedFooterIcon })
                .setTimestamp();
            
            await message.reply({ embeds: [successEmbed] });
            
        } catch (error) {
            console.error('Erreur lors de la configuration du système de rôles:', error);
            
            const errorEmbed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('❌ Erreur')
                .setDescription('Une erreur est survenue lors de la configuration du système de rôles.')
                .addFields(
                    { name: '🔍 Détails', value: error.message, inline: false }
                )
                .setFooter({ text: config.bot.embedFooter, iconURL: config.bot.embedFooterIcon })
                .setTimestamp();
            
            await message.reply({ embeds: [errorEmbed] });
        }
    }
}; 