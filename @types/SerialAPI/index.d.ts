// Type definitions for non-npm package W3C Web USB API 1.0
// Project: https://wicg.github.io/webusb/
// Definitions by: Lars Knudsen <https://github.com/larsgk>
//                 Rob Moran <https://github.com/thegecko>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.3

type Baudrate = 115200 | 57600 | 38400 | 19200 | 9600;
type Databits = 8 | 7 | 6 | 5;
type Stopbits = 1 | 2;
type Parity = "none" | "even" | "odd" | "mark" | "space";



interface SerialPortRequestOptions {
    filters: SerialPortFilter[];
}

interface SerialPortFilter {
    vendorId?: number;
    productId?: number;
}

interface SerialPortInfo {
    maplike: string;
}

interface SerialOptions {
    baudrate?: Baudrate;
    databits?: Databits;
    stopbits?: Stopbits;
    parity?: Parity;
    buffersize?: number;
    rtscts?: number;
    xon?: boolean;
    xoff?: boolean;
    xany?: boolean;
}


interface SerialConnectionEventInit extends EventInit {
    port: SerialPort;
}



declare class SerialConnectionEvent extends Event {
    constructor(type: string, eventInitDict: SerialConnectionEventInit);
    readonly port: SerialPort;
}



declare class Serial extends EventTarget {
    onconnect(): (this: this, ev: Event) => any;
    ondisconnect(): (this: this, ev: Event) => any;
    getPorts(): Promise<SerialPort[]>;
    requestPort(options?: SerialPortRequestOptions): Promise<SerialPort>;
    addEventListener(type: "connect" | "disconnect", listener: (this: this, ev: SerialConnectionEvent) => any, useCapture?: boolean): void;
    //addEventListener(type: string, listener: EventListenerOrEventListenerObject | null, options?: boolean | AddEventListenerOptions): void;
}

declare class SerialPort {

    readonly readable: ReadableStream;
    readonly writable: WritableStream;
    
    open(options?: SerialOptions): Promise<void>;
    // getInfo(): SerialPortInfo;
    close(): void;
    
}

interface Navigator {
    readonly serial: Serial;
}
