// Slider Code
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
      title: {
        display: true,
        text: "SEIR Model",
        fontSize: 32
      },
      scales: {
        xAxes: [{
          type: 'linear',
          scaleLabel: {
            display: true,
            labelString: '# of Days'
          }
        }],
        yAxes: [{
          stacked: true,
          ticks: {
            min: 0
          },
          scaleLabel: {
            display: true,
            labelString: '# of People'
          }
        }]
      }
    }
});


function autofocus(plots){
  var i_data = plots[2];
  var max_point = i_data[0]['y'];

  for(i = 0; i < i_data.length; i++){
    if (i_data[i]['y'] <= max_point * 0.01){
      var max_x = i_data[i]['x'];
      break;
    }
  }

  return max_x;
}


function generate_new_graph(){
  clearTimeout();
  setTimeout(function(){
    infectious = parseFloat(document.getElementById("Infected").value);
    susceptible = parseFloat(document.getElementById("populat").value) - infectious;
    beta = parseFloat(document.getElementById("Transmission_prob").value) * parseFloat(document.getElementById("Contact_Rate").value);
    sigma = 1 / parseFloat(document.getElementById("Incubation").value);
    gamma = parseFloat(document.getElementById("Recovery").value);

    plots = simulate(1000);

    console.log(plots);

    var test_dataset = define_datasets(plots);

    console.log(chart.data);

    for(i = 0; i < 4; i++){
      chart.data.datasets[i].data = plots[i];
    }

    console.log(autofocus(plots))
    chart.options.scales.xAxes[0].ticks.max = autofocus(plots);

    chart.update();
  }, 500)
}

// graphing covid normally

months = [
  0,
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sept",
  "Oct",
  "Nov",
  "Dec"
];

function alphanumeric_date(numeric_date){
  date = numeric_date.split("/");
  return months[date[0]] + " " + date[1];
}

