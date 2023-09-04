var bluetoothDevice;
var incomingCharacteristic;
var outgoingCharacteristic = null;
// device dependend characteristic names
const serviceName = '0000ffe0-0000-1000-8000-00805f9b34fb';
const receiveCharacteristicName = '0000ffe1-0000-1000-8000-00805f9b34fb'
const sendCharacteristicName = '0000ffe1-0000-1000-8000-00805f9b34fb'

var enc = new TextEncoder(); // need arraybuffer to send data 
var dec = new TextDecoder(); // need arraybuffer to receive data 

async function listBLE() {
	console.log("listBLE");
	myDeviceName = "foobar";
	try {
		if (!bluetoothDevice) {
			await requestDevice();
		}
		console.log('Connect Device ...');
		await connectDeviceAndCacheCharacteristics();
	} catch(error) {
		console.log('*** Argh! (connectDeviceAndCacheCharacteristics) ' + error);
	}
	console.log("end of listBLE");
	connectButton.disabled = true;
	saveButton.disabled = false;
}
	
async function requestDevice() {
	console.log('Requesting Device (predefined list)');
	bluetoothDevice = await navigator.bluetooth.requestDevice({
		// filters: [...] <- Prefer filters to save energy & show relevant devices.
		acceptAllDevices: false,
		filters: [ {namePrefix: "CIRCUITPY"}, {namePrefix: "Arduino"} , {namePrefix: "MIO"}, {namePrefix: "HMSoft"},],
		optionalServices: ['6e400001-b5a3-f393-e0a9-e50e24dcca9e', // circuitpy uart service
		'19b10000-e8f2-537e-4f6c-d104768a1214', // arduino service
		//'0000ffe1-0000-1000-8000-00805f9b34fb', // HM10 uart(?) service
		'0000ffe0-0000-1000-8000-00805f9b34fb', // HM10 main SendReceive (Arduino example)				   
		 0x1809] // NRFsend temperature service - note the 0x and missing '' in a standard service type uuid ...
	});
	bluetoothDevice.addEventListener('gattserverdisconnected', onDisconnected);
}

async function connectDeviceAndCacheCharacteristics() {
	if (bluetoothDevice.gatt.connected && incomingCharacteristic) {
		console.log('already connected');
		return;
	}

	console.log('Connecting to GATT Server...');
	const server = await bluetoothDevice.gatt.connect();
	console.log('server:', server.device.name);

	// document.getElementById("deviceID").innerHTML = server.device.name;

	console.log('Getting Service...', serviceName);
	// document.getElementById("serviceID").innerHTML = serviceName+"<br>"+characteristicName;
	const service = await server.getPrimaryService(serviceName);
	if (debug) console.log('Getting Incoming Characteristic...', characteristicName);

	//*** not neccesary, for debug
	//console.log("listCharacteristics");
	//listCharacteristics = await service.getCharacteristics();
	//console.log(listCharacteristics);

	//listCharacteristics.forEach(e => {
	//	console.log(e.properties.write, e.properties.read, e.properties.notify);			
	//});

	incomingCharacteristic = await service.getCharacteristic(receiveCharacteristicName);
	incomingCharacteristic.addEventListener('characteristicvaluechanged', getData);
	await incomingCharacteristic.startNotifications(); // otherwise nothing happens...
	timeStarted = Date.now();

	console.log('Getting outgoing Characteristic...');
	outgoingCharacteristic = await service.getCharacteristic(sendCharacteristicName);

	//TODO: testing only.
	message = enc.encode("test");
	if (debug) {
		console.log('write test message');
	}
	// outgoingCharacteristic.writeValue(message);

	r = await btSendData("V1612")
	r = await btSendData("T3;S10;I;\r\n")
	//
	
}

async function onDisconnected() {
	console.log('> Bluetooth Device disconnected');
	try {
		await connectDeviceAndCacheCharacteristics()
	} catch(error) {
		console.log('*** Argh! (onDisconnect) ' + error);
	}
}

function getData(event) {
	//if (debug) console.log('getData target value', event.target.value)
	var string = dec.decode(event.target.value);
	if (debug) console.log('getData string', string)
	processIncoming(string)
}

// don't async send (unless you can check if the previous action has finished)
function btSendData(string) {
	console.log('btSendData', string)
	message = enc.encode(string);
	try {
		outgoingCharacteristic.writeValue(message);
	} catch (error) {
    		console.error(`Could not write: ${error}`);
  	}
}

console.log(1612)