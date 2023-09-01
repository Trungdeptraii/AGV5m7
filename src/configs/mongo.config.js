'use strict'

const dev = {
    app : {
        port: process.env.DEV_PORT || 7700,
        host: process.env.DEV_HOST || 'localhost'
    },
    dbs: {
        url: process.env.DEV_DBURL || 'mongodb://127.0.0.1:27017',
        options : {
            dbName: process.env.DEV_DBNAME || 'AGV_5m7',
        }
    }
}

const pro = {
    app : {
        port: process.env.PRO_PORT || 7700,
        host: process.env.PRO_HOST  || 'localhost'
    },
    dbs: {
        url: process.env.PRO_DBURL || 'mongodb+srv://Trungdeptrai:Trung1998@cluster0.cexh5cn.mongodb.net/?retryWrites=true&w=majority',
        options : {
            dbName: process.env.PRO_DBNAME || 'Tips_javascript',
            user: process.env.PRO_USERNAME || 'Trungdeptrai',
            pass: process.env.PRO_PASS || 'Trung1998'
        }
    }
}

const configs = {
    dev, pro
}
const cf = process.env.NODE_ENV || 'dev';

module.exports  = configs[cf]