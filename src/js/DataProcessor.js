// Constructor for a DataProcessor, has a range of different methods to mnodify the
// structures date
function DataProcessor(messageArray, user) {
    this.messageArray = messageArray;
    this.user = user;
}

DataProcessor.prototype.getMessageArray = function() {
    return this.messageArray;
}

// Function to return a unique array of people
DataProcessor.prototype.listPeople = function () {
    let peopleSet = {};

    for (let i = 0; i < this.messageArray.length; i++) {
        let name = this.messageArray[i].sender;
        peopleSet[name] = true;
    }

    // Create a array with the unique people talked to
    var names = [];
    for (var id in peopleSet) {
        names.push(id);
    }
    return names;
};


// Returns an array with entry objects that hold a word and the frequence it occours
DataProcessor.prototype.createWordMap = function (caseSensitive) {
    let entry = {
        word: "",
        count: 0
    };

    let wordMap = {};

    for (let i = 0; i < this.messageArray.length; i++) {
        let words = this.messageArray[i].words;

        for (let j = 0; j < words.length; j++) {
          let word = caseSensitive ? words[j].toLowerCase() : words[j];

            if (wordMap[word] === undefined) {
                wordMap[word] = 0;
            }
            wordMap[word]++;// Increment count for word
        }
    }

    let wordArray = [];
    for (var key in wordMap) {
        let newEntry = Object.create(entry);
        newEntry.word = key;
        newEntry.count = wordMap[key];
        wordArray.push(newEntry);
    }
    wordArray.sort(function (a, b) { return a.count - b.count });
    return wordMap;
}


// Returns an array of unique words in the data
DataProcessor.prototype.getUniqueWords = function (caseSensitive) {
    var object = {};
    var r = [];

    for (let i = 0; i < this.messageArray.length; i++) {
        let words = this.messageArray[i].words;

        for (let j = 0; j < words.length; j++) {
          let word = caseSensitive ? words[j].toLowerCase() : words[j];
          word = word.replace(".",""); // Remove dots on words
          object[word] = word;
        }
    }
    for(word in object){
        r.push(object[word]);
    }
    return r;
}


