
var pies = [];

function Pie(id,svg){
    this.id = id;
    this.svg = svg;
    this.d3Pie = d3.pie().sort(null).value(function (d) { return d.count; });
    this.path = null;
}



function showPie(data, divID, title){
    let exists = false;
    pies.forEach(function(pie){
        if(pie.id === divID){
            updatePie(createPieData(data),pie,title);
            exists = true;
        }
    });

    if(!exists){
        createNewPie(createPieData(data),divID,title);
    }
}




var niceColors = ["#e69a61", "#9817ff", "#18c61a", "#33b4ff", "#c9167e", "#297853", "#d7011b", "#7456c7"];
var color = d3.scaleOrdinal(niceColors);

var pieWidth = 350,
    pieHeight = 350,
    pieRadius = Math.min(pieWidth, pieHeight) / 2;

var arc = d3.arc()
    .outerRadius(pieRadius)
    .innerRadius(pieRadius - 70);


var labelArc = d3.arc()
    .outerRadius(pieRadius - 40)
    .innerRadius(pieRadius - 40);

function createNewPie(data, divID, title) {
    var svg = d3.select("#"+divID).append("svg")
        .attr("width", pieWidth)
        .attr("height", pieHeight)
        .append("g")
        .attr("transform", "translate(" + pieWidth / 2 + "," + pieHeight / 2 + ")");

    let pieGraph = new Pie(divID, svg);        
    pies.push(pieGraph);


    pieGraph.path = pieGraph.svg.selectAll('path')
        .data(pieGraph.d3Pie(data))
        .enter()
        .append('path')
        .attr('d', arc)
        .attr('fill', function (d) {
            return color(d.data.name);
        })
        .on("mouseover", function(d, i) {
          
          svg.append("text")
            .attr("dy", ".5em")
            .style("text-anchor", "middle")
            .style("font-size", 45)
            .attr("class","label")
            .style("fill", function(d,i){return "black";})
            .text(d.data.name);
          
      })
      .on("mouseout", function(d) {
        svg.select(".label").remove();
      });

    var g = pieGraph.svg.selectAll(".arc")
        .data(pieGraph.d3Pie(data))
        .enter().append("g")
        .attr("class", "arc");

    function type(d) {
        d.count = +d.count;
        return d;
    }
}

function updatePie(data, pie, title){
    pie.d3Pie.value
    pie.path.data(pie.d3Pie(data));
    pie.path.transition().duration(750).attrTween("d", arcTween); // redraw the arcs    
}

// Store the displayed angles in _current.
// Then, interpolate from _current to the new angles.
// During the transition, _current is updated in-place by d3.interpolate.
function arcTween(a) {
    var i = d3.interpolate(this._current, a);
    this._current = i(0);
    return function(t) {
        return arc(i(t));
    };
}


function createPieData(dataStruct){
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
      return peopleArray;
    } else {
      return peopleArray.splice(peopleArray.length-6, peopleArray.length-1);
    }
}