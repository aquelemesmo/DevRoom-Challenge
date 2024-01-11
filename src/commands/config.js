const { ApplicationCommandType, ApplicationCommandOptionType, EmbedBuilder, PermissionsBitField, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
    name: "config",
    type: ApplicationCommandType.ChatInput,
    description: "[ ADMIN ] Configure the ticket system",
    options: [
        {
            name: "ticket",
            type: ApplicationCommandOptionType.Subcommand,
            description: "Configure the ticket system",
        }
    ],
    run: async (bot, interaction) => {
        if(interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            const row = new ActionRowBuilder()
            .addComponents(new ButtonBuilder().setCustomId("id-category").setLabel("ID category").setStyle(ButtonStyle.Primary))
            .addComponents(new ButtonBuilder().setCustomId("id-channel-logs").setLabel("ID logs ticket channel").setStyle(ButtonStyle.Primary))
            .addComponents(new ButtonBuilder().setCustomId("role-support").setLabel("Support access").setStyle(ButtonStyle.Success))
            .addComponents(new ButtonBuilder().setCustomId("channel-ticket").setLabel("Set channel for ticket embed").setStyle(ButtonStyle.Success))

            const row2 = new ActionRowBuilder()
            .addComponents(new ButtonBuilder().setCustomId("embed-constructor").setLabel("Create a embed").setStyle(ButtonStyle.Secondary))
            .addComponents(new ButtonBuilder().setCustomId("embed-in-ticket-constructor").setLabel("Create a embed in ticket").setStyle(ButtonStyle.Primary))
        
            const embedHome = new EmbedBuilder()
            .setTitle("Ticket configuration")
            .setDescription("Configure the ticket system")
            .setColor("Blue")
            interaction.reply({embeds: [embedHome], components: [row, row2], ephemeral: true})
        } else {
            return interaction.reply({content: "You dont have permission to use this command! Baka", ephemeral: true})
        }
    }
}