function Create(Data) {
  var Border = { top: 10, right: 30, bottom: 30, left: 60 },
    width = 800 - Border.left - Border.right,
    height = 600 - Border.top - Border.bottom;


  // X - axis
  var x = d3.scaleLinear()
    .domain([d3.min(Data.map(data => data.X)), d3.max(Data.map((data) => data.X))])
    .range([0, width]);

  // SVG object
  var svg = d3.select("#G")
    .append("svg")
    .attr("height", height + Border.top + Border.bottom)
    .attr("width", width + Border.left + Border.right)
    .append("g")
    .attr("transform",
      "translate(" + Border.left + "," + Border.top + ")");


  var y = d3.scaleLinear()
    .domain([d3.min(Data.map((data) => data.Y)), d3.max(Data.map((data) => data.Y + 0.1))])
    .range([height, 0]);
  svg.append("g")
    .call(d3.axisLeft(y));

    svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  // Plotting
  svg.append("path")
    .datum(Data)
    .attr("fill", "grey")
    .attr("stroke", "none")
    .attr("d", d3.line()
      .x(function (d) { return x(d.X) })
      .y(function (d) { return y(d.Y) })
    )
}

function Gamma(x) {
  var u = [0.99999999999980993, 676.5203681218851, -1259.1392167224028,
    771.32342877765313, -176.61502916214059, 12.507343278686905,
    -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7
  ];
  var v = 7;
  var a = Math.PI;
  var b = Math.sin(a * x);
  var c = Math.sqrt(2 * a);
  if (x < 0.5) {
    return a / (b * Gamma(1 - x));
  }

  x -= 1;
  var y =  0.5 + v + x;
  var w = u[0];
  for (var r = 1; r < u.length; r++) {
    w += u[r] / (x + r);
  }

  return c * Math.pow(y, x + 0.5) * Math.exp(-y) * w;
}

function Plot(p, n) {
  var Data = []
  var a = Math.PI;
  const root = Math.sqrt(a);
  function Point(n, x) {
    return (Gamma((n + 1) / 2) * (Math.pow((1 + (x ** 2) / n), (-(n + 1) / 2)))) / ((Math.sqrt(n) * root) * Gamma(n / 2));
  }

  function D(n) {
    var x = -p;
    while (x < p) {
      Data.push({ "X": x, "Y": Point(n, x) });
      x = x + 0.1;
    }
  }
  D(n);
  Create(Data);
}

var val = 25;
var Slider = document.getElementById("Range");
$("#text").html(Slider.value);
Plot(val, Number(Slider.value));


Slider.oninput = function(){
  $('#G').html('');
  $("#text").html(this.value);
  Plot(val, Number(this.value));
}
