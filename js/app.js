//Frogger-like game Modified by James Merrill jamestmerrill@gmail.com
//Set global variables for easier updates and enhancements
var xSpacing=101;
var ySpacing=83; 
var topSpacing=62;
var numRows=6;
var numCols=5;
var maxSpeed=400;
var playerStartRow=(numRows-2)*ySpacing+topSpacing;
var rightBoundry=(numCols-1)*xSpacing;
var bottomBoundry=(numRows-2)*ySpacing;
var topBoundry=0;
var inTheWater=62;
var defaultLevel=1;
var level=defaultLevel;
var defaultLives=3;

var random = function(num) { //randomize function
	return Math.floor(Math.random() * num); //generates a random number between 0 and the number passed in
};

// Enemies our player must avoid
var Enemy = function(enemyLocation) {
	// Variables applied to each of our instances go here,
	// we've provided one for you to get started   
	this.enemyLocation =enemyLocation;  //array position of the enemy. uniquely identifies them
	this.speed= (random(5)+1)*50*level; //random speed between 100-500 in increments of 100
	if (this.speed > maxSpeed) this.speed= maxSpeed; //don't get any faster than max speed
	this.x =0;
	this.y =random(4)*ySpacing+topSpacing;  //randomly places enemy in one of 4 rows
	this.sprite = 'images/enemy-bug.png';
	// The image/sprite for our enemies, this uses
	// a helper we've provided to easily load images
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
	// You should multiply any movement by the dt parameter
	// which will ensure the game runs at the same speed for
	// all computers.
	this.x +=this.speed*dt;
	if (this.x > rightBoundry) {
		this.x=0;	
		allEnemies.splice(this.enemyLocation,1,new Enemy(this.enemyLocation)); //index location, howmany to remove, item to be added
	}
	if (typeof player != "undefined" ) {
		if (this.y == player.y && (this.x > player.x-75 && this.x < player.x+50)) {
			var location=startAtHome(); //restarts player at bottom row
			player.x=location[0];
			player.y=location[1];
			player.lives-=1;
			changeBoard('lives',player.lives);
			//document.getElementById("lives").innerHTML =player.lives;
			if (player.lives<=0) {
				var again = confirm("Game Over! Play again?");
				if (again == true) { //play again
					reset();
				} else {
					alert('Thanks for playing');
					allEnemies.splice(0,3); //remove all enemies
				}
			}
		} 
	}
}

function changeBoard(boardItem, value) {
	document.getElementById(boardItem).innerHTML =value;
}

function reset() {
	player= new Player();
	level=defaultLevel;
	changeBoard("levelNum",level);
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

var startAtHome = function() { //starts player on the first row in a random location
	var x =Math.floor(Math.random() * 5)*xSpacing;//places player on random column
	var y =playerStartRow; 
	return [x,y];
};

var Player = function() { //Player class
	var location=startAtHome();
	console.log(location);
	this.x=location[0];
	this.y=location[1];
	this.lives=defaultLives;
	this.level=defaultLevel;
	this.sprite = 'images/char-princess-girl.png';
};

Player.prototype.update = function() { //update method for Player Class
  //alert('player update'); 
}

Player.prototype.render = function() { //render method for Player Class
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

Player.prototype.handleInput = function(key) { //handleInput method for Player Class
	switch(key) {
		case 'left':
			if (this.x >0) this.x -= xSpacing;
			break;
		case 'right':
			if (this.x < rightBoundry) this.x += xSpacing;
			break;
		case 'up':
			if (this.y > topBoundry) this.y -= ySpacing;
			if (this.y < inTheWater) {
				var location=startAtHome(); //restarts player at bottom row
				this.x=location[0];
				this.y=location[1];
				level +=1; //increases the level by 1
				changeBoard('levelNum',level) //update level on scoreboard
			};
			break;
		case 'down':
			if (this.y < bottomBoundry) this.y += ySpacing;
			break;
	};
}

var allEnemies =[new Enemy(0), new Enemy(1), new Enemy(2)]; // Place all enemy objects in an array called allEnemies
var player= new Player(); // only one player- no array needed

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});