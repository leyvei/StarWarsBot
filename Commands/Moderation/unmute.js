const Discord = require("discord.js");

module.exports = {
  data: new Discord.SlashCommandBuilder()
    .setName("unmute")
    .setDescription("Supprime la mise en sourdine d'un membre")
    .setDefaultMemberPermissions(Discord.PermissionFlagsBits.ModerateMembers)
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("Membre à mettre en sourdine")
        .setRequired(true)
    ),

  execute: async (interaction) => {
    const { guild, options } = interaction;

    const user = options.getUser("user");
    const member = guild.members.cache.get(user.id);

    const errorEmbed = new Discord.EmbedBuilder()
      .setDescription("Une erreur est survenue. Veuillez réessayer plus tard.")
      .setColor("#c0392b");

    const successEmbed = new Discord.EmbedBuilder()
      .setDescription(`La mise en sourdine de ${user} a pris fin.`)
      .setColor("#27ae60")
      .setTimestamp();

    if (
      member.roles.highest.position >= interaction.member.roles.highest.position
    )
      return interaction.reply({ embeds: [errEmbed], ephemeral: true });
    if (
      !interaction.guild.members.me.permissions.has(
        Discord.PermissionFlagsBits.ModerateMembers
      )
    )
      return interaction.reply({ embeds: [errEmbed], ephemeral: true });

    try {
      await member.timeout(null);
      return interaction.reply({ embeds: [successEmbed], ephemeral: true });
    } catch (err) {
      return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }
  },
};
