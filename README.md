# micro:bit signal meter

A signal meter for the [BBC micro:bit](http://microbit.org/).

Run this on a couple of micro:bits, to measure their signal strength at
different radio transmission powers and distances.

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


Developed at [Dinacon 2018](https://www.dinacon.org).

## License

MIT
