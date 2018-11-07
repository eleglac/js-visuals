var numberOfBoxes = 2048; /* put GLOBAL variables at the beginning of your script, so they are easy to find */

console.log("script running");

function randInt(maximum) {
	return Math.floor(maximum*Math.random());
}

function randColor() {
	var randR = randInt(256);
	var randG = randInt(256);
	var randB = randInt(256);
	return "rgb("+randR+","+randG+","+randB+")";
}

function changeColor() {
	var color = randColor();

	console.log(event.currentTarget);

	event.currentTarget.style.backgroundColor = color;
}

for (i = 0; i < numberOfBoxes; i = i + 1) {
	var newChild = document.createElement("DIV");
	newChild.className = "color-block";
	newChild.id = i;
	newChild.style.backgroundColor = "black";
	newChild.addEventListener("click", changeColor);

	document.getElementById("content").appendChild(newChild);
}