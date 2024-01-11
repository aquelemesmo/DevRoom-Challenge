const { Sequelize, DataTypes } = require("sequelize");
const chalk = require("chalk")

const sequelize = new Sequelize({
    dialect: 'mysql',
    database: process.env.MYSQL_DATABASE,
    username: process.env.MYSQL_ROOT,
    password: process.env.MYSQL_PASSWORD,
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT ?? 3306
})

try { 
    sequelize.authenticate()
    console.log(chalk.green('[SUCCESS] ') + 'Connection has been established successfully.')
} catch (error) {
    console.error(chalk.red('[ERROR] ') + 'Unable to connect to the database:', error)
}

const TicketSetup = sequelize.define('ticket', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    guild: {
        type: DataTypes.STRING,
        allowNull: false
    },
    channelTicket: {
        type: DataTypes.STRING,
        allowNull: true
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false
    },
    ticket_logs: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role_support: {
        type: DataTypes.STRING,
        allowNull: false
    },
    embed_title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    embed_description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    embed_color: {
        type: DataTypes.STRING,
        allowNull: false
    },
    embed_in_ticket_title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    embed_in_ticket_description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    embed_in_ticket_color: {
        type: DataTypes.STRING,
        allowNull: false
    },
})

TicketSetup.sync()


module.exports = TicketSetup;