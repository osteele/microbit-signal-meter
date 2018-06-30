let fns = [showRadioState, showSignalStrength, showTransmitPower];
let displayMode = 0;

let lastSignalStrength = 0;
let transmitPower = 0;
let radioSignalReceived = false;

radio.setGroup(1);

basic.forever(() => {
    radio.sendNumber(0);
    game.pause();
    return fns[displayMode]();
});

input.onButtonPressed(Button.A, () => {
    displayMode = (displayMode + 1) % fns.length;
});

input.onButtonPressed(Button.B, () => {
    transmitPower = (transmitPower + 1) % 8;
    radio.setTransmitPower(transmitPower);
    basic.showNumber(transmitPower);
    basic.pause(100);
    // sel = fns.length - 1;
});

radio.onDataPacketReceived(({ signal }) => {
    lastSignalStrength = signal;
    radioSignalReceived = true;
});

let cylon = 0;
let row = [0, 0, 0, 0, 0];

function showRadioState() {
    // basic.showNumber(lastSignalStrength);
    if (!radioSignalReceived) {
        return;
    }
    cylon += 1;
    row.forEach((_, i) => {
        led.plotBrightness(i, 0, i === cylon % 5 ? 20 : 0);
    });
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
    trail.forEach(r => {
        r[2] = Math.max(0, r[2] - 10);
    });
    trail.push([i, j, 255]);
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
