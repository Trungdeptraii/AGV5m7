const AGV = require(`${__dirname}/../agv/agv`);
const Log = require(`${__dirname}/../models/log.model.js`);
const getLog = require(`${__dirname}/../utils/utils.js`);
const {format} = require('date-fns')
class Controller {
  static home(req, res) {
    res.render("overview");
  }
  static dasbroad(req, res) {
    res.render("dasbroad",{
      tite: 'log',
      data: JSON.stringify([{'time_start': '12:20:20', 'path': '2-12', 'total_time': 'pending', 'status': 'pending'}])
    });
  }
  static status(req, res) {
    res.status(200).json({
      status: "succee",
      connect: `${JSON.stringify(AGV.checkConnect)}`,
      data: `${JSON.stringify(AGV.data)}`,
    });
  }
  static async getDashBroad(req, res){
    try {
      const result = await getLog.find();
      res.status(200).json({
        status: 'succee',
        data: result
      })
    } catch (error) {
      console.log('router getDashbroad Error')
    }
  }
  static async getDay(req, res){
    let {dateDay, dateDays} = req.body;
    let get = dateDay && dateDays;
    let result;
    let option = {
      date: 1, arrLogTotal: 1, arrLogFail: 1, arrLogSuccee: 1, arrLogPending: 1, _id: 0
    }
    if(!get){
      try {
        result = await Log.findOne({date: format(new Date(dateDay), 'dd-MM-yyy')});
      } catch (error) {
        console.log('getDay Server Error', error)
      }
    }else{
      try {
        result = await Log.find({createdAt
          : {$gte: new Date(dateDay), $lte: new Date(dateDays)}}).select(option);
      } catch (error) {
        console.log('getDays Server Error', error)
      }
    }
    res.status(200).json({
      status: 'succee',
      data: result
    })

  }
}

module.exports = Controller;
