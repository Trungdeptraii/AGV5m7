const { format } = require("date-fns");
const Log = require(`${__dirname}/../models/log.model.js`)

const filter = {date: `${format(new Date(), 'dd-MM-yyyy') }`};
const selectz = {
    date: 1,
    arrLogTotal: 1,
    arrLogSuccee: 1,
    arrLogFail: 1,
    arrLogPending: 1,
    _id: 0
};

const itemlog = ({timeStart=undefined, timeEnd=undefined, totalTime='chờ', path=[], status='đang xử lý'})=>{
    return{
        timeStart: timeStart ? timeStart : null,
        timeEnd: timeEnd ? timeEnd : null,
        path,
        status,
        totalTime
    }
}
const find = async()=>{
    try {
        const result = await Log.find(filter).select(selectz);
        return result;
    } catch (error) {
        console.log('[FindOne ERROR]: ', error)
    }
}
const update =  async(data)=>{
    const options = {
        new: true,
        upsert: true, // chưa có thì sẽ insert, có rồi thì sẽ update
      };
    try {
        await Log.findOneAndUpdate(filter, data)
    } catch (error) {
        console.log('[Update ERROR]: ', error)
    }
}
const time =  (start, end)=>{
    let timeEnd = start.split(':');
    let timeStart = end.split(':');
    let [minute, second] =  [timeEnd[1]-timeStart[1], timeEnd[2]-timeStart[2]];
    if(timeEnd[1]>=timeStart[1] && timeEnd[2]<timeStart[2]){
        return `${minute*60 + timeEnd[2] - timeStart[2]}`
    }else{
        return `${minute}:${second}`
    }
}
module.exports = {
    itemlog,
    find,
    update,
    time
}
'10: 30'
'11:40'