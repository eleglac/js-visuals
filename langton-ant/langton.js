window.addEventListener("click", antHandler);

var tileScale = 1;
var columns = Math.floor(100/tileScale);
var rows = Math.floor(75/tileScale);
var tiles = columns*rows;

var directions = { left: [1, 2, 3, 0], right: [3, 0, 1, 2], ahead: [0, 1, 2, 3] };

var antOne = { ahead: 0, position: Math.floor(tiles/2) };
var antTwo = { ahead: 1, position: 0 };

var transformations = new Map();

function standardAnt() {
	transformations.clear();
	transformations.set("white", 	[directions.right, "black"]);
	transformations.set("black", 	[directions.left,  "white"]);
}

function wRkLrRAnt() {
	transformations.clear();
	transformations.set("white", 	[directions.right, "black"]);
	transformations.set("black", 	[directions.left,  "red"]);
	transformations.set("red",   	[directions.right, "white"]);
}

function rRgLbRkRAnt() {
	transformations.clear();
	transformations.set("red",	[directions.right, "green"]);
	transformations.set("green", 	[directions.left,  "blue"]);
	transformations.set("blue",   	[directions.right, "white"]);
	transformations.set("white",   	[directions.right, "red"]);
}

function creeperAnt() {
	transformations.clear();
	transformations.set("red",	[directions.right, "green"]);
	transformations.set("green",	[directions.ahead, "red"]);
	transformations.set("white",	[directions.left, "red"]);
}

function createTile(id) {
	var tile = document.createElement("DIV");
	tile.className = "tile";
	tile.id = id;
	tile.style.backgroundColor = "white";
	
	return tile;
}

function getNeighbors(ant) {
	var id = parseInt(ant.position);
	
	var top, bottom;
	if ((id - columns) < 0) {
		top = tiles - id;
		bottom = id + columns;
	} 
	else if ((id + columns) > tiles) {
		top = id - columns;
		bottom = (id + columns) % tiles;
	} 
	else {
		top = id - columns;
		bottom = id + columns;
	}

	var left, right;
	if ((id - 1)%columns > id%columns) {
		left = id - (id%columns) + (columns - 1);
		right = id + 1;
	} 
	else if ((id + 1)%columns < id%columns) {
		left = id - 1;
		right = id - (id % columns);
	} 
	else {
		left = id - 1;
		right = id + 1;
	}

	return [right, top, left, bottom];
}

function updateAnt(ant) {
	var neighbors = getNeighbors(ant);

	var currentPosition = document.getElementById(neighbors[ant.ahead]);
	ant.position = currentPosition.id;

	var tileColor = currentPosition.style.backgroundColor;
	var update = transformations.get(tileColor);
	currentPosition.style.backgroundColor = update[1];

	ant.ahead = update[0][ant.ahead];
}

function antHandler() {
	updateAnt(antOne);
	setTimeout(antHandler, 1);
}	

for (i = 0; i < tiles; i++) {
	document.body.appendChild(createTile(i));
}

creeperAnt();
//standardAnt();
//wRkLrRAnt();
//rRgLbRkRAnt();