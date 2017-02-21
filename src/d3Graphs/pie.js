function createDataAndShowPie(dataStruct){
    let entry = {
        name: "",
        count: 0
      };

    let peopleMap = {};

      for (let i = 0; i < dataStruct.length; i++) {

        if(dataStruct[i].sender.toLowerCase() !== user.toLowerCase()){ // Ignore user messages
          if(peopleMap[dataStruct[i].sender] === undefined){
            peopleMap[dataStruct[i].sender] = 0;
          }
          peopleMap[dataStruct[i].sender]++;
        }
    }

    let peopleArray = [];

      for (var key in peopleMap) {
      let newEntry = Object.create(entry);
      newEntry.name = key;
      newEntry.count = peopleMap[key];
      peopleArray.push(newEntry);
    }

    peopleArray.sort(function (a, b) { return a.count - b.count });

    if(peopleArray.length <= 5){
      showPie(peopleArray);
    } else {
      showPie(peopleArray.splice(peopleArray.length-6, peopleArray.length-1));
    }
}

function showPie(dataSource) {
    var width = 350,
        height = 350,
        radius = Math.min(width, height) / 2;

    var niceColors = ["#4D4D4D","#5DA5DA ","#FAA43A","#60BD68 ","#F17CB0","#B2912F","#B276B2","#DECF3F","#F15854","#FFFF00"];
    // var color = d3.scaleOrdinal(d3.schemeCategory10);
    var color = d3.scaleOrdinal(niceColors);
    console.log(d3.schemeCategory10);

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

    function type(d) {
        d.count = +d.count;
        return d;
    }


}
