import { Sequelize } from "sequelize";
export function UsersGuilds(sequelize: Sequelize, Sequelize: any) {
  const Users_Guilds = sequelize.define("users_guilds", {
    isOwner: {
      type: Sequelize.BOOLEAN,
      allowNull: true,
    },
  });

  return Users_Guilds;
}
