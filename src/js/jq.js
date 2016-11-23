$(document).ready(function(){
    $('#lf').hide();
    $('#ld').hide();

    $('#files').click(function(){
        $('#lf').show();
        $('#ld').show();
    });

});




  // setup autocomplete function pulling from currencies[] array
  $('#search-friends').autocomplete({
    lookup: getFriends(),
    onSelect: function (suggestion) {
        console.log("Doing Stuff");
      var thehtml = '<strong>Currency Name:</strong> ' + suggestion;
      $('#outputcontent').html(thehtml);
    }
  });
