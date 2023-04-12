const Discord = require("discord.js");

module.exports = {
  data: new Discord.SlashCommandBuilder()
    .setName("set-color")
    .setDescription("Permet de définir la couleur du pseudo d'un membre.")
    .setDefaultMemberPermissions(Discord.PermissionFlagsBits.ModerateMembers)
    .addStringOption((option) =>
      option.setName("color").setDescription("(Hexadécimale)").setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("user")
        .setDescription("Utilisateur à changer la couleur")
        .setRequired(false)
    ),

  execute: async (interaction) => {
    const { options, guild } = interaction;

    let AnnounceEmbed = new Discord.EmbedBuilder()
      .setColor("Random")
      .setTitle(
        `Annonce pour ${guild.roles.everyone.toString()} - ${options.getString(
          "name"
        )}`
      )
      .setDescription(`${options.getString("description")}`)
      .setTimestamp();

    interaction.reply({ content: "L'annonce a été envoyée", ephemeral: true });
    await guild.channels.cache
      .get("1093164279571681291")
      .send({ embeds: [AnnounceEmbed] });
  },
};
