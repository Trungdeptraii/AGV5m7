require("dotenv").config({ path: `${__dirname}/../../.env` });
const web3 = require("web3-utils");
const net = require("node:net");
const Log = require(`${__dirname}/../models/log.model.js`);
const createLog = require(`${__dirname}/../utils/utils.js`);
const {format} = require('date-fns');

const portClient = process.env.PORTCLIENT;
const ipClient = process.env.HOSTCLIENT;

class agv {
  constructor(port, host) {
    this.port = port;
    this.host = host;
    this.socket = net.Socket();
    this.data = {};
    this.timeCirCle = 1000;
    this.checkConnect = "offline";
    this.run = false;
  }
  connect() {
    this.client = this.socket.connect(this.port, this.host);
  }
  checkModbusFrameWithCRC(frame) {
    const frameBuffer = Buffer.from(frame, "hex");
    const receivedCRC = frameBuffer.readUInt16LE(frameBuffer.length - 2);
    const calculatedCRC = this.calculateCRC(frameBuffer.slice(0, -2));
    return receivedCRC === calculatedCRC ? frameBuffer : false;
  }
  calculateCRC(buffer) {
    const polynomial = 0xa001;
    let crc = 0xffff;

    for (let i = 0; i < buffer.length; i++) {
      crc ^= buffer[i];
      for (let j = 0; j < 8; j++) {
        if (crc & 0x0001) {
          crc >>= 1;
          crc ^= polynomial;
        } else {
          crc >>= 1;
        }
      }
    }

    return crc;
  }
  start() {
    this.connect();
    this.client.on("error", (error) => {
      console.log("Error", error);
    });
    this.client.on("close", () => {
      this.checkConnect = "offline";
      console.log("Connect close, waitting reconnect !!!");
      clearInterval(this.timeClear);
      this.connect();
    });
    this.client.on("ready", () => {
      this.checkConnect = "online";
    });
    this.client.on("connect", () => {
      console.log(`Connected ip: ${this.host} port ${this.port} succee.`);
      this.client.on("data", (data) => {
        if (this.checkModbusFrameWithCRC(data.toString("hex"))) {
          let dem = -1;
          const data1 = data.slice(3);
          for (let i = 1; i < data1.length -2; i += 2) {
            dem++;
            this.data[`${dem}`] = data1[i];
          }
        }
        this.status = this.data['0'] == 0 ? 'STOP' : this.data['0'] == 1 ? 'START' : this.data['0'] == 2 ? 'ERROR' : undefined;
        this.rfid = this.data['1'];
        let path = Object.values(this.data).slice(9);
        this.path = path.filter((el)=>{
          return el != 0
        })
        this.handle()
      });
      this.timeClear = setInterval(() => {
        this.client.write(
          Buffer.from([0x01, 0x03, 0x00, 0x0a, 0x00, 0x31, 0xa4, 0x1c])
        );
      }, this.timeCirCle);
    });
  }
  async handle(){
    let data
    if(this.path.length!= 0 && this.status == 'START' && this.run == false && this.rfid !== this.path[this.path.length-1]){
      this.pathAGV = this.path;
      this.run = true;
      try {
        data = await createLog.find();
        const itemLog = createLog.itemlog({timeStart: format(new Date(), 'HH:mm:ss'), path: this.pathAGV})
        data[0].arrLogTotal[data[0].arrLogTotal.length] = itemLog;
        data[0].arrLogPending[data[0].arrLogPending.length] = itemLog;
        await createLog.update(data[0])
      } catch (error) {
        console.log('start Error', error)
      }
      //Đoạn này bắt đầu tạo log gồm có thời gian bắt đầu, path, thời gian tổng thì chờ, trạng thái chờ
    }
    if(this.run == true && this.status == 'START' && this.pathAGV.length != 0){
        if(this.rfid === this.pathAGV[0]){
          console.log(this.pathAGV)
          this.pathAGV.shift()
        }
    }
    if(this.run==true && this.pathAGV.length == 0){
      this.run = false;
      try {
        const data = await createLog.find();
        const succee = data[0].arrLogPending.pop();
        data[0].arrLogTotal.pop();
        succee.timeEnd = `${format(new Date(), 'HH:mm:ss')}`;
        succee.status = 'Thành công';
        console.log('timeEnd', succee.timeEnd)
        console.log('timeStart', succee.timeStart)
        succee.totalTime = createLog.time(succee.timeEnd, succee.timeStart)
        data[0].arrLogSuccee[data[0].arrLogSuccee.length] = succee;
        data[0].arrLogTotal[data[0].arrLogTotal.length] = succee;
        await createLog.update(data[0])
      } catch (error) {
        console.log('erorr', error)
      }
    }
    
  }
}

let agvv = new agv(portClient, ipClient);
module.exports = agvv;
