var margin = {top: 40, right: 20, bottom: 30, left: 50},
    width = 450 - margin.left - margin.right,
    height = 250 - margin.top - margin.bottom;

var formatPercent = d3.format("0");

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickFormat(formatPercent);

var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "<strong>Frequency:</strong> <span style='color:red'>" + d.frequency + "</span>";
  })

function showYearBarGraph(dataInput){
var svg = d3.select("#bar-mpy").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg.call(tip);

// The new data variable.
//   var data = [
//         {letter: "2011", frequency: 636},
//         {letter: "2012", frequency: 2847},
//         {letter: "2013", frequency: 3516},
//         {letter: "2014", frequency: 2122},
//         {letter: "2015", frequency: 616},
//         {letter: "2016", frequency: 263},
//   ];

var data = dataInput;

// The following code was contained in the callback function.
x.domain(data.map(function(d) { return d.letter; }));
y.domain([0, d3.max(data, function(d) { return d.frequency; })]);

svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
  .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("Frequency");

svg.selectAll(".bar")
    .data(data)
  .enter().append("rect")
    .attr("class", "bar")
    .attr("x", function(d) { return x(d.letter); })
    .attr("width", x.rangeBand())
    .attr("y", function(d) { return y(d.frequency); })
    .attr("height", function(d) { return height - y(d.frequency); })
    .on('mouseover', tip.show)
    .on('mouseout', tip.hide)
}



function type(d) {
  d.frequency = +d.frequency;
  return d;
}