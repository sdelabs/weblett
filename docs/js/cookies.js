debug = true

// https://www.w3schools.com/js/js_cookies.asp
function saveParameterCookies() {
	if (debug) console.log('save cookies')
	console.log("LETTtest", testType)
	setCookie("LETTtest", testType)
	setCookie("LETTsubtest", subtestType)
	setCookie("LETTspeed", testSpeed)
	setCookie("LETTforce", testForce)
	setCookie("LETTtarget", testTarget)
	setCookie("LETTcycles", testCycles)	
}

function getParameterCookies() {
	if (true) console.log('get cookies')
	testType  = getCookie("LETTtest")
	console.log('LETTtest', testType)
	if (testType==testTypeTensile) document.getElementById('tensile').checked = true
	if (testType==testTypeCompression) document.getElementById('compression').checked = true

	subtestType  = getCookie("LETTsubtest")
	// console.log('LETTsubtest', subtestType)
	if (subtestType == subtestTypeFail) document.getElementById('fail').checked = true
	if (subtestType == subtestTypeRelax) document.getElementById('relax').checked = true
	if (subtestType == subtestTypeCreep) document.getElementById('creep').checked = true
	if (subtestType == subtestTypeCyclic) document.getElementById('cyclic').checked = true

	testSpeed  = getCookie("LETTspeed")
	if (testSpeed == "") {
		testSpeed = 15
	} 
	if (debug) console.log('speed=', testSpeed, '|')
	speedSlider.value = testSpeed
	speedText.innerText = 'speed: ' + testSpeed

	testForce  = getCookie("LETTforce")
	if (testForce != "") {
		//console.log('force', testForce)
		forceSlider.value = testForce
		forceText.innerText = 'force: ' + testForce
	}
	testTarget = getCookie("LETTtarget")
	if (testTarget != "") {
		//console.log('target', testTarget)
		targetSlider.value = testTarget
		targetText.innerText = 'target: ' + testTarget
	}
	testCycles = getCookie("LETTcycles")
	if (testCycles != "") {
		//console.log('cycles', testCycles)
		cyclesSlider.value = testCycles
		cyclesText.innerText = 'cycles: ' + testCycles
	}
}

function setCookie(cname, cvalue, exdays) {
	if (debug) console.log('setCookie', cname, cvalue)
	const d = new Date();
	d.setTime(d.getTime() + (exdays*24*60*60*1000));
	let expires = "expires="+ d.toUTCString();
	document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
	if (debug) console.log('getCookie:', cname)
	let name = cname + "=";
	let decodedCookie = decodeURIComponent(document.cookie);
	let ca = decodedCookie.split(';')
	for(let i = 0; i <ca.length; i++) {
		let c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1)
		}
		console.log(c, c.indexOf(name))
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return "";
}

// for testing purposes it's convenient to clear all cookies
function clearAllCookies() {
	console.log('cleared cookies');
	document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
	/* 
 	setCookie("LETTtest", testType)
	setCookie("LETTsubtest", subtestType)
	setCookie("LETTspeed", testSpeed)
	setCookie("LETTforce", testForce)
	setCookie("LETTtarget", testTarget)
	setCookie("LETTcycles", testCycles)	
 	*/
	document.cookie = 'LETTspeed=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
	document.cookie = 'LETTforce=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
	document.cookie = 'LETTtarget=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
	document.cookie = 'LETTcycles=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}


// and read existing cookies
getParameterCookies()
//clearAllCookies();
