
var user = 'nicky';

// Creates the table that displays the words and the count
function createWordCountTable(data, numbRows) {

  //First grab to table to add to
  var table = document.getElementById("wordTable");

  for (var i = 1; i < numbRows; i++) {
    var row = table.insertRow(i);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    cell1.innerHTML = data[data.length - 1 - i].word;
    cell2.innerHTML = data[data.length - 1 - i].count;
  }
}


// 
function createStatisticsTable(dataStruct){
  let totMessages = 0; totSent = 0; totRec = 0; totWords = 0;

  for(let i = 0; i < dataStruct.length; i++){
      totMessages++;

      if(dataStruct[i].sender.toLowerCase() === "nicky van hulst"){
        totSent++; //TODO update to use users name
      } else {
        totRec++;
      }

      totWords+= dataStruct[i].words.length; 
  }
  console.log(totSent + " " + totRec + " " + totMessages + " " + totWords );

  $('#tms').html(totSent);
  $('#tmr').html(totRec);
  $('#tm').html(totMessages);
  $('#tw').html(totWords);
}


// Create the pie chart
function createPie(dataStruct){
  
  let entry = {
      name: "",
      count: 0 
    };

  let peopleMap = {};

    for (let i = 0; i < dataStruct.length; i++) {
      
      if(dataStruct[i].sender.toLowerCase() !== user.toLowerCase()){ // Ignore user messages
        if(peopleMap[dataStruct[i].sender.toLowerCase()] === undefined){
          peopleMap[dataStruct[i].sender.toLowerCase()] = 0;
        }
        peopleMap[dataStruct[i].sender.toLowerCase()]++;
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

  if(peopleArray.length <= 10){
    showPie(peopleArray);
  } else {
    showPie(peopleArray.splice(peopleArray.length-11, peopleArray.length-1));  
  }
}

function genBarGraph(proc){
  showYearBarGraph(proc.createYearCountMap());
}

// TODO 
function showFriendStats(friendString, messageDataArray){

  
  let totMessages = 0; totSent = 0; totRec = 0; totWords = 0; totMessagesPerson = 0;

  

  for(let i = 0; i < messageDataArray.length; i++){
    totMessages++;

      if(messageDataArray[i].peopleInThread.length === 2){ // Could change later to apply to any thread
        if(messageDataArray[i].peopleInThread[0].toLowerCase() === friendString.toLowerCase() || messageDataArray[i].peopleInThread[1].toLowerCase() === friendString.toLowerCase()){
          totMessagesPerson++;
            if(messageDataArray[i].sender.toLowerCase() === user.toLowerCase()){
                totSent++;
            } else {
                totRec++;    
            }
            totWords+= messageDataArray[i].words.length;
        }
    }
  }

  $('#tmsF').html(totSent);
  $('#tmrF').html(totRec);
  $('#tmF').html(totMessagesPerson);
  $('#twF').html(totWords);
  $('#pms').html((((totSent + totRec)) / totMessages) * 100); // Percent of total messages sent
  $('#statF').html("Statistics for you and " + friendString);
  $("#wordTableF").show();
}

function showWordStats(val,dataProcessor){

}