const RSS_MAX = -42;
const RSS_MIN = -128;
let txValue = 0;
let rxValue = 2;

// Button A cycles through these
const DISPLAY_MODES = [
    showRadioState,
    showSignalStrength,
    showTransmitPower,
    showSendReceiveValues
];
let displayMode = 0;
let pauseUntil = 0;
let afterPause: () => void;

let buttonBAction: () => void = null;

let signalStrength = 0; // the signal strength of the last received packet
let transmitPower = 0;
let packetPulse = false; // onDataPacketReceived sets this; consumer should clear it

radio.setGroup(1);

basic.forever(() => {
    radio.sendNumber(txValue);
    if (input.runningTime() < pauseUntil) {
        return;
    } else if (afterPause) {
        afterPause();
        afterPause = null;
    }
    DISPLAY_MODES[displayMode]();
});

function pause(ms: number, callback: () => void) {
    pauseUntil = input.runningTime() + ms;
    afterPause = callback;
}

input.onButtonPressed(Button.A, () => {
    displayMode = (displayMode + 1) % DISPLAY_MODES.length;
    buttonBAction = null;
    ledClear();
});

input.onButtonPressed(Button.B, () => {
    if (buttonBAction) {
        buttonBAction();
    }
});

radio.onDataPacketReceived(({ receivedNumber, signal }) => {
    if (rxValue == 2 || receivedNumber == rxValue) {
        signalStrength = signal;
        packetPulse = true;
    }
});

function cycleTransmitPower() {
    transmitPower = (transmitPower + 1) % 8;
    radio.setTransmitPower(transmitPower);
}

// Display modes

let pulseTicker = 0;

function showRadioState() {
    buttonBAction = () => {
        pause(3000, ledClear);
        basic.showNumber(-signalStrength);
    };
    if (!packetPulse) {
        fadeTrail();
        renderTrail();
        return;
    }
    packetPulse = false;
    pulseTicker += 1;
    for (let i = 0; i < 5; i++) {
        led.plotBrightness(i, 0, i === pulseTicker % 5 ? 20 : 0);
    }
    const val = Math.floor(
        (20 * (signalStrength - RSS_MAX)) / (RSS_MIN - RSS_MAX)
    );
    addToTrail(val % 5, 1 + Math.floor(val / 5));
    renderTrail();
}

function showSignalStrength() {
    basic.showNumber(-signalStrength);
}

function showSendReceiveValues() {
    buttonBAction = () => {
        const plex = 3 * txValue + rxValue + 1;
        txValue = Math.floor(plex / 3) % 2;
        rxValue = plex % 3;
    };
    const rxString: string = rxValue == 2 ? '*' : rxValue.toString();
    basic.showString('T' + txValue + 'R' + rxString);
}

function showTransmitPower() {
    buttonBAction = cycleTransmitPower;
    basic.showString('P' + transmitPower);
}

// Display utilities

let trail: (number[])[] = [];

function addToTrail(x: number, y: number) {
    fadeTrail();
    trail.push([x, y, 255]);
}

function fadeTrail() {
    trail.forEach(r => {
        r[2] = Math.max(0, r[2] - 10);
    });
}

function renderTrail() {
    trail.forEach(r => {
        const x = r[0];
        const y = r[1];
        const b = r[2];
        led.plotBrightness(x, y, b);
    });
    trail = trail.filter(r => r[2] > 0);
}

function ledClear() {
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
            led.plotBrightness(i, j, 0);
        }
    }
}
