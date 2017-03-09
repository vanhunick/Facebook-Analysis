// Holds if the user data has been loaded
var loaded = false;

// Data processor with the user data once loaded is set to true
var DPUser;

var user = 'nicky van hulst';

// Array of friends for autocomplete searching
var friends = ["No data"];

// Array of words for autocomplete searching
var words = ["No data"];

// Used to generate random data
var dataGenerator = new DataGen(someWords,names);

// Example data
var DPRandom = new DataProcessor(dataGenerator.getMessageArray(1000));

// Called when the upload file button is pressed
function handleFileSelect(evt) {
    handleFileSelect1(evt, loadedData); //TODO change to loadFile
}

// Called when the user data is loaded
function loadedData(data){
    loaded = true;
    DPUser = new DataProcessor(data);

    // Assings the arrays for the autocomplete
    friends = DPUser.listPeople();
    words = DPUser.getUniqueWords(true);

    // Add friends to the autocomplete
    updateAutocomplete();
    updateWordAutocomplete();

    // Set defaults
    friendSearched(friends[0]);
    wordSearched(words[0]);
    let thehtml = 'Selected friend : <span style="color: orangered;">' + friends[0];
    $('#search-output').html(thehtml);

    thehtml = 'Selected Word : <span style="color: orangered;">' + words[0];
    $('#search-output-word').html(thehtml);

    // $('#general-wrap').html("");
    showLineGraph(DPUser.totalMessagesOverTime(),"stat-line", " Total Messages Over Time", "Messages count");

    //draw the pie

    showPie(data, "pie", "A great pie");

    // Draw the bar graph
    showBarGraph(DPUser.createYearCountMap(), 'bar-mpy', "Messages sent and recieved", "Messages count");

    // The table with the users stats
    createStatisticsTable(DPUser.createMetaData());
}

function getGeneralStatsHTML(rowNumber){
  let outerWell = $("<div>", {id: "general-stats-"+rowNumber, "class": "well"}); // outer well
  let row = $("<div>", {"class": "row text-left"}); // row
  let barDiv = $("<div>", {id: "bar-mpy-"+rowNumber, "class": "col-md-6 text-center"}); // bar graph div
  let pieDiv = $("<div>", {id: "pie-"+rowNumber, "class": "col-md-6 text-center"}); // pie graph div

  row.append(barDiv);
  row.append(pieDiv);
  outerWell.append(row);
  $('#general-wrap').append(outerWell);
}

getGeneralStatsHTML(0);


// Show random data to the user on first load
function displayRandomData(){

    friends = DPRandom.listPeople(DPRandom.getMessageArray());
    words = DPRandom.getUniqueWords(true);

    updateAutocomplete();
    updateWordAutocomplete();

    showPie(DPRandom.getMessageArray(), "pie", "Top 5 people");
    createStatisticsTable(DPRandom.createMetaData());
    showBarGraph(DPRandom.createYearCountMap(), "bar-mpy","Messages per year","Messages count");
    let gs= "general-stats";


    showLineGraph(DPRandom.totalMessagesOverTime(),"stat-line", "Total Messages Over Time","Messages count");

    friendSearched(friends[0]);
    wordSearched(words[0]);

    $('#search-output').html('Selected friend : <span style="color: orangered;">' + friends[0]);
    $('#search-output-word').html('Selected word : <span style="color: orangered;">' + words[0]);
}

function removeMyself(id){
    $('#'+id).remove();
}


// Decides if the random data or the user data should be used called when user searches friend
function friendSearched(val){
  showFriendStats(val, loaded ? DPUser : DPRandom);
}

// Decides if the random data or the user data should be used called when user searches word
function wordSearched(val){
    showWordStats(val, loaded ? DPUser : DPRandom);
}

// The loaded friends
function getFriends(){
  return friends;
}

// The loaded friends
function getWords(){
  return words;
}

// Displays the friend stats on the table
function createStatisticsTable(metaData){
  $('#tms').html(metaData.totalSent);
  $('#tmr').html(metaData.totalRecieved);
  $('#tm').html(metaData.totalMessages);
  $('#tw').html(metaData.totalWords);
}

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

// Fills out the the statistics table and draws the graphs for friend statistics
function showFriendStats(friendString, dataProcessor){
  let friendData = dataProcessor.createFriendMetaData(friendString);
  console.log(friendData);

  $('#tmsF').html(friendData.totalSent);
  $('#tmrF').html(friendData.totalRecieved);
  $('#tmF').html(friendData.totalMessages);
  $('#twF').html(friendData.totalWords);
  $('#pms').html((((friendData.totalSent + friendData.totalRecieved)) / friendData.totalMessages) * 100); // Percent of total messages sent
  $('#statF').html("Statistics for you and " + friendString);
  $("#wordTableF").show();

  // Show the line graph
  showLineGraph(dataProcessor.friendMessagesOverTime(friendString),"friend-line-1", "MSG's Recieved from " + friendString, "Total");

  showLineGraph(dataProcessor.averageOverTotalMessages(dataProcessor.totalMessagesOverTime(),dataProcessor.friendMessagesOverTime(friendString)),"friend-line", "MSG's Recieved % from  " + friendString, "Percentage (%)");
}

var initialLoad = true;

function showWordStats(val,dataProcessor){
  // Create some other stat table
  // word-table
  // Friend used with the most

  // Grab data from
  let wordStats = dataProcessor.createWordMetaData(val);

  $('#word-table').html(
    '<table class="table table-striped table-hover" id="wordTableF" style="width:50%">'+
      '<thead><tr><th colspan="2" id="statF">Word statistics friends</th></tr></thead>'+
          '<tbody>'+
            '<tr><th>Total occourences</th><th id="twF">'+ wordStats.occourences +'</th></tr>'+
            '<tr><th>Times sent</th><th id="tmF">'+ wordStats.sent +'</th></tr>'+
            '<tr><th>Times recieved</th><th id="tmsF">'+ wordStats.recieved +'</th></tr>'+
            '<tr><th>Percent total</th><th id="tmsF">'+ wordStats.percent +'</th></tr>'+
          '</tbody>'+
        '</table>' +"");
    showLineGraph(dataProcessor.wordUssageOverTime(val),"word-time", "Word Frequency over time");
}


document.getElementById('files').addEventListener('change', handleFileSelect, false);
