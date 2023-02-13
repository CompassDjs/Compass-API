import { Sequelize } from "sequelize";
export function Guild(sequelize: Sequelize, Sequelize: any) {
  const Guild = sequelize.define("guilds", {
    guildId: {
      type: Sequelize.STRING(45),
      primaryKey: true,
      allowNull: false,
    },
    guildCreatedAt: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    guildName: {
      type: Sequelize.STRING(100),
      allowNull: true,
    },
    iconUrl: {
      type: Sequelize.STRING(100),
      allowNull: true,
    },
  });
  return Guild;
}
