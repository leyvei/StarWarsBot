const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const loadEvents = require('../../Handlers/eventHandler')
const loadCommands = require('../../Handlers/commandHandler')
const client = require('../../index')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("reload")
        .setDescription("Recharger le bot ou une partie")
        .addSubcommand(subcommand => subcommand.setName("all").setDescription("Recharger tout le bot"))
        .addSubcommand(subcommand => subcommand.setName("commands").setDescription("Recharger vos commandes"))
        .addSubcommand(subcommand => subcommand.setName("events").setDescription("Recharger vos évènements")),
    async execute(interaction) {

        const { user } = interaction

        if (user.id !== "829256424941027328") return interaction.reply({ embeds: [new EmbedBuilder().setColor("red").setDescription("Cette commande est réservée au développeur du bot.")], ephemeral: true })

        const subcommand = interaction.options.getSubcommand()
        const embed = new EmbedBuilder()
            .setTitle("🖥️ Développeur")
            .setColor("Blue")

        switch (subcommand) {
            case "commands":
                loadCommands(client)
                client.channels.cache.get('1092462727638827168').send({ embeds: [embed.setDescription("✅ Commandes rechargées")] })
                break
            case "events":
                loadEvents(client)
                client.channels.cache.get('1092462727638827168').send({ embeds: [embed.setDescription("✅ Evenements rechargées")] })
                break
            case "all":
                loadCommands(client)
                loadEvents(client)
                client.channels.cache.get('1092462727638827168').send({ embeds: [embed.setDescription("✅ Bot rechargé")] })
        }
        await interaction.reply({ content: `Voir salon logs`, ephemeral: true })
    }
};