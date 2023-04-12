const Discord = require("discord.js");
const ms = require("ms");

module.exports = {
  data: new Discord.SlashCommandBuilder()
    .setName("poll")
    .setDescription("Créer un sondage (2 options).")
    .setDefaultMemberPermissions(Discord.PermissionFlagsBits.ModerateMembers)
    .addStringOption((option) =>
      option
        .setName("option1")
        .setDescription("Première option")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("option2")
        .setDescription("Deuxième option")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("time").setDescription("Ex: 1s, 1m, 1d").setRequired(true)
    ),

  async execute(interaction, client) {
    const option1 = interaction.options.getString("option1");
    const option2 = interaction.options.getString("option2");
    const time = interaction.options.getString("time");

    const pollEmbed = new Discord.EmbedBuilder()
      .setColor("#7289da")
      .setTitle("Nouveau sondage")
      .setDescription(
        `Choisissez entre les 2 options. Vous avez ${time} secondes !`
      )
      .addFields(
        { name: "Option 1", value: option1, inline: true },
        { name: "Option 2", value: option2, inline: true }
      )
      .setTimestamp();

    try {
      const pollChannel = await client.channels.cache.get(
        "1093205669747900537"
      );
      const pollMessage = await pollChannel.send({ embeds: [pollEmbed] });
      await pollMessage.react("1️⃣");
      await pollMessage.react("2️⃣");

      // Set a time limit of 30 seconds for the poll
      const filter = (reaction, user) => {
        return (
          ["1️⃣", "2️⃣"].includes(reaction.emoji.name) &&
          user.id === interaction.user.id
        );
      };
      const collector = pollMessage.createReactionCollector({
        filter,
        time: ms(time),
      });

      let option1Count = 0;
      let option2Count = 0;

      collector.on("collect", (reaction, user) => {
        if (reaction.emoji.name === "1️⃣") {
          option1Count++;
        } else if (reaction.emoji.name === "2️⃣") {
          option2Count++;
        }
      });

      collector.on("end", (collected) => {
        let result = "";
        if (option1Count > option2Count) {
          result = option1;
        } else if (option2Count > option1Count) {
          result = option2;
        } else {
          result = "Le serveur n'a pas réussi à se décider veuillez réessayer.";
        }

        const resultEmbed = new Discord.EmbedBuilder()
          .setColor("#7289da")
          .setTitle("Nouvelle features à ajouter")
          .setDescription(`**${result}**`)
          .setTimestamp();

        const addChannel = client.channels.cache.get("1093218377222344714");
        if (addChannel) {
          addChannel.send({ embeds: [resultEmbed] });
        } else {
          console.log("Je ne trouve pas le salon.");
        }

        pollEmbed.setDescription("Le sondage est terminé");
        pollMessage.edit({ embeds: [pollEmbed] });
      });

      await interaction.reply({
        content: "Le sondage a été créé",
        ephemeral: true,
      });
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: "An error occurred while creating the poll.",
        ephemeral: true,
      });
    }
  },
};
