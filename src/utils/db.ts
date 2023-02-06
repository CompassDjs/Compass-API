import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();
const { DB_NAME, DB_HOST, DB_PORT, DB_USER, DB_PASS } = process.env;

const sequelize = new Sequelize(DB_NAME!, DB_USER!, DB_PASS!, {
  host: DB_HOST,
  port: DB_PORT as unknown as number,
  query: { raw: true },
  dialect: "mysql",
  logging: false,
  define: {
    timestamps: false,
  },
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

db.users = User(sequelize, Sequelize);
db.guilds = Guild(sequelize, Sequelize);
db.games = Game(sequelize, Sequelize);
db.channels = Channel(sequelize, Sequelize);
db.messages = Message(sequelize, Sequelize);
db.users_guilds = UsersGuilds(sequelize, Sequelize);
db.users_games = UsersGames(sequelize, Sequelize);
db.users_channels = UsersChannels(sequelize, Sequelize);

db.users.belongsToMany(db.guilds, {
  through: db.users_guilds,
  timestamps: false,
});
db.guilds.belongsToMany(db.users, {
  through: db.users_guilds,
  timestamps: false,
});

db.users.belongsToMany(db.games, {
  through: db.users_games,
});
db.games.belongsToMany(db.users, {
  through: db.users_games,
});

db.guilds.hasMany(db.channels, {});
db.channels.hasMany(db.messages, {});

db.users.belongsToMany(db.channels, {
  through: db.users_channels,
});
db.channels.belongsToMany(db.users, {
  through: db.users_channels,
});

export default db;
