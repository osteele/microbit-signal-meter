const fns = [showRadioState, showSignalStrength, showTransmitPower];
let displayMode = 0;

let lastSignalStrength = 0;
let transmitPower = 0;
let packetPulse = false;

const nearThreshold = -76; // higher RSS than this turns it on; was -76
const farThreshold = -(76 + 3 * 4); // lower RSS than this turns it off
const farThresholdDelay = 500;
let isNear = false;
let firstFarTime = 0;

radio.setGroup(1);

basic.forever(() => {
    radio.sendNumber(1);
    return fns[displayMode]();
});

input.onButtonPressed(Button.A, () => {
    displayMode = (displayMode + 1) % fns.length;
    ledClear();
});

input.onButtonPressed(Button.B, () => {
    transmitPower = (transmitPower + 1) % 8;
    radio.setTransmitPower(transmitPower);
    basic.showNumber(transmitPower);
    basic.pause(100);
});

radio.onDataPacketReceived(({ receivedNumber, signal }) => {
    if (receivedNumber == 0) {
        lastSignalStrength = signal;
        packetPulse = true;
    }
});

let pulseTicker = 0;

function showRadioState() {
    if (!packetPulse) {
        fadeTrail();
        renderTrail();
        return;
    }

    packetPulse = false;
    pulseTicker += 1;
    for (let i = 0; i < 4; i++) {
        // led.plotBrightness(i, 0, i === pulseTicker % 4 ? 10 : 0);
    }

    const currentTime = input.runningTime();
    if (lastSignalStrength > nearThreshold) {
        isNear = true;
        firstFarTime = 0;
    }
    if (lastSignalStrength < farThreshold) {
        if (!firstFarTime) {
            firstFarTime = currentTime;
        } else if (currentTime - firstFarTime > farThresholdDelay) {
            isNear = false;
        }
    }
    led.plotBrightness(2, 0, isNear ? 128 : 0);

    let val = Math.floor((20 * (-lastSignalStrength - 42)) / (128 - 42));
    addToTrail(val % 5, 1 + Math.floor(val / 5));
    renderTrail();
}

function showSignalStrength() {
    basic.showNumber(-lastSignalStrength);
    // basic.showNumber(Math.floor(lastSignalStrength / 10) % 1);
}

function showTransmitPower() {
    basic.showNumber(transmitPower);
}

let trail = [[0, 0, 0]];

function addToTrail(i: number, j: number) {
    fadeTrail();
    trail.push([i, j, 255]);
}

function fadeTrail() {
    trail.forEach(r => {
        r[2] = Math.max(0, r[2] - 10);
    });
}

function renderTrail() {
    trail.forEach(r => {
        let i = r[0];
        let j = r[1];
        let b = r[2];
        led.plotBrightness(i, j, b);
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
