$(document).ready(function(){

	$('#write-comment-container').hide();
	$('#write-comment-btn').hide();
	$('#comment-container').hide();
	$('#show-comment-btn').hide();
	$('#results-container').hide();
	$('#track-player').hide();

	var userPerma;
	var personal;
	var mePerma;
	var mySongs = {};
	var mySongIds = {};
	var users = {};
	var userSongs = {};
	var userTrackIds = {};
	var tracksComment = [];



	SC.initialize({
		client_id: '5c3759b4842b6a82f2a156a1b7aa0187',
		redirect_uri: 'http://localhost.dev/cloudbrowse/callback.html'
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

	function me(){
		$('#results-container').show();
		$('#userResults').hide();
		$('#results').show();
		$('#track-player').show();
		$('#results-container #returns span').html(personal);
		SC.get('/me/tracks').then(function(tracks) {
			for(var i =0; i<tracks.length; i++){
				$('#results').append('<img src="'+tracks[i].artwork_url+'"/>'+'<br>'+'<li class="items">'+tracks[i].title+'</li>');
				mySongs[tracks[i].title] = tracks[i].permalink_url;
				mySongIds[tracks[i].title] = tracks[i].id;
			}
		console.log(mySongIds);
		});
	}

	function searchUsers(query){
		$('#results-container').show();
		$('#userResults').html('')
		$('#results').hide();
		SC.get('/users', {
			q: query
		}).then(function(user){
			for (var i = 0; i < user.length; i++) {
				$('#userResults').append('<img src="' + user[i].avatar_url + '" />');
				$('#userResults').append('<li class="items">'+ user[i].username + '</li>');
				$('#results-container #returns span').html(query);
				users[user[i].username] = user[i].id;
			}
		$('#userResults').show()
		})

	}

	function getTracks(pick){
		$('#userResults').html('');
		SC.get('/users/'+pick+'/tracks', {
			filter: 2
		}).then(function(tracks){
			for(var i = 0; i<tracks.length; i++){
				$('#userResults').append('<img src="' + tracks[i].artwork_url + '" />'+'<br>'+'<li class="items">'+ tracks[i].title + '</li>');
				$('#track-player #returns span').html(pick);
				userSongs[tracks[i].title] = tracks[i].permalink_url;
				userTrackIds[tracks[i].title] = tracks[i].id;
			}
		})

	}

	function player(tune){
		$('#track-player').html('');
		SC.oEmbed(tune, { auto_play: false, maxheight: 100}).then(function(oEmbed) {
			$('#track-player').show();
			$('#track-player').html(oEmbed.html);
			//console.log('oEmbed response: ', oEmbed);
		});

	}
	
	function writeComment (id, cmnt) {
		SC.post('/tracks/'+id+'/comments', {
			comment: { body: cmnt, timestamp: 5000 } 
		});
	}

	//play user tracks
	$('#results-container #results').on('click', 'li', function(e){
		var title = e.target.innerHTML;
		if (mySongs.hasOwnProperty(title)){
			player(mySongs[title])
			$('#show-comment-btn').show();
		}
	});

	$('#results-container #results').on('click', 'li', function(e){
		$('#comment').html('');
		var title = e.target.innerHTML;
		console.log(title);
		if (mySongIds.hasOwnProperty(title)){
			var id = mySongIds.title;
			SC.get('/tracks/'+id+'/comments').then(function(comments){
				for(var i = 0; i<comments.length; i++){
					$('#comment').append('<img src="'+comments[i].user.avatar_url+'" /><p class="cName">'+comments[i].user.username+'</p><p> on: '+comments[i].created_at+'</p><br>'+'<p class="track-comments">'+comments[i].body+'</p>');
					$('#comment-container h1 span').html(title);
				}
			});
		//$('#comment-container').show();
		$('#show-comment-btn').show();
		}
	});

	//get songs from search results
	$('#results-container #userResults').on('click', 'li', function(e){
		var username = e.target.innerHTML;
		if (users.hasOwnProperty(username)){
			getTracks(users[username]);
		}
	});

	//play songs from results
	$('#results-container #userResults').on('click', 'li', function(e){
		var title = e.target.innerHTML;
		if (userSongs.hasOwnProperty(title)) {
			player(userSongs[title]);
			$('#write-comment-btn').show();
		}
	});	

	//show comments for current track
	$('#results-container #userResults').on('click', 'li', function(e){
		$('#comment').html('');
		var title = e.target.innerHTML;
		if (userTrackIds.hasOwnProperty(title)){
			var id = userTrackIds[title];
			tracksComment.push(id);
			SC.get('/tracks/'+id+'/comments').then(function(comments){
				for(var i = 0; i<comments.length; i++){
					$('#comment').append('<img src="'+comments[i].user.avatar_url+'" /><p class="cName">'+comments[i].user.username+'</p><p> on: '+comments[i].created_at+'</p><br>'+'<p class="track-comments">'+comments[i].body+'</p>');
					$('#comment-container h1 span').html(title);
				}
			});
		$('#show-comment-btn').show();
		}
	});

	//post comments on tracks
	$('#write-comment-form').on('submit', function(){
		var cmnt = $('#write-comment-text-box').val();
		var id = tracksComment[tracksComment.length -1];
		writeComment(id, cmnt);
		$('#write-comment-container').hide();
		$('#write-comment-text-box').val('');
	});


	$('#show-comment-btn').click(function(){
				$('#comment-container').toggle();

			});
	
	$('#write-comment-btn').click(function() {
		$('#write-comment-container').toggle();
	});
	
	//get users's songs
	document.querySelector('#get-my-tracks').addEventListener('click', function(){
		$('#userResults').html('');
		$('#track-player').html('');
		$('#results').html('');
		$('#comment').html('');
		$('#comment-container').hide();
		$('#show-comment-btn').hide();
		$('#write-comment-container').hide();
		$('#write-comment-btn').hide
		me();
	});

	//log in user
	document.querySelector('#log').addEventListener('click', function(){
		login();
		console.log('click');
	});

	//search form submission
	$('#forms').on('submit', function(){
		var searchVal = $('#lookup').val();
		$('#track-player').html('');
		$('#userResults').html('');
		$('#results').html('');
		$('#resulter span').html('');
		$('#returns span').html('');
		$('#comment-container').hide();
		$('#show-comment-btn').hide();
		$('#write-comment-container').hide();
		$('#write-comment-btn').hide();
		$('#lookup').val('');
		searchUsers(searchVal);
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









