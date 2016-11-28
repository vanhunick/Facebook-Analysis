// Check the file api is supported
if (!(window.File && window.FileReader && window.FileList && window.Blob)) {
  alert('The File APIs are not fully supported in this browser.');
}

let percentage = 0;// Percentage for load bar

// Holds the html of the message data
let dataElem;

// Holds the threads of the message file
let threads;

// The converted data structure
var dataStruct;

// Array of friends used for searching
var friends = ["No Data"];

// The load file bar element
const loadFileElem = document.getElementById("loadFile");

// The load bar bar element
const elemLoadData = document.getElementById("loadData");

// Setup for default data
// dataStruct = randomData;
// console.log(dataStruct.length);
// friends = listPeople(messageDataArray);
// updateAutocomplete();
// createPie(messageDataArray);

function handleFileSelect(evt) {
  var files = evt.target.files; // FileList object

  // files is a FileList of File objects. List some properties.
  var output = [];
  for (let i = 0, f; f = files[i]; i++) {
    console.log("Name " + f.name);
    output.push('<li><strong>', escape(f.name), '</strong> (', f.type || 'n/a', ') - ',
      f.size, ' bytes, last modified: ',
      f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a',
      '</li>');
  }



  var reader = new FileReader();

  // Sets a function to call when progress is made loading the file
  reader.onprogress = updateProgress;


  // Wait for the file to be read
  reader.onload = function (e) {

    // Set the load bar to 100% as the file is now loaded
    loadFileElem.style.width = 100 + '%';
    loadFileElem.textContent = 100 + '%';


    // Set the html element with file data and find all threads
    var text = reader.result;
    dataElem = document.createElement('html');
    dataElem.innerHTML = text;
    threads = dataElem.getElementsByClassName('thread');

    dataStruct = createWorkableDataStructure();
  }


  // Only read the first file
  reader.readAsText(files[0]);
}


function listPeople(dataStruct) {
  let peopleSet = {};

  for (var i = 0; i < dataStruct.length; i++) {
    var name = dataStruct[i].sender;
    peopleSet[name] = true;
  }

  // Create a array with the unique people talked to
  var names = [];
  for (var id in peopleSet) {
    names.push(id);
  }
  return names;
}


// Creates a map where word is the key and value is the count
function createWordMap(dataElem) {
  let entry = {
    word: "",
    count: 0
  };

  let wordMap = {};

  for (let i = 0; i < dataElem.length; i++) {
    constructMap(wordMap, dataElem.words);
  }

  let wordArray = [];
  for (var key in wordMap) {
    let newEntry = Object.create(entry);
    newEntry.word = key;
    newEntry.count = wordMap[key];
    wordArray.push(newEntry);
  }
  wordArray.sort(function (a, b) { return a.count - b.count });
}


// Creates a map where word is the key and value is the count
function createYearCountMap(dataElem) {
  let entry = {
    letter: "",
    frequency: 0
  };

  let yearMap = {};
  
  for (let i = 0; i < dataElem.length; i++) {
    if(yearMap[dataElem[i].timeData.year] === undefined){
      yearMap[dataElem[i].timeData.year] = 0;
    }
    yearMap[dataElem[i].timeData.year]++;
  }

  let wordArray = [];
  for (var key in yearMap) {
    let newEntry = Object.create(entry);
    newEntry.letter = key;
    newEntry.frequency = yearMap[key];
    wordArray.push(newEntry);
  }
  return wordArray;
}


