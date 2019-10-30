const { RichEmbed } = require("discord.js");
const db = require('../../schemas/db.js');

module.exports = {
    name: "getmembers",
    aliases: ["members", "listmembers"],
    category: "moderation",
    description: "Add permitted role for mod commands",
    permissions: "moderator",
    usage: "<role name|@role>",
    run: (client, message, args) => {
        let guildID = message.guild.id;
        let output = new RichEmbed()
            .setColor("#0efefe")
        if (message.deletable) message.delete();

        db.findOne({
            guildID: guildID,
        }, (err, exists) => {
            if (err) console.log(err)
            if (!exists) return message.reply("Error within database").then(m => m.delete(7500))
            else {
                let memberRoles = exists.memberRoles.map(role => " Name: " + role.roleName + "  ID: " + role.roleID)
                if (memberRoles.length > 0) {
                    output.addField("Member Roles", memberRoles)
                    return message.channel.send(output).then(m => m.delete(7500))
                } else return message.reply("You have no bot members set.").then(m => m.delete(7500))
            }
        }).catch(err => console.log(err))
    }
}