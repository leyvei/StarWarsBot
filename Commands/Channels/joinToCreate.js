const Discord = require("discord.js");
const schema = require("../../Models/join-to-create");

module.exports = {
  data: new Discord.SlashCommandBuilder()
    .setName("setup-jointocreate")
    .setDescription("Mettre en place le système 'joinToCreate'.")
    .setDefaultMemberPermissions(
      Discord.PermissionFlagsBits.ManageGuild,
      Discord.PermissionFlagsBits.Connect
    ),
  execute: async (interaction) => {
    const channel = interaction.member.voice.channelId;
    if (!channel)
      return interaction.reply(
        `**${interaction.member}** Join the voice channel you wanna convert to **join to create** vc`
      );

    let data = await schema.findOne({ Guild: interaction.guild.id });
    if (!data) {
      data = new schema({
        Guild: interaction.guild.id,
        Channel: channel,
      }).save();
    } else {
      data.Channel = channel;
      data.save();
    }

    interaction.reply({
      content: `<#${channel}> has been set as join to create vc`,
    });
  },
};
