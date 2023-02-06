import { Sequelize } from "sequelize";
export function Channel(sequelize: Sequelize, Sequelize: any) {
  const Channel = sequelize.define("channels", {
    channelId: {
      type: Sequelize.STRING(45),
      primaryKey: true,
      allowNull: false,
    },
    type: {
      type: Sequelize.INTEGER(2),
      allowNull: false,
    },
  });
  return Channel;
}
