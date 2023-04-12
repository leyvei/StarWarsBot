const Discord = require("discord.js");

module.exports = {
  data: new Discord.SlashCommandBuilder()
    .setName("ban")
    .setDescription("Bannir une personne du serveur")
    .setDefaultMemberPermissions(Discord.PermissionFlagsBits.ModerateMembers)
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("L'utilisateur à bannir")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("reason").setDescription("La raison du bannissement")
    ),
  async execute(interaction, client) {
    const user =
      interaction.options.get("user").user || interaction.options.get("user");
    const reason =
      interaction.options.getString("reason") || "Raison non spécifiée";
    const member = interaction.guild.members.cache.get(user.id);

    if (member.bannable) {
      try {
        await interaction.guild.members.ban(user, { reason: reason });
        await interaction.reply({
          content: `Ban réussi. Veuillez vous rendre dans le salon <#1092365428388540477> pour plus d'informations.`,
          ephemeral: true,
        });

        const banEmbed = new Discord.EmbedBuilder()
          .setColor("#ff0000")
          .setTitle(`🔨 ${user.tag} a été banni !`)
          .setDescription(
            `L'utilisateur ${user} a été banni du serveur pour la raison suivante : ${reason}`
          )
          .setThumbnail(user.displayAvatarURL({ dynamic: true }))
          .addFields(
            { name: "Utilisateur", value: user.toString(), inline: true },
            { name: "ID utilisateur", value: user.id, inline: true },
            { name: "Raison", value: reason },
            {
              name: "Banni par",
              value: interaction.user.toString(),
              inline: true,
            },
            {
              name: "ID du modérateur",
              value: interaction.user.id,
              inline: true,
            }
          )
          .setImage("https://i.imgur.com/O3DHIA5.gif")
          .setTimestamp();

        await client.channels.cache
          .get("1092365428388540477")
          .send({ embeds: [banEmbed], ephemeral: false });
      } catch (error) {
        console.error(error);
        await interaction.reply({
          content: "Je n'ai pas pu bannir cet utilisateur.",
          ephemeral: true,
        });
      }
    } else {
      await interaction.reply({
        content: "Je ne peux pas bannir cet utilisateur.",
        ephemeral: true,
      });
    }
  },
};
