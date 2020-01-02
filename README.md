# ComPort

A simple package to use the new [Serial Api](https://wicg.github.io/serial/) available in Chrome

🔥 Notice : Serial Api is under Chrome experimental flag for Chrome 79 and expected to goes on Origins Trail on Chrome 80

## Why Serial Api

Although [WebUSB](https://wicg.github.io/webusb/) has been around for some years, it is mainly targeted at companies intending to developed web-based firmwares. A major downside of WebUSB is once a native driver is installed on the OS, the device will no longer be recognized by WebUSB. Unlike WebUSB, the [Serial Api](https://wicg.github.io/serial/) is intended for use as a traditional COM port (Serial port) which includes many microcontroller based devices and USB-to-Serial devices such as FTDI and Cypress chipsets. Additionally, you can still implement your own USB CDC protocol, and have the OS driver and Web driver co-exist. The Serial Api opens doors for new and exciting web-based front-ends for small and medium sized embedded projects.

## Why ComPort

ComPort makes it easy for embedded developers to quickly build a modern front-end for their applications. It removes the hassle of dealing with async/await functions. This package is not intended for high-performance and high data-rate applications, but for quick and simple development. If high-performance is required then a browser based app is probably the wrong choice.  

## Potential use cases

all serial communication to and from embedded hardware via USB-to-Serial bridges like FTDI cables and Arduino boards.

## How to enable Serial Api (Chrome 79)

Enable it in: chrome://flags/#enable-experimental-web-platform-features

## Build instructions

```bash
npm i
npm run build
```

## installation

```bash
npm i @danchitnis/comport
```

## Examples

See [here](https://github.com/danchitnis/Serial-API-Examples) examples tested with [Arduino Nano 33 BLE](https://store.arduino.cc/arduino-nano-33-ble), but also extendable to other boards as it is simply using serial communication.

## Useful links

* [W3C Serial Api working draft](https://wicg.github.io/serial/)
* [Serial Api Chrome status](https://www.chromestatus.com/feature/6577673212002304)
* [Google Serial Api example](https://codelabs.developers.google.com/codelabs/web-serial/#0)
* [Serial Api Explainer](https://github.com/WICG/serial/blob/gh-pages/EXPLAINER.md)
