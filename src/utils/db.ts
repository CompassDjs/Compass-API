import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();
const { DB_NAME, DB_HOST, DB_PORT, DB_USER, DB_PASS } = process.env;

const sequelize = new Sequelize(DB_NAME!, DB_USER!, DB_PASS!, {
  host: DB_HOST,
  port: DB_PORT as unknown as number,
  dialect: "mysql",
  logging: false,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

if (!sequelize.authenticate()) {
  console.log("❌ Failed to connect to MySQL");
} else {
  console.log("🐬 Connected to MySQL");
}

const db: any = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

import { User } from "@models/user.model";
import { Guild } from "@models/guild.model";
import { Game } from "@models/game.model";
import { Channel } from "@models/channel.model";
import { Message } from "@models/message.model";
import { UsersGuilds } from "@models/users_guilds.model";
import { UsersGames } from "@models/users_games.model";
import { UsersChannels } from "@models/users_channels.model";
import { UsersMessages } from "@models/users_messages";

db.users = User(sequelize, Sequelize);
db.guilds = Guild(sequelize, Sequelize);
db.games = Game(sequelize, Sequelize);
db.channels = Channel(sequelize, Sequelize);
db.messages = Message(sequelize, Sequelize);
db.users_guilds = UsersGuilds(sequelize, Sequelize);
db.users_games = UsersGames(sequelize, Sequelize);
db.users_channels = UsersChannels(sequelize, Sequelize);
db.users_messages = UsersMessages(sequelize, Sequelize);

db.users.belongsToMany(db.guilds, {
  through: db.users_guilds,
});
db.users.belongsToMany(db.games, {
  through: db.users_games,
});
db.users.belongsToMany(db.channels, {
  through: db.users_channels,
});
db.users.belongsToMany(db.messages, {
  through: db.users_messages,
});

db.guilds.belongsToMany(db.users, {
  through: db.users_guilds,
});
db.guilds.hasMany(db.channels, {});

db.games.belongsToMany(db.users, {
  through: db.users_games,
});

db.channels.hasMany(db.messages, {});
db.channels.belongsTo(db.guilds, {});
db.channels.belongsToMany(db.users, {
  through: db.users_channels,
});

db.messages.belongsToMany(db.users, {
  through: db.users_messages,
});
db.messages.belongsTo(db.channels, {});

export default db;
