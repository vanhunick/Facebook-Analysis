

function createRandomMessage(length, ){

}

var days = ["monday","tuesday","wednesday","thursday","friday","saturday","sunday"];
var months = ["January","Februaury","March","April","May","June","July","August","September","October","November","December"];


function createRandomTimeData(){
	let day = days[getRandomInt(0,day.length)];
	let month = months[getRandomInt(0,months.length)];
	let year = getRandomInt(2010,2016);

	let hour = getRandomInt(1,13);
	let min = getRandomInt(1,61);

	let timeZ = "UTC+12";

	let am = getRandomInt(1,3) === 1 ? true : false;

	let amString = "am";
	if(!am){
		amString = "pm";
	}

	return new timeData(day,month,year, ""+hour + "." +min+""+amString, timeZ,am);
}


// Random number function max not unclusive
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}