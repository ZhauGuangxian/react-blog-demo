module.exports ={
    mysql:{
        host: process.env.NODE_ENV === 'production' ? 'yourhost' : 'localhost',
        user: process.env.NODE_ENV === 'production'?'admin':'root',
        password: process.env.NODE_ENV === 'production'?'yourpwd':'gTVGodo74iI9WvhC',
        database: 'test', // 前面建的user表位于这个数据库中
        port: 3306,
        multipleStatements:true
    }
}