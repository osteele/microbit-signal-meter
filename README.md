# micro:bit radio signal strength meter

A radio signal strength (RSS) meter for the [BBC
micro:bit](http://microbit.org/).

Run this on a couple of micro:bits, to measure their radio signal strength at
different radio transmission powers and distances.

We used this to calibrate RSS for range-finding for our [hermit crab
project](https://github.com/margmarg/DinaCrab) at [Dinacon
2018](https://www.dinacon.org).

## Installation

1. Install [pxt](https://makecode.com/cli)
2. `pxt deploy` compiles and deploys the project to a connected micro:bit

You can also (1) create a new project on
[MakeCode](https://makecode.microbit.org), (2) click `{} JavaScript` at the top
of the page, (3) paste the code from [`main.ts`](./main.ts) into the edit pane
on the right, (4) and click “Download” to download a `*.hex` file to copy to the
micro:bit.

## Usage

The left button cycles between display modes:

* Grid (default): The top row cycles when packets are received. The remaining
  four rows are used to display the received packet signal strength. The top
  left corner of this rectangle is -42 dB; the bottom right rectangle is -128dB.
  The last few samples are faded; this makes it easier to eyeball a trace of the
  signal strength history.

  In this mode, button B briefly displays the last received packet signal
  strength.

* The absolute value of the last received packet signal strength. The absolute
  value is used because the number is scrolled across the display, and the
  negative sign makes this take even longer.

* Transmission value (0 or 1), and receive value (0, 1, *). When the receive
  value is 0 or 1, the meter only attends to signals that match this value.

  In this mode, button B cycles among the values.

* Current radio transmission power.

  In this mode, button B cycles the radio transmission power from 0 to 7 and
  back to zero again.

## Motivation

Created at [Dinacon 2018](https://www.dinacon.org), for use in developing
[Dinacrab](https://github.com/margmarg/DinaCrab).

## Branches

* [`threshold`](https://github.com/osteele/microbit-signal-meter/tree/threshold)
  adds hysteresis to proximity sensing, to reduce flapping. Proximity is set
  when the signal is high, but is cleared only after it has spent some time low.
* [`transforms`](https://github.com/osteele/microbit-signal-meter/tree/transforms)
  uses a button to cycle through different transforms that are applied to the
  signal strength before it is displayed. Since the transforms are all
  monotonic, this doesn't affect an algorithm that's conditionalized on RSS
  thresholds in any substantive way (simply apply the same transform to the
  thresholds), but it can simplify eyeballing the meter.

## License

MIT
