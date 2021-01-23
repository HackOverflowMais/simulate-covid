var rangeslid = document.getElementById("sliderRange");
document.getElementById("populat").value = rangeslid.value;

rangeslid.oninput = function() {
  generate_new_graph();
  document.getElementById("populat").value = this.value;
}

var textentry = document.getElementById("populat");
// First box
var rangeslid2 = document.getElementById("sliderRange2");
document.getElementById("Infected").value = rangeslid2.value;

rangeslid2.oninput = function() {
  generate_new_graph();
  document.getElementById("Infected").value = this.value;
}
var textentry2 = document.getElementById("Infected");
//box2

var rangeslid3 = document.getElementById("sliderRange3");
document.getElementById("Transmission_prob").value = rangeslid3.value;

rangeslid3.oninput = function() {
  generate_new_graph();
  document.getElementById("Transmission_prob").value = this.value;
}

var textentry3 = document.getElementById("Transmission_prob");
// First box
var rangeslid4 = document.getElementById("sliderRange4");
document.getElementById("Contact_Rate").value = rangeslid4.value;

rangeslid4.oninput = function() {
  generate_new_graph();
  document.getElementById("Contact_Rate").value = this.value;
}
var textentry4 = document.getElementById("Contact_Rate");


var rangeslid5 = document.getElementById("sliderRange5");
document.getElementById("Incubation").value = rangeslid5.value;

rangeslid5.oninput = function() {
  generate_new_graph();
  document.getElementById("Incubation").value = this.value;
}

var textentry5 = document.getElementById("Incubation");
// First box
var rangeslid6 = document.getElementById("sliderRange6");
document.getElementById("Recovery").value = rangeslid6.value;

rangeslid6.oninput = function() {
  generate_new_graph();
  document.getElementById("Recovery").value = this.value;
}
var textentry6 = document.getElementById("Recovery");



// Chart Code -------------------------------------------------------------------

var ctx = document.getElementById('myChart').getContext('2d');

var beta = 0.056;
var gamma = 0.04;
var sigma = 1/7;

// https://docs.idmod.org/projects/emod-hiv/en/latest/model-seir.html

function get_s_dot(s, i, n){
  return -1 * beta * s * i / n;
}

function get_e_dot(s, i, n, e){
  return (beta * s * i )/ n - sigma * e;
}

function get_i_dot(e, i){
  return sigma * e - gamma * i;
}

function get_r_dot(i){
  return gamma * i;
}

// starting values of simulation

var susceptible = 900;
var exposed = 0;
var infectious = 100;
var recovered = 0;

var resolution = 0.1 // number of points added per trial

function simulate(t){

  var s = susceptible;
  var e = exposed;
  var i = infectious;
  var r = recovered;
  var n = s + e + i + r;

  console.log(typeof(r));

  var x = [];
  var y = [];
  var z = [];

  var trial_no = 1;

  var data_point;
  var final = [[], [], [], []];

  var s_dot, e_dot, i_dot, r_dot;

  const delta_t = 0.1; // time interval (smaller is slower but more accurate)


  for(j = 0; j <= t; j += delta_t){
    s_dot = get_s_dot(s, i, n);
    e_dot = get_e_dot(s, i, n, e);
    i_dot = get_i_dot(e, i);
    r_dot = get_r_dot(i);

    s += s_dot * delta_t;
    e += e_dot * delta_t;
    i += i_dot * delta_t;
    r += r_dot * delta_t;
    n = s + e + i + r;

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

var plots = simulate(1000);

function calculate_min_y(plots){
  var n = 0; // n is the sum of e, i, and r (in this case only)
  for(i = 1; i < 4; i++){
    n += plots[i][0]['y'];
  }

  var min_s = plots[0][plots[0].length - 1]['y'];

  return min_s - n/2;
}

function define_datasets(plots){
  return 
}

var chart = new Chart(ctx, { //template code for graphs
    // The type of chart we want to create
    type: 'line',

    // The data for our dataset
    data: {
      datasets: [{
    label: 'Susceptible',
    data: plots[0],
    backgroundColor: 'rgb(255, 205, 86)',
    borderColor: 'rgba(239, 234, 86, 0)',
    pointRadius: 0
  }, {
    label: 'Exposed',
    data: plots[1],
    backgroundColor: 'rgb(75, 192, 192)',
    borderColor: 'rgba(0, 255, 0, 0)',
    pointRadius: 0
  }, {
    label: 'Infectious',
    data: plots[2],
    backgroundColor: 'rgb(255, 99, 132)',
    borderColor: 'rgba(255, 108, 108, 0)',
    pointRadius: 0
  }, {
    label: 'Removed',
    data: plots[3],
    backgroundColor: 'rgb(54, 162, 235)',
    borderColor: 'rgba(0, 0, 255, 0)',
    pointRadius: 0
  }]
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
            min: 0
          }
        }]
      }
    }
});

function generate_new_graph(){
  clearTimeout();
  setTimeout(function(){
    infectious = parseFloat(document.getElementById("Infected").value);
    susceptible = parseFloat(document.getElementById("populat").value) - infectious;
    beta = parseFloat(document.getElementById("Transmission_prob").value) * parseFloat(document.getElementById("Contact_Rate").value);
    sigma = 1 / parseFloat(document.getElementById("Incubation").value);
    gamma = parseFloat(document.getElementById("Recovery").value);

    plots = simulate(1000);

    var test_dataset = define_datasets(plots);

    for(i = 0; i < 4; i++){
      chart.data.datasets[i].data = plots[i];
    }
    chart.update();
  }, 500)
}
