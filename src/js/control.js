// Holds if the user data has been loaded
var loaded = false;

// Data processor with the user data once loaded is set to true
var DPUser;

// Array of friends for autocomplete searching
var friends = ["No data"];

// Called when the upload file button is pressed
function handleFileSelect(evt) {
    handleFileSelect1(evt, loadedData); //TODO change to loadFile
}

// Called when the user data is loaded
function loadedData(data){
    loaded = true;
    DPUser = new DataProcessor(data);
    friends = DPUser.listPeople();

    // Add friends to the autocomplete
    updateAutocomplete();

    
    // d3.select("svg").selectAll("*").remove();

    //draw the pie 
    createPie(data);

    // Draw the bar graph
    genBarGraph(DPUser);

    // The table with the users stats
    createStatisticsTable(DPUser.getMessageArray());
}

var dataGenerator = new DataGen();// Used to generate random data

// Example data
var DPRandom = new DataProcessor(dataGenerator.getMessageArray(100));

// Show random data to the user on first load
function displayRandomData(){
    
    friends = DPRandom.listPeople(DPRandom.getMessageArray());
    updateAutocomplete();
    createPie(DPRandom.getMessageArray());
    createStatisticsTable(DPRandom.getMessageArray());
    genBarGraph(DPRandom);
}


function friendSearched(val){
    if(loaded){
        showFriendStats(val,DPUser.getMessageArray());
    } else {
        showFriendStats(val,DPRandom.getMessageArray());
    }
}

// The loaded friends
function getFriends(){
  return friends;
}

document.getElementById('files').addEventListener('change', handleFileSelect, false);


