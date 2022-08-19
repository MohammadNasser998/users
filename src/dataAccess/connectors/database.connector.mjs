import Sequelize from 'sequelize';

export const DatabaseConnector = new Sequelize(AppConfigs.connections.RDS);
