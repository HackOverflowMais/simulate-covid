var ctx = document.getElementById('myChart').getContext('2d');

var beta = 0.056;
var gamma = 0.04;
var sigma = 1/7;

// https://docs.idmod.org/projects/emod-hiv/en/latest/model-seir.html

function get_s_dot(s, i, n){
  return -1 * beta * s * i / n;
}

function get_e_dot(s, i, n, e){
  return beta * s * i / n - sigma * e;
}

function get_i_dot(e, i){
  return sigma * e - gamma * i;
}

function get_r_dot(i){
  return gamma * i;
}

// starting values of simulation

var susceptible = 7000000000;
var exposed = 0;
var infectious = 96000000;
var recovered = 0;

var resolution = 0.0001 // number of points added per trial

function simulate(t){
  var s = susceptible;
  var e = exposed;
  var i = infectious;
  var r = recovered;
  var n = s + e + i + r;

  var x = [];
  var y = [];
  var z = [];

  trial_no = 1

  var data_point;
  var final = [[], [], [], []];

  var s_dot, e_dot, i_dot, r_dot;

  delta_t = 0.01; // time interval (smaller is slower but more accurate)

  for(j = 0; j <= t; j += delta_t){
    s_dot = get_s_dot(s, i, n);
    e_dot = get_e_dot(s, i, n, e);
    i_dot = get_i_dot(e, i);
    r_dot = get_r_dot(i);

    s += s_dot * delta_t;
    e += e_dot * delta_t;
    i += i_dot * delta_t;
    r += r_dot * delta_t;
    n += s + e + i + r;

    z = [s, e, i, r];

    trial_no += resolution;

    if (trial_no >= 1){
      final[0].push({x: j, y: Math.round(s)});
      final[1].push({x: j, y: Math.round(e)});
      final[2].push({x: j, y: Math.round(i)});
      final[3].push({x: j, y: Math.round(r)});
      trial_no -= 1;
    }
  }

  return final;
}

plots = simulate(10000);


function calculate_min_y(plots){
  var n = 0 // n is the sum of e, i, and r (in this case only)
  for(i = 1; i < 4; i++){
    n += plots[i][0]['y'];
  }

  min_s = plots[0][plots[0].length - 1]['y'];

  return min_s - n/2;
}

function define_datasets(plots){
  return [{
    label: 'Susceptible',
    data: plots[0],
    backgroundColor: 'rgba(255, 99, 132, 0.5)'
  }, {
    label: 'Exposed',
    data: plots[1],
    backgroundColor: 'rgba(153, 255, 153, 0.5)'
  }, {
    label: 'Infectuous',
    data: plots[2],
    backgroundColor: 'rgba(153, 153, 255, 0.5)'
  }, {
    label: 'Removed',
    data: plots[3],
    backgroundColor: 'rgba(255, 153, 153, 0.5)'
  }];
}

var chart = new Chart(ctx, { //template code for graphs
    // The type of chart we want to create
    type: 'line',

    // The data for our dataset
    data: {
      datasets: define_datasets(plots)
    },
    // Configuration options go here
    options:{
      scales: {
        xAxes: [{
          type: 'linear'
        }],
        yAxes: [{
          stacked: true,
          ticks: {
            min: calculate_min_y(plots)
          }
        }]
      }
    }
});

document.getElementById("myChart").onclick = function() {myFunction()};

function myFunction(){
  beta = 5;

  console.log("ur noob");

  plots = simulate(1000)

  chart.data.datasets = define_datasets(plots);
  chart.update();
}