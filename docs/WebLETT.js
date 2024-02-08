// from original file - for testing purpuses
//const ledDimmer = document.getElementById('led-dimmer');
//const ledDimmerValue = document.querySelector('label span');
const connectButton = document.getElementById('connect-button');
const startButton = document.getElementById('start-button');
const upButton = document.getElementById('up-button');
const downButton = document.getElementById('down-button');
const testButton = document.getElementById('test-button');
const saveButton = document.getElementById('save-button');
const clearButton = document.getElementById('clear-button');
const speedSlider = document.getElementById('speed-slide');
const targetSlider = document.getElementById('target-slide');
const forceSlider = document.getElementById('force-slide');
const cyclesSlider = document.getElementById('cycle-slide');
const statusText = document.getElementById('status-text');
const testTypeTensile = 01; // bit 0
const testTypeCompression = 02; // bit 1
const testTypeData = 8; // bit 3
const subtestTypeFail = 16; // bit 4
const subtestTypeCreep = 32; // bit 5
const subtestTypeRelax = 64; // bit 6
const subtestTypeCyclic = 128; // bit 7
// positions of datamembers in results
const posTim = 0
const posPos = 1
const posFor = 2
const posRes = 3
const posTem = 4
const posNum = 5

// background colors
const good = 'limeGreen'
const goodWarning = 'lightGreen'
const neutral = 'LightGray'
const badWarning = 'lightSalmon'
const bad = 'red'

var debug = false
var LETTnumber
var testType = 0
var subtestType = 0
var LETTnumber
var LETTtime = -1
var starTime = -1
var testRunning = false
var unsavedData = false
var samples = 0
var testSpeed = -1, testForce = -1, testTarget = -1, testCycles = -1
var sensorType
var testValid = false
var LETTString
var LETTmoving = false
var BLEconnected = false
var USBconnected = false

const testEndReasons = [
"Undefined", 
"Finished normally", 
"Aborted (GUI)", 
"Aborted (BUTTON)", 
"Maximum steps reached", 
"Timeout", 
"Specimen Fail", 
"Force Overload" ];

var dataList = []
var dataPoint = []

speedSlider.addEventListener('input', (event) => {
	//console.log('speed event', event.target.value)
	testSpeed = parseInt(event.target.value)
	speedText.innerText = 'speed: ' + testSpeed
	//console.log("cookie testSpeed", testSpeed)
	//setCookie("testSpeed", testSpeed)
});		

targetSlider.addEventListener('input', (event) => {
	//console.log('target event', event.target.value)
	testTarget = parseInt(event.target.value)
	targetText.innerText = 'target: ' + testTarget;
});		

forceSlider.addEventListener('input', (event) => {
	//console.log('force event', event.target.value)
	testForce = Math.floor(10 ** (parseInt(event.target.value)/100))
	forceText.innerText = 'force: ' + testForce;
});		

cyclesSlider.addEventListener('input', (event) => {
	//console.log('cycle event', event.target.value)
	testCycles = Math.floor(Math.exp(parseInt(event.target.value)/100))
	cyclesText.innerText = 'cycles: ' + testCycles;
});		
		
function failClicked() {
	speedSlider.disabled = false
	speedText.style.color = "black"
	targetSlider.disabled = true
	targetText.style.color = "lightgrey"
	forceSlider.disabled = true
	forceText.style.color = "lightgrey"
	cyclesSlider.disabled = true
	cyclesText.style.color = "lightgrey"
}

function creepClicked() {
	speedSlider.disabled = false;
	speedText.style.color = "black"
	targetSlider.disabled = true;
	targetText.style.color = "lightgrey"
	forceSlider.disabled = false;
	forceText.style.color = "black"
	cyclesSlider.disabled = true;
	cyclesText.style.color = "lightgrey"
}