// Used to find the count of unique words
function constructMap(map, words) {
  for (let i = 0; i < words.length; i++) {
    let word = words[i];
    if (map[word] === undefined) {
      map[word] = 0;
    }
    map[word]++;// Increment count for word
  }
  return map;
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


// The time data format 
function timeData(day, month, monthDay, year, time, timeZone, am) {
  this.day = day;
  this.month = month;
  this.monthDay = monthDay;
  this.year = year;
  this.time = time;
  this.timeZone = timeZone;
  this.am = am;
}


// The complete message data format
function messageData(sender, peopleInThread, timeData, words) {
  this.sender = sender;
  this.peopleInThread = peopleInThread;
  this.timeData = timeData;
  this.words = words;
}


// A print function used for debugging
function printDataStruct(data) {
  console.log("Sender : " + data.sender);
  let str = "";
  for (let i = 0; i < data.peopleInThread.length; i++) {
    str += data.peopleInThread[i] + " ";
  }
  console.log("People in thread : " + str);

  console.log("Time Data : " + data.timeData.day + " " + data.timeData.month + " " + data.timeData.monthDay + " " + data.timeData.year + " " + data.timeData.time + " " + data.timeData.am);

  let strW = "";
  for (let i = 0; i < data.words.length; i++) {
    strW += data.words[i] + " ";
  }
  console.log("Message : " + strW);
}


// Util function that returns people in thread given the thread
function getPeopleInThread(thread) {
  // Get the string that represents people in the thread
  let index = 0;
  while (thread.innerHTML.charAt(index) !== '<') {
    index++;
  }

  let str = thread.innerHTML.substr(0, index);
  let people = str.split(",");
  for(let i = 0; i < people.length; i++){
    people[i] = people[i].replace(/,/g, ""); // Remove the comma from each person
    if(people[i].startsWith(" ")){
      people[i] = people[i].replace(" ","");
    }

  }
  return people;
}


// Util function that returns a timeData object given the meta data from the message file
function getTimeData(meta) {
  let stripedTime = meta.replace(/,/g, ""); // Replace all the commas with empty string
  let timeDataArray = stripedTime.split(" ");
  let am = timeDataArray[5].includes('p') ? true : false;

  return new timeData(timeDataArray[0], timeDataArray[1], timeDataArray[2], timeDataArray[3], timeDataArray[5], timeDataArray[6], am); // index 4 is 'at' so it is skipped
}


// Seperated out incase I want to do extra things with it later like change to lower case
function getWordsFromMessage(message) {
  return message.split(" ");
}


var threadsProc = 0;
var thread = document.createElement('div');
var lastLoadPercentage = 0;
var i = 0;

let messageDataArray = [];

// Conerts the html structure into a workable data structure
function createWorkableDataStructure() {
  

  if (i < threads.length) {//threads.length
    let percentDone = Math.floor((i / threads.length) * 100);

    if (percentDone > lastLoadPercentage) {
      lastLoadPercentage = percentDone;
      percentage = percentDone;

      elemLoadData.style.width = percentage + '%';
      elemLoadData.textContent = percentage + '%';
    }

    thread.innerHTML = threads[i].innerHTML;

    let peopleInThread = getPeopleInThread(thread);
    let users = thread.getElementsByClassName('user');
    let meta = thread.getElementsByClassName('meta');
    let messages = thread.getElementsByClassName('message');
    let messagesHead = thread.getElementsByClassName('message_header');
    let p = thread.getElementsByTagName('p');

    
    for (let j = 0; j < messages.length; j++) {

      let timeData = getTimeData(meta[j].textContent); // Create the time data object
      let words = getWordsFromMessage(p[j].textContent); // Get the wors in the message
      let user = users[j].textContent; // Get the person that sent the message 

      let tempMessageData = new messageData(user, peopleInThread, timeData, words);
      messageDataArray.push(tempMessageData);
    }
    i++;
  if (i === threads.length) {// threads.length
    var elem = document.getElementById("loadData");
    elemLoadData.style.width = 100 + '%';
    elemLoadData.textContent = 100 + '%'; 
    
    friends = listPeople(messageDataArray);
    updateAutocomplete();
    createPie(messageDataArray);
    return messageDataArray;
  } else {
    setTimeout(createWorkableDataStructure, 0);
  }
  }


  
}

function getFriends(){
  return friends;
}

function genBarGraph(){
  showYearBarGraph(createYearCountMap(dataStruct));
}


// Called when progress is made loading the file
function updateProgress(evt) {
  let elem = document.getElementById("loadFile");
  // evt is an ProgressEvent.
  if (evt.lengthComputable) {
    var percentLoaded = Math.round((evt.loaded / evt.total) * 100);
    // Increase the progress bar length.
    if (percentLoaded < 100) {
      elem.style.width = percentLoaded + '%';
      elem.textContent = percentLoaded + '%';
    }
  }
}




function createStatisticsTable(){
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

let user = "Nicky van Hulst"

function friendSearched(friendString){
  
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


document.getElementById('files').addEventListener('change', handleFileSelect, false);
