let numTotal, numSuccee, numFail, dataPlot, pending;
// const listItem = document.querySelector('.list-item');
const listEvent = document.querySelector('.list-event') 
const pieContaint = document.querySelector('.pie-containt ') 
const listEventChart = document.querySelector('.list-eventChart');
const chartMonth = document.querySelector('.chartMonth ');
const pieContaintChart = document.querySelector('.pie-containtChart');
const timeShow = document.querySelector('.timeShow');

const dashBroad = document.querySelector('.dashBroad')
import {format} from 'date-fns'

const title = document.querySelector('.dashBroad-title');
title.textContent = `Dữ liệu ngày ${format(new Date(), 'dd-MM-yyyy')}`
import Plotly from 'plotly.js-dist-min'
setInterval(()=>{
  Fetch('GET','getDashBroad')
}, 1500)
//Fetch
async function Fetch(method, path, raw = null) {
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
    const {data} = await result.json();
    console.log('data', data)
    if(data.length != 0){
      numTotal = data[0].arrLogTotal.length;
      numSuccee = data[0].arrLogSuccee.length;
      pending = data[0].arrLogPending.length;
      numFail = numTotal - numSuccee - pending;
      console.log( 'numTotal', numTotal, 'numSuccee', numSuccee, 'numFail', numFail)
      if(numTotal != 0){
        listEvent.style.display = 'flex';
        pieContaint.style.margin = 'initial';
        if(numSuccee != 0 || numFail != 0){
          let dataPlot = [{
            type: "pie",
            values: [numSuccee, numFail],
            labels: [`Thành công: ${numSuccee}`, `Thất bại: ${numFail}`],
            texttemplate: "%{percent}",
            textposition: "inside"
          }];
          Plotly.newPlot("pie", dataPlot)
          const listChild = document.querySelector('.list-item');
          const arrListChild = Array.from(listChild.children)
          arrListChild.forEach((el)=>{
            el.remove()
          })
          const titleItem = document.querySelector('.title-item');
          if(!titleItem){
            listEvent.insertAdjacentHTML('afterbegin', `
            <div class='title-item'>
              <span class = "dashBroad-timeStart-title"> T.g bắt đầu</span>
              <span class = "dashBroad-path-title">Đường đi</span>
              <span class = "dashBroad-time-title">T.g hoàn thành</span>
              <span class = "dashBroad-status-title"> Trạng thái</span>
            </div>
          `)
          }
          data[0].arrLogTotal.forEach((el)=>{
            createElement(el, listChild);
          })
        }else{
          let dataPlot = [{
            type: "pie",
            values: [1],
            labels: [`Đang xử lý !!!`],
            texttemplate: "%{percent}",
            textposition: "inside"
          }];
          Plotly.newPlot("pie", dataPlot);
          const listChild = document.querySelector('.list-item');
          const arrListChild = Array.from(listChild.children)
          arrListChild.forEach((el)=>{
            el.remove()
          })
          const titleItem = document.querySelector('.title-item');
          if(!titleItem){
            listEvent.insertAdjacentHTML('afterbegin', `
            <div class='title-item'>
              <span class = "dashBroad-timeStart-title"> T.g bắt đầu</span>
              <span class = "dashBroad-path-title">Đường đi</span>
              <span class = "dashBroad-time-title">T.g hoàn thành</span>
              <span class = "dashBroad-status-title"> Trạng thái</span>
            </div>
          `)
          }
          data[0].arrLogTotal.forEach((el)=>{
            createElement(el, listChild);
          })
        }
      }else{
        listEvent.style.display = 'none';
        pieContaint.style.margin = '0 auto';
        let dataPlot = [{
          type: "pie",
          values: [1],
          labels: [`Không có dữ liệu !!!`],
          texttemplate: "%{percent}",
          textposition: "inside"
        }];
        Plotly.newPlot("pie", dataPlot);
      }
    }else{
      listEvent.style.display = 'none';
      pieContaint.style.margin = '0 auto';
      let dataPlot = [{
        type: "pie",
        values: [1],
        labels: [`Không có dữ liệu !!!`],
        texttemplate: "%{percent}",
        textposition: "inside"
      }];
      Plotly.newPlot("pie", dataPlot);
    }
    } catch (error) {
      console.log("Fetch api to Server Error", error);
      const titleItem = document.querySelector('.title-item');
        if(!titleItem){
          listEvent.insertAdjacentHTML('afterbegin', `
          <div class='title-item'>
            <span class = "dashBroad-timeStart-title"> T.g bắt đầu</span>
            <span class = "dashBroad-path-title">Đường đi</span>
            <span class = "dashBroad-time-title">T.g hoàn thành</span>
            <span class = "dashBroad-status-title"> Trạng thái</span>
          </div>
        `)
        }
    numTotal = 1;
    numSuccee = 0;
    numFail = numTotal - numSuccee;
    let dataPlot = [{
      type: "pie",
      values: [numSuccee, numFail],
      labels: [`Thành công: ${numSuccee}`, `Thất bại: ${numFail}`],
      texttemplate: "%{percent}",
      textposition: "inside"
    }];
    Plotly.newPlot("pie", dataPlot)
  }
}

