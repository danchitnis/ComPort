/*
 * This code is inspired by Googles Serial Api example
 * https://codelabs.developers.google.com/codelabs/web-serial/
 *
 * Danial Chitnis 2020
 */
/**
 *  The main class for ComPort package
 */
export class ComPort {
    /**
     * creates a ComPort object
     */
    constructor() {
        this.strRX = "";
        this.comEvent = new EventTarget();
    }
    async disconnect() {
        if (this.port) {
            if (this.reader) {
                await this.reader.cancel();
                await this.inputDone.catch((e) => { console.log(e); });
                this.reader = null;
                this.inputDone = null;
            }
            if (this.outputStream) {
                await this.outputStream.getWriter().close();
                await this.outputDone.catch((e) => { console.log(e); });
                this.outputStream = null;
                this.outputDone = null;
            }
            await this.port.close();
            this.log("\nport is now closed!\n");
        }
    }
    async connectSerialApi(baudrate) {
        // CODELAB: Add code to request & open port here.
        // - Request a port and open a connection.
        this.log("Requesting port...");
        this.port = await navigator.serial.requestPort();
        // - Wait for the port to open.
        this.log("Openning port...");
        await this.port.open({ baudrate: baudrate });
        // CODELAB: Add code to read the stream here.
        const decoder = new TextDecoderStream();
        this.inputDone = this.port.readable.pipeTo(decoder.writable);
        const inputStream = decoder.readable;
        const encoder = new TextEncoderStream();
        this.outputDone = encoder.readable.pipeTo(this.port.writable);
        this.outputStream = encoder.writable;
        this.reader = inputStream.getReader();
        this.readLoop();
    }
    async connectToPort(baudrate) {
        // CODELAB: Add connect code here.
        try {
            await this.connectSerialApi(baudrate);
            this.log("Port is now open 🎉");
        }
        catch (error) {
            this.log("Error 😢: " + error + "\n");
        }
    }
    /**
     * Connect to the serial port. This will open the request user dialog box.
     * @param baudrate : speed of connection e.g. 9600 or 115200
     */
    connect(baudrate) {
        this.connectToPort(baudrate);
    }
    async readLoop() {
        // CODELAB: Add read loop here.
        // eslint-disable-next-line no-constant-condition
        while (true) {
            try {
                const { value, done } = await this.reader.read();
                if (value) {
                    this.procInput(value);
                }
                if (done) {
                    console.log('[readLoop] DONE', done);
                    this.reader.releaseLock();
                    break;
                }
            }
            catch (e) {
                console.log(e);
            }
        }
    }
    procInput(str) {
        this.strRX = this.strRX + str;
        const linesRX = this.strRX.split("\n");
        if (linesRX.length > 1) {
            for (let i = 0; i < linesRX.length - 1; i++) {
                const event = new CustomEvent('rx', { detail: linesRX[i] });
                this.dispatchEvent(event);
            }
            // save the reminder of the input line
            this.strRX = linesRX[linesRX.length - 1];
        }
    }
    log(str) {
        const event = new CustomEvent("log", { detail: str });
        this.dispatchEvent(event);
    }
    /**
     * Adds a event listnere type for ComPort
     * @param eventType either two types of event rx or rx-msg
     * @param listener a function callback for CustomEvent
     */
    addEventListener(eventType, listener) {
        this.comEvent.addEventListener(eventType, listener);
    }
    removeEventListener() {
        //
    }
    dispatchEvent(event) {
        return this.comEvent.dispatchEvent(event);
    }
    async writeToStream(line) {
        // CODELAB: Write to output stream
        const writer = this.outputStream.getWriter();
        //console.log('[SEND]', line);
        await writer.write(line + '\n');
        writer.releaseLock();
    }
    /**
     * Send a line of String
     * @param line : a line of string. The \n character will be added to end of the line
     */
    sendLine(line) {
        this.writeToStream(line);
    }
}
//# sourceMappingURL=ComPort.js.map