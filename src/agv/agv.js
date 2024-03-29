require("dotenv").config({ path: `${__dirname}/../../.env` });
const web3 = require("web3-utils");
const net = require("node:net");
const Log = require(`${__dirname}/../models/log.model.js`);
const createLog = require(`${__dirname}/../utils/utils.js`);
const {format} = require('date-fns');
const { da } = require("date-fns/locale");
const { assert } = require("node:console");

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
    this.isStart = false;
    this.isFail = false;
    this.isSuccee = false;
    this.pointGet = [10, 11, 12];
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
    this.client.on("ready", async() => {
      this.checkConnect = "online";
      await this.reconnect()
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
        this.call = this.data['7'];
        this.succee = this.data['8'];
        this.getReturns = this.data['9'] == 1 ? 'get' : this.data['9'] == 2 ? 'returns' : undefined;
        this.cancel = this.data['10'] == 1 ? 'cancel' : undefined;
        let path = Object.values(this.data).slice(11);
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
    let data;
    if(!this.date === format(new Date(), 'dd-MM-yyyy')){
      createLog.create();
    }
    // Handle start run
    if(this.path.length!= 0 && this.status == 'START' && !this.run && this.getReturns == 'returns' && this.pointGet.includes(this.rfid)){
      this.pathAGV = this.path;
      this.run = true;
      try {
        // Tìm ngày hiện tại
        data = await createLog.find(); 
        let {date, arrLogTotal, arrLogSuccee, arrLogFail, arrLogPending} = data;
        if(arrLogPending.length === 0){
          console.log('Không có data chờ, tạo data mới');
          // Tạo log trong ngày
          const itemLog = createLog.itemlog({timeStart: format(new Date(), 'HH:mm:ss'), path: this.pathAGV})
          arrLogTotal[arrLogTotal.length] = itemLog;
          arrLogPending[arrLogPending.length] = itemLog;
          await createLog.update(data);
        }else if(arrLogPending.length != 0){
          console.log('Đang có dữ liệu chưa xử lý');
          if(this.getReturns === 'returns'){
            console.log('Tiếp tục dữ liệu cũ');
          }else{
            console.log('Dữ liệu cũ thất bại')
          }
        }
      } catch (error) {
        console.log('start Error', error)
      }
    }
    // Handle succee
    if(this.run==true && this.getReturns == 'returns' && this.rfid == this.pathAGV[this.pathAGV.length-1]){
      try {
        const data = await createLog.find();
        let {date, arrLogTotal, arrLogSuccee, arrLogFail, arrLogPending} = data;
        const succee = arrLogPending.pop();
        arrLogTotal.pop();
        succee.timeEnd = `${format(new Date(), 'HH:mm:ss')}`;
        succee.status = 'Thành công';
        console.log('timeEnd', succee.timeEnd)
        console.log('timeStart', succee.timeStart)
        succee.totalTime = createLog.time(succee.timeEnd, succee.timeStart)
        arrLogSuccee[arrLogSuccee.length] = succee;
        arrLogTotal[arrLogTotal.length] = succee;
        await createLog.update(data)
      } catch (error) {
        console.log('erorr', error)
      }
      this.run = false;
    }
  
  }
  async handleFail(){
    try {
      // Lấy thông tin log ngày hiện tại
      const data = await createLog.find();
      let {date, arrLogTotal, arrLogSuccee, arrLogFail, arrLogPending} = data;
      // Lấy ra phần từ log đang pending
      const fail = arrLogPending.pop();
      console.log('fail', fail)
      // Xóa phần tử pending trong log Total
      arrLogTotal.pop();
      fail.timeEnd = `${format(new Date(), 'HH:mm:ss')}`;
      fail.status = 'Thất bại';
      fail.totalTime = createLog.time(fail.timeEnd, fail.timeStart)
      arrLogFail[arrLogFail.length] = fail;
      arrLogTotal[arrLogTotal.length] = fail;
      await createLog.update(data)
    } catch (error) {
      console.log('Fn Handle Fail Error', error)
    }
  }
  async reconnect(){
    try {
      // Tìm ngày hiện tại
      let data = await createLog.find(); 
      let {date, arrLogTotal, arrLogSuccee, arrLogFail, arrLogPending} = data;
      if(arrLogPending.length != 0){
        console.log('Đang có dữ liệu chưa xử lý', this.getReturns);
        if(this.getReturns === 'returns'){
          console.log('Tiếp tục dữ liệu cũ');
        }else{
          console.log('Dữ liệu cũ bị fail');
          await this.handleFail()
        }
      }
    } catch (error) {
      console.log('start Error', error)
    }
  }
}

let agvv = new agv(portClient, ipClient);
module.exports = agvv;
