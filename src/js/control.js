// Holds if the user data has been loaded
var loaded = false;

// Data processor with the user data once loaded is set to true
var DPUser;

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
    createPie(data);

    // Draw the bar graph
    genBarGraph(DPUser);

    // The table with the users stats
    createStatisticsTable(DPUser.getMessageArray());
}



// Show random data to the user on first load
function displayRandomData(){

    friends = DPRandom.listPeople(DPRandom.getMessageArray());
    words = DPRandom.getUniqueWords(true);

    updateAutocomplete();
    updateWordAutocomplete();

    createPie(DPRandom.getMessageArray());
    createStatisticsTable(DPRandom.getMessageArray());
    genBarGraph(DPRandom);

    showLineGraph(DPRandom.totalMessagesOverTime(),"stat-line", "Total Messages Over Time");


    friendSearched(friends[0]);
    wordSearched(words[0]);

    $('#search-output').html('Selected friend : <span style="color: orangered;">' + friends[0]);
    $('#search-output-word').html('Selected word : <span style="color: orangered;">' + words[0]);

    // showLineGraph(DPRandom.wordUssageOverTime("memphian")) // TEST WORD
}


function friendSearched(val){
    if(loaded){
        showFriendStats(val,DPUser);
    } else {
        showFriendStats(val,DPRandom);
    }
}

function wordSearched(val){
    if(loaded){
        showWordStats(val,DPUser);
    } else {
        showWordStats(val,DPRandom);
    }
}

// The loaded friends
function getFriends(){
  return friends;
}

// The loaded friends
function getWords(){
  return words;
}

function type(d) {
  d.count = +d.count;
  return d;
}

document.getElementById('files').addEventListener('change', handleFileSelect, false);
