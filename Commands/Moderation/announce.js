const Discord = require("discord.js");

module.exports = {
  data: new Discord.SlashCommandBuilder()
    .setName("announce")
    .setDescription("Faire une annonce au serveur")
    .setDefaultMemberPermissions(Discord.PermissionFlagsBits.ModerateMembers)
    .addStringOption((option) =>
      option
        .setName("name")
        .setDescription("Nom de l'annonce")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("description")
        .setDescription("Description de l'annonce")
        .setRequired(true)
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
