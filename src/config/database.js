module.exports = {
    dialect: 'postgres',
    host: 'localhost',
    username: 'postgres',
    password: 'docker',
    database: 'mdemulher',
    define: {
        timestamps: true,
        underscored: true,
        undesrscoredAll: true,
    },
};
