function DataProcessor(messageArray) {
    this.messageArray = messageArray;
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