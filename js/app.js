$(document).ready(function(){

	SC.initialize({
		client_id: '5c3759b4842b6a82f2a156a1b7aa0187',
		redirect_uri: 'http://localhost:8080/cloudbrowse/callback.html'
	});

	

	SC.connect().then(function() {
		return SC.get('/me');
	}).then(function(me) {
		$('#ui').removeClass('hidden');
		$('#ui h2 span').html(me.username+ '!');
		$('#avatar').attr('src', me.avatar_url);
		$('#city').html(me.city);
		//SC.stream('/tracks/33427584').then(function(song) {
			//song.play();
			//console.log(song.title);
			//});
	});
	





	function play(genre) {
		console.log(genre)
		SC.get('/tracks', {
			genres: genre,
			bpm: {
				from:120
			}
		}).then(function(tracks){
			var random = Math.floor(Math.random()* 19);
			SC.oEmbed(tracks[random].uri, {auto_play: true}, console.log(tracks.title), document.getElemenById('track-player'));

		});
	}

	//var link = $("#lookup").val();
	$('#go').on('click', function(){
		console.log(link);
		play($("#lookup").val());
	});





	
	




});