function relaxClicked() {
	speedSlider.disabled = false;
	speedText.style.color = "black"
	targetSlider.disabled = false;
	targetText.style.color = "black"
	forceSlider.disabled = true;
	forceText.style.color = "lightgrey"
	cyclesSlider.disabled = true;
	cyclesText.style.color = "lightgrey"
}

function cyclicClicked() {
	speedSlider.disabled = false;
	speedText.style.color = "black"
	targetSlider.disabled = false;
	targetText.style.color = "black"
	forceSlider.disabled = true;
	forceText.style.color = "lightgrey"
	cyclesSlider.disabled = false;
	cyclesText.style.color = "black"
}

function sensorClicked(s) {
	if (s == '100') {
		sensorType = 100
		LETTString = 'L100;'
	}
	if (s == '500') {
		sensorType = 500
		LETTString = 'L100;'
	}
	console.log('LETTString =' , LETTString)
	sendToLETT(LETTString)
}

function checkTestType() {
	testType = 0;
	if (document.getElementById('tensile').checked) {
		// console.log('tensile');
		testType = testTypeTensile;
	} 
	if (document.getElementById('compression').checked) {
		// console.log('compression');
		testType = testTypeCompression;
	}
	if (document.getElementById('data').checked) {
		// console.log('data');
		testType = testTypeData;
	}
	if (testType == 0) startEnabled = false;

	// test sub-type
	subtestType = 0;
	if (document.getElementById('fail').checked) {
		// console.log('fail');
		subtestType = subtestTypeFail;
	}
	if (document.getElementById('creep').checked) {
		// console.log('creep');
		subtestType = subtestTypeCreep;
	}
	if (document.getElementById('relax').checked) {
		// console.log('relax');
		subtestType = subtestTypeRelax;
	}
	if (document.getElementById('cyclic').checked) {
		// console.log('cyclic');
		subtestType = subtestTypeCyclic;
	}
	if (subtestType == 0) startEnabled = false;
	if (!startEnabled) errorMessage = "ERROR: check (sub)test type!";
}

function checkSensorType() {
	if (document.getElementById('sensor100').checked) sensorType = 100;
	if (document.getElementById('sensor500').checked) sensorType = 500;
	if ((sensorType != 100) && (sensorType != 500)) {
		startEnabled = false;
		errorMessage = 'ERROR: sensor not selected';
	}
}

function checkTestSpeed() {
	// console.log('speed', testSpeed);
	if (testSpeed<0 || testSpeed >256) {
		startEnabled = false;
		errorMessage = 'ERROR: speed not set';
	}
}

function checkTestForce() {
	console.log('force', testForce);
	if (subtestType != subtestTypeCreep) return;
	if (sensorType == 100) maxForce = 1000;
	if (sensorType == 500) maxforce = 5000;
	if (sensorType == 500 && testType == testTypeCompression) maxForce  = 2000;

	if (testForce<1 || testForce > maxForce) {
		startEnabled = false;
		errorMessage = 'ERROR: force not set (correct)!';
	}
}

function checkTestTarget() {
	if (subtestType != subtestTypeRelax && subtestType != subtestTypeCyclic) return;
	// console.log('goto', testTarget);
	if (testTarget<0 || testTarget>100) {
		startEnabled = false; 
		errorMessage = 'ERROR: target position not in range!';
	}
}

function checkTestCycles() {
	if (subtestType != subtestTypeCyclic) return;
	if (testCycles<0 || testCycles>1000) {
		startEnabled = false;
		errorMessage = 'ERROR: # cycles out of range';
	}
}

function checkUnsavedData() {
	if (unsavedData) {
		startEnabled = false;
		errorMessage = 'ERROR: there is unsaved data, press clear to erase';
		clearButton.disabled = false
		return true
	} else {
		return false
	}
}

function makeStartString() {
	// speed, force, target position, cycles if applicable.
	LETTString = "";
	LETTString += "T" + (testType+subtestType).toString();
	LETTString += "S" + testSpeed.toString();
	LETTString += "F" + testForce.toString();
	LETTString += "G" + testTarget.toString();
	LETTString += "N" + testCycles.toString();
	LETTString += "L" + sensorType.toString();
	LETTString += "I\n";
	// print this always - errorchecking
	console.log('LETTString:', LETTString);
}

