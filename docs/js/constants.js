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

// --- Speed lookup (non-linear slider) ---
const SPEED_LIST = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 14, 15, 16, 18, 20, 22, 25, 30, 35, 40, 45, 50, 60, 70, 75, 80, 90, 100, 110, 120, 125, 130, 140, 150, 160, 175, 180, 200, 220, 240, 250]

// --- LETT Serial Protocol - Incoming (all tokens start with a single letter) ---
const MSG = {
    POSITION:    'p',
    FORCE:       'f',
    TIME:        't',
    RESISTANCE:  'r',
    TEMPERATURE: 'k',
    CYCLE_NUM:   'n',
    SW_VERSION:  'W',
    LETT_NUM:    'X',
    HW_CONFIG:   'Y',
    TEST_END:    'C',
}

const MEASUREMENT_PREFIXES = new Set([MSG.POSITION, MSG.FORCE, MSG.TIME, MSG.RESISTANCE, MSG.TEMPERATURE, MSG.CYCLE_NUM])
const DEVICE_INFO_PREFIXES  = new Set([MSG.SW_VERSION, MSG.LETT_NUM, MSG.HW_CONFIG])

// --- LETT Serial Protocol - Outgoing (all tokens start with a single letter) ------
const CMD = {
    TEST_TYPE:  'T',
    SPEED:      'S',
    FORCE:      'F',
    TARGET:     'G',
    CYCLES:     'N',
    START:      'I',
    SENSOR:     'L',
    PRINT:      'P',
    VERSION:    'V',
    UP:         'A',
    DOWN:       'B',
    STOP:       'C',
}

// --- Test End Reasons --- (LETT reports a reason number, we translate it to human radable text)
const TEST_END_REASONS = [
    "Undefined", 
    "Finished normally", 
    "Aborted (GUI)", 
    "Aborted (BUTTON)", 
    "Maximum steps reached", 
    "Timeout", 
    "Specimen Fail", 
    "Force Overload",
    "Ruler Timeout at Start"
]


console.info('constants.js loaded')
