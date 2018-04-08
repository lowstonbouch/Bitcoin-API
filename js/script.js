google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawChart);
const buttonDateField = document.getElementById('button-field');
const buttonCurrencyField = document.getElementById('button-currency-field');

let arrayBTC = [];
let currency = 'USD';
let tittleDate = 'Year';

async function getJSONAsync(url) {
    let json = await axios.get(url);
    return json;
}

function getURL(){
    let date = new Date();
    var values = [ date.getDate(), date.getMonth() + 1 ];
    for(var id in values) {
        values[id] = values[id].toString().replace( /^([0-9])$/, '0$1' );
    }
    return `https://api.coindesk.com/v1/bpi/historical/close.json?currency=${currency}&start=${date.getFullYear()-1}-${values[1]}-${values[0]}&end=${date.getFullYear()}-${values[1]}-${values[0]}`;
}

changeButtonDate = (event) => {
    const target = event.target;
    let array = [];
    if(target.id === 'button-week'){
        tittleDate = 'Week';
        array = arrayBTC.filter((item,i) => {
            if(i === 0) return item;
             if (i > 358) return item;
            })
        renderChart(array);
    }
    if(target.id === 'button-month'){
        tittleDate = 'Month';
        array = arrayBTC.filter((item,i) => {
            if(i === 0) return item;
             if (i > 335) return item;
            })
        renderChart(array);
    }
    if(target.id === 'button-year'){
        tittleDate = 'Year';
        renderChart(arrayBTC);
    }
}
buttonDateField.addEventListener('click', changeButtonDate);

changeButtonCurrency = event => {
    const target = event.target;
    if(target.id === 'currency-USD'){
        currency = 'USD';
        drawChart();
    }
    if(target.id === 'currency-EUR'){
        currency = 'EUR';
        drawChart();
    }
    if(target.id === 'currency-GBP'){
        currency = 'GBP';
        drawChart();
    }
}
buttonCurrencyField.addEventListener('click', changeButtonCurrency);
  
function drawChart() {
    let url = getURL();
    getJSONAsync(url)
    .then((result) => {
        bpi = result.data.bpi;
        console.log('bpi', bpi);
        arrayBTC = [['Date','Bitcoin']];
        for(key in bpi){
            arrayBTC.push([`${key}`.slice(5,10), bpi[key]]);
        }
        renderChart(arrayBTC);
    })
    .catch((error) => {
        console.log(error);
    }); 
}

function renderChart(array){
    var data = google.visualization.arrayToDataTable(array);
    var options = {
        title: 'Company Performance',
        hAxis: {title: `${tittleDate}-${currency}`,  titleTextStyle: {color: '#333'}},
        vAxis: {minValue: 0}
    };
  
    var chart = new google.visualization.AreaChart(document.getElementById('chart_div'));
    chart.draw(data, options);
}


