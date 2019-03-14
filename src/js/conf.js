module.exports = {
    host: process.env.NODE_ENV === 'production' ?'120.79.204.25':'localhost',
    port: process.env.NODE_ENV === 'production'?'8080':'3000',
    apiHost: process.env.NODE_ENV === 'production' ?'120.79.204.25':'localhost',
    apiPort: process.env.NODE_ENV === 'production' ? '3000' : '3030'
}