/**
 * This code is inspired by Googles Serial Api example
 * https://codelabs.developers.google.com/codelabs/web-serial/
 *
 * Danial Chitnis 2020
 */
export class ComPort extends EventTarget {
    constructor() {
        super();
        this.strRX = "";
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
        this.log("Requesting port");
        this.port = await navigator.serial.requestPort();
        // - Wait for the port to open.
        this.log("Openning port");
        await this.port.open({ baudrate: baudrate });
        this.log("Port is now open 🎉");
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
    async connect(baudrate) {
        // CODELAB: Add connect code here.
        try {
            await this.connectSerialApi(baudrate);
            console.log("here2 🥗");
        }
        catch (error) {
            this.log("Error 😢: " + error + "\n");
        }
    }
    async readLoop() {
        // CODELAB: Add read loop here.
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
        const event = new CustomEvent("rx-msg", { detail: str });
        this.dispatchEvent(event);
    }
    addEventListener(eventType, listener) {
        super.addEventListener(eventType, listener);
    }
    async writeToStream(line) {
        // CODELAB: Write to output stream
        const writer = this.outputStream.getWriter();
        //console.log('[SEND]', line);
        await writer.write(line + '\n');
        writer.releaseLock();
    }
    sendLine(line) {
        this.writeToStream(line);
    }
}
//# sourceMappingURL=ComPort.js.map