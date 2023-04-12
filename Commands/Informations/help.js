const Discord = require("discord.js");

module.exports = {
  data: new Discord.SlashCommandBuilder()
    .setName("help")
    .setDescription("Récuperer la liste de toutes les commandes du bot."),
  async execute(interaction) {
    if (interaction.channelId == 1092385721622466642) {
      const { client } = interaction;

      const emojis = {};

      function getCommand(name) {
        const getCommandID = client.application.commands.cache
          .filter((command) => command.name === name) // Filter by command name
          .map((command) => command.id); // Map to just the ID property

        return getCommandID;
      }

      const directories = [
        ...new Set(client.commands.map((command) => command.folder)),
      ];

      const formatString = (str) =>
        `${str[0].toUpperCase()}${str.slice(1).toLowerCase()}`;

      const categories = directories.map((dir) => {
        const getCommands = client.commands
          .filter((command) => command.folder === dir)
          .map((command) => {
            return {
              name: command.data.name,
              description:
                command.data.description ||
                "Aucune description pour cette commande",
            };
          });

        return {
          directory: formatString(dir),
          commands: getCommands,
        };
      });

      const embed = new Discord.EmbedBuilder()
        .setDescription("Voir les commandes du droïde de notre serveur")
        .setColor("#235ee7")
        .setAuthor({
          name: `Commande du droïde ${client.user.username}`,
          iconURL: client.user.avatarURL(),
        });

      const components = (state) => [
        new Discord.ActionRowBuilder().addComponents(
          new Discord.StringSelectMenuBuilder()
            .setCustomId("help-menu")
            .setPlaceholder("Trouver une catégorie")
            .setDisabled(state)
            .addOptions(
              categories.map((command) => {
                return {
                  label: command.directory,
                  value: command.directory.toLowerCase(),
                  description: `Commandes de la carte mémoire ${command.directory}.`,
                  emoji: emojis[command.directory.toLowerCase() || null],
                };
              })
            )
        ),
      ];

      const initialMessage = await interaction.reply({
        embeds: [embed],
        components: components(false),
        ephemeral: true,
      });

      const filter = (interaction) =>
        interaction.user.id === interaction.member.id;

      const collector = interaction.channel.createMessageComponentCollector({
        filter,
        componentType: Discord.ComponentType.StringSelect,
      });

      collector.on("collect", (interaction) => {
        const [directory] = interaction.values;
        const category = categories.find(
          (x) => x.directory.toLowerCase() === directory
        );

        const categoryEmbed = new Discord.EmbedBuilder()
          .setTitle(
            `Carte mémoire trouvée: ${
              emojis[directory.toLowerCase()]
                ? `${emojis[directory.toLowerCase()]}${formatString(directory)}`
                : formatString(directory)
            }`
          )
          .setDescription(
            `Liste des commandes de la carte mémoire ${directory}.`
          )
          .setColor("#235ee7")
          .addFields(
            category.commands.map((command) => {
              return {
                name: `</${command.name}:${getCommand(command.name)}>`,
                value: `\`${command.description}\``,
                inline: true,
              };
            })
          );

        interaction.update({ embeds: [categoryEmbed] });
      });

      collector.on("end", () => {
        initialMessage.edit({ components: components(true) });
      });
    } else {
      await interaction.reply({
        content:
          "Veuillez effectuer cette commande dans le salon <#1092385721622466642>.",
        ephemeral: true,
      });
    }
  },
};
