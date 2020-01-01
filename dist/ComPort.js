/**
 *
 *
 * Danial Chitnis
 */
export class ComPort extends EventTarget {
    constructor() {
        super();
        this.strRX = "";
    }
    async disconnect() {
        if (this.port) {
            if (this.reader) {
                await this.reader.cancel().catch(e => console.log('Error: ', e.message));
                this.port.close();
            }
        }
        this.log("\nport is closed now!\n");
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
        const inputDone = this.port.readable.pipeTo(decoder.writable);
        const inputStream = decoder.readable;
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
}
//# sourceMappingURL=ComPort.js.map