function showMessage(s, c) {
	console.log(s, c);
	statusText.style.backgroundColor = c;
	statusText.innerText = s;
}

function gripperUp() {
	showMessage('Gripper Up', goodWarning);
	sendToLETT('A');
	LETTmoving = true;
}

function gripperDown() {
	showMessage('Gripper Down', goodWarning);
	sendToLETT('B');
	LETTmoving = true;
}

function gripperStop() {
	showMessage('', neutral);
	sendToLETT('C');
	LETTmoving = false;
}

function toggleDebug() {
	debug = !debug
	if (debug) {
		showMessage('debug on', badWarning); 
		testButton.disabled = false;
	} else {
		showMessage('debug off', goodWarning);
		testButton.disabled = true;
	}
}

function startStop() {
	console.log("start/stop pressed");
	startButton.style.backgroundColor = 'LightSalmon'
	if (!testRunning) {
		startEnabled = true; // the tests will disable if conditions are not met.
		checkTestType();
		checkSensorType();
		if (testType != testTypeData) {
			checkTestSpeed();
			checkTestForce();
			checkTestTarget();
			checkTestCycles();
		}
		makeStartString();
		checkUnsavedData();
		if (!startEnabled) {
			//console.log('no start');
			showMessage(errorMessage, badWarning);
			return;
		} else {
			showMessage('test running', goodWarning);
			document.getElementById('smplLabel').hidden=false;
			if (subtestType==subtestTypeCyclic) {
				document.getElementById('cycLabel').hidden=false;
			}
			clearData()
			dataPoint = []
			testRunning = true;
			//startTime = LETTtime;
			startButton.innerHTML = "STOP";
			startButton.style.backgroundColor = 'LightRed'
			upButton.disabled = true;
			downButton.disabled = true;
			//console.log('save cookies')
			saveParameterCookies()
			//
			console.log('LETTString', LETTString);
			sendToLETT(LETTString);
		
		}
	} else {
		sendToLETT('C\n');
		testRunning = false;
		upButton.disabled = true;
		downButton.disabled = true;
		startButton.innerHTML = "START";
	}
}

function sendToLETT(str) {
	if (BLEconnected) sendBLE(str)
	if (USBconnected) sendSerial(str)
}

function sendSerial(str) {
	enc = new TextEncoder();
	if (debug) console.log('sendSerial', str);
	var bytes = enc.encode(str);
	//console.log('bytes', bytes);
	const writer = port.writable.getWriter();
	writer.write(bytes);
	writer.releaseLock();
}

function addDataPoint(dp) {
	dataList.push([].concat(dp))
}

function saveData() {
  // Prompt the user for a filename
  var filename = prompt("Please enter a filename", "dataset.csv");

  // Prepare the CSV content
  var csvContent = "Time,Extension,Force,Resistance,Temperature\n";

  // Iterate over the dataset and append each row to the CSV content
  dataList.forEach(function(data) {
	if (debug) console.log('data', data)
	var row = Object.values(data).join(",") // Join the values with commas
	csvContent += row + "\n"
  })

  // Create a blob with the CSV content
  var blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

  // Check if the browser supports the 'msSaveOrOpenBlob' method (for IE)
  if (navigator.msSaveOrOpenBlob) {
	navigator.msSaveOrOpenBlob(blob, filename);
  } else {
	// Create a temporary link element
	var link = document.createElement("a");
	if (link.download !== undefined) {
	  // Set the download attribute and the object URL to the link
	  link.setAttribute("href", URL.createObjectURL(blob));
	  link.setAttribute("download", filename);

	  // Simulate a click on the link to trigger the download
	  link.style.visibility = "hidden";
	  document.body.appendChild(link);
	  link.click();
	  document.body.removeChild(link);
	  unsavedData = false
	}
  }
}

