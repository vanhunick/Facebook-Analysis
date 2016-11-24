$(document).ready(function(){
    $('#lf').hide();
    $('#ld').hide();

    $('#files').click(function(){
        $('#lf').show();
        $('#ld').show();
    });

});


//  lookup: getFriends(),

  // setup autocomplete function pulling from friends[] array
  function updateAutocomplete(){
$('#search-friends').autocomplete({
    lookup: getFriends(),
    onSelect: function (suggestion) {
        console.log("Doing Stuff");
        console.log("friends " + getFriends());
      var thehtml = '<strong>Currency Name:</strong> ' + suggestion;
      $('#outputcontent').html(thehtml);
    }
  });
  }
  
  updateAutocomplete();
