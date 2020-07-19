module.exports = {
  dialect: 'postgres',
  host: 'localhost',
  username: 'postgres',
  password: 'docker',
  database: 'gobarber09',
  define: {
    timestamps: true,
    undescored: true,
    undescoredAll: true,
  },
};
