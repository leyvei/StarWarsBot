const Discord = require('discord.js')

module.exports = {
    name: "interactionCreate",
    execute: (interaction, client) => {

        if (interaction.isChatInputCommand()) {
            const command = client.commands.get(interaction.commandName)
            if (!command) { interaction.reply({ content: "Commande obsolète." }) }
            command.execute(interaction, client)
        } else if (interaction.isButton()) {
            if (interaction.channelId == "1092888671901978654") {
                const role = interaction.guild.roles.cache.get("1092887209578856468")
                interaction.member.roles.remove("1092448256874778704")
                return interaction.member.roles.add(role).then((member) => interaction.reply({ content: `Vous êtes désormais ${role}.`, ephemeral: true }))
            }
        } else {
            return;
        }
    }
}