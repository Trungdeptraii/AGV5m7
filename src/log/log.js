const fs = require('fs/promises')
const path = require('path')
const fns = require('date-fns')

class Log{
    static createLog = async ()=>{
        let datetime = this.createDateTime()
        let data = {
            date_time: `${datetime.date} ${datetime.time}`,
            log_total: [],
            log_succee: [],
            log_fail: [],
            time_succee: [],
            time_fail: [],
            path: [],
            total: 0,
            succee: 0,
            fail: 0
        }
        try {
            let result = this.createDateTime()
            await fs.writeFile(`${__dirname}/${result.date}.txt`, JSON.stringify(data))

        } catch (error) {
            console.log('create file log Error', error)
        }
        
    
    }
    static createDateTime = ()=>{
        let date = new Date();
        let day, month, year, hourse, minute, second, odate, otime;
        day = date.getDate();
        month = date.getMonth();
        year = date.getFullYear();
        hourse = date.getHours();
        minute = date.getMinutes();
        second = date.getSeconds();
        odate = `${day}-${month}-${year}`;
        otime = `${hourse}:${minute}:${second}`
        return {date: odate, time: otime}
    }
    static start = async ()=>{
        try {
            const date_time = this.createDateTime()
            await fs.readFile(`${__dirname}/${date_time.date}.txt`);
        } catch (error) {
            this.createLog();
        } 
    }
    static write = async (type = 'start', data = {path, })=>{
        try {
            let log = {};
            const date_time = this.createDateTime()
            const data = await fs.readFile(`${__dirname}/${date_time.date}.txt`);
            const result = JSON.stringify(data);
            result.path[result.path.length] = path
            if(type == 'start'){
                log.date_time_start = `${date_time.date} ${date_time.time}`;
                result.log_total[result.log_log_total.length] = log
                result.total = result.log_total.length;
                result.fail[result.fail.length] = log;
                result.time_fail[result.time_fail.length] = date_time.time;
            }else if(type = 'succee'){
                log.date_time_end = `${date_time.date} ${date_time.time}`;
                result.log_total[result.log_log_total.length] = log
                result.total = result.log_total.length;
                result.succee[result.succee.length] = log;
                result.time_succee[result.time_succee.length] = date_time.time;
            }
            

 
        } catch (error) {
            
        }
    }
}

module.exports = Log
