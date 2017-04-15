var keys = require('./keys.js');
var fs = require('fs');
var inquirer = require('inquirer');
var request = require('request');// imports the module request.
var Twitter = require('twitter'); //imports the twitter module.
//var spotify = require('spotify'); // imports the spotify module.


var client = new Twitter(keys.twitterKeys);

// prompt to ask users for their .
function start(){
	inquirer.prompt([
		{
			type: "list",
			name: "userChoice",
			message: "Which one would you like to check out?",
			choices: ["My tweets", "Spotify", "Movies", "Random", "Exit"] 
		}
	]).then(function(answer) {
		if (answer.userChoice== 'My tweets'){
			inquirer.prompt([
			{
				type: "input",
				name: "userName",
				message: "What is your twitter user name?"
			}
			]).then(function(user) {
			myTweets(user.userName);
			});
		}
		else if (answer.userChoice == 'Spotify'){
			console.log("check");
			inquirer.prompt([
				{
					type: "input",
					name: "songChoice",
					message: "What song would you like to check out?",
				}
			]).then(function(spotifyAnswer){
				if (spotifyAnswer.songChoice == ""){
					chosenSpotify("Ace of Base")
				}else{
					chosenSpotify(spotifyAnswer.songChoice);	
				}
			})
		}else if (answer.userChoice== 'Movies'){
			console.log("check");
			inquirer.prompt([
				{
					type: "input",
					name: "movieChoice",
					message: "What movie would you like to check out?",
				}
			]).then(function(userMovieInput){
				console.log(userMovieInput);
				if (userMovieInput.movieChoice == ''){
					movieSearch("Mr. Nobody");
				}else{
					movieSearch(userMovieInput.movieChoice);
				}

			})	
		}else if (answer.userChoice == "Random"){
			randomChoice();		
		}else if (answer.userChoice == "Exit"){
			inquirer.prompt([
				{
					type: "confirm",
					name: "exitApp",
					message: "Are you sure you want to leave?",
				}
			]).then(function(leave){
				if (leave.exitApp == true){
					console.log("Bye!");
				}else{
					start();
				}

			});
		}
	});
}



var myTweets = function(userName){

	var params = {screen_name: userName, count: 20};
	client.get('statuses/user_timeline', params, function(error, tweets, response){
	  if (!error) {
	  
	  	for(var i=0; i < tweets.length; i++){
	  		console.log(tweets[i].created_at);
	  		console.log('');
	  		console.log(tweets[i].text);
	  	}
	  }
	  else 
	  {
	  	console.log("Either your account is private or there is an error! ");
	  }
	});
}


var movieSearch = function(movie) {
 
 var urlRequest = "http://www.omdbapi.com/?t=" + movie + "&tomatoes=true";
  

 request(urlRequest , function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var dataJSON = JSON.parse(body);
      console.log('Title: ' + dataJSON.Title);
      console.log('Year: ' + dataJSON.Year);
      console.log('IMDB Rating: ' + dataJSON.imdbRating);
      console.log('Country: ' + dataJSON.Country);
      console.log('Language: ' + dataJSON.Language);
      console.log('Plot: ' + dataJSON.Plot);
      console.log('Actors: ' + dataJSON.Actors);
      console.log('Rotten Tomato Rating ' + dataJSON.tomatoMeter);
      console.log('Rotten Tomato Link: ' + dataJSON.tomatoURL);
    }
  })
}

start();