function getConnectionString(cfg) {
    var connectionString = '';
    connectionString += (cfg.protocol ? cfg.protocol : 'mongodb') + '://';
    connectionString += (cfg.username && cfg.password) ?
        cfg.username + ':' + cfg.password + '@' : '';
    connectionString += cfg.host || 'localhost';
    connectionString += cfg.port ? ':' + cfg.port : '';
    connectionString += cfg.db ? '/' + cfg.db : '';
    return connectionString;
}

var config = {
    protocol: 'mongodb',
    username: '',
    password: '',
    host: '',
    port: '',
    db: 'imgges'
};

var dbURI = getConnectionString(config);

exports.dbURI = dbURI;
