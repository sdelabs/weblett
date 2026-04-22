/* 
#### **A. `config.js` (De "Bron van Waarheid")**
Hier zet je variabelen die overal nodig zijn, zoals je kleuren of standaardinstellingen.
* *Functies:* Geen, alleen data.
* *Inhoud:* `const CHART_COLORS = {...}`, `let debug = true;`.
*/
const DEBUG_MODE = true;
const VERSION = "2026.1.1";

// Door kleuren hier te definiëren, kun je ze in je JavaScript gebruiken (voor Chart.js) 
// én makkelijk aanpassen zonder door honderden regels code te scrollen.
const CHART_COLORS = {
    force: '#003f5c',
    time: '#d45087',
    resistance: '#665191',
    error: '#FF0000'
};

const CHART_DEFAULTS = {
    pointRadius: 5,
    borderWidth: 2,
    showLine: true
};


// Hardware
// Informatie over de LETT-machine zelf die niet verandert tijdens het gebruik.
const SENSOR_LIMITS = {
    s100: 1000, // max Newton voor 100kg sensor
    s500: 5000  // max Newton voor 500kg sensor
};

const BAUDRATE = 115200; // Voor de seriële verbinding


// Dit is een slimme truc: in plaats van overal document.getElementById() te moeten roepen,
// maak je één object dat alle elementen bevat. Dit houdt de rest van je JS-files schoon.
// Functie die alle belangrijke elementen ophaalt
const UI = {
    get inputs() {
        return {
            frcRadio: document.getElementById("frcRadio"),
            resRadio: document.getElementById("resRadio"),
            timeRadio: document.getElementById("timeRadio"),
            displaceRadio: document.getElementById("displaceRadio"),
            speedSlide: document.getElementById("speed-slide")
        };
    },
    get displays() {
        return {
            pos: document.getElementById("pos"),
            frc: document.getElementById("frc"),
            res: document.getElementById("res"),
            status: document.getElementById("status-text")
        };
    },
    get buttons() {
        return {
            connect: document.getElementById("connect-button"),
            start: document.getElementById("start-button"),
            save: document.getElementById("save-button")
        };
    }
};
