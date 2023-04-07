const Discord = require('discord.js');

module.exports = {
  data: new Discord.SlashCommandBuilder()
    .setName('server')
    .setDescription("Affiche des informations sur le serveur")
    .setDefaultMemberPermissions(Discord.PermissionFlagsBits.ManageChannels),
  async execute(interaction, client) {
    const guild = interaction.guild;

    if (interaction.channelId == "1092363573382107196") {
      const embed = new Discord.EmbedBuilder()
        .setColor('#6D214F')
        .setTitle(`Informations sur ${guild.name}`)
        .setThumbnail(guild.iconURL({ dynamic: true }))
        .addFields(
          { name: 'ID', value: guild.id, inline: true },
          { name: 'Propriétaire', value: `<@${guild.ownerId}>`, inline: true },
          { name: 'Région', value: `🇫🇷 France 🇫🇷`, inline: true },
          { name: 'Créé le', value: `${guild.createdAt.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}`, inline: true },
          { name: 'Membres', value: `${guild.memberCount}`, inline: true },
          { name: 'Catégories', value: `${guild.channels.cache.filter(channel => channel.type == "4").size}`, inline: true },
          { name: 'Salons', value: `${guild.channels.cache.size}`, inline: true },
          { name: 'Salons textuels', value: `${guild.channels.cache.filter(channel => channel.type == "0").size}`, inline: true },
          { name: 'Salons vocaux', value: `${guild.channels.cache.filter(channel => channel.type == '2').size}`, inline: true },
          { name: 'Rôles', value: `${guild.roles.cache.size}`, inline: true },
          { name: 'Emojis', value: `${guild.emojis.cache.size}`, inline: true }
        )
        .setTimestamp();

      await interaction.reply({ embeds: [embed], ephemeral: false });
    } else {
      await interaction.reply({ content: "Veuillez exécuter cette commande dans le salon <#1092363573382107196>", ephemeral: true });
    }
  }
}