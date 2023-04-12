const {
  EmbedBuilder,
  SlashCommandBuilder,
  PermissionFlagsBits,
} = require("discord.js");
const client = require("../../index");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("rewind")
    .setDescription("Rembobiner une chanson de quelques secondes.")
    .setDefaultMemberPermissions(PermissionFlagsBits.PrioritySpeaker)
    .addIntegerOption((option) =>
      option
        .setName("seconds")
        .setDescription("Nombre de secondes à rembobiner. (10 = 10s)")
        .setMinValue(0)
        .setRequired(true)
    ),
  async execute(interaction) {
    const { options, member, guild } = interaction;
    const seconds = options.getInteger("seconds");
    const voiceChannel = member.voice.channel;

    const embed = new EmbedBuilder();

    if (!voiceChannel) {
      embed
        .setColor("Red")
        .setDescription(
          "Vous devez être dans un salon vocal pour utiliser les commandes musicales."
        );
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    if (!member.voice.channelId == guild.members.me.voice.channelId) {
      embed
        .setColor("Red")
        .setDescription(
          `Vous ne pouvez pas utiliser le lecteur musical car il est déjà actif dans <#${guild.members.me.voice.channelId}>`
        );
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    try {
      const queue = await client.distube.getQueue(voiceChannel);

      if (!queue) {
        embed
          .setColor("Red")
          .setDescription("Il n'y a pas de file d'attente active.");
        return interaction.reply({ embeds: [embed], ephemeral: true });
      }

      await queue.seek(queue.currentTime - seconds);
      embed
        .setColor("Blue")
        .setDescription(`⏪ La chanson a été rembobinée de \`${seconds}s\`.`);
      return interaction.reply({ embeds: [embed], ephemeral: true });
    } catch (err) {
      console.log(err);

      embed
        .setColor("Red")
        .setDescription("⛔ | Quelque chose s'est mal passé...");

      return interaction.reply({ embeds: [embed], ephemeral: true });
    }
  },
};
