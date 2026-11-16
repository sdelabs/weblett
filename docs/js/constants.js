/* constants.js - contains all (most of) the constants used */

// Keep track of the version
const WebLETTversion = 261116

// Test Type contains two bits: test and subtest, assembled in a syngle 16bit value.
const testTypeTensile = 1; // bit 0
const testTypeCompression = 2; // bit 1
const testTypeData = 8; // bit 3
const subtestTypeFail = 16; // bit 4
const subtestTypeCreep = 32; // bit 5
const subtestTypeRelax = 64; // bit 6
const subtestTypeCyclic = 128; // bit 7
//
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

console.info('constants.js loaded')
