function showLineGraph(input) {
    var margin = { top: 40, right: 20, bottom: 80, left: 50 },
        width = 800 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;

    var svg = d3.select("#word-time").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)

    var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var parseTime = d3.timeParse("%Y %B"); // year month

    data = input;

    // Convert data into correct types
    for (let i = 0; i < data.length; i++) {
        data[i].count = +data[i].count;
        data[i].date = parseTime(data[i].date);
    }

    // now sort them as they are date objects
    data.sort((a, b) => a.date - b.date);

    var x = d3.scaleTime()
        .rangeRound([0, width]);

    var y = d3.scaleLinear()
        .rangeRound([height, 0]);

    var line = d3.line()
        .x(function (d) { return x(d.date); })
        .y(function (d) { return y(d.count); });

    x.domain(d3.extent(data, function (d) { return d.date; }));
    y.domain(d3.extent(data, function (d) { return d.count; }));

    g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    g.append("g")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(y))
        .append("text")
        .attr("fill", "#000")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .style("text-anchor", "end")
        .text("Frequency");

    g.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("d", line);
}