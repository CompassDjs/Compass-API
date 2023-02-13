import { Sequelize } from "sequelize";

export function User(sequelize: Sequelize, Sequelize: any) {
  const User = sequelize.define("users", {
    userId: {
      type: Sequelize.STRING(45),
      primaryKey: true,
      allowNull: false,
    },
    accessToken: {
      type: Sequelize.STRING(100),
      allowNull: true,
    },
    refreshToken: {
      type: Sequelize.STRING(100),
      allowNull: true,
    },
    username: {
      type: Sequelize.STRING(45),
      allowNull: true,
    },
    avatarUrl: {
      type: Sequelize.STRING(100),
      allowNull: true,
    },
    bannerUrl: {
      type: Sequelize.STRING(100),
      allowNull: true,
    },
    nitro: {
      type: Sequelize.INTEGER(2), //https://discord.com/developers/docs/resources/user#user-object-premium-types
      allowNull: true,
    },
    badges: {
      type: Sequelize.STRING(500),
      allowNull: true,
    },
    locale: {
      type: Sequelize.STRING(10),
      allowNull: true,
    },
  });
  return User;
}
