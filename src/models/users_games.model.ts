import { Sequelize } from "sequelize";
export function UsersGames(sequelize: Sequelize, Sequelize: any) {
  const Users_Games = sequelize.define("users_games", {
    gameTime: {
      type: Sequelize.INTEGER(20),
      allowNull: false,
      defaultValue: 0,
    },
    firstPlayed: {
      type: Sequelize.INTEGER(20),
      allowNull: false,
    },
  });
  return Users_Games;
}