function clearData(override = false) {
	if (checkUnsavedData() & !override) return
	myChart.config.data.datasets[0].data = [] // Force
	myChart.config.data.datasets[1].data = [] // Resistance
	myChart.config.data.datasets[2].data = [] // Temperature
	myChart.update('none')
	dataList = []
	clearButton.disabled = true
	unsavedData = false
}

function processIncoming(line) {
	if (debug) console.log('line:', line)
	document.getElementById("info").style.color = 'lightGrey'
	document.getElementById("info").innerHTML=line
	var data = line.split(';')
	for (i = 0; i<data.length; i++) {
		//console.log(data[i]);
		
		// standard data package (force, position, time, resistance, temperature
		if (data[i].startsWith('p')) { // position
			//console.log('p', data[i].split('p'))
			pos = parseFloat(data[i].split('p')[1])
			dataPoint[posPos] = pos
			document.getElementById("pos").innerHTML=pos
			//myChart.config.data.datasets[0].data[samples%100].x=pos
		}

		if (data[i].startsWith('f')) { // force
			if (debug) console.log('f', data[i].split('f'))
			force = parseFloat(data[i].split('f')[1])
			dataPoint[posFor] = force
			document.getElementById("frc").innerHTML=force
			//myChart.config.data.datasets[0].data[samples%100].y=force
		}

		if (data[i].startsWith('t')) { // timestamp
			//console.log('t', data[i].split('t'))
			LETTtime = parseFloat(data[i].split('t')[1])
			dataPoint[posTim] = LETTtime
			if (testRunning) {
				document.getElementById("tim").innerHTML=LETTtime
			}
		}

		if (data[i].startsWith('r')) { // resistance
			//console.log('f', data[i].split('f'));
			res = parseFloat(data[i].split('r')[1]);
			dataPoint[posRes] = res
			document.getElementById('resLabel').hidden=false;
			document.getElementById("res").innerHTML=res;
		}

		if (data[i].startsWith('k')) { // k-type temperature
			//console.log('f', data[i].split('f'));
			temp = parseFloat(data[i].split('k')[1]);
			dataPoint[posTem] = temp
			document.getElementById("tmp").innerHTML=temp;
		}
		
		if (data[i].startsWith('n')) { // sample number
			//console.log('f', data[i].split('f'));
			num = parseFloat(data[i].split('n')[1]);
			dataPoint[posNum] = num
			document.getElementById("cycl").innerHTML=num;
		}
		
		//if (data[i].startsWith('V')) { // LETT number
		if (data[i].indexOf('V') != -1) { // LETT number
			if(debug) console.log('V', data[i].split('V')[1]);
			n = parseInt(data[i].split('V')[1]);
			document.getElementById("num").innerHTML="LETT " + n;
		}				

		// configuration info (
		if (data[i].startsWith('L')) { // Loadcell / Sensor installed
			s = parseInt(data[i].split('L')[1]);
			if (s==1) {
				sensorType = 100;
				document.getElementById("sensor100").checked=true;
			}
			if (s==5) {
				sensorType = 500;
				document.getElementById("sensor500").checked=true;
			}
		}

		if (data[i].startsWith('W')) { // Versionstring new style
			v = data[i].split('W')[1].substr(0);
			document.getElementById('swver').innerText = 'V' + v;
		}

		if (data[i].startsWith('X')) { // LETT number (new style)
			n = parseInt(data[i].split('X')[1]);
			document.getElementById("num").innerHTML="LETT " + n;
		}

		if (data[i].startsWith('Y')) { // Hardware config (fourpoint / K-Type)
			s = parseInt(data[i].split('Y')[1]);
		}

		if (data[i].startsWith('Y')) { // Hardware config (fourpoint / K-Type)
			h = parseInt(data[i].split('Y')[1]);
			if (h &  1) {
				sensorType = 100;
				document.getElementById("sensor100").checked=true;
			}
			if (h &  2) {
				sensorType = 500;
				document.getElementById("sensor500").checked=true;
			}
			if (h &  4) {
				document.getElementById("4pts").innerHTML="4Point";
				document.getElementById("resLabel").hidden=false;
			}
			if (h & 16) {
				document.getElementById("ktype").innerHTML="K-Type";
				document.getElementById("tmpLabel").hidden=false;
			}
		}

		if (data[i].startsWith('C')) { // End of test
			testRunning = false;
			testEndReason = parseInt(data[i].split('C')[1]);
			showMessage('test finished:' + testEndReasons[testEndReason], goodWarning);
			upButton.disabled = false;
			downButton.disabled = false;
			startButton.innerHTML = "START";
			saveButton.disabled = false
		}

	}		
	if (testRunning) {
		// showData()
		unsavedData = true
		addDataPoint(dataPoint) // add record to testData
		plotData(dataPoint)	// update plot.
		// myChart.update() // now in plotData
	}
}


