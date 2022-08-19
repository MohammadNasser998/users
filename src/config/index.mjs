export default {
  port: +process.env.SERVER_PORT || 3000,
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
  },
  security: {
    password: {
      saltRounds: +process.env.PASSWORD_SALT_ROUNDS || 10,
    },
    token: {
      expiry: process.env.ACCESS_TOKEN_EXPIRY,
      secret: process.env.ACCESS_TOKEN_SECRET,
    },
  },
  connections: {
    RDS: {
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      port: +process.env.DB_PORT,
      database: process.env.DB_DATABASE,
      host: process.env.DB_HOST,
      dialect: 'postgres',
      pool: {
        max: 20,
      },
      logging: console.log,
    },
  },
};
