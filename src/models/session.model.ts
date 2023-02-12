import { Sequelize } from "sequelize";

export function Session(sequelize: Sequelize, Sequelize: any) {
  const Session = sequelize.define("sessions", {
    sid: {
      type: Sequelize.STRING(45),
      primaryKey: true,
    },
    userId: {
      type: Sequelize.STRING(45),
      allowNull: false,
    },
    expires: {
      type: Sequelize.DATE,
    },
    data: {
      type: Sequelize.TEXT,
    },
  });
  return Session;
}
