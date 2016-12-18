function DataProcessor(messageArray, user) {
    this.messageArray = messageArray;
    // this.metaData = createMetaData
    
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
DataProcessor.prototype.createWordMap = function () {
    let entry = {
        word: "",
        count: 0
    };

    let wordMap = {};

    for (let i = 0; i < this.messageArray.length; i++) {
        let words = this.messageArray[i].words;

        for (let j = 0; j < words.length; j++) {
            let word = words[i];
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


// Returns a MetaData Object
DataProcessor.prototype.createMetaData = function () {
    let totMessages = 0;
    let totWords = 0;
    let totPeople = this.listPeople().length; //TODO CHeck if calls the right thing
    let totSent = 0;
    let totRec = 0;

    for (let i = 0; i < this.messageArray.length; i++) {
        totMessages++;

        if (this.messageArray[i].sender.toLowerCase() === user) {
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

    for (let i = 0; i < this.messageArray.length; i++) {

        if (this.messageArray[i].peopleInThread.length === 2) { // Could change later to apply to any thread
            if (this.messageArray[i].peopleInThread[0].toLowerCase() === friendString.toLowerCase() || this.messageArrayy[i].peopleInThread[1].toLowerCase() === friendString.toLowerCase()) {
                totMessagesPerson++;
                if (this.messageArray[i].sender.toLowerCase() === user.toLowerCase()) {
                    totSent++;
                } else {
                    totRec++;
                }
                totWords += messageDataArray[i].words.length;
            }
        }
    }
    return new FriendMetaData(totMessagesPerson, totSent, totRec, totWords);
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