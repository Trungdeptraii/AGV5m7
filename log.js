const mongoose = require('mongoose');
const url = 'mongodb://0.0.0.0:27017'
const connect = async()=>{
    const result = await mongoose.connect(url, {
        dbName: 'crud'
    })
    console.log('result', result)
}
connect()
