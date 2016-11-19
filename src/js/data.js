// Check the file api is supported
if (!(window.File && window.FileReader && window.FileList && window.Blob)) {
  alert('The File APIs are not fully supported in this browser.');
}

var percentage = 0;// Percentage for load bar
var threads;

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
  document.getElementById('list').innerHTML = '<ul>' + output.join('') + '</ul>';

  var reader = new FileReader();

  // Wait for the file to be read
  reader.onload = function(e) {
    var text = reader.result; // The text in the file as a string
    var dataElem = document.createElement( 'html' );
    dataElem.innerHTML = text; // Create element to work with
    threads = dataElem.getElementsByClassName('thread');

    console.log("Starting Creation of data structure");
    asyncLoop();
    let fancyStruct = createWorkableDataStructure();
    console.log("Finished Creation of data structure");

    var thread = dataElem.getElementsByClassName('thread')[0];

    var people = dataElem.getElementsByClassName('user');

    var dataElemThreads = document.createElement('div');

    dataElemThreads.innerHTML = thread.innerHTML;



    // console.log("t " + thread.innerHTML);

    let p2 = dataElemThreads.getElementsByTagName('p');
    console.log("Test " + p2.length);
    console.log("Test " + dataElemThreads);
    // console.log("Text in thread " + thread.innerHTML);
    
    
    // Get the string that represents people in the thread
    let index = 0;
    while(thread.innerHTML.charAt(index) != '<'){
      index++;
    }
    
    let str = thread.innerHTML.substr(0,index);
    console.log("Concat :" + str);

    var me = [];

    // me = arr.filter(function(e) {e.textContent === "Nicky van Hulst"});



    // Create a set out of the people talked to
    var peopleSet = {};

    for(var i = 0; i < people.length; i++){
      var name = people[i].textContent;
      peopleSet[name] = true;
    }

    // Create a array with the unique people talked to
    var names = [];
    for(var id in peopleSet){
      names.push(id);
    }

  const entry = {
    word: "",
    count: 0
  };


  // Grab all messages
  var messages = dataElem.getElementsByTagName('p');

  let wordMap = {};


  for(let i = 0; i < messages.length; i++){
    let ms = messages[i].innerHTML;
    let words = ms.split(" ");
    constructMap(wordMap,words);
  }

    let wordArray = [];
    for(var key in wordMap){
        let newEntry = Object.create(entry);
        newEntry.word = key;
        newEntry.count = wordMap[key];
        wordArray.push(newEntry);
    }
    wordArray.sort(function(a, b){return a.count-b.count});

    console.log("Max " + wordArray[wordArray.length-1].word + ": " + wordArray[wordArray.length-1].count);
    console.log("Min " + wordArray[0].word + ": " + wordArray[0].count);


    for(let i = wordArray.length-1; i > 0; i--){
      if(wordArray[i].count > 1){
        // console.log(wordArray[i].word + ": " + wordArray[i].count);
      }
    }

    createWordCountTable(wordArray,50);
    
    

    
  }


  // Only read the first file
  reader.readAsText(files[0]);
}

document.getElementById('files').addEventListener('change', handleFileSelect, false);

function createWordCountTable(data, numbRows){

  //First grab to table to add to
  var table = document.getElementById("wordTable");
  

  for(var i = 1; i < numbRows; i++){ 
    var row = table.insertRow(i);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    cell1.innerHTML = data[data.length-1-i].word;
    cell2.innerHTML = data[data.length-1-i].count;
  }
}

function timeData(day,month, monthDay,year,time, timeZone, am){
  this.day = day;
  this.month = month;
  this.monthDay = monthDay;
  this.year = year;
  this.time = time;
  this.timeZone = timeZone;
  this.am = am;
}

function messageData(sender,peopleInThread,timeData,words){
  this.sender = sender;
  this.peopleInThread = peopleInThread;
  this.timeData = timeData;
  this.words = words;
}


function printDataStruct(data){
  console.log("Sender : " + data.sender);
  let str = "";
  for(let i = 0; i < data.peopleInThread.length; i++){
    str += data.peopleInThread[i] + " ";
  }
  console.log("People in thread : " + str);
  
  console.log("Time Data : " + data.timeData.day + " " + data.timeData.month + " " + data.timeData.monthDay + " " + data.timeData.year + " " + data.timeData.time + " " + data.timeData.am);
  
  let strW = "";
  for(let i = 0; i < data.words.length; i++){
    strW += data.words[i] +" ";
  }
  console.log("Message : " + strW);
  
}




function getPeopleInThread(thread){
      // Get the string that represents people in the thread
    let index = 0;
    while(thread.innerHTML.charAt(index) !== '<'){
      index++;
    }
    
    let str = thread.innerHTML.substr(0,index);
    str = str.replace(/,/g,"");
    return str.split(" ");
}

function getTimeData(meta){
  let stripedTime = meta.replace(/,/g,""); // Replace all the commas with empty string
  let timeDataArray = stripedTime.split(" ");
  let am = timeDataArray[5].includes('p') ? true : false; 
  
  return new timeData(timeDataArray[0],timeDataArray[1],timeDataArray[2],timeDataArray[3],timeDataArray[5],timeDataArray[6],am); // index 4 is at
}

// Seperated out incase I want to do extra things with it later like change to lower case
function getWordsFromMessage(message) {
  return message.split(" ");
}


var threadsProc = 0;
var thread = document.createElement('div');
var lastLoadPercentage = 0;
var i = 0;

// 
function createWorkableDataStructure(){
  
  let messageDataArray = [];
  
  
  // First seperate into threads
  
  
  if(i < threads.length){
    
    let percentDone = Math.floor((i / threads.length)*100);
    
    // console.log(percentDone); 
    
    if(percentDone > lastLoadPercentage){
      lastLoadPercentage = percentDone;
      percentage = percentDone;
      // incrementLoad(percentDone);
    }
    
    thread.innerHTML = threads[i].innerHTML;
    
    let peopleInThread = getPeopleInThread(thread);
    
    
    var users = thread.getElementsByClassName('user');
    var meta = thread.getElementsByClassName('meta');
    var messages = thread.getElementsByClassName('message');
    var messagesHead = thread.getElementsByClassName('message_header');
    var p = thread.getElementsByTagName('p');      
    
    for(let i = 0; i < messages.length; i++){
     
      let timeData = getTimeData(meta[i].textContent); // Create the time data object
      let words = getWordsFromMessage(p[i].textContent); // Get the wors in the message
      let user = users[i].textContent; // Get the person that sent the message 
      
      let tempMessageData = new messageData(user,peopleInThread,timeData,words);
      // printDataStruct(tempMessageData);
      // console.log(tempMessageData);
      messageDataArray.push(tempMessageData);
      
    }
    setTimeout(createWorkableDataStructure,0);
      i++; 
  }
}




// Used to find the count of unique words
function constructMap(map, words){
  for(let i = 0; i < words.length; i++){
    let word = words[i];
    if(map[word] === undefined){
      map[word] = 0;
    }
    map[word]++;// Increment count for word
  }
  return map;
}


function incrementLoad(percentage) {
  console.log(percentage);
    var elem = document.getElementById("loadData");
    elem.style.width = percentage + '%';
}


function asyncLoop() {
  var elem = document.getElementById("loadData");
    elem.style.width = percentage + '%';
  
   
    if (percentage <= 100) {
        setTimeout(asyncLoop, 50);
    }
}