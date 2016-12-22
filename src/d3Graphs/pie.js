function showPie(dataSource) {
    var width = 350,
        height = 350,
        radius = Math.min(width, height) / 2;

    var color = d3.scaleOrdinal(d3.schemeCategory10);

    var arc = d3.arc()
        .outerRadius(radius)
        .innerRadius(radius - 70);

    var pie = d3.pie()
        .sort(null)
        .value(function (d) { return d.count; });

    let data = dataSource;

    var svg = d3.select("#pie").append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    var arc = d3.arc()
        .outerRadius(radius - 10)
        .innerRadius(radius - 70);

    var labelArc = d3.arc()
        .outerRadius(radius - 40)
        .innerRadius(radius - 40);

    var path = svg.selectAll('path')
        .data(pie(data))
        .enter()
        .append('path')
        .attr('d', arc)
        .attr('fill', function (d) {
            return color(d.data.name);
        });

    var g = svg.selectAll(".arc")
        .data(pie(data))
        .enter().append("g")
        .attr("class", "arc");

    g.append("text")
        .attr("transform", function (d) { return "translate(" + labelArc.centroid(d) + ")"; })
        .attr("class","pieLabel")
        .attr("dy", ".35em")
        .text(function (d) { return d.data.name; });

    g.append("text")
        .attr("x", (width / 2))
        .attr("y", 40 - (height / 2))
        .attr("text-anchor", "middle")
        .attr('class','graph-title')
        .text("Interactions");

    function type(d) {
        d.count = +d.count;
        return d;
    }
}


