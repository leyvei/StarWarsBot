const Discord = require('discord.js')
const welcomeSchema = require('../../Models/Welcome')
const { model, Schema } = require('mongoose')

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName("setup-welcome")
        .setDescription("Définir un message de bienvenue pour le serveur")
        .setDefaultMemberPermissions(Discord.PermissionFlagsBits.Administrator)
        .addChannelOption(option => option.setName("channel").setDescription("Salon dans lequel sera affiché le message de bienvenue.").setRequired(true))
        .addRoleOption(option => option.setName("role").setDescription("Entrer votre role par défaut").setRequired(true))
        .addStringOption(option => option.setName("welcome-message").setDescription("Entrer votre message de bienvenue")),

    execute: async (interaction) => {
        const { channel, options } = interaction
        const welcomeChannel = options.getChannel("channel")
        const welcomeMessage = options.getString("welcome-message")
        const roleId = options.getRole("role")

        if (!interaction.guild.members.me.permissions.has(Discord.PermissionFlagsBits.SendMessages)) {
            interaction.reply({ content: "Je n'ai pas la permission d'effectuer cette commande", ephemeral: true })
            return
        }

        try {
            let data = await welcomeSchema.findOne({ Guild: interaction.guild.id })
            if (!data) {
                const newWelcome = new welcomeSchema({
                    Guild: interaction.guild.id,
                    Channel: welcomeChannel.id,
                    Message: welcomeMessage,
                    Role: roleId.id
                })
                await newWelcome.save()
            } else {
                data.Channel = welcomeChannel.id
                data.Message = welcomeMessage
                data.Role = roleId.id
                await data.save()
            }
            interaction.reply({ content: "Nouveau message de bienvenue créé !", ephemeral: true })
        } catch (error) {
            console.error(error)
            interaction.reply({ content: "Une erreur s'est produite lors de la création du message de bienvenue.", ephemeral: true })
        }
    }
}