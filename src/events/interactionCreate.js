const { InteractionType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, PermissionsBitField, ActionRow, SelectMenuBuilder, StringSelectMenuBuilder, ChannelSelectMenuBuilder, ComponentType, RoleSelectMenuBuilder } = require("discord.js")
const TicketSetup = require("../database/TicketSetup")
const discordTranscripts = require("discord-html-transcripts")
const chalk = require("chalk")

module.exports = async (bot, interaction) => {
    if(interaction.type === InteractionType.ApplicationCommand) {
        const cmd = bot.slashCommands.get(interaction.commandName)
        if(!cmd) return interaction.reply({content: "An error has occurred", ephemeral: true})
        interaction["member"] = interaction.guild.members.cache.get(interaction.user.id)
        if(cmd) cmd.run(bot, interaction)
    }

    const closeTicketRow = new ActionRowBuilder()
    .addComponents(new ButtonBuilder().setCustomId("close-ticket").setLabel("Close ticket").setStyle(ButtonStyle.Danger))

    /*

    Ticket configuration (/config ticket)

    */

    if(interaction.isButton()) {
        /*
       
        Ticket configuration

        */
       
        if(interaction.customId === "id-category") {
            const channelmenu = new ChannelSelectMenuBuilder()
                .setCustomId("id-category-selectmenu")
                .setPlaceholder("Choose a category for tickets")
                .setChannelTypes(ChannelType.GuildCategory)
                .setMaxValues(1)

            const row = new ActionRowBuilder()
            .addComponents(channelmenu)

            const embed = new EmbedBuilder()
            .setColor("Blue")
            .setDescription("Select the ID of the category")
            const e = await interaction.reply({embeds: [embed], ephemeral: true, components: [row], fetchReply: true})

            const collector = e.createMessageComponentCollector({filter: (i) => i.user.id === interaction.user.id})

            collector.on("collect", async r => {
                const embed = new EmbedBuilder()
                .setColor("Blue")
                .setDescription("The ID of the category has been configured")
                interaction.editReply({embeds: [embed], ephemeral: true, components: []})
    
                await TicketSetup.update({
                    category: r.values[0]
                }, {where: {guild: interaction.guild.id}})
            })
        }

        if(interaction.customId === "id-channel-logs") {
            const channelmenu = new ChannelSelectMenuBuilder({
                custom_id: 'id-channel-logs-selectmenu',
                placeholder: 'Choose a channel to logs tickets',
            })
            .addChannelTypes(ChannelType.GuildText)
            .setMaxValues(1)

            const row = new ActionRowBuilder()
            .addComponents(channelmenu)

            const embed = new EmbedBuilder()
            .setColor("Blue")
            .setDescription("Select the ID of the category")
            const e = await interaction.reply({embeds: [embed], ephemeral: true, components: [row], fetchReply: true})

            const collector = e.createMessageComponentCollector({filter: (i) => i.user.id === interaction.user.id})

            collector.on("collect", async r => {
                const embed = new EmbedBuilder()
                .setColor("Blue")
                .setDescription("The ID of the ticket logs has been configured")
                interaction.editReply({embeds: [embed], ephemeral: true, components: []})
    
                await TicketSetup.update({
                    ticket_logs: r.values[0]
                }, {where: {guild: interaction.guild.id}})
            })
        }

        if(interaction.customId === "role-support") {
            const rolemenu = new RoleSelectMenuBuilder({
                custom_id: 'id-role-support-selectmenu',
                placeholder: 'Choose a role to access a tickets',
            })
            .setMaxValues(1)

            const row = new ActionRowBuilder()
            .addComponents(rolemenu)

            const embed = new EmbedBuilder()
            .setColor("Blue")
            .setDescription("Select the role to access a tickets")
            const e = await interaction.reply({embeds: [embed], ephemeral: true, components: [row], fetchReply: true})

            const collector = e.createMessageComponentCollector({filter: (i) => i.user.id === interaction.user.id})

            collector.on("collect", async r => {
                const embed = new EmbedBuilder()
                .setColor("Blue")
                .setDescription("The ID of the role support has been configured")
                interaction.editReply({embeds: [embed], ephemeral: true, components: []})
    
                await TicketSetup.update({
                    role_support: r.values[0]
                }, {where: {guild: interaction.guild.id}})
            })
        }

        if(interaction.customId === "channel-ticket") {
            const channelmenu = new ChannelSelectMenuBuilder({
                custom_id: 'id-channel-ticket-selectmenu',
                placeholder: 'Choose a channel to send a embed ticket',
            })
            .addChannelTypes(ChannelType.GuildText)
            .setMaxValues(1)

            const row = new ActionRowBuilder()
            .addComponents(channelmenu)

            const embed = new EmbedBuilder()
            .setColor("Blue")
            .setDescription("Select the channel for a embed ticket")
            const e = await interaction.reply({embeds: [embed], ephemeral: true, components: [row], fetchReply: true})

            const collector = e.createMessageComponentCollector({filter: (i) => i.user.id === interaction.user.id})

            collector.on("collect", async r => {
                const embed = new EmbedBuilder()
                .setColor("Blue")
                .setDescription("The ID of the channel ticket has been configured")
                interaction.editReply({embeds: [embed], ephemeral: true, components: []})
    
                await TicketSetup.update({
                    channelTicket: r.values[0]
                }, {where: {guild: interaction.guild.id}})
            })
        }

        if(interaction.customId === "embed-constructor") {
            let questions = [
                "Send the title for embed ticket",
                "Send the description for embed ticket",
                "Choose the color for embed ticket\n\nColors available: \`\`Default, Aqua, DarkAqua, Green, DarkGreen, Blue, DarkBlue, Purple, DarkPurple, LuminousVividPink, DarkVividPink, Gold, DarkGold, Orange, DarkOrange, Red, DarkRed, Grey, DarkGrey, LightGrey, Navy, DarkNavy, Yellow, Greyple, Black, DarkButNotBlack, NotQuiteBlack, Blurple and Fuchsia\`\`",
            ]

            let response = []

            const collector = interaction.channel.createMessageCollector({filter: (m) => m.author.id === interaction.user.id, max: questions.length})

            const embed = new EmbedBuilder()
            .setColor("Blue")
            .setDescription(questions[0])
            interaction.reply({embeds: [embed], ephemeral: true})

            collector.on("collect", async r => {
                response.push(r.content)
                if(response.length === questions.length || !questions[response.length]) return collector.stop()
            
                r.delete()

                const embed = new EmbedBuilder()
                .setColor("Blue")
                .setDescription(questions[response.length])
                interaction.editReply({embeds: [embed], ephemeral: true})
            })

            collector.on("end", async r => {
                const embed = new EmbedBuilder()    
                .setColor("Blue")
                .setDescription("The embed has been configured!")
                interaction.editReply({embeds: [embed], ephemeral: true})

                await TicketSetup.update({
                    embed_title: response[0],
                    embed_description: response[1],
                    embed_color: response[2],
                }, {where: {guild: interaction.guild.id}})
            })
        }

        if(interaction.customId === "embed-in-ticket-constructor") {
            let questions = [
                "Send the title for embed ticket",
                "Send the description for embed ticket",
                "Choose the color for embed ticket\n\nColors available: \`\`Default, Aqua, DarkAqua, Green, DarkGreen, Blue, DarkBlue, Purple, DarkPurple, LuminousVividPink, DarkVividPink, Gold, DarkGold, Orange, DarkOrange, Red, DarkRed, Grey, DarkGrey, LightGrey, Navy, DarkNavy, Yellow, Greyple, Black, DarkButNotBlack, NotQuiteBlack, Blurple and Fuchsia\`\`",
            ]

            let response = []

            const collector = interaction.channel.createMessageCollector({filter: (m) => m.author.id === interaction.user.id, max: questions.length})

            const embed = new EmbedBuilder()
            .setColor("Blue")
            .setDescription(questions[0])
            interaction.reply({embeds: [embed], ephemeral: true})

            collector.on("collect", async r => {
                response.push(r.content)
                if(response.length === questions.length || !questions[response.length]) return collector.stop()
            
                r.delete()

                const embed = new EmbedBuilder()
                .setColor("Blue")
                .setDescription(questions[response.length])
                interaction.editReply({embeds: [embed], ephemeral: true})
            })

            collector.on("end", async r => {
                const embed = new EmbedBuilder()    
                .setColor("Blue")
                .setDescription("The embed has been configured!")
                interaction.editReply({embeds: [embed], ephemeral: true})

                await TicketSetup.update({
                    embed_in_ticket_title: response[0],
                    embed_in_ticket_description: response[1],
                    embed_in_ticket_color: response[2],
                }, {where: {guild: interaction.guild.id}})
            })
        }

        /*

        Open ticket

        */

        if(interaction.customId === "open-ticket") {
            interaction.reply({content: "The ticket has been opened!", ephemeral: true})

            let ticketIn = await TicketSetup.findOne({where: {guild: interaction.guild.id}})

            const canal = await interaction.guild.channels.create({
                name: `ticket-${interaction.user.username}`,
                parent: ticketIn.category,
                type: ChannelType.GuildText,
                permissionsOverwrite: [
                    {
                        name: interaction.guild.id,
                        deny: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages]
                    },
                    {
                        name: interaction.user.id,
                        allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages]
                    },
                    {
                        name: `${TicketSetup.role_support}`,
                        deny: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages]
                    }
                ]
            })

            const embed = new EmbedBuilder()
            .setColor(ticketIn.embed_in_ticket_color)
            .setTitle(ticketIn.embed_in_ticket_title)
            .setDescription(ticketIn.embed_in_ticket_description)
            .setFooter({text: `${interaction.user.id}`, iconURL: `${interaction.user.displayAvatarURL()}`})
            .setTimestamp()
            canal.send({embeds: [embed], components: [closeTicketRow]})
        }

        /*
       
        Close ticket
       
        */
       
        if(interaction.customId === "close-ticket") {
            let channelTicketLogs = await TicketSetup.findOne({where: {guild: interaction.guild.id}})

            if(!channelTicketLogs) {
                console.error(chalk.red("[ERROR] ") + "The ticket configuration has not been done yet")
                return;
            }

            const row = ActionRowBuilder.from(interaction.message.components[0])
            row.components[0].setDisabled(true)

            interaction.message.edit({components: [row]})

            const embed = new EmbedBuilder()
            .setColor("Blue")
            .setDescription("The ticket has been closed in 5 seconds")
            interaction.reply({embeds: [embed]})

            setTimeout(async () => {
                const attachment = await discordTranscripts.createTranscript(interaction.channel, {
                    limit: -1,
                    returnType: 'attachment',
                    filename: 'transcript.html',
                    saveImages: false,
                    poweredBy: false,
                    ssr: true
                });
    
                const embed = new EmbedBuilder()
                .setColor("Blue")
                .setTitle("Ticket - " + interaction.channel.name)
                .addFields([
                    {name: "Ticket closed by", value: interaction.user.tag},
                    {name: "Ticket logs", value: interaction.channel.id}
                ])
                try {
                    bot.channels.cache.get(channelTicketLogs.ticket_logs).send({embeds: [embed], files: [attachment]})
                } catch(err) {
                    interaction.editReply({content: "The ticket logs channel has not been configured yet\n\nPlease use /config ticket and press \`ID logs ticket channel\` button", ephemeral: true})                   
                }
                interaction.channel.delete()
            }, 5000);
        }
    }
}