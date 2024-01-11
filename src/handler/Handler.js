const fs = require("fs")

module.exports = async (bot) => {

const SlashsArray = []

fs.readdir(`./src/commands`, (err, files) => {
    if(err) console.error(err)
        files.forEach(files => {
            if(!files?.endsWith('.js')) return;
            files = require(`../commands/${files}`);
            if(!files?.name) return;
            bot.slashCommands.set(files?.name, files);
   
            SlashsArray.push(files)
            });
        });

    bot.on("ready", async () => {
        bot.guilds.cache.forEach(guild => guild.commands.set(SlashsArray))
    });
};