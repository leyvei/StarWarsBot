const Discord = require("discord.js");

module.exports = {
  data: new Discord.SlashCommandBuilder()
    .setName("ping")
    .setDescription("Renvoie la latence de l'API Discord")
    .setDefaultMemberPermissions(Discord.PermissionFlagsBits.SendMessages),
  execute: (interaction, client) => {
    interaction.reply({ content: "Pong", ephemeral: true });
  },
};
