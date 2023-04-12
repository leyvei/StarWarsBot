const Discord = require("discord.js");

module.exports = {
  data: new Discord.SlashCommandBuilder()
    .setName("kick")
    .setDescription("Exclure une personne du serveur")
    .setDefaultMemberPermissions(Discord.PermissionFlagsBits.ModerateMembers)
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("L'utilisateur à exclure")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("reason").setDescription("La raison de l'exclusion")
    ),
  async execute(interaction) {
    const user = interaction.options.getUser("user");
    const reason =
      interaction.options.getString("reason") || "Raison non spécifiée";
    const member = interaction.guild.members.cache.get(user.id);

    if (member.kickable) {
      try {
        await member.kick(reason);
        await interaction.reply({
          content: `Exclusion réussie. Veuillez vous rendre dans le salon <#1092472118773559457> pour plus d'informations.`,
          ephemeral: true,
        });

        const kickEmbed = new Discord.EmbedBuilder()
          .setColor("#ff0000")
          .setTitle(`🔨 ${user.tag} a été exclu(e) !`)
          .setDescription(
            `L'utilisateur ${user} a été exclu(e) du serveur pour la raison suivante : ${reason}`
          )
          .setThumbnail(user.displayAvatarURL({ dynamic: true }))
          .addFields(
            { name: "Utilisateur", value: user.toString(), inline: true },
            { name: "ID utilisateur", value: user.id, inline: true },
            { name: "Raison", value: reason },
            {
              name: "Exclu(e) par",
              value: interaction.user.toString(),
              inline: true,
            },
            {
              name: "ID du modérateur",
              value: interaction.user.id,
              inline: true,
            }
          )
          .setImage(
            "https://66.media.tumblr.com/tumblr_m0g5y9Cmdz1rqfhi2o1_400.gif"
          )
          .setTimestamp();

        await interaction.guild.channels.cache
          .get("1092472118773559457")
          .send({ embeds: [kickEmbed], ephemeral: false });
      } catch (error) {
        console.error(error);
        await interaction.reply({
          content: "Je n'ai pas pu exclure cet utilisateur.",
          ephemeral: true,
        });
      }
    } else {
      await interaction.reply({
        content: "Je ne peux pas exclure cet utilisateur.",
        ephemeral: true,
      });
    }
  },
};
