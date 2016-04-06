$(document).ready(function(){


	$('#results-container').hide();


	var samples = [];
	var sampleIds = [];



	SC.initialize({
		client_id: '5c3759b4842b6a82f2a156a1b7aa0187',
		redirect_uri: 'https://cuttybang.github.io/cloudbrowse/'
	});

	//auto connect

	function login(){
		SC.connect().then(function() {
			return SC.get('/me');
			}).then(function(me) {
				personal = me.username;
				mePerma = me.permalink_url;
				$('#ui').removeClass('hidden');
				$('#ui .right h2 span').html(me.username);
				$('#avatar').attr('src', me.avatar_url);
				$('#city').html(me.city);
				$('#follows').html(me.followers_count);
				$('#instructions').addClass('hidden');
			});
	}



	function searchSounds(query){
		$('#results-container').show();
		$('#results').html('');
		SC.get('/tracks', {
			q: query,
			duration: {to: 30000},
			licence: "cc-by-sa"
		}).then(function(tracks){
			for (var i = 0; i < tracks.length; i++) {
				$('#results').append('<img src="' + tracks[i].artwork_url + '" />'+'<li class="items">'+ tracks[i].title + '</li>');
				$('#results-container #returns span').html(query);
				samples[tracks[i].title] = tracks[i].permalink_url;
				sampleIds[tracks[i].title] = tracks[i].id;
			}
		$('#results').show();
	});

	}

	function player(tune){
		$('#track-player').html('');
		SC.oEmbed(tune, { auto_play: true, maxheight: 125}).then(function(oEmbed) {
			$('#track-player').html(oEmbed.html);
			//console.log('oEmbed response: ', oEmbed);
		});

	}

	//play user tracks
	$('#results-container #results').on('click', 'li', function(e){
		var title = e.target.innerHTML;
		if (samples.hasOwnProperty(title)){
			player(samples[title]);
			console.log(samples[title]);
		}
	});


	//search form submission
	$('#forms').on('submit', function(){
		var searchVal = $('#lookup').val();
		$('#track-player').html('');
		$('#results').html('');
		$('#resulter span').html('');
		$('#returns span').html('');
		$('#lookup').val('');
		searchSounds(searchVal);
	});

	function init(){
		$('#lookup').val('');
		$('#userResults').html('');
		$('#results').html('');
		$('#resulter span').html('');
		$('#returns span').html('');
	}

	//function play(genre) {
		//console.log(genre)
		//SC.get('/tracks', {
			//genres: genre,
			//bpm: {
				//from:120
			//}
		//}).then(function(tracks){
			//var random = Math.floor(Math.random()* 19);
			//SC.oEmbed(tracks[random].uri, {auto_play: true}, console.log(genre), document.getElemenById('track-player'));

		//});
	//}





});
