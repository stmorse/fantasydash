$(document).ready(function() {
  
  var league_id = 572240;
  var season = 2020;
  
  var url = "https://fantasy.espn.com/apis/v3/games/ffl/seasons/" + 
    season + '/segments/0/leagues/' + league_id + "?view=mMatchup";

  // var data;

  $.ajax({
    url: url,
    type: "GET",
    dataType: "json",
    crossDomain: true,
    xhrFields: {
         withCredentials: true
    },
    success: function(data) {
        console.log('Success');

        var r = data['teams'][0]['roster']['entries'];

        $(function() {
          $.each(r, function(i, item) {
              var $tr = $('<tr>').append(
                  $('<td>').text(item.playerPoolEntry.player.firstName),
                  $('<td>').text(item.playerPoolEntry.player.lastName),
                  $('<td>').text(item.playerId)
              ).appendTo('#roster');
              // console.log($tr.wrap('<p>').html());
          });
        });
    },
    error: function(error) {
        console.log(`Error ${error}`);
    }
  });

})