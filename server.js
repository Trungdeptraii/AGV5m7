const app = require(`${__dirname}/src/app`);
const AGV = require(`${__dirname}/src/agv/agv`);
const {format} = require('date-fns')
require(`${__dirname}/src/dbs/dbs.js`);
const createLog = require(`${__dirname}/src/utils/utils.js`)



const port = process.env.DEV_PORT;
const host = process.env.DEV_HOST;
const server = app.listen(port, host, async() => {
  AGV.start();
  console.log(`Server start port ${port}`);
  createLog.create();
  AGV.date = format(new Date(), 'dd-MM-yyyy');
});
//SIGINT bắt tín hiệu khi thoát server nhấn Ctrl + C, refer: nodejs.org
process.on("SIGINT", () => {
  server.close(() => {
    console.log("Exit Server Express !!!");
  });
  clearInterval(AGV.timeClear);
  process.exit();
});

