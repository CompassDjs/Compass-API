import { Sequelize } from "sequelize";
export function UsersMessages(sequelize: Sequelize, Sequelize: any) {
  const Users_Messages = sequelize.define("users_messages", {});
  return Users_Messages;
}
