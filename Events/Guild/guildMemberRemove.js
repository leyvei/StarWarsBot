const Discord = require('discord.js')

module.exports = {
    name: "guildMemberRemove",
    execute: async (member, client) => {

        let imagesLink = ["https://media.tenor.com/TDM6-pMehDMAAAAC/obi-wan-obi-wan-kenobi.gif", "https://media.tenor.com/Q4qwcrmFa1MAAAAC/star-wars-luke-skywalker.gif", "https://media.tenor.com/wNccfy-f8HgAAAAC/princess-leia-good-bye.gif", "https://media.tenor.com/uGnRAZj7gyQAAAAC/anakin-dark-vador.gif", "https://media.tenor.com/LFj2prZDXooAAAAC/david-vader.gif", "https://media.tenor.com/kRYZCtb8R1MAAAAC/sw-starwars.gif", "https://media.tenor.com/CjGyb4da3DgAAAAd/vader-unmasked.gif", "https://media.tenor.com/X-OJ8LRAbGYAAAAC/no-darth-vader.gif", "https://media.tenor.com/1837VZy1LQYAAAAC/kylo-ren-star-wars.gif", "https://media.tenor.com/HsOm1DzDk9cAAAAM/kylo-ren-stab.gif"]
        let image = imagesLink[Math.floor(Math.random() * imagesLink.length)]

        let Embed = new Discord.EmbedBuilder()
            .setColor("#e23922")
            .setDescription("Que la Force soit avec toi, " + member.toString() + " ! Nous sommes tristes de te voir partir, mais nous te remercions pour tout ce que tu as apporté à notre communauté Star Wars.\n\n↬ N'hésite pas à revenir nous voir si tu as l'envie ou le besoin de discuter à nouveau avec des passionnés de l'univers. Nous te souhaitons le meilleur !\n\n**Nous sommes maintenant " + member.guild.memberCount + " membres dans ce vaisseau !** 🚀")
            .setThumbnail(member.guild.iconURL({ format: "png" }))
            .setImage(image)
            .setTimestamp()

        member.guild.channels.cache.get('1092100810999087166').send({ embeds: [Embed] });
    }
}