// Check the file api is supported
if (!(window.File && window.FileReader && window.FileList && window.Blob)) {
  alert('The File APIs are not fully supported in this browser.');
}

function handleFileSelect(evt) {
  var files = evt.target.files; // FileList object

  // files is a FileList of File objects. List some properties.
  var output = [];
  for (var i = 0, f; f = files[i]; i++) {
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

    // Get all the user elements the people talked to
    var people = dataElem.getElementsByClassName('user');

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
        console.log(wordArray[i].word + ": " + wordArray[i].count);
      }
    }
  }




  // Only read the first file
  reader.readAsText(files[0]);
}

document.getElementById('files').addEventListener('change', handleFileSelect, false);

function createWordCountTable(data, numbRows){

  //First grab to table to add to
  var wordTable = document.getElementById("wordTable");

  for(var i = 0; i < numbRows; i++){
    var row = table.insertRow(i);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    cell1.innerHTML = data[i].word;
    cell2.innerHTML = data[i].count;
  }
}

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
