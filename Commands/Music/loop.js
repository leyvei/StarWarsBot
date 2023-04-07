const { EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const client = require("../../index");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("loop")
        .setDescription("Affiche les options de répétition.")
        .setDefaultMemberPermissions(PermissionFlagsBits.PrioritySpeaker)
        .addStringOption(option =>
            option.setName("options")
                .setDescription("Options de répétition: off, song, queue")
                .addChoices(
                    { name: "off", value: "off" },
                    { name: "song", value: "song" },
                    { name: "queue", value: "queue" },
                )
                .setRequired(true)
        ),
    async execute(interaction) {
        const { member, options, guild } = interaction;
        const option = options.getString("options");
        const voiceChannel = member.voice.channel;

        const embed = new EmbedBuilder();

        if (!voiceChannel) {
            embed.setColor("Red").setDescription("Vous devez être dans un salon vocal pour utiliser les commandes musicales.");
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        if (!member.voice.channelId == guild.members.me.voice.channelId) {
            embed.setColor("Red").setDescription(`Vous ne pouvez pas utiliser le lecteur musical car il est déjà actif dans <#${guild.members.me.voice.channelId}>`);
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        try {
            const queue = await client.distube.getQueue(voiceChannel);

            if (!queue) {
                embed.setColor("Red").setDescription("Il n'y a pas de file d'attente active.");
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            let mode = null;

            switch (option) {
                case "off":
                    mode = 0;
                    break;
                case "song":
                    mode = 1;
                    break;
                case "queue":
                    mode = 2;
                    break;
            }

            mode = await queue.setRepeatMode(mode);

            mode = mode ? (mode === 2 ? "Répéter la file d'attente" : "Répéter la chanson") : "Désactivé";

            embed.setColor("Orange").setDescription(`🔁 Mode de répétition défini sur \`${mode}\`.`);
            return interaction.reply({ embeds: [embed], ephemeral: true });
        } catch (err) {
            console.log(err);

            embed.setColor("Red").setDescription("⛔ | Quelque chose s'est mal passé...");

            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

    }
}