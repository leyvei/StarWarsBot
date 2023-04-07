const economySchema = require('../../Models/economySchema')

const Discord = require('discord.js')

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName("economy")
        .setDescription("Créer votre compte galactique.")
        .setDefaultMemberPermissions(Discord.PermissionFlagsBits.SendMessages),

    execute: async (interaction) => {
        const { user, guild } = interaction

        let Data = await economySchema.findOne({ Guild: interaction.guild.id, User: interaction.user.id })

        const embed = new Discord.EmbedBuilder()
            .setColor("Aqua")
            .setTitle("Compte")
            .setDescription("Choisissez une option.")

        if (!Data) {
            // Si l'utilisateur n'a pas de compte galactique
            embed.addFields({ name: "Créer", value: "Créer votre compte galactique" })
        } else {
            // Si l'utilisateur a un compte galactique
            embed.addFields({ name: "Supprimer", value: "Supprimer votre compte galactique" })
        }

        const embed2 = new Discord.EmbedBuilder()
            .setColor("Green")
            .setTitle("Créer votre compte galactique")
            .setDescription("Votre compte galactique a été créé.")
            .addFields({ name: "Succès", value: "Votre compte galactique a bien été créé. Vous avez été crédité de 1CG (Crédit Galactique)" })
            .setFooter({ text: `Demandé par ${interaction.user.username}` })
            .setTimestamp()

        const embed3 = new Discord.EmbedBuilder()
            .setColor("Red")
            .setTitle("Supprimer votre compte galactique")
            .setDescription("Votre compte galactique a été supprimé.")
            .addFields({ name: "Succès", value: "Votre compte galactique a bien été supprimé." })
            .setFooter({ text: `Demandé par ${interaction.user.username}` })
            .setTimestamp()

        const button = new Discord.ActionRowBuilder()

        if (!Data) {
            // Si l'utilisateur n'a pas de compte galactique
            button.addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId("page1")
                    .setEmoji("✅")
                    .setLabel("Créer")
                    .setStyle(Discord.ButtonStyle.Success)
            )
        } else {
            // Si l'utilisateur a un compte galactique
            button.addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId("page2")
                    .setEmoji("❌")
                    .setLabel("Supprimer")
                    .setStyle(Discord.ButtonStyle.Danger)
            )
        }

        const message = await interaction.reply({ embeds: [embed], components: [button], ephemeral: true })
        const collector = await message.createMessageComponentCollector()

        collector.on('collect', async (index) => {
            if (index.customId === "page1") {
                if (index.user.id !== interaction.user.id) {
                    return index.reply({ content: `La seule personne autorisée à utiliser ce bouton est ${interaction.user.tag}` })
                }

                if (Data) return interaction.reply({ content: "Vous avez déjà un compte galactique.", ephemeral: true })

                Data = new economySchema({
                    Guild: interaction.guild.id,
                    User: user.id,
                    Bank: 0,
                    Wallet: 1000
                })

                await Data.save()

                await index.update({ embeds: [embed2], components: [] })
            }

            if (index.customId === "page2") {
                if (index.user.id !== interaction.user.id) {
                    return index.reply({ content: `La seule personne autorisée à utiliser ce bouton est ${interaction.user.tag}` })
                }

                await Data.deleteOne()

                await index.update({ embeds: [embed3], components: [] })
            }
        })
    }
}