// Creates a map where word is the key and value is the count
DataProcessor.prototype.createYearCountMap = function (){
    let entry = {
    letter: "",
    frequency: 0
  };

  let yearMap = {};

  for (let i = 0; i <this.messageArray.length; i++) {
    if(yearMap[this.messageArray[i].timeData.year] === undefined){
      yearMap[this.messageArray[i].timeData.year] = 0;
    }
    yearMap[this.messageArray[i].timeData.year]++;
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


DataProcessor.prototype.wordUssageOverTime = function(word) {

    // First filter out all the messages that contain the word we care about
    let relMessages = this.messageArray.filter(message => message.words.indexOf(word) !=-1);

    // Map with date 'year month' as the key and the count of the occours of 'word' as the value
    let dateMap = {};

    // Go through all relevant messages
    for(let i = 0; i < relMessages.length; i++){

        // Create an array of the words that match word in the message this will be at least one match
        let wordMatch = relMessages[i].words.filter(aWord => aWord === word);

        // Create a string out of the year and the month to use as a key in the map
        let date = relMessages[i].timeData.year + " " + relMessages[i].timeData.month;

            if(dateMap[date] === undefined){
              dateMap[date] = 0;
            }
            dateMap[date] += wordMatch.length;
    }

    let entry = {
        date : "",
        count : 0
    }

    let entryArray = [];

    for (var key in dateMap) {
        let newEntry = Object.create(entry);
        newEntry.date = key;
        newEntry.count = dateMap[key];
        entryArray.push(newEntry);
  }
    return entryArray;
}


DataProcessor.prototype.friendMessagesOverTime = function(friendName) {
    let relMessages = this.messageArray.filter(message => message.sender === friendName);

    let dateMap = {}

    for(let i = 0; i < relMessages.length; i++){

        // Create a string out of the year and the month to use as a key in the map
        let date = relMessages[i].timeData.year + " " + relMessages[i].timeData.month;

            if(dateMap[date] === undefined){
              dateMap[date] = 0;
            }
            dateMap[date] ++;
    }

    let entry = {
        date : "",
        count : 0
    }

    let entryArray = [];

    for (var key in dateMap) {
        let newEntry = Object.create(entry);
        newEntry.date = key;
        newEntry.count = dateMap[key];
        entryArray.push(newEntry);
  }
    return entryArray;
}

DataProcessor.prototype.averageOverTotalMessages = function (totalArray, partArray) {
    let adjustedArray = [];

    for(let i = 0; i < totalArray.length; i++){
        let entry = totalArray[i];
        for(let j = 0; j < partArray.length; j++){
            let partEntry = partArray[j];
            if(entry.date === partEntry.date){
                let percentage = (partEntry.count / entry.count) * 100;
                let newEntry = Object.create(entry);
                newEntry.date = entry.date;
                newEntry.count = percentage;
                adjustedArray.push(newEntry);
            }
        }
    }

    return adjustedArray;
}


// Returns an array of entries where with a date and count for the number of messages sent on that date
DataProcessor.prototype.totalMessagesOverTime = function () {
    let dateMap = {};

    for(let i = 0; i < this.messageArray.length; i++){
        // Create a string out of the year and the month to use as a key in the map
        let date = this.messageArray[i].timeData.year + " " + this.messageArray[i].timeData.month;

            if(dateMap[date] === undefined){
              dateMap[date] = 0;
            }
            dateMap[date] ++;
    }

    let entry = {
        date : "",
        count : 0
    }

    let entryArray = [];

    for (var key in dateMap) {
        let newEntry = Object.create(entry);
        newEntry.date = key;
        newEntry.count = dateMap[key];
        entryArray.push(newEntry);
  }
    return entryArray;
}


DataProcessor.prototype.totalWordsOverTime = function () {
        let dateMap = {};

    for(let i = 0; i < this.messageArray.length; i++){
        let words = this.messageArray[i];

        // Create a string out of the year and the month to use as a key in the map
        let date = this.messageArray[i].timeData.year + " " + this.messageArray[i].timeData.month;

            if(dateMap[date] === undefined){
              dateMap[date] = 0;
            }
            dateMap[date] += words.words.length; // Add all the words in the array
    }

    let entry = {
        date : "",
        count : 0
    }

    let entryArray = [];

    for (var key in dateMap) {
        let newEntry = Object.create(entry);
        newEntry.date = key;
        newEntry.count = dateMap[key];
        entryArray.push(newEntry);
  }
    return entryArray;
}

// Function that returns the number of occourences of a word in a message
DataProcessor.prototype.wordInMessageCount = function (message, word) {
    let count = 0;
    for(let i = 0; i < message.length; i++) {
        if(message[i] === word){
            count++;
        }
    }
    return count;
}


// Returns an array containing all the years messages were sent
DataProcessor.prototype.getYears = function () {
    let yearArray = [];
      let yearMap = {};

  for (let i = 0; i <this.messageArray.length; i++) {
    if(yearMap[this.messageArray[i].timeData.year] === undefined){
      yearMap[this.messageArray[i].timeData.year] = 0;
      yearArray.push(this.messageArray[i].timeData.year);
    }
  }
  return yearArray;
}


// Returns a MetaData Object
DataProcessor.prototype.createMetaData = function () {
    let totMessages = 0;
    let totWords = 0;
    let totPeople = this.listPeople().length; //TODO CHeck if calls the right thing
    let totSent = 0;
    let totRec = 0;

    for (let i = 0; i < this.messageArray.length; i++) {
        totMessages++;

        if (this.messageArray[i].sender.toLowerCase() === user.toLowerCase()) {
            totSent++;
        } else {
            totRec++;
        }

        totWords += this.messageArray[i].words.length;
    }
    return new MetaData(totMessages, totWords, totPeople, totSent, totRec);
}


// Returns a friend meta data object
DataProcessor.prototype.createFriendMetaData = function (friendString) {
    let totMessagesPerson = 0;
    let totSent = 0;
    let totRec = 0;
    let totWords = 0;
    let totLetters  = 0;

    // People in thread no longer the names
    for (let i = 0; i < this.messageArray.length; i++) {
        if (this.messageArray[i].peopleInThread.length === 2) { // Could change later to apply to any thread
            if (this.messageArray[i].peopleInThread[0].toLowerCase() === friendString.toLowerCase()
            || this.messageArray[i].peopleInThread[1].toLowerCase() === friendString.toLowerCase()) {
                totMessagesPerson++;
                if (this.messageArray[i].sender.toLowerCase() === user.toLowerCase()) {
                    totSent++;
                } else {
                    totRec++;
                }
                totWords += this.messageArray[i].words.length;
            }
        }
    }
    return new FriendMetaData(totMessagesPerson, totSent, totRec, totWords);
}

DataProcessor.prototype.createWordMetaData = function (word) {
  let occourences = 0;
  let sent = 0;
  let recieved = 0;
  let totalWords = 0;

  // First filter out all the messages that contain the word we care about
  let relMessages = this.messageArray.filter(message => message.words.indexOf(word) !=-1);

  for (let i = 0; i < relMessages.length; i++) {
    let words = relMessages[i].words;
    for(let j = 0; j < words.length; j++) {
        if(words[j] === word){
          if (relMessages[i].sender.toLowerCase() === user.toLowerCase()) { // Could change later to apply to any thread
            sent++;
          } else {
            recieved++;
          }
          occourences++;
        }
    }
    totalWords += relMessages[i].words.length;
  }
  return new WordMetaData(occourences,sent,recieved, (occourences / totalWords));
}

// Object that stores general meta data about the messages in order to not have to recalulate it
function MetaData(totalMessages, totalWords, totalPeople, totalSent, totalRecieved) {
    this.totalMessages = totalMessages;
    this.totalWords = totalWords;
    this.totalPeople = totalPeople;
    this.totalSent = totalSent;
    this.totalRecieved = totalRecieved;
}

// Object that stores general meta data about the messages in order to not have to recalulate it
function FriendMetaData(totalMessages, totalSent, totalRecieved, totalWords) {
    this.totalMessages = totalMessages;
    this.totalSent = totalSent;
    this.totalRecieved = totalRecieved;
    this.totalWords = totalWords;
}

function WordMetaData(occourences,sent,recieved, percent) {
  this.occourences = occourences;
  this.sent = sent;
  this.recieved = recieved;
  this.percent = percent;
}
