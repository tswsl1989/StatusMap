$('#about-title').click(function() {
  $('#how-to-use').hide();
  $('#about').show();
});
 
$('#how-to-use-title').click(function() {
  $('#how-to-use').show();
  $('#about').hide();
});

$("#search-box").keyup(function(event){

	    if(event.keyCode == 13){ //13 = carriage return

	        $("#search").click();

	    }

	});

	function filterTweet(text) {

		var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig; //regex for hyperlinks

		var url = text.replace(exp,"<a target=\"blank\" href='$1'>$1</a>"); 

		exp = /#([-A-Z0-9]*)/ig; //regex for hashtags

		var tweet = url.replace(exp,'<a href="javascript:auto_search(\'#$1\')">#$1</a>'); //replace hashtags with hyperlinks for a search

		return tweet 

	}

	function auto_search(query) {// Enters passed value into search box and searches for it

		$("#query").val(query);

		$("#search").click();

			

	}

	function show_results(tweet) {

		$("#results").append('<div id="tweet"><hr>');

		$("#results").append('<p><strong><a href="https://twitter.com/#!/' + tweet.from_user + '" target="blank">@' + tweet.from_user + '</a></strong> - ' + tweet.from_user_name + '</p>');

		$("#results").append('<img src="' + tweet.profile_image_url +'" width="48" height="48" class="avatar" /><p class="tweet-text">' + filterTweet(tweet.text) + '</p>');

		$("#results").append('<p class="small">Tweet ID: <a href="https://twitter.com/#!/' + tweet.from_user + '/status/' + tweet.id_str + '" target="blank">' + tweet.id_str + '</a><br />');

		if(tweet.geo === null){

			$("#results").append('<p class="small">No geo info available</p>');

		}else{

			$("#results").append('<p class="small">Location: ' + tweet.geo.coordinates[0] + ', ' + tweet.geo.coordinates[1] +'</p>');
			text = '<p><strong><a href="https://twitter.com/#!/' + tweet.from_user + '" target="blank">@' + tweet.from_user + '</a></strong> - ' + tweet.from_user_name + '</p>';
			text += '<img src="' + tweet.profile_image_url +'" width="48" height="48" class="avatar" /><p class="tweet-text">' + filterTweet(tweet.text) + '</p>';
			text += '<p class="small">Tweet ID: <a href="https://twitter.com/#!/' + tweet.from_user + '/status/' + tweet.id_str + '" target="blank">' + tweet.id_str + '</a><br />';
			addMarker(tweet.id_str, tweet.geo.coordinates[0], tweet.geo.coordinates[1], text);
			$("#results").append('<p class="small"><a href=\'javascript:map.addPopup(popups["pop'+tweet.id_str+'"], true);popups["pop'+tweet.id_str+'"].show();map.panTo(popups["pop'+tweet.id_str+'"].lonlat)\'>Show on Map</a></p>');

		}

		$("#results").append('<p class="small">Tweeted at: ' + tweet.created_at + '</p>');

		$("#results").append('</div>');

	}

	

	$(document).ready(function(){

	

	var search_url='https://search.twitter.com/search.json?callback=?&q=';

	var hashtag_url='https://search.twitter.com/search.json?callback=?&tag=';

	var location_url='https://search.twitter.com/search.json?callback=?&geocode=';

	var user_url='https://search.twitter.com/search.json?callback=?&from=';



	var query;

		$('#search').click(function(){
		 if($("#query").val() != ''){
			$("#sidebar-title").empty();
			$("#sidebar-title").replaceWith("<h2 id='sidebar-title'>Search Results</h2>");
			$("#results").empty();
			$("#results").append('<img src="loading_transparent.gif">');
			$("#results").append('<p>Searching</p>');
			query=$("#query").val();
			if(query.indexOf('#') == -1){
				if(query.indexOf('@') == -1){
					var url = search_url;
				}else{
					var url = user_url;
					query = query.substring(1, query.length);
				}
			}else{
				var url = hashtag_url;
				query = query.substring(1, query.length);
			}
			$.getJSON(url+query,function(json){
				clearMap();
				$("#results").empty();
				$.each(json.results,function(i,tweet){
					show_results(tweet);

				});

			});
		  }
		});

		$('#fire').click(function(){
			$("#sidebar-title").replaceWith("<h2 id='sidebar-title'>Tweets Nearby</h2>");
			$("#results").empty();

			$("#results").append('<img src="loading_transparent.gif">');

			$("#results").append('<p>Searching</p>');

			a = getCenterRadius(map.getExtent());

			$.getJSON(location_url+a[0].lat+","+a[0].lon+","+a[1]+"mi",function(json){

				clearMap();

				$("#results").empty();

				$.each(json.results,function(i,tweet){

					show_results(tweet);

				});

			});

			updateFsqLayer();

		});

		$('#locate').click(function(){

			map.addControl(geol);

			geol.activate();

			if ($('#followlocation').val() == 'on') {

				geol.watch = true;

				geol.bind = true;

			}	

		});

                /************

                * FACEBOOOK *

                ************/



		var fburl = 'https://graph.facebook.com/search?type=checkin&access_token=#REPLACE#';

                $('#facebook').click(function(){

                        $("#sidebar-title").replaceWith("<h2 id='sidebar-title'>Facebook Check-ins</h2>");

                        $("#results").empty();

                        $("#results").append('<img src="loading_transparent.gif">');

                        $("#results").append('<p>Searching</p>');

                        $.getJSON(fburl, function(data){

                                $("#results").empty();

                                $.each(data, function(i, item) {

                                        $.each(data[i], function(j, item) {

                                                $("#results").append("<hr>");

                                                var basic_string = "<p><strong><a href=\"http://www.facebook.com/"+data[i][j].from.id + "\" target=\"blank\">"+data[i][j].from.name + "</a></strong> checked in at <a href=\"http://www.facebook.com/"+data[i][j].place.id + "\" target=\"blank\">"+data[i][j].place.name + "</a>";                                             if(data[i][j].tags){ //see if there were other people tagged with them

                                                        var friends = new Array();

                                                        var ids = new Array();

                                                        $.each(data[i][j].tags.data, function(k, item) {

                                                                friends.push(data[i][j].tags.data[k].name);

                                                                ids.push(data[i][j].tags.data[k].id);

                                                        });

                                                        if(friends.length == 1){

                                                                $("#results").append(basic_string + " with <a href=\"http://www.facebook.com/"+ids + "\" target=\"blank\">" + friends + "</a>");

                                                        }else if(friends.length == 2) {

                                                                $("#results").append(basic_string + " with <a href=\"http://www.facebook.com/"+ids[0] + "\" target=\"blank\">" + friends[0] + "</a> and <a href=\"http://www.facebook.com/"+ids[1] + "\" target=\"blank\">" + friends[1]);



                                                        }else {

                                                                var output = basic_string + " with ";

                                                                $.each(friends, function(i, item){



                                                                        if(i == friends.length){

                                                                                output = output + "and <a href=\"http://www.facebook.com/"+ids[i] + "\" target=\"blank\">" + friends[i] + "</a>.";

                                                                        }else if(i == friends.length-1){

                                                                                output = output + "<a href=\"http://www.facebook.com/"+ids[i] + "\" target=\"blank\">" + friends[i] + "</a> ";

                                                                        }else{

                                                                                output = output + "<a href=\"http://www.facebook.com/"+ids[i] + "\" target=\"blank\">" + friends[i] + "</a>, ";

                                                                        }

                                                                });

                                                                $("#results").append(output);

                                                        }

                                                }else{//if there were no friends...

                                                        $("#results").append(basic_string);

                                                }



                                                //$("#results").append("<p><strong>Checkin ID: </strong>"+data[i][j].id + "</p>");

                                                var created_time = data[i][j].created_time;

                                                created_time = created_time.replace(/\D/g," ");

                                                var split_time = created_time.split(" ");

                                                if(data[i][j].message){

                                                        message = data[i][j].message;

                                                        $("#results").append("<p class=\"tweet-text\"><strong>Message: </strong>"+ message + "</p>");

                                                }else{

                                                        message = '';

                                                }

						$("#results").append('<p class="small"><a href=\'javascript:map.addPopup(fbpopups["fb'+data[i][j].id+'"], true);fbpopups["fb'+data[i][j].id+'"].show();map.panTo(fbpopups["fb'+data[i][j].id+'"].lonlat)\'>Show on Map</a></p>');

                                                $("#results").append('<p class="small">' + split_time[3] + ':' + split_time[4] + ', ' + split_time[2] + '/' + split_time[1] + '/' + split_time[0] + '</p>');

                                                var latitude = data[i][j].place.location.latitude;

                                                var longitude = data[i][j].place.location.longitude;

                                                message = "<p class='tweet-text'><img src='fb.png' alt='Facebook' height=20 width=20 />&nbsp;"+data[i][j].from.name+"<br /><strong>Checked in at:</strong>" + data[i][j].place.name +"<br />" + message + "</p>";

                                                addFBMarker(data[i][j].id, latitude, longitude, message);



                                        });

                                });

                        });

                });





                /**************

                END OF FACEBOOK

                **************/

 		

	});
