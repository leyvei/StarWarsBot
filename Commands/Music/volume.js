const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const client = require("../../index");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("volume")
    .setDescription("Ajustez le volume du joueur.")
    .addIntegerOption((option) =>
      option
        .setName("volume")
        .setDescription("10 = 10%")
        .setMinValue(0)
        .setMaxValue(100)
        .setRequired(true)
    ),
  async execute(interaction) {
    const { member, guild, options } = interaction;
    const volume = options.getInteger("volume");
    const voiceChannel = member.voice.channel;

    const embed = new EmbedBuilder();

    if (!voiceChannel) {
      embed
        .setColor("Red")
        .setDescription(
          "Vous devez être dans un canal vocal pour exécuter des commandes musicales."
        );
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    if (!member.voice.channelId == guild.members.me.voice.channelId) {
      embed
        .setColor("Red")
        .setDescription(
          `Vous ne pouvez pas utiliser le lecteur de musique car il est déjà actif dans <#${guild.members.me.voice.channelId}>`
        );
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    try {
      client.distube.setVolume(voiceChannel, volume);
      return interaction.reply({
        content: `🔉 Le volume a été défini sur ${volume}%.`,
        ephemeral: true,
      });
    } catch (err) {
      console.log(err);

      embed
        .setColor("Red")
        .setDescription("⛔ | Quelque chose s'est mal passé ...");

      return interaction.reply({ embeds: [embed], ephemeral: true });
    }
  },
};
