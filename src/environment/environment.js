const config = {
    dbName: process.env.DB_NAME,
    dbUrl: process.env.DB_URL,
    cloudDBUrl : process.env.CLOUD_DB_URL,
    port: process.env.PORT || 3000,
    privateKey: process.env.PRIVATE_KEY,
    senGridApiKey: process.env.SEND_GRID_API_KEY
}
module.exports = config;