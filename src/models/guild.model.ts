import { Sequelize } from "sequelize";
export function Guild(sequelize: Sequelize, Sequelize: any) {
  const Guild = sequelize.define("guilds", {
    guildId: {
      type: Sequelize.STRING(45),
      primaryKey: true,
      allowNull: false,
    },
    guildCreatedAt: {
      type: Sequelize.INTEGER(20),
      allowNull: false,
    },
  });
  return Guild;
}
