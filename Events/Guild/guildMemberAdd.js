const Discord = require('discord.js')
const Schema = require('../../Models/Welcome')

module.exports = {
    name: "guildMemberAdd",
    execute: async (member) => {
        let imagesLink = ["https://media.tenor.com/cg0h-BiFJ5gAAAAd/star-wars-baby-yoda.gif", "https://media.tenor.com/hdZ_-Tde3jgAAAAC/welcome-creepy.gif", "https://media.tenor.com/tzPjLvfZ0vMAAAAC/grand-inquisitor-star-wars.gif", "https://media.tenor.com/vmeCFrfFOIwAAAAC/welcome-sithlord.gif", "https://media.tenor.com/vyR8EIapvm4AAAAC/sabine-wren-star-wars-rebels.gif", "https://media.tenor.com/5mcYh073e1EAAAAC/ps4-lego.gif", "https://media.tenor.com/PgggCxgVJz8AAAAC/ahsoka-tano-clone-wars-you-are-welcome.gif", "https://media.tenor.com/BDc-SQZ6R0YAAAAC/star-wars-captain-phasma.gif", "https://media.tenor.com/bWKcqloRSS8AAAAC/stickergiant-bienvenidos.gif", "https://media.tenor.com/K2vBPyK-pAsAAAAC/star-wars-cacti-caine.gif"]
        let image = imagesLink[Math.floor(Math.random() * imagesLink.length)]

        try {
            let data = await Schema.findOne({ Guild: member.guild.id })
            if (!data) return
            const welcomeChannel = member.guild.channels.cache.get(data.Channel)

            let Embed = new Discord.EmbedBuilder()
                .setColor("#e23922")
                .setDescription("Salut " + member.toString() + "! Bienvenue dans notre communauté Star Wars.\n\n  ↬ Nous sommes ravis de t'accueillir sur notre serveur. Tu n'es plus seul(e) dans ta quête de l'Équilibre de la Force, tu pourras désormais échanger avec d'autres passionnés.\n\n**Nous sommes maintenant " + member.guild.memberCount + " membres dans ce vaisseau !** 🚀")
                .setThumbnail(member.guild.iconURL({ format: "png" }))
                .setImage(image)
                .setTimestamp()

            welcomeChannel.send({ embeds: [Embed] })
            // member.roles.add(data.Role)
        } catch (error) {
            console.error(error)
        }


        // let Embed = new Discord.EmbedBuilder()
        //     .setColor("#e23922")
        //     .setDescription("Salut " + member.toString() + "! Bienvenue dans notre communauté Star Wars.\n\n  ↬ Nous sommes ravis de t'accueillir sur notre serveur. Tu n'es plus seul(e) dans ta quête de l'Équilibre de la Force, tu pourras désormais échanger avec d'autres passionnés.\n\n**Nous sommes maintenant " + member.guild.memberCount + " membres dans ce vaisseau !** 🚀")
        //     .setThumbnail(member.guild.iconURL({ format: "png" }))
        //     .setImage(image)
        //     .setTimestamp()


        // try {
        //     member.send("Bienvenue sur notre serveur Star Wars, " + member.toString() + "! Nous sommes ravis de t'accueillir parmi nous. N'hésite pas à te présenter dans le salon dédié et à participer aux discussions. Que la Force soit avec toi ! 🌟");
        // } catch (e) {
        //     return
        // }


    }
}