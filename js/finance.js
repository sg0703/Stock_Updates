// File to call finance API

const stocks = [
    {
        company: 'VERU',
        symbol: 'VERU',
        shares: 508,
        type: 'indiv',
        portfolio: 'Personal'
    },
    {
        company: 'Denison Mines Corp.',
        symbol: 'DNN',
        shares: 127,
        type: 'indiv',
        portfolio: 'Personal'
    },
    {
        company: 'IQSTEL Inc.',
        symbol: 'IQST',
        shares: 100,
        type: 'indiv',
        portfolio: 'Personal'
    },
    {
        company: 'Royal Caribbean Group',
        symbol: 'RCL',
        shares: 50,
        type: 'indiv',
        portfolio: 'Personal'
    },
    {
        company: 'SG Blocks, Inc.',
        symbol: 'SGBX',
        shares: 100,
        type: 'indiv',
        portfolio: 'Personal'
    },
    {
        company: 'Toughbuilt Industries, Inc.',
        symbol: 'TBLT',
        shares: 500,
        type: 'indiv',
        portfolio: 'Personal'
    },
    {
        company: 'AT&T',
        symbol: 'T',
        shares: 100,
        type: 'indiv',
        portfolio: 'IRA'
    }
];

var portfolioVal = 0; // add up total amount of money

// display initial page
stocks.forEach(stock => getPrice(stock));
displayTime();

// re-write page every 30 seconds. if market closed, stop and add message at bottom
var refresh = setInterval(() => {
    var date = new Date();
    
    if (date.getHours() >= 16) {
        clearInterval(refresh);
    } 
    else {
        contentReset();
        stocks.forEach(stock => getPrice(stock));    
        displayTime();
    }
},30000)

function getPrice(stock) {
    var token = 'c162mdv48v6ootkka5hg';
    var priceQuote = 'https://finnhub.io/api/v1/quote?symbol=' + stock.symbol + '&token=' + token; 

    fetch(priceQuote, {mode: 'cors'})
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        stock.price = data.c;
        stock.pc = data.pc;

        displayCard(stock);
    });
}

// only called after fetch request complete
// accepts stock object
function displayCard(stock) {
    const stocks_here = document.getElementById('stocks_here');
    var value = stock.shares * stock.price;
    var green = 'background: #59de5f';
    var red = 'background: #d64e45';

    let stockCard = `
    <div class="one column" style="margin: 10px 10px 10px 5px; width: 200px;">
    <h5>${stock.symbol}</h5>
    <table>
        <tr>
            <td style="${(Number(stock.price) - Number(stock.pc)) > 0 ? green : red}">Price</td>
            <td style="${Number(stock.price) - Number(stock.pc) > 0 ? green : red}">${formatPrice(stock.price)}</td>
        </tr>
        <tr>
            <td>Last close</td>
            <td>${formatPrice(stock.pc)}</td>
        </tr>
        <tr>
          <td>Shares</td>
          <td>${stock.shares}</td>
      </tr>
      <tr>
          <td>Value</td>
          <td>${formatPrice(value)}</td>
      </tr>
    </table>      
  </div>`;

  stocks_here.innerHTML += stockCard;

  portfolioVal += value;
  
  document.getElementById('port_val').innerHTML = `Total portfolio value: ${formatPrice(portfolioVal)}`;
}

// formats stock price numbers
function formatPrice(number) {
    number = new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD', maximumFractionDigits: 2}).format(number);

    return number;
}

function contentReset() {
    portfolioVal = 0;
    stocks_here.innerHTML = '';
}

function displayTime() {
    var date = new Date();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var year = date.getFullYear();
    var hour = date.getHours();
    var minutes = date.getMinutes();

    if (minutes < 10) {
        minutes = '0' + minutes;
    }

    var time = `${month}/${day}/${year} ${hour}:${minutes}`;

    document.getElementById('updated').innerHTML = time;

    console.log(hour);
    if (hour >= 16) {
        document.getElementById('updated').append(' | Market closed');
    } 
}