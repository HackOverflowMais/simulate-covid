var ctx = document.getElementById('myChart').getContext('2d');

var beta = 0.1
var gamma = 0.1
var sigma = 0.1

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

susceptible = 0
exposed = 0
infectious = 1
recovered = 0

function simulate(t){
  var s = susceptible;
  var e = exposed;
  var i = infectious;
  var r = recovered;
  var n = s + e + i + r;

  var x = [];
  var y = [];
  var z = [];

  var data_point;
  var final = [[], [], [], []];

  var s_dot, e_dot, i_dot, r_dot;

  delta_t = 1; // time interval (smaller is slower but more accurate)

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

    final[0].push({x: j, y: s});
    final[1].push({x: j, y: e});
    final[2].push({x: j, y: i});
    final[3].push({x: j, y: r});
  }

  return final;
}

plots = simulate(1000);

var chart = new Chart(ctx, { //template code for graphs
    // The type of chart we want to create
    type: 'line',

    // The data for our dataset
    data: {
      datasets: [{
        label: 's',
        data: plots[0]
      }, {
        label: 'e',
        data: plots[1]
      }, {
        label: 'i',
        data: plots[2]
      }, {
        label: 'r',
        data: plots[3]
      }]
    },
    // Configuration options go here
    options:{
      scales: {
        xAxes: [{
          type: 'linear'
        }]
      }
    }
});