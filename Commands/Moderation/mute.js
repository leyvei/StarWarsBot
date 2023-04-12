const Discord = require("discord.js");
const ms = require("ms");

module.exports = {
  data: new Discord.SlashCommandBuilder()
    .setName("mute")
    .setDescription("Mettre en sourdine un membre du serveur")
    .setDefaultMemberPermissions(Discord.PermissionFlagsBits.ModerateMembers)
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("Membre à mettre en sourdine")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("time")
        .setDescription(
          "Combien de temps souhaitez-vous le mettre en sourdine ?"
        )
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("Pourquoi mettre le membre en sourdine ?")
        .setRequired(false)
    ),
  execute: async (interaction) => {
    const { guild, options } = interaction;

    const user = options.getUser("user");
    const member = guild.members.cache.get(user.id);
    const time = options.getString("time");
    const convertedTime = ms(time);
    const reason = options.getString("reason") || "Aucune raison spécifiée";

    const errorEmbed = new Discord.EmbedBuilder()
      .setDescription("Une erreur est survenue. Veuillez réessayer plus tard.")
      .setColor("#c0392b");

    const successEmbed = new Discord.EmbedBuilder()
      .setDescription(`${user} a correctment été mis en sourdine.`)
      .addFields(
        { name: "Raison", value: `${reason}, inline: true` },
        { name: "Durée", value: `${time}`, inline: true }
      )
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
    if (!convertedTime)
      return interaction.reply({ embeds: [errEmbed], ephemeral: true });

    try {
      await member.timeout(convertedTime, reason);
      return interaction.reply({ embeds: [successEmbed], ephemeral: true });
    } catch (err) {
      return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }
  },
};
