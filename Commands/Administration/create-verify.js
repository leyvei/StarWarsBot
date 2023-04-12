const Discord = require("discord.js");

module.exports = {
  data: new Discord.SlashCommandBuilder()
    .setName("create-verify")
    .setDescription("Créer un nouveau salon de vérification sur le serveur.")
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("Channel d'envoi des vérifications")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(Discord.PermissionFlagsBits.Administrator),

  execute: async (interaction) => {
    const channel = interaction.options.getChannel("channel");
    const verifyEmbed = new Discord.EmbedBuilder()
      .setTitle("Vérification")
      .setDescription(
        "Cliquer sur le bouton pour vérifier votre compte et accéder aux autres salons."
      )
      .setColor("Random");

    try {
      await channel.send({
        embeds: [verifyEmbed],
        components: [
          new Discord.ActionRowBuilder().addComponents(
            new Discord.ButtonBuilder()
              .setCustomId("verify")
              .setLabel("Vérifier")
              .setStyle(Discord.ButtonStyle.Success)
          ),
        ],
      });
      return interaction.reply({
        content: "Le salon de vérification a été créé avec succès !",
        ephemeral: true,
      });
    } catch (err) {
      console.error(err);
      return interaction.reply({
        content: "Une erreur s'est produite ! Veuillez réessayer plus tard.",
        ephemeral: true,
      });
    }
  },
};
