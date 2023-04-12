const Discord = require("discord.js");

module.exports = {
  data: new Discord.SlashCommandBuilder()
    .setName("lock")
    .setDescription("Vérouiller un salon.")
    .setDefaultMemberPermissions(Discord.PermissionFlagsBits.ManageChannels)
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("Salon à vérouiller.")
        .addChannelTypes(Discord.ChannelType.GuildText)
        .setRequired(true)
    ),

  execute: async (interaction) => {
    let channel = interaction.options.getChannel("channel");

    channel.permissionOverwrites.create(interaction.guild.id, {
      SendMessages: false,
    });

    const embed = new Discord.EmbedBuilder()
      .setColor("Random")
      .setDescription(
        `:white_check_mark: Le salon ${channel} a été vérouillé.`
      );

    await interaction.reply({ embeds: [embed] });
  },
};
