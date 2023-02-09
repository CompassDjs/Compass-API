import { Sequelize } from "sequelize";
export function Game(sequelize: Sequelize, Sequelize: any) {
  const Game = sequelize.define("games", {
    gameName: {
      type: Sequelize.STRING(200),
      primaryKey: true,
      allowNull: false,
    },
    igdbId: {
      type: Sequelize.STRING(100),
      allowNull: true,
    },
    igdbCoverId: {
      type: Sequelize.STRING(45),
      allowNull: true,
    },
  });
  return Game;
}