function plotData(p) {
	if (debug) console.log('plotData', p);
	myChart.config.data.datasets[0].data.push({x: p[posPos], y:p[posFor]}) // Displacement vs Force
	myChart.config.data.datasets[1].data.push({x: p[posTim], y:p[posFor]}) // Time vs Force
	myChart.config.data.datasets[2].data.push({x: p[posTim], y:p[posPos]}) // Time vs Resistance
	myChart.update()	
}

// Serial stuff
var lineBuffer = '';
async function getReader() {
	//console.log('getReader');
	port = await navigator.serial.requestPort({});
	await port.open({ baudRate: 38400 });
	//console.log('port is open');
	const appendStream = new WritableStream({
		write(chunk) {
		if (debug) console.log('chunk:', chunk);
		lineBuffer += chunk;
		var lines = lineBuffer.split('\n');				
		while (lines.length > 1) {
			if (testRunning) {
				samples +=1;
				document.getElementById("smpl").innerHTML=samples;
			}
			var line = lines.shift();
			processIncoming(line);
		}
		lineBuffer = lines.pop();
		}
	});
		
	// console.log('port.readable');
	port.readable
	  .pipeThrough(new TextDecoderStream())
	  .pipeTo(appendStream);	
		
	//console.log('document.querySelector');
        document.querySelector('input').disabled = false;

	port.addEventListener('disconnect', (event) => {
		console.log('port: lost connection');
		showMessage('port disconnected!', bad)
	});

	// opening the port causes a reset of Arduino. 
	// Wait for it to initialize and turn on printing.
	setTimeout(function () {
		if (debug) console.log('Timer expired')
		USBconnected = true;
		sendToLETT('P\n')
		console.log('request version info')
		sendToLETT('V\n')
	        //connectButton.innerText = '🔌 Disconnect';
        	connectButton.disabled = true;
        	startButton.disabled = false;
        	upButton.disabled = false;
        	downButton.disabled = false;
		showMessage('LETT connected, have fun!', good)
	}, 3500)


	navigator.serial.addEventListener('connect', (e) => {
		console.log('(re)connected')
		showMessage('port (re)connected, you must start over!', badWarning)
		setTimeout(function () {
			location.reload()
		}, 5000)
	});


	navigator.serial.addEventListener('disconnect', (e) => {
		console.log('navigator: disconnected')
		showMessage('port disconnected!', bad)
	});			
		
}

console.log('load eventlistener')
window.addEventListener("beforeunload", function (e) {
	console.log('unloadevent')
	if (unsavedData) {
		var confirmationMessage = 'It looks like you have been editing something. '
			    + 'If you leave before saving, your changes will be lost.';

		(e || window.event).returnValue = confirmationMessage; //Gecko + IE
		return confirmationMessage; //Gecko + Webkit, Safari, Chrome etc.
	} else {
		return
	}
});
console.log('WebLETT.js loaded');
