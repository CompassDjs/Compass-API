import { Sequelize } from "sequelize";
export function Message(sequelize: Sequelize, Sequelize: any) {
  const Message = sequelize.define("messages", {
    messageId: {
      type: Sequelize.INTEGER(20),
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    createdAt: {
      type: Sequelize.INTEGER(20),
      allowNull: false,
    },
  });
  return Message;
}
