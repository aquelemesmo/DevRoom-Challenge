const { ApplicationCommandType, ApplicationCommandOptionType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const TicketSetup = require("../database/TicketSetup.js");
const chalk = require("chalk")

module.exports = {
    name: "ticket",
    type: ApplicationCommandType.ChatInput,
    description: "[ ADMIN ] Create a ticket and add a member in a ticket channel",
    options: [
        {
            name: "setup",
            type: ApplicationCommandOptionType.Subcommand,
            description: "Setup a ticket channel",
        },
        {
            name: "member",
            type: ApplicationCommandOptionType.Subcommand,
            description: "Add or remove a member in a ticket channel",
            options: [
                {
                    name: "member",
                    type: ApplicationCommandOptionType.User,
                    description: "You can add or remove a member in a ticket channel",
                    required: true
                }
            ]
        }
    ],
    run: async (bot, interaction) => {
        const type = interaction.options.getSubcommand("type")
        const member = interaction.options.getMember("member")

        const rowButton = new ActionRowBuilder()
        .addComponents(new ButtonBuilder().setCustomId("open-ticket").setLabel("Open ticket").setStyle(ButtonStyle.Success))

        if(type === "setup") {
            const tableExists = await TicketSetup.sync()

            await TicketSetup.findOrCreate({
                where: {guild: interaction.guild.id},
                defaults: {
                    guild: interaction.guild.id,
                    channelTicket: "channel",
                    category: "category",
                    ticket_logs: "logs",
                    role_support: "support",
                    embed_title: "Support area",
                    embed_description: "Support area",
                    embed_color: "Blue",
                    embed_in_ticket_title: "Service area",
                    embed_in_ticket_description: "Thanks for opening a ticket, wait for a support to help you!",
                    embed_in_ticket_color: "Green"
                }
            })  

            if(tableExists) {
                const embedFind = await TicketSetup.findOne({where: {guild: interaction.guild.id}})
    
                const embed = new EmbedBuilder()
                .setColor(embedFind.embed_color)
                .setTitle(embedFind.embed_title)
                .setDescription(embedFind.embed_description)

                try {
                    bot.channels.cache.get(embedFind.channelTicket).send({embeds: [embed], components: [rowButton]})

                    interaction.reply({content: "The ticket channel is already set!", ephemeral: true})
                } catch(err) {
                    interaction.reply({content: "You must send the channel ID for the ticket embed to be sent!\n\nPlease use /config ticket and press \`Set channel for ticket embed\` button", ephemeral: true})
                }
            }   
        }
    }
}