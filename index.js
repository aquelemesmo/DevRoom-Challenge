require("dotenv").config()
const { Client, Collection, GatewayIntentBits, Partials } = require("discord.js");
const bot = new Client({intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildIntegrations, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildMembers, GatewayIntentBits.DirectMessages, GatewayIntentBits.DirectMessageTyping, GatewayIntentBits.DirectMessageReactions]});
const fs = require("fs")
const { Sequelize } = require('sequelize');
const chalk = require("chalk")
bot.slashCommands = new Collection()

require("./src/database/TicketSetup.js")
require("./src/handler/Handler.js")(bot)

fs.readdir("./src/events", (err, files) => {
    if(err) console.error(err)
    files.forEach(f => {
        let event = require(`./src/events/${f}`)
        let eventName = f.split(".")[0]
        bot.on(eventName, event.bind(null, bot))
    })    
})

bot.login(process.env.TOKEN)