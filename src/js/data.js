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
let dataStruct;

// The load file bar element
const loadFileElem = document.getElementById("loadFile");

// The load bar bar element
const elemLoadData = document.getElementById("loadData");

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
  const entry = {
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
  str = str.replace(/,/g, "");
  return str.split(" ");
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

// Conerts the html structure into a workable data structure
function createWorkableDataStructure() {
  let messageDataArray = [];

  if (i < threads.length) {
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

    for (let i = 0; i < messages.length; i++) {

      let timeData = getTimeData(meta[i].textContent); // Create the time data object
      let words = getWordsFromMessage(p[i].textContent); // Get the wors in the message
      let user = users[i].textContent; // Get the person that sent the message 

      let tempMessageData = new messageData(user, peopleInThread, timeData, words);
      messageDataArray.push(tempMessageData);
    }
    setTimeout(createWorkableDataStructure, 0);
    i++;
  }
  if (i === threads.length) {
    var elem = document.getElementById("loadData");
    elemLoadData.style.width = 100 + '%';
    elemLoadData.textContent = 100 + '%';
  }
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

document.getElementById('files').addEventListener('change', handleFileSelect, false);
