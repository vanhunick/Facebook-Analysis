var barMargin = { top: 60, right: 20, bottom: 30, left: 50 },
    barWidth = 550 - barMargin.left - barMargin.right,
    barHeight = 350 - barMargin.top - barMargin.bottom;

var formatPercent = d3.format("0");

var barGraphs = [];

function BarGraph(id,svg){
    this.id = id;
    this.svg = svg;
    this.x = d3.scaleBand().range([0, barWidth]).padding(0.1);
    this.y = d3.scaleLinear().range([barHeight, 0]);
    this.xAxis = d3.axisBottom();
    this.yAxis = d3.axisLeft();
}    

function showBarGraph(data, divID, title){
    var exists = false;
    barGraphs.forEach(function(barGraph){
        if(barGraph.id === divID){
            updateBarGraph(data,barGraph);
            exists = true;
        }
    });
    if(!exists){
        createNewBarGraph(data,divID,title);
    }
}

function createNewBarGraph(data, id, title){
    var svg = d3.select('#'+id).append("svg")
        .attr("width", barWidth + barMargin.left + barMargin.right)
        .attr("height", barHeight + barMargin.top + barMargin.bottom)
        .append("g")
        .attr("transform", "translate(" + barMargin.left + "," + barMargin.top + ")");

   barGraph = new BarGraph(id,svg);
   barGraphs.push(barGraph);     

    barGraph.x.domain(data.map(function (d) { return d.letter; }));
    barGraph.y.domain([0, d3.max(data, function (d) { return d.frequency; })]);

    barGraph.xAxis.scale(barGraph.x);
    barGraph.yAxis.scale(barGraph.y);

    barGraph.svg.append("g")
        .attr("class", "y axis")
        .call(barGraph.yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Frequency");

    barGraph.svg.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function (d) { return barGraph.x(d.letter); })
        .attr("width", barGraph.x.bandwidth())
        .attr("y", function (d) { return barGraph.y(d.frequency); })
        .attr("height", function (d) { return barHeight - barGraph.y(d.frequency); });

    barGraph.svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + barHeight + ")")
        .call(barGraph.xAxis);

    barGraph.svg.append("text")
        .attr("x", (barWidth / 2))
        .attr("y", 0 - (barMargin.top / 2))
        .attr("text-anchor", "middle")
        .attr('class','graph-title')
        .text(title);
}


function updateBarGraph(data, graph){
        // Set the domains
        graph.x.domain(d3.extent(data, function (d) { return d.date; }));
        graph.y.domain(d3.extent(data, function (d) { return d.count; }));

        graph.xAxis.scale(graph.x);
        graph.yAxis.scale(graph.y);

        // Update the axis
        graph.svg.select('.yAxis').call(graph.yAxis);
        graph.svg.select('.xAxis').call(graph.xAxis);

        // Update bars
        graph.svg.selectAll(".bar")
        .data(data)
        .attr("x", function (d) { return graph.x(d.letter); })
        .attr("width", barGraph.x.bandwidth())
        .attr("y", function (d) { return graph.y(d.frequency); })
        .attr("height", function (d) { return barHeight - barGraph.y(d.frequency); });
}
