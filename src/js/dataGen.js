// Some random words
var words = ["moldavia","eclipsing","minotaur","lido","halloween","semite","cylvia","tatiana",
"degrease","ectype","elena","picara","dividedly","pottier","yawata","macu","muggur","forsythia",
"bakeries","memphian","fubsiest","pygmalion","sotted","yap","dulcinea","revelry","cwo","bluey",
"rifler","delilah","madrona","mulliken","bulldoze","eddie","cheney","dysuria","analogy","annwn",
"dottrel","phocine","stoss","unveering","atiptoe","mandarin","weaponed","solver","defile","tumuluses",
"ruminate","dresser","daira","blankbook","hague","macled","lowcased","macled","lowcased","weirdieblankbook"];

var days = ["monday","tuesday","wednesday","thursday","friday","saturday","sunday"];
var months = ["January","Februaury","March","April","May","June","July","August","September","October","November","December"];

// Some random names
var names = ["Candy Maske","Faustino Regis","Newton Masson","Iris Lucier", "Cherilyn Meade", "Kelli Dyer",  
"Debera Eisenhart","Beatris Adamek","Jacquetta Asberry","Herschel Whisler"];

function createRandomMessage(){
	let message = [];
	for(let i = 0; i < getRandomInt(0,10); i++){ // Create a random length message
		message.push(words[getRandomInt(0,words.length)]); // Grab a random word out of the words array
	}
	return message;
}

function createRandomTimeData(){
	let day = days[getRandomInt(0,days.length)];
	let month = months[getRandomInt(0,months.length)];
	let monthDay = getRandomInt(1,32); 
	let year = getRandomInt(2010,2016);

	let hour = getRandomInt(1,13);
	let min = getRandomInt(1,61);

	let timeZ = "UTC+12";

	let am = getRandomInt(1,3) === 1 ? true : false;

	let amString = "am";
	if(!am){
		amString = "pm";
	}

	return new timeData(day,month,monthDay,year, ""+hour + "." +min+""+amString, timeZ,am);
}


function createRandomMessageData(){
	let time = createRandomTimeData();
	let message = createRandomMessage();
	let sender = names[getRandomInt(0,names.length)];
	let peopleInThread = [sender,names[getRandomInt(0,names.length)]]

	return new messageData(sender,peopleInThread,time,message);
}

// Random number function max not unclusive
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

const randomData = [];

for(let i = 0; i < 100; i++){
	randomData.push(createRandomMessageData());
}

console.log(randomData);