function createElement(data, element){
  let path = [data.path[0], data.path[data.path.length -1]].join(' - ')
  const li = document.createElement('li');
  li.className = 'item';
  li.innerHTML = 
   ` 
    <span class = "dashBroad-timeStart"> ${data.timeStart}</span>
    <span class = "dashBroad-path"> ${path}</span>
    <span class = "dashBroad-time"> ${data.totalTime}</span>
    <span class = "dashBroad-status"> ${data.status}</span>
   `
  element.appendChild(li)
}

// const tab = document.querySelector('.tab')
// // addEventListener
let isCheck = false;
const tag = (tag) => document.querySelector(tag);
const input_dateTimeDay = tag('.dateTimeDay');
const input_dateTimeMonth = tag('.dateTimeMonth');
const chooseDay = tag('.chooseDay');
const chooseMonth = tag('.chooseMonth');
const btnSearch = tag('.btn-search');
let resultAPI;

if(!isCheck){
    input_dateTimeMonth.disabled = true;
    chooseDay.style.backgroundColor = 'green';
    chooseDay.style.color = 'white';
    chooseDay.disabled = true;
}else{
    input_dateTimeMonth.disabled = false;
    chooseDay.style.backgroundColor = 'initial';
    chooseMonth.style.backgroundColor = 'green';
    chooseMonth.style.color = 'white';
}
chooseMonth.addEventListener('click', ()=>{
    if(!isCheck){
        input_dateTimeMonth.disabled = false;
        chooseMonth.style.backgroundColor = 'green';
        chooseMonth.style.color = 'white';
        chooseDay.style.backgroundColor = 'initial';
        chooseDay.style.color = 'initial';
        chooseDay.disabled = false;
        chooseMonth.disabled = true;
        isCheck = true;
    }
});
chooseDay.addEventListener('click', ()=>{
    if(isCheck){
        input_dateTimeMonth.disabled = true;
        chooseMonth.style.backgroundColor = 'initial';
        chooseMonth.style.color = 'initial';
        chooseDay.style.backgroundColor = 'green';
        chooseDay.style.color = 'white';
        chooseDay.disabled = true;
        chooseMonth.disabled = false;
        isCheck = false;
    }
})
btnSearch.onclick = async()=>{
    let day = input_dateTimeDay.value;
    let monthDay = new Date(input_dateTimeDay.value).getMonth();
    let days = input_dateTimeMonth.value;
    let monthDays = new Date(input_dateTimeMonth.value).getMonth();
    let checkMonth = monthDay == monthDays;
    let desTitle = document.querySelector('.des-pieChart');
    let desTotalTrip = document.querySelector('.des-totalTrip')
    if(!isCheck && day){
      listEventChart.style.display = '';
      chartMonth.style.display = 'none';
      pieContaintChart.style.margin = 'initial';
      resultAPI = await Fetch2('POST','getDay', {dateDay: `${day}`, dateDays:``});
      console.log('resultAPI', resultAPI)
      if(resultAPI && resultAPI.arrLogTotal.length != 0){
        console.log('Day true')
        const listChild = document.querySelector('.list-itemChart');
        const arrListChild = Array.from(listChild.children)
        arrListChild.forEach((el)=>{
          el.remove()
        })
        const titleItemChart = document.querySelector('.title-itemChart');
        if(!titleItemChart){
          listEventChart.insertAdjacentHTML('afterbegin', `
          <div class='title-itemChart'>
          <span class = "dashBroad-timeStart-titleChart"> T.g bắt đầu</span>
          <span class = "dashBroad-path-titleChart">Đường đi</span>
          <span class = "dashBroad-time-titleChart">T.g hoàn thành</span>
          <span class = "dashBroad-status-titleChart"> Trạng thái</span>
          </div>
          `)}         
          resultAPI.arrLogTotal.forEach((el)=>{
            createElement(el, listChild);
          })
          let numSuccee = resultAPI.arrLogSuccee.length;
          let numFail = resultAPI.arrLogFail.length;
          let numTotal = resultAPI.arrLogTotal.length;
          desTitle.textContent = ` Dữ liệu ngày: ${format(new Date(day), 'dd-MM-yyy')} - thực hiện: ${numSuccee + numFail} chuyến`;
          let dataPlot = [{
            type: "pie",
            values: [numSuccee, numFail] ,
            labels: [`Thành công: ${numSuccee}`, `Thất bại: ${numFail}`],
            texttemplate: "%{percent}",
            textposition: "inside"
      }];
        Plotly.newPlot("pieChart", dataPlot);
       }else{
          console.log('Day fail');
          listEventChart.style.display = 'none';
          pieContaintChart.style.margin = '0 auto';
          let dataPlot = [{
            type: "pie",
            values: [1],
            labels: [`Không có dữ liệu !!!`],
            texttemplate: "%{percent}",
            textposition: "inside"
          }];
          Plotly.newPlot("pieChart", dataPlot);
          desTitle.textContent = ` Dữ liệu ngày: ${format(new Date(day), 'dd-MM-yyy')} - thực hiện: ${0} chuyến`;
        }
    }else{
        if(!isCheck && !day){
          alert('Nhập ngày cần tìm kiếm !!!')
        }
    }
    if(isCheck && days && checkMonth){
        if(new Date(days) - new Date(day) > 0){
          chartMonth.style.display = 'block';
          listEventChart.style.display = 'none';
          pieContaintChart.style.margin = 'initial';
          resultAPI = await Fetch2('POST','getDay', {dateDay: `${day}`, dateDays:`${days}`});
          console.log('resultAPI Days', resultAPI)
          console.log('resultAPI.length Days', resultAPI.length)
          if(resultAPI.length != 0){
            console.log('Days true')
            let tongSuccee =0, tongFail=0;
            resultAPI.forEach((el)=>{
              tongSuccee = tongSuccee + el.arrLogSuccee.length;
              tongFail = tongFail + el.arrLogFail.length;
            })
            desTitle.textContent = ` Dữ liệu từ ngày: ${format(new Date(day), 'dd-MM-yyy')} đến ${format(new Date(days), 'dd-MM-yyy')} - thực hiện: ${tongFail + tongSuccee} chuyến `;
            let dataPlot = [{
              type: "pie",
              values: [tongSuccee, tongFail] ,
              labels: [`Thành công: ${tongSuccee}`, `Thất bại: ${tongFail}`],
              texttemplate: "%{percent}",
              textposition: "inside"
            }];
            Plotly.newPlot("pieChart", dataPlot);

            // Chart 2
            let monthSuccee = {
              x: [],
              y: [],
              name: ` Thành công `,
              type: 'bar'
            }; 
            var monthFail = {
              x: [],
              y: [],
              name: ` Thất bại`,
              type: 'bar'
            };
              resultAPI.forEach((el)=>{
                if(el.arrLogTotal.length != 0){
                  monthSuccee.x[monthSuccee.x.length] = el.date;
                  monthSuccee.y[monthSuccee.y.length] = el.arrLogSuccee.length;
                  monthFail.x[monthFail.x.length] = el.date;
                  monthFail.y[monthFail.y.length] = el.arrLogFail.length;
                }
              })
              var data = [monthSuccee, monthFail];
              var layout = {barmode: 'group'};
              Plotly.newPlot('pieMonth', data, layout);
            }else{
              console.log('Days fail');
              listEventChart.style.display = 'none';
              pieContaintChart.style.margin = '0 auto';
              let dataPlot = [{
                type: "pie",
                values: [1],
                labels: [`Không có dữ liệu !!!`],
                texttemplate: "%{percent}",
                textposition: "inside"
              }];
              Plotly.newPlot("pieChart", dataPlot);
              desTitle.textContent = ` Dữ liệu từ ngày: ${format(new Date(day), 'dd-MM-yyy')} đến ${format(new Date(days), 'dd-MM-yyy')} - thực hiện: ${0} chuyến `;
          }
        }else{
          alert('Ngày nhập phải theo thứ tự tăng dần !!!')
        }
  }else if(isCheck && days && !checkMonth){
    alert(' Chọn dữ liệu tìm kiếm trong cùng 1 tháng ')
  }else{
    if(isCheck && (!day || !days)){
      alert('Nhập đầy đủ ngày cần tìm kiếm !!!')
    }
  }
}
const tab = tag('.tab');
Array.from(tab.children).forEach((el, index)=>{
    if(index == 0){
        el.addEventListener('click', function(){
            openCity(this, "Day")
    })
    }else{
        el.addEventListener('click', function(){
            openCity(this, "Month")
            })
    }
})
function openCity(evt, cityName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(cityName).style.display = "block";
}
async function Fetch2(method, path, raw = null) {
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    let requestOptions = {
        method: method,
        headers: myHeaders,
        body: raw ? JSON.stringify(raw) : null,
        redirect: "follow",
    };
    try {
        const result = await fetch(
        `http://localhost:6200/esatech/${path}`,
        requestOptions
        );
        const {data} = await result.json();
        return data
    }catch(error){
        console.log('Error getDay', error)
    }
}
setInterval(()=>{
  timeShow.textContent = format(new Date(), 'dd-MM-yyyy HH:mm:ss')
}, 1000)
window.addEventListener('load', ()=>{
  let tabcontent = document.getElementsByClassName("tabcontent");
  let tablinks = document.getElementsByClassName("tablinks");
  tablinks[0].backgroundColor = 'gray';
  tablinks[0].color = 'white';
  tabcontent[0].style.display = 'block';
})