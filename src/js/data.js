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

    // Print out the names
    console.log(names);
  }

  // Only read the first file
  reader.readAsText(files[0]);
}

document.getElementById('files').addEventListener('change', handleFileSelect, false);
