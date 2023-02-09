import { Sequelize } from "sequelize";
export function Message(sequelize: Sequelize, Sequelize: any) {
  const Message = sequelize.define("messages", {
    messageId: {
      type: Sequelize.STRING(20),
      primaryKey: true,
      allowNull: false,
    },
  });
  return Message;
}
