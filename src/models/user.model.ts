import { Sequelize } from "sequelize";

export function User(sequelize: Sequelize, Sequelize: any) {
  const User = sequelize.define("users", {
    userId: {
      type: Sequelize.STRING(45),
      primaryKey: true,
      allowNull: false,
    },
  });
  return User;
}
