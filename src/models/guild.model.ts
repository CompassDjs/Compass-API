import { Sequelize } from "sequelize";
export function Guild(sequelize: Sequelize, Sequelize: any) {
  const Guild = sequelize.define("guilds", {
    id: {
      type: Sequelize.STRING(45),
      primaryKey: true,
      allowNull: false,
    },
    guildCreatedAt: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    name: {
      type: Sequelize.STRING(100),
      allowNull: true,
    },
    icon: {
      type: Sequelize.STRING(100),
      allowNull: true,
    },
  });
  return Guild;
}
