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
var testTypeText = ""
var subtestType = 0
var LETTnumber
var LETTtime = -1
var starTime = -1
var testRunning = false
var unsavedData = false
var samples = 0
var testSpeed = -1, testForce = -1, testTarget = -1, testCycles = -1
var testSpeedIndex = -1, testCyclesIndex = -1
var testStarted = ""
var sensorType
var testValid = false
var LETTString
var LETTmoving = false
var BLEconnected = false
var USBconnected = false

var testEndReason = 0
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
var testData = []
/*
speedSlider.addEventListener('input', (event) => {
	//console.log('speed event', event.target.value)
	testSpeed = parseInt(event.target.value)
	speedText.innerText = testSpeed
});		
*/
const speedList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 14, 15, 16, 18, 20, 22, 25, 30, 35, 40, 45, 50, 60, 70, 75, 80, 90, 100, 110, 120, 125, 130, 140, 150, 160, 175, 180, 200, 220, 240, 250]
console.log(speedList.length)

speedSlider.oninput = function() {
	testSpeedIndex = parseInt(this.value)
	console.log(this.value, speedList[testSpeedIndex])
	speedText.innerText = speedList[testSpeedIndex]
	testSpeed  = speedList[testSpeedIndex]
}

targetSlider.addEventListener('input', (event) => {
	//console.log('target event', event.target.value)
	testTarget = parseInt(event.target.value)
	targetText.innerText = testTarget
});		

forceSlider.addEventListener('input', (event) => {
	//console.log('force event', event.target.value)
	testForce = Math.floor(10 ** (parseInt(event.target.value)/100))
	forceText.innerText = testForce
});		

/*
cyclesSlider.addEventListener('input', (event) => {
	//console.log('cycle event', event.target.value)
	testCycles = Math.floor(Math.exp(parseInt(event.target.value)/100))
	cyclesText.innerText = testCycles
});		
*/
const cyclesList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 15, 16, 18, 20, 22, 25, 30, 35, 40, 45, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 180, 200, 250, 500, 750, 1000]
console.log(cyclesList.length)
cyclesSlider.oninput = function() {
	testCyclesIndex = parseInt(this.value)
	console.log(this.value, cyclesList[testCyclesIndex])
	cyclesText.innerText = cyclesList[testCyclesIndex]
	testCycles = cyclesList[testCyclesIndex]
}
		
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
		LETTString = 'L100\n'
	}
	if (s == '500') {
		sensorType = 500
		LETTString = 'L500\n'
	}
	console.log('LETTString =' , LETTString)
	sendToLETT(LETTString)
}

