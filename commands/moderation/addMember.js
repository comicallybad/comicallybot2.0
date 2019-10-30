const db = require('../../schemas/db.js');

module.exports = {
    name: "addmember",
    aliases: ["amember", "memberadd"],
    category: "moderation",
    description: "Add permitted role/user for member commands",
    permissions: "moderator",
    usage: "<role name|@role|userID|@user>",
    run: (client, message, args) => {
        let guildID = message.guild.id;
        if (message.deletable) message.delete();

        if (!args[0])
            return message.reply("Please provide a user/role.").then(m => m.delete(7500));

        let roleNames = message.guild.roles.map(role => role.name.toLowerCase());
        let roleIDs = message.guild.roles.map(role => role.id);
        let userNames = message.guild.members.map(role => role.user.username.toLowerCase());
        let userIDs = message.guild.members.map(role => role.user.id);

        let channelMention = args[0].slice(3, args[0].length - 1);
        let userMention = args[0].slice(2, args[0].length - 1)

        if (!roleIDs.includes(channelMention) && !roleIDs.includes(args[0])
            && !userIDs.includes(userMention) && !userIDs.includes(args[0]))
            return message.reply("user/role not found").then(m => m.delete(7500));

        if (roleIDs.includes(channelMention))
            addMember(roleNames[roleIDs.indexOf(channelMention)], channelMention);

        if (roleIDs.includes(args[0]))
            addMember(roleNames[roleIDs.indexOf(args[0])], args[0])

        if (userIDs.includes(args[0]))
            addMember(userNames[userIDs.indexOf(args[0])], args[0])

        if (userIDs.includes(userMention))
            addMember(userNames[userIDs.indexOf(userMention)], userMention)

        function addMember(roleName, roleID) {
            db.findOne({
                guildID: guildID,
                memberRoles: { $elemMatch: { roleName: roleName, roleID: roleID } }
            }, (err, exists) => {
                if (err) console.log(err)
                if (!exists) {
                    db.updateOne({ guildID: guildID }, {
                        $push: { memberRoles: { roleName: roleName, roleID: roleID } }
                    }).then(function () {
                        return message.reply("Adding member... this may take a second...").then(m => m.delete(7500));
                    }).catch(err => console.log(err))
                } else return message.reply("user/role already added.").then(m => m.delete(7500));
            }).catch(err => console.log(err))
        }
    }
}