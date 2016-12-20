var margin = {top: 40, right: 20, bottom: 30, left: 50},
    width = 550 - margin.left - margin.right,
    height = 350 - margin.top - margin.bottom;

var formatPercent = d3.format("0");

    // set the ranges
var x = d3.scaleBand()
          .range([0, width])
          .padding(0.1);


    var y = d3.scaleLinear()
          .range([height, 0]);

function showYearBarGraph(dataInput){
var x = d3.scaleBand()
          .range([0, width])
          .padding(0.1);

// var y = d3.scale.linear()
//     .range([height, 0]);

    var y = d3.scaleLinear()
          .range([height, 0]);


var svg = d3.select("#bar-mpy").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// svg.call(tip);


var data = dataInput;

// The following code was contained in the callback function.
x.domain(data.map(function(d) { return d.letter; }));
y.domain([0, d3.max(data, function(d) { return d.frequency; })]);



svg.append("g")
    .attr("class", "y axis")
    .call(d3.axisLeft(y))
  .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("Frequency");

// svg.selectAll(".bar")
//     .data(data)
//   .enter().append("rect")
//     .attr("class", "bar")
//     .attr("x", function(d) { return x(d.letter); })
//     .attr("width", x.bandwidth())
//     .attr("y", function(d) { return y(d.frequency); })
//     .attr("height", function(d) { return height - y(d.frequency); })
//     .on('mouseover', tip.show)
//     .on('mouseout', tip.hide)

      svg.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.letter); })
      .attr("width", x.bandwidth())
      .attr("y", function(d) { return y(d.frequency); })
      .attr("height", function(d) { return height - y(d.frequency); });


svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

    function type(d) {
  d.frequency = +d.frequency;
  return d;
}

}


