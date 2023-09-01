const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
let agvStatus = {};
const statusz = $(".status");
const connect = $(".connect");
const point = $(".location");
const battery = $(".battery");
const hourse = $(".hours");
const minute = $(".minute");
const speed_int = $(".speed-int");
const spees_float = $(".speed-float");
const total = $(".total");
const succee = $(".succee");
const grid = $(".grid");
let listPoint;
let checklog = false, pathAGVRun;

let arrElement = [
  statusz,
  point,
  battery,
  hourse,
  minute,
  speed_int,
  spees_float,
  total,
  succee,
];
function setValueHtml(data = [], ele = [], connects) {
  connect.textContent = JSON.parse(connects);
  if (connect.textContent === "online") {
    connect.style.color = 'green'
    ele.forEach((el, index) => {
      if(el === statusz){
        el.textContent = data[`${index}`] == 1 ? 'STOP' : data[`${index}`] == 2 ? 'RUN' : data[`${index}`] == 3 ? "WAIT" : "ERROR"
      }else{
        el.textContent = data[`${index}`];
      }
    });
    listPoint.forEach((el)=>{
      if(+el.children[0].textContent === +point.textContent){
        el.classList.add('agv')
      }else{
        el.classList.remove('agv')
      }
    })
  } else {
    connect.style.color = 'gray'
    ele.forEach((el, index) => {
      el.textContent = 0;
    });
  }
}
const host = `localhost`,
  port = 6200;
const apiStatus = `${host}:${port}/esatech/`;
setInterval(() => {
  Fetch("GET", "status");
}, 500);
const Fetch = async function Fetch(method, path, raw = null) {
  let pathAGV = [];
  let myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  let requestOptions = {
    method: method,
    headers: myHeaders,
    body: raw ? raw : null,
    redirect: "follow",
  };

  try {
    const result = await fetch(
      `http://localhost:6200/esatech/${path}`,
      requestOptions
    );
    const dataJSON = await result.json();
    const data = JSON.parse(dataJSON.data);
    setValueHtml(data, arrElement, dataJSON.connect);
    pathAGV =  Object.values(data).slice(9).filter(el=> el!=0 && el!=data['1']);
    //Kiểm tra AGV có path và run bắt đầu log start
    console.log('pathAGV', pathAGV)
    console.log('data', data['0'])
    if(pathAGV.length != 0 && data['0'==2]){
      checklog = true;
      pathAGVRun = [];
      Fetch('POST','start', pathAGV)
      console.log('fetch')
    }
    listPoint.filter((el)=>{
      if(pathAGV.includes(+el.children[0].textContent)){
        el.classList.add('pathActive')
      }else{
        el.classList.remove('pathActive')
      }
    })
    pathAGV.push(+data['1'])
    listPoint.filter((el)=>{
      if(!pathAGV.includes(+el.children[0].textContent)){
        el.style.opacity = '0.5'
      }else{
        el.style.opacity = '1'
      }
    })
  } catch (error) {
    console.log("Fetch api to Server Error", error);
  }
}
//create item
lengthItem = 80;
lengthPoint = 89;
window.addEventListener('load',()=>{
  for(let i=0; i<lengthItem; i++){
    let item = document.createElement('div');
    item.className = 'item';
    grid.appendChild(item)
  }
  for(let i=1; i<=lengthPoint; i++){
    if(i%10 !== 0){
      let item = document.createElement('div');
      let number = document.createElement('span');
      number.className = 'number'
      let dot = document.createElement('span');
      dot.className = 'dot'
      if(i<10){
        item.className = `point-0${i} point`;
        number.textContent = `0${i}`
        
      }else{
        item.className = `point-${i} point`;
        number.textContent = i
      }
      item.appendChild(number);
      item.appendChild(dot);
      grid.appendChild(item)
    }
  }
  let listPoints =  $$(".point");
  listPoint = Array.from(listPoints);
})
