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

    

    // Respond to enter being pressed in search bar for words
    $('#search-words').keypress(function(event){

	var keycode = (event.keyCode ? event.keyCode : event.which);
	if(keycode == '13'){
        var val = $('#search-words').val();
        wordSearched(val);
	}

    });

    displayRandomData(); 

});



  // setup autocomplete function pulling from friends[] array
  function updateAutocomplete(){
$('#search-friends').autocomplete({
    lookup: getFriends(),
    onSelect: function (suggestion) {
    
    var thehtml = 'Selected friend : <span style="color: orangered;">' + suggestion.value;
      
      $('#search-output').html(thehtml);
    }
  });
  }
  
$('#search-words').autocomplete({
    lookup: getWords(),
    onSelect: function (suggestion) {
    
    var thehtml = 'Selected Word : <span style="color: orangered;">' + suggestion.value;
      
      $('#search-output-word').html(thehtml);
    }
  });


  updateAutocomplete();
