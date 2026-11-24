/* state.js - contains state variables
 * refactoring: vars should go in state. , some should not be global
 */
var testType = 0
var testTypeText = ""
var subtestType = 0
var LETTnumber
var LETTSoftwareVersion
var LETTtime = -1
// var starTime = -1
var testRunning = false
var unsavedData = false
var samples = 0
var testSpeed = -1, testForce = -1, testTarget = -1, testCycles = -1
var testSpeedIndex = -1 //, testCyclesIndex = -1
var testStarted = ""
var sensorType
var testValid = false
var LETTString
var LETTmoving = false
var BLEconnected = false
var USBconnected = false

let startEnabled = false;
let errorMessage = 'ERROR: Message undefined!';

var tareForceValue = 0
var tarePositionValue = 0

console.info('state.js loaded')
