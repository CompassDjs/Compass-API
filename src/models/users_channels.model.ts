import { Sequelize } from "sequelize";
export function UsersChannels(sequelize: Sequelize, Sequelize: any) {
  const Users_Channels = sequelize.define("users_channels", {
    voiceTime: {
      type: Sequelize.INTEGER(20),
      allowNull: false,
      defaultValue: 0,
    },
  });
  return Users_Channels;
}