var covid_data = `4/8/2020,India,5916,506,178,5232
4/9/2020,India,6725,620,226,5879
4/10/2020,India,7598,774,246,6578
4/11/2020,India,8446,969,288,7189
4/12/2020,India,9205,1080,331,7794
4/13/2020,India,10453,1181,358,8914
4/14/2020,India,11487,1359,393,9735
4/15/2020,India,12322,1432,405,10485
4/16/2020,India,13430,1768,448,11214
4/17/2020,India,14352,2041,486,11825
4/18/2020,India,15722,2463,521,12738
4/19/2020,India,17615,2854,559,14202
4/20/2020,India,18539,3273,592,14674
4/21/2020,India,20080,3975,645,15460
4/22/2020,India,21370,4370,681,16319
4/23/2020,India,23077,5012,721,17344
4/24/2020,India,24530,5498,780,18252
4/25/2020,India,26283,5939,825,19519
4/26/2020,India,27890,6523,881,20486
4/27/2020,India,29451,7137,939,21375
4/28/2020,India,31324,7747,1008,22569
4/29/2020,India,33062,8437,1079,23546
4/30/2020,India,34863,9068,1154,24641
5/1/2020,India,37257,10007,1223,26027
5/2/2020,India,39699,10819,1323,27557
5/3/2020,India,42505,11775,1391,29339
5/4/2020,India,46437,12847,1566,32024
5/5/2020,India,49400,14142,1693,33565
5/6/2020,India,52987,15331,1785,35871
5/7/2020,India,56351,16776,1889,37686
5/8/2020,India,59695,17887,1985,39823
5/9/2020,India,62808,19301,2101,41406
5/10/2020,India,67161,20969,2212,43980
5/11/2020,India,70768,22549,2294,45925
5/12/2020,India,74292,24420,2415,47457
5/13/2020,India,78055,26400,2551,49104
5/14/2020,India,81997,27969,2649,51379
5/15/2020,India,85784,30258,2753,52773
5/16/2020,India,90648,34224,2871,53553
5/17/2020,India,95698,36795,3025,55878
5/18/2020,India,100328,39233,3156,57939
5/19/2020,India,106475,42309,3302,60864
5/20/2020,India,112028,45422,3434,63172
5/21/2020,India,118226,48553,3584,66089
5/22/2020,India,124794,51824,3726,69244
5/23/2020,India,131423,54385,3868,73170
5/24/2020,India,138536,57692,4024,76820
5/25/2020,India,144950,60706,4172,80072
5/26/2020,India,150793,64277,4344,82172
5/27/2020,India,158086,67749,4534,85803
5/28/2020,India,165386,70920,4711,89755
5/29/2020,India,173491,82627,4980,85884
5/30/2020,India,181827,86936,5185,89706
5/31/2020,India,190609,91852,5408,93349
6/1/2020,India,198370,95754,5608,97008
6/2/2020,India,207191,100285,5829,101077
6/3/2020,India,216824,104071,6088,106665
6/4/2020,India,226713,108450,6363,111900
6/5/2020,India,236184,113233,6649,116302
6/6/2020,India,246622,118695,6946,120981
6/7/2020,India,257486,123848,7207,126431
6/8/2020,India,265928,129095,7473,129360
6/9/2020,India,276146,134670,7750,133726
6/10/2020,India,286605,135206,8102,143297
6/11/2020,India,297535,147195,8498,141842
6/12/2020,India,308993,154330,8884,145779
6/13/2020,India,320922,162379,9195,149348
6/14/2020,India,332424,169798,9520,153106
6/15/2020,India,343091,180013,9900,153178
6/16/2020,India,354065,186935,11903,155227
6/17/2020,India,366946,194325,12237,160384
6/18/2020,India,380532,204711,12573,163248
6/19/2020,India,395048,213831,12948,168269
6/20/2020,India,410451,227728,13254,169469
6/21/2020,India,425282,237196,13699,174387
6/22/2020,India,440215,248190,14011,178014
6/23/2020,India,456183,258685,14476,183022
6/24/2020,India,473105,271697,14894,186514
6/25/2020,India,490401,285637,15301,189463
6/26/2020,India,508953,295881,15685,197387
6/27/2020,India,528859,309713,16095,203051
6/28/2020,India,548318,321723,16475,210120
6/29/2020,India,566840,334822,16893,215125
6/30/2020,India,585481,347912,17400,220169
7/1/2020,India,604641,359860,17834,226947
7/2/2020,India,625544,379892,18213,227439
7/3/2020,India,648315,394227,18655,235433
7/4/2020,India,673165,409083,19268,244814
7/5/2020,India,697413,424433,19693,253287
7/6/2020,India,719664,439934,20159,259571
7/7/2020,India,742417,456831,20642,264944
7/8/2020,India,767296,476378,21129,269789
7/9/2020,India,793802,495513,21604,276685
7/10/2020,India,820916,515386,22123,283407
7/11/2020,India,849522,534618,22673,292231
7/12/2020,India,878254,553471,23174,301609
7/13/2020,India,906752,571460,23727,311565
7/14/2020,India,936181,592032,24309,319840
7/15/2020,India,968857,612768,24914,331175
7/16/2020,India,1003832,635757,25602,342473
7/17/2020,India,1039084,653751,26273,359060
7/18/2020,India,1077781,677423,26816,373542
7/19/2020,India,1118206,700087,27497,390622
7/20/2020,India,1155338,724578,28082,402678
7/21/2020,India,1193078,753050,28732,411296
7/22/2020,India,1238798,782607,29861,426330
7/23/2020,India,1288108,817209,30601,440298
7/24/2020,India,1337024,849432,31358,456234
7/25/2020,India,1385635,885573,32060,468002
7/26/2020,India,1435616,917568,32771,485277
7/27/2020,India,1480073,951166,33408,495499
7/28/2020,India,1531669,988029,34193,509447
7/29/2020,India,1581963,1019735,34955,527273
7/30/2020,India,1634746,1055348,35718,543680
7/31/2020,India,1695988,1094374,36511,565103
8/1/2020,India,1750723,1145629,37364,567730
8/2/2020,India,1803695,1186203,38135,579357
8/3/2020,India,1855745,1230509,38938,586298
8/4/2020,India,1908254,1282215,39795,586244
8/5/2020,India,1964536,1328336,40699,595501
8/6/2020,India,2027074,1378105,41585,607384
8/7/2020,India,2088611,1427005,42518,619088
8/8/2020,India,2153010,1480884,43379,628747
8/9/2020,India,2215074,1535743,44386,634945
8/10/2020,India,2268675,1583489,45257,639929
8/11/2020,India,2329638,1639599,46091,643948
8/12/2020,India,2396637,1695982,47033,653622
8/13/2020,India,2461190,1751555,48040,661595
8/14/2020,India,2525922,1808936,49036,667950
8/15/2020,India,2589952,1862258,49980,677714
8/16/2020,India,2647663,1919842,50921,676900
8/17/2020,India,2702681,1977671,51797,673213
8/18/2020,India,2767253,2037816,52888,676549
8/19/2020,India,2836925,2096664,53866,686395
8/20/2020,India,2905825,2158946,54849,692030
8/21/2020,India,2975701,2222577,55794,697330
8/22/2020,India,3044940,2280566,56706,707668
8/23/2020,India,3106348,2338035,57542,710771
8/24/2020,India,3167323,2404585,58390,704348
8/25/2020,India,3224547,2458339,59357,706851
8/26/2020,India,3310234,2523771,60472,725991
8/27/2020,India,3387500,2583948,61529,742023
8/28/2020,India,3463972,2648998,62550,752424
8/29/2020,India,3542733,2713933,63498,765302
8/30/2020,India,3621245,2774801,64469,781975
8/31/2020,India,3691166,2839882,65288,785996
9/1/2020,India,3769523,2901908,66333,801282
9/2/2020,India,3853406,2970492,67376,815538
9/3/2020,India,3936747,3037151,68472,831124
9/4/2020,India,4023179,3107223,69561,846395
9/5/2020,India,4113811,3180865,70626,862320
9/6/2020,India,4204613,3250429,71642,882542
9/7/2020,India,4280422,3323950,72775,883697
9/8/2020,India,4370128,3398844,73890,897394
9/9/2020,India,4465863,3471783,75062,919018
9/10/2020,India,4562414,3542663,76271,943480
9/11/2020,India,4659984,3624196,77472,958316
9/12/2020,India,4754356,3702595,78586,973175
9/13/2020,India,4846427,3780107,79722,986598
9/14/2020,India,4930236,3859399,80776,990061
9/15/2020,India,5020359,3942360,82066,995933
9/16/2020,India,5118253,4025079,83198,1009976
9/17/2020,India,5214677,4112551,84372,1017754
9/18/2020,India,5308014,4208431,85619,1013964
9/19/2020,India,5400619,4303043,86752,1010824
9/20/2020,India,5487580,4396399,87882,1003299
9/21/2020,India,5562663,4497867,88935,975861
9/22/2020,India,5646010,4587613,90020,968377
9/23/2020,India,5732518,4674987,91149,966382
9/24/2020,India,5818570,4756164,92290,970116
9/25/2020,India,5903932,4849584,93379,960969
9/26/2020,India,5992532,4941627,94503,956402
9/27/2020,India,6074702,5016520,95542,962640
9/28/2020,India,6145291,5101397,96318,947576
9/29/2020,India,6225763,5187825,97497,940441
9/30/2020,India,6312584,5273201,98678,940705
10/1/2020,India,6394068,5352078,99773,942217
10/2/2020,India,6473544,5427706,100842,944996
10/3/2020,India,6549373,5509966,101782,937625
10/4/2020,India,6623815,5586703,102685,934427
10/5/2020,India,6685082,5662490,103569,919023
10/6/2020,India,6757131,5744693,104555,907883
10/7/2020,India,6835655,5827704,105526,902425
10/8/2020,India,6906151,5906069,106490,893592
10/9/2020,India,6979423,5988822,107416,883185
10/10/2020,India,7053806,6077976,108334,867496
10/11/2020,India,7120538,6149535,109150,861853
10/12/2020,India,7175880,6227295,109856,838729
10/13/2020,India,7239389,6301927,110586,826876
10/14/2020,India,7307097,6383441,111266,812390
10/15/2020,India,7370468,6453779,112161,804528
10/16/2020,India,7432680,6524595,112998,795087
10/17/2020,India,7494551,6597209,114031,783311
10/18/2020,India,7550273,6663608,114610,772055
10/19/2020,India,7597063,6733328,115197,748538
10/20/2020,India,7651107,6795103,115914,740090
10/21/2020,India,7706946,6874518,116616,715812
10/22/2020,India,7761312,6948497,117306,695509
10/23/2020,India,7814682,7016046,117956,680680
10/24/2020,India,7864811,7078123,118534,668154
10/25/2020,India,7909959,7137228,119014,653717
10/26/2020,India,7946429,7201070,119502,625857
10/27/2020,India,7990322,7259509,120010,610803
10/28/2020,India,8040203,7315989,120527,603687
10/29/2020,India,8088851,7373375,121090,594386
10/30/2020,India,8137119,7432829,121641,582649
10/31/2020,India,8184082,7491513,122111,570458
11/1/2020,India,8229313,7544798,122607,561908
11/2/2020,India,8267623,7603121,123097,541405
11/3/2020,India,8313876,7656478,123611,533787
11/4/2020,India,8364086,7711809,124315,527962
11/5/2020,India,8411724,7765966,124985,520773
11/6/2020,India,8462080,7819886,125562,516632
11/7/2020,India,8507754,7868968,126121,512665
11/8/2020,India,8553657,7917373,126611,509673
11/9/2020,India,8591730,7959406,127059,505265
11/10/2020,India,8636011,8013783,127571,494657
11/11/2020,India,8683916,8066501,128121,489294
11/12/2020,India,8728795,8115580,128668,484547
11/13/2020,India,8773479,8163572,129188,480719
11/14/2020,India,8814579,8205728,129635,479216
11/15/2020,India,8845127,8249579,130070,465478
11/16/2020,India,8874290,8290370,130519,453401
11/17/2020,India,8912907,8335109,130993,446805
11/18/2020,India,8958483,8383602,131578,443303
11/19/2020,India,9004365,8428409,132162,443794
11/20/2020,India,9050597,8478124,132726,439747
11/21/2020,India,9095806,8521617,133227,440962
11/22/2020,India,9139865,8562641,133738,443486
11/23/2020,India,9177840,8604955,134218,438667
11/24/2020,India,9222216,8642771,134699,444746
11/25/2020,India,9266705,8679138,135223,452344
11/26/2020,India,9309787,8718517,135715,455555
11/27/2020,India,9351109,8759969,136200,454940
11/28/2020,India,9392919,8802267,136696,453956
11/29/2020,India,9431691,8847600,137139,446952
11/30/2020,India,9462809,8889585,137621,435603
12/1/2020,India,9499413,8932647,138122,428644
12/2/2020,India,9534964,8973373,138648,422943
12/3/2020,India,9571559,9016289,139188,416082
12/4/2020,India,9608211,9058822,139700,409689
12/5/2020,India,9644222,9100792,140182,403248
12/6/2020,India,9677203,9139901,140573,396729
12/7/2020,India,9703770,9178946,140958,383866
12/8/2020,India,9735850,9215581,141360,378909
12/9/2020,India,9767371,9253306,141772,372293
12/10/2020,India,9796744,9290809,142185,363750
12/11/2020,India,9826775,9324328,142628,359819
12/12/2020,India,9857029,9357464,143019,356546
12/13/2020,India,9884100,9388159,143355,352586
12/14/2020,India,9906165,9422636,143709,339820
12/15/2020,India,9932547,9456449,144096,332002
12/16/2020,India,9956557,9489740,144451,322366
12/17/2020,India,9979447,9520827,144789,313831
12/18/2020,India,10004599,9550712,145136,308751
12/19/2020,India,10031223,9580402,145477,305344
12/20/2020,India,10055560,9606111,145810,303639
12/21/2020,India,10075116,9636487,146111,292518
12/22/2020,India,10099066,9663382,146444,289240
12/23/2020,India,10123778,9693173,146756,283849
12/24/2020,India,10146845,9717834,147092,281919
12/25/2020,India,10169118,9740108,147343,281667
12/26/2020,India,10187850,9761538,147622,278690
12/27/2020,India,10207871,9782669,147901,277301
12/28/2020,India,10224303,9807569,148153,268581
12/29/2020,India,10244852,9834141,148439,262272
12/30/2020,India,10266674,9860280,148738,257656
12/31/2020,India,10266674,9860280,148738,257656`

var temp;
var temp_array = covid_data.split("\n");
var covid_array = [[],[],[],[],[],[]];
for(i = 0; i < temp_array.length; i++){
  temp = temp_array[i].split(",");
  for(j = 0; j < temp.length; j++){
    covid_array[j].push(temp[j]);
  }
}

var vtx = document.getElementById('covidChart').getContext('2d');

var covid_chart = new Chart(vtx, {
  type: 'line',
  data: {
    labels: covid_array[0].map(alphanumeric_date),
    datasets: [{
      label: 'Recovered',
      data: covid_array[3],
      borderColor: 'rgb(54, 162, 235)'
    }, {
      label: 'Deaths',
      data: covid_array[4],
      borderColor: 'rgb(255, 99, 132)'
    }, {
      label: 'Active',
      data: covid_array[5],
      borderColor: 'rgb(255, 205, 86)'
    }]
  },
  options: {
    title: {
      display: true,
      text: 'Covid Cases in India',
      fontSize: 24
      },
    scales:{
      yAxes: [{
        scaleLabel: {
          display: true,
          labelString: '# of People (Logarithmic Scale)'
        },
        type: 'logarithmic'
      }]
    }
  }
})