/* var dp = {
  timestamp: 0,
  position: 0.0,
  force: 0.0,
  resistance: 0.0,
  temperature: 0.0
};
*/

var da = [0,0,0,0]
var ds = [[]]
var xc = document.cookie

function testClicked() {
	console.log('test clicked')
    setCookie('testSpeed', 25)
}

// https://www.w3schools.com/js/js_cookies.asp
function setCookie(cname, cvalue, exdays) {
	console.log('setCookie', cname, cvalue)
  const d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  let expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
	//console.log('getCookie', cname)
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  console.log('ck', decodedCookie)
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

console.log('speed', getCookie("testSpeed"))
