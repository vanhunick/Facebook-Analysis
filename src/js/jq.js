$(document).ready(function(){
    $('#lf').hide();
    $('#ld').hide();

    $("#wordTableF").hide();


    $('#files').click(function(){
        $('#lf').show();
        $('#ld').show();
    });

    // Respond to search bar button being pressed
     $("#searchBut").click(function(){
         var val = $('#search-friends').val();
        friendSearched(val);
    }); 

    // Respond to enter being pressed in search bar
    $('#search-friends').keypress(function(event){

	var keycode = (event.keyCode ? event.keyCode : event.which);
	if(keycode == '13'){
        var val = $('#search-friends').val();
        friendSearched(val);
	}

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
