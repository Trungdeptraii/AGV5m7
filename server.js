const app = require(`${__dirname}/src/app`);
const AGV = require(`${__dirname}/src/agv/agv`);
const {format} = require('date-fns')
const Mongo = require(`${__dirname}/src/dbs/dbs.js`);
const Log = require(`${__dirname}/src/models/log.model.js`)


const port = process.env.DEV_PORT;
const host = process.env.DEV_HOST;
const server = app.listen(port, host, async() => {
  AGV.start();
  console.log(`Server start port ${port}`);
  try {
    const result = await Log.find({date: `${format(new Date(), 'dd-MM-yyyy') }`})
    if(result.length == 0){
      await Log.create({date: `${format(new Date(), 'dd-MM-yyyy') }`});
      console.log(`Create log ${format(new Date(), 'dd-MM-yyyy')}` )
    }
  } catch (error) {
    console.log(error)
  }
});
//SIGINT bắt tín hiệu khi thoát server nhấn Ctrl + C, refer: nodejs.org
process.on("SIGINT", () => {
  server.close(() => {
    console.log("Exit Server Express !!!");
  });
  clearInterval(AGV.timeClear);
  process.exit();
});

