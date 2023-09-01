'use strict'

const mongoose = require('mongoose');
const {dbs : {url, options}} = require(`${__dirname}/../configs/mongo.config.js`)


class DataBase{
	static async connect(){
		if(this.type === 'mongodb'){
			if(process.env.NODE_ENV === 'dev'){
				mongoose.set('debug', true);
				mongoose.set('debug', {
					color: true
				})
			}
            const Status = {
                0: 'disconnect',
                1: 'connected',
                2: 'connecting',
                3: 'disconnecting',
                99: 'uninitialized'
            }
			try {
                const mongoDB = await mongoose.connect(url, options);
                if(Status[`${mongoDB.connection.readyState}`] == 'connected'){
                    console.log(`Connect to db ${mongoDB.connection.db.databaseName} succee`)
                    return mongoDB
                }
            } catch (error) {
                console.log(`[ERROR]: Mongoose connect`, error)
            }
			
		}
	}
	static async getInstance(type){
		this.type = type;
		if(!this.Instance){
			this.Instance = await this.connect();
			return this.Instance;
		}
		return null;
	}

}

let mongoDB = DataBase.getInstance('mongodb');

module.exports = mongoDB;