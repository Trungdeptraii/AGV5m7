const mongose = require('mongoose');

const schemaLog = mongose.Schema({
    date : String,
    arrLogTotal: {
        type: Array,
        default: []
    },
    arrLogSuccee: {
        type: Array,
        default: []
    },
    arrLogFail: {
        type: Array,
        default: []
    },
    arrLogPending: {
        type: Array,
        default: []
    },
},{
    timestamps: true
})

const log = mongose.model('log', schemaLog);
module.exports = log