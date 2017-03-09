// Check the file api is supported
if (!(window.File && window.FileReader && window.FileList && window.Blob)) {
  alert('The File APIs are not fully supported in this browser.');
}

// Used for updating load bar
var lastLoadPercentage = 0;

// Index of the current thread being processed
var i = 0;

// Temp store for message data
var messageDataArray = [];

// Percentage for load bar
let percentage = 0;

// The load file bar element
const loadFileElem = document.getElementById("loadFile");

// The load bar bar element
const elemLoadData = document.getElementById("loadData");

// Loads file and creates data structure
function handleFileSelect1(evt, callBackLoaded) {

  var files = evt.target.files; // FileList object

  // files is a FileList of File objects. List some properties.
  var output = [];
  for (let i = 0, f; f = files[i]; i++) {
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
  let dataElem = document.createElement('html');
  dataElem.innerHTML = reader.result;

  threads = dataElem.getElementsByClassName('thread');

    // dataStruct = createWorkableDataStructure(threads);
    oldDate = new Date();
    createWorkableDataStructure(threads, callBackLoaded);
  }

  // Only read the first file
  reader.readAsText(files[0]);
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

var metric2 = 0;

// Conerts the html structure into a workable data structure
function createWorkableDataStructure(threads, callBackLoaded) {

  var thread = document.createElement('div');
  
  processThread();

  function processThread(){

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

    // Call the function in control once the data is loaded
    callBackLoaded(messageDataArray);
    return messageDataArray;
  } else {
    setTimeout(processThread, 0);
  }
  }
}
}

// Util function that returns people in thread given the thread
function getPeopleInThread(thread) {
  return thread.innerHTML.substr(0, thread.innerHTML.indexOf('<')).split(',');
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