function checkTestType() {
	testType = 0;
	if (document.getElementById('tensile').checked) {
		// console.log('tensile');
		testType = testTypeTensile;
		testTypeText = "Tensile"
	} 
	if (document.getElementById('compression').checked) {
		// console.log('compression');
		testType = testTypeCompression;
		testTypeText = "Compression"
	}
	if (document.getElementById('data').checked) {
		// console.log('data');
		testType = testTypeData;
		testTypeText = "Data"
	}
	if (testType == 0) startEnabled = false;

	// test sub-type
	subtestType = 0;
	if (document.getElementById('fail').checked) {
		// console.log('fail');
		subtestType = subtestTypeFail;
		testTypeText += " (Fail)"
	}
	if (document.getElementById('creep').checked) {
		// console.log('creep');
		subtestType = subtestTypeCreep;
		testTypeText += " (Creep)"
	}
	if (document.getElementById('relax').checked) {
		// console.log('relax');
		subtestType = subtestTypeRelax;
		testTypeText += " (Relax)"
	}
	if (document.getElementById('cyclic').checked) {
		// console.log('cyclic');
		subtestType = subtestTypeCyclic;
		testTypeText += " (Cyclic)"
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
	if (debug) console.log('unsavedData', unsavedData)
	if (unsavedData) {
		startEnabled = false;
		errorMessage = 'ERROR: there is unsaved data, save or clear first';
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
			testStarted = Date().toLocaleString()
			document.getElementById('smplLabel').style.visibility='visible'
			if (subtestType==subtestTypeCyclic) {
				console.log('**** visible')
				document.getElementById('cycLabel').style.visibility='visible'
				document.getElementById('cycl').style.visibility='visible'
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
	} else { // test running: stop pressed
		sendToLETT('C\n');
		testRunning = false;
		upButton.disabled = true;
		downButton.disabled = true;
		startButton.innerHTML = "START";
		startButton.style.backgroundColor = 'LightRed'
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
/* 	assemble testdata
	LETT2020 version February 2021 maintained by Adrie Kooijman				
					
	Test parameters				
	LETT number: 5		Sensor: 100 kg		
	Test type: cyclic		Speed: 5 mm/min		
	Force limit: 0		Distance: 1		Cycles: 4
					
	Started 1 Feb 2022 16:16		Final state: Finished normally		
*/
	testData[1] = ",,LETT2020 Version XXXX " // + SoftwareVersion
	testData[2] = ""
 	testData[3] = ",,Test parameters"
	testData[4] = ",,LETT number: " + LETTnumber + ", Sensor: " + sensorType + "kg"
	testData[5] = ",,Test type: " + testTypeText + ", Speed: " + testSpeed
	testData[6] = ",,Force limit: " + testForce + ", Displacement: " + testTarget + ", Cycles: ", testCycles
	testData[7] = ""
 	testData[8] = ",,Started: " + testStarted + ", Final state: " + testEndReasons[testEndReason]

	console.log(' testData' , testData, ' length' , testData.length)
	
  // Prompt the user for a filename
  var filename = prompt("Please enter a filename", "dataset.csv");

  // Prepare the CSV content
  var csvContent = "Time,Extension,Force,Resistance,Temperature\n";

  // Iterate over the dataset and append each row to the CSV content
  testDataLinecount = 0
  console.log(' testData' , testData, ' length' , testData.length)
  dataList.forEach(function(data) {
	if (debug) console.log('data', data)
	var row = Object.values(data).join(",") // Join the values with commas
	if (testDataLinecount < testData.length) {
		csvContent += row + testData[testDataLinecount] + "\n"
		testDataLinecount += 1
	} else {
		csvContent += row + "\n"
	}
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

	  startButton.style.backgroundColor = '#667292'
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
	saveButton.disabled = true
	unsavedData = false
	// https://www.geeksforgeeks.org/how-to-change-text-label-orientation-on-x-axis-in-chart-js/
	// myChart.options.scales.y.title.text='New Label'
	startButton.style.backgroundColor = '#667292'
}

function processIncoming(line) {
	if (debug) console.log('line:', line)
	document.getElementById("info").style.color = 'darkGrey'
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
			if (res < 1000) {
				res = res.toFixed(2)
			} else if (res > 1250000) {
				res = -1
			} else {
				res = res.toFixed(0)
			}
			
			dataPoint[posRes] = res
			document.getElementById('resLabel').style.visibility='visible'
			document.getElementById("res").innerHTML=res;
		}

		if (data[i].startsWith('k')) { // k-type temperature
			//console.log('f', data[i].split('f'));
			temp = parseFloat(data[i].split('k')[1]);
			dataPoint[posTem] = temp
			document.getElementById("tmp").innerHTML=temp;
		}
		
		if (data[i].startsWith('n')) { // cycle number
			// console.log('n', data[i], data[i].split('n'));
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
				document.getElementById("resLabel").style.visibility='visible'
			}
			if (h & 16) {
				document.getElementById("ktype").innerHTML="K-Type";
				document.getElementById("tmpLabel").style.visibility='visible'
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
			clearButton.disabled = false
			//saveButton.style.backgroundColor = good
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
	myChart.config.data.datasets[2].data.push({x: p[posPos], y:p[posRes]}) // Time vs Resistance
	myChart.config.data.datasets[3].data.push({x: p[posTim], y:p[posRes]}) // Time vs Resistance
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
