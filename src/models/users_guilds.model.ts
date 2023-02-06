import { Sequelize } from "sequelize";
export function UsersGuilds(sequelize: Sequelize, Sequelize: any) {
  const Users_Guilds = sequelize.define("users_guilds", {});
  return Users_Guilds;
}
