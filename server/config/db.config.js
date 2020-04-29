module.exports = {
  HOST: 'localhost',
  USER: 'trickappadmin',
  PASSWORD: 'Tr!cK@@P@Dm!N',
  DB: 'trickdb',
  dialect: "postgres",
  pool: { // pool is optional, it will be used for Sequelize connection pool configuration
    max: 5, // maximum number of connection in pool
    min: 0, // minimum number of connection in pool
    acquire: 30000, // maximum time, in milliseconds, that pool will try to get connection before throwing error
    idle: 10000  // maximum time, in milliseconds, that a connection can be idle before being released
  }
};
