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
var dataGenerator = new DataGen();

// Example data
var DPRandom = new DataProcessor(dataGenerator.getMessageArray(10000));

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

    // d3.select("svg").selectAll("*").remove();
    showLineGraph(DPUser.totalMessagesOverTime(),"stat-line", " Total Messages Over Time");

    //draw the pie
    createDataAndShowPie(data);

    // Draw the bar graph
    genBarGraph(DPUser);

    // The table with the users stats
    createStatisticsTable(DPUser.createMetaData());
}


// Show random data to the user on first load
function displayRandomData(){

    friends = DPRandom.listPeople(DPRandom.getMessageArray());
    words = DPRandom.getUniqueWords(true);

    updateAutocomplete();
    updateWordAutocomplete();

    createDataAndShowPie(DPRandom.getMessageArray());
    createStatisticsTable(DPRandom.createMetaData());
    genBarGraph(DPRandom);

    showLineGraph(DPRandom.totalMessagesOverTime(),"stat-line", "Total Messages Over Time");

    friendSearched(friends[0]);
    wordSearched(words[0]);

    $('#search-output').html('Selected friend : <span style="color: orangered;">' + friends[0]);
    $('#search-output-word').html('Selected word : <span style="color: orangered;">' + words[0]);

    // showLineGraph(DPRandom.wordUssageOverTime("memphian")) // TEST WORD
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

function genBarGraph(proc){
  showYearBarGraph(proc.createYearCountMap());
}

// TODO
function showFriendStats(friendString, dataProcessor){
  let friendData = dataProcessor.createFriendMetaData(friendString);

  $('#tmsF').html(friendData.totalSent);
  $('#tmrF').html(friendData.totalRecieved);
  $('#tmF').html(friendData.totalMessages);
  $('#twF').html(friendData.totalWords);
  $('#pms').html((((friendData.totalSent + friendData.totalRecieved)) / friendData.totalMessages) * 100); // Percent of total messages sent
  $('#statF').html("Statistics for you and " + friendString);
  $("#wordTableF").show();

  // Show the line graph
  showLineGraph(dataProcessor.friendMessagesOverTime(friendString),"friend-line-1", "Messages Recieved over time from friend");

  showLineGraph(dataProcessor.averageOverTotalMessages(dataProcessor.totalMessagesOverTime(),dataProcessor.friendMessagesOverTime(friendString)),"friend-line", "Messages Recieved");
}


function showWordStats(val,dataProcessor){
  // Create some other stat table

  showLineGraph(dataProcessor.wordUssageOverTime(val),"word-time", "Word Frequency over time");
}


document.getElementById('files').addEventListener('change', handleFileSelect, false);
