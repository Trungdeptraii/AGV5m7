import Plotly from 'plotly.js-dist-min'

let isCheck = false;
const tag = (tag) => document.querySelector(tag);
const input_dateTimeDay = tag('.dateTimeDay');
const input_dateTimeMonth = tag('.dateTimeMonth');
const chooseDay = tag('.chooseDay');
const chooseMonth = tag('.chooseMonth');
const btnSearch = tag('.btn-search');
let resultAPI;
// const pieDay = tag('#pie-chart')

if(!isCheck){
    input_dateTimeMonth.disabled = true;
    chooseDay.style.backgroundColor = 'green';
    chooseDay.disabled = true;
}else{
    input_dateTimeMonth.disabled = false;
    chooseDay.style.backgroundColor = 'initial';
    chooseMonth.style.backgroundColor = 'green';
}
chooseMonth.addEventListener('click', ()=>{
    if(!isCheck){
        input_dateTimeMonth.disabled = false;
        chooseMonth.style.backgroundColor = 'green';
        chooseDay.style.backgroundColor = 'initial';
        chooseDay.disabled = false;
        chooseMonth.disabled = true;
        isCheck = true;
    }
});
chooseDay.addEventListener('click', ()=>{
    if(isCheck){
        input_dateTimeMonth.disabled = true;
        chooseMonth.style.backgroundColor = 'initial';
        chooseDay.style.backgroundColor = 'green';
        chooseDay.disabled = true;
        chooseMonth.disabled = false;
        isCheck = false;
    }
})
btnSearch.onclick = async()=>{
    if(!isCheck){
       resultAPI = await Fetch('POST','getDay', {dateDay: `${input_dateTimeDay.value}`, dateDays:`${input_dateTimeMonth.value}`});
       let numSuccee = resultAPI.arrLogSuccee.length;
       let numFail = resultAPI.arrLogFail.length;
       let numTotal = resultAPI.arrLogTotal.length
       let dataPlot = [{
        type: "pie",
        values: [numSuccee, numFail],
        labels: [`Thành công: ${numSuccee}`, `Thất bại: ${numFail}`],
        texttemplate: "%{percent}",
        textposition: "inside"
      }];
      Plotly.newPlot("pieChart", dataPlot)
    }else if(isCheck){
       resultAPI = await Fetch('POST','getDay', {dateDay: `${input_dateTimeDay.value}`, dateDays:`${input_dateTimeMonth.value}`})
    }
    if(!resultAPI && !isCheck){
        alert(` Không có dữ liệu ngày ${input_dateTimeDay.value} `)
    }else if(!resultAPI && isCheck){
        alert(` Không có dữ liệu từ ngày ${input_dateTimeDay.value} tới ${input_dateTimeMonth.value} `)
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
async function Fetch(method, path, raw = null) {
    console.log(JSON.stringify(raw))
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
        console.log('data', data)
    }catch(error){
        console.log('Error getDay', error)
    }
}