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

function testClicked() {
	console.log('test clicked: test unload')

	window.addEventListener("beforeunload", function (e) {
    		var confirmationMessage = 'It looks like you have been editing something. '
                	            + 'If you leave before saving, your changes will be lost.';

    	(e || window.event).returnValue = confirmationMessage; //Gecko + IE
    	return confirmationMessage; //Gecko + Webkit, Safari, Chrome etc.
	});
}
