const Discord = require("discord.js");

module.exports = {
  data: new Discord.SlashCommandBuilder()
    .setName("create-role")
    .setDescription("Créer un nouveau rôle sur le serveur.")
    .setDefaultMemberPermissions(Discord.PermissionFlagsBits.MuteMembers)
    .addStringOption((option) =>
      option
        .setName("name")
        .setDescription("Le nom du rôle à créer.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("color")
        .setDescription("Le nom du rôle à créer.")
        .setRequired(true)
    ),

  async execute(interaction) {
    const roleName = interaction.options.getString("name");
    const roleColor = interaction.options.getString("color");
    const guild = interaction.guild;

    try {
      const permissions = [
        Discord.PermissionFlagsBits.ManageMessages,
        Discord.PermissionFlagsBits.ManageChannels,
        Discord.PermissionFlagsBits.ManageRoles,
        Discord.PermissionFlagsBits.ModerateMembers,
        Discord.PermissionFlagsBits.ManageEmojisAndStickers,
      ];

      const newRole = await guild.roles.create({
        name: roleName,
        color: roleColor ? roleColor.replace("#", "") : null,
        permissions: permissions,
      });

      await interaction.reply(
        `Le rôle ${newRole.name} a été créé avec succès !`
      );
    } catch (error) {
      console.log(error);
      await interaction.reply(
        "Une erreur s'est produite lors de la création du rôle."
      );
    }
  },
};
