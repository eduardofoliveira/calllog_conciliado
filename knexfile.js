// Update with your config settings.

module.exports = {
  development: {
    client: 'oracledb',
    connection: {
      user          : process.env.CLOUD_USER,
      password      : process.env.CLOUD_PASS,
      connectString : process.env.CLOUD_CONNECT_STRING,
    },
    pool: {
      min: 0,
      max: 2
    },
  }
};
