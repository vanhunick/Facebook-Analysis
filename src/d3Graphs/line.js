

var lineGraphs = [];

var parseTime = d3.timeParse("%Y %B"); // year month


function LineGraph(id,svg){
  this.margin =  { top: 60, right: 20, bottom: 40, left: 30 };
  this.width = 500 - this.margin.left - this.margin.right;
  this.height = 400 - this.margin.top - this.margin.bottom;
  this.id = id;
  this.svg = svg;
  this.x = d3.scaleTime().rangeRound([0, this.width]);
  this.y = d3.scaleLinear().rangeRound([this.height,0])
  this.xAxis = d3.axisBottom();
  this.yAxis = d3.axisLeft();
}

function showLineGraph(data, divId, title){
  let exists = false;
  lineGraphs.forEach(function(graph){
    if(graph.id === divId){
      updateLineGraph(data,graph);
      exists = true;
    }
  });
  if(!exists){
    createNewLineGraph(data,divId,title);  
  }
}

function updateLineGraph(data, graph){      
        // Convert data into correct types
        for (let i = 0; i < data.length; i++) {
            data[i].count = +data[i].count;
            data[i].date = parseTime(data[i].date);
        }
        data.sort((a, b) => a.date - b.date);

        // Set the domains
        graph.x.domain(d3.extent(data, function (d) { return d.date; }));
        graph.y.domain(d3.extent(data, function (d) { return d.count; }));

        graph.xAxis.scale(graph.x);
        graph.yAxis.scale(graph.y);

        // Update the axis
        graph.svg.select('.yAxis').call(graph.yAxis);
        graph.svg.select('.xAxis').call(graph.xAxis);


        var line = d3.line()
            .x(function (d) { return graph.x(d.date); })
            .y(function (d) { return graph.y(d.count); });
    // Make the changes
    graph.svg.select(".line")
        .transition()   // change the line
        .duration(750)
        .attr("d", line(data));
}

// Only call the first time to create a specific graph
function createNewLineGraph(data, divId, title) {

  var margin =  { top: 60, right: 20, bottom: 40, left: 30 };
  var width = 500 - margin.left - margin.right;
  var height = 400 - margin.top - margin.bottom;
    // First create and append the svg
    var svg = d3.select("#"+divId).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)

    // Create the graph object with the id and the svg
    var graph = new LineGraph(divId,svg);
    lineGraphs.push(graph);


    var g = graph.svg.append("g").attr("transform", "translate(" + graph.margin.left + "," +graph.margin.top + ")");

    // Convert data into correct types
    for (let i = 0; i < data.length; i++) {
        data[i].count = +data[i].count;
        data[i].date = parseTime(data[i].date);
    }

    // now sort them as they are date objects
    data.sort((a, b) => a.date - b.date);

    graph.xAxis.scale(graph.x);
    graph.yAxis.scale(graph.y);

    var line = d3.line()
        .x(function (d) { return graph.x(d.date); })
        .y(function (d) { return graph.y(d.count); });

    graph.x.domain(d3.extent(data, function (d) { return d.date; }));
    graph.y.domain(d3.extent(data, function (d) { return d.count; }));

    g.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("d", line(data));


    g.append("g")
        .attr("class", "axis xAxis")
        .attr("transform", "translate(0," + graph.height + ")")
        .call(graph.xAxis);

    g.append("g")
        .attr("class", "axis yAxis")
        .call(graph.yAxis)
        .append("text")
        .attr("fill", "#fff")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .style("text-anchor", "end")
        .text("Frequency");
}
