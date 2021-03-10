let port,
    reader,
    inputDone,
    outputDone,
    inputStream,
    outputStream,
    arr = [];
async function connect() {
    (port = await navigator.serial.requestPort()), await port.open({ baudRate: 9600 });
    const t = new TextEncoderStream();
    (outputDone = t.readable.pipeTo(port.writable)), (outputStream = t.writable);
    let e = new TextDecoderStream();
    (inputDone = port.readable.pipeTo(e.writable)), (inputStream = e.readable.pipeThrough(new TransformStream(new LineBreakTransformer()))), (reader = inputStream.getReader());
}
async function disconnect() {
    return (
        reader && (await reader.cancel(), await inputDone.catch(() => {}), (reader = null), (inputDone = null)),
        outputStream && (await outputStream.getWriter().close(), await outputDone, (outputStream = null), (outputDone = null)),
        await port.close(),
        (port = null),
        "Dongle Disconnected!"
    );
}
function writeCmd(t) {
    const e = outputStream.getWriter();
    e.write(t), "" !== t && e.write("\r"), e.releaseLock();
}
/**
 * @at_connect
 * Connects Device
*/
(exports.at_connect = async function () {
    return await connect(), "device connected";
}),
/**
 * @at_connect
 * Disconnects Device
*/
(exports.at_disconnect = async function () {
    return await disconnect(), "device disconnected";
}),
/**
 * @ati
 * Device information query.
 * @return {Promise} returns promise
 * 
*/
    (exports.ati = () => (port ? (writeCmd("ATI"), readLoop("ati")) : "Device not connected.")),
/**
 * @at_central
 * Sets the device Bluetooth role to central role.
 * @return {Promise} returns promise
 * 
*/  
/**
 * @ate
 * Turn echo on/off. (On per default). ex ate(0)
 * @param {number} status int (0 or 1, 0 for off 1 for on)
 * @return {Promise} returns promise
 * 
*/
(exports.ate = function (status) {
    return writeCmd("ATE"+status), readLoop("ate");
}),
/**
 * @at_central
 * Sets the device Bluetooth role to central role.
 * @return {Promise} returns promise
 * 
*/  
(exports.at_central = function () {
    return writeCmd("AT+CENTRAL"), readLoop("at_central");
}),
/**
 * @at_peripheral
 * Sets the device Bluetooth role to peripheral.
 * @return {Promise} returns promise
 * 
*/ 
(exports.at_peripheral = function () {
    return writeCmd("AT+PERIPHERAL"), readLoop("at_peripheral");
}),
/**
 * @atr
 * Trigger platform reset.
 * @return {Promise} returns promise
 * 
*/
(exports.atr = function () {
    return writeCmd("ATR"), readLoop("atr");
}),
/**
 * @at_advstart
 * Starts advertising .
 * @return {Promise} returns promise
 * 
*/
(exports.at_advstart = function () {
    return writeCmd("AT+ADVSTART"), readLoop("at_advstart");
}),
/**
 * @at_advstop
 * Stops advertising .
 * @return {Promise} returns promise
 * 
*/
(exports.at_advstop = function () {
    return writeCmd("AT+ADVSTOP"), readLoop("at_advstop");
}),
/**
 * @at_advdata
 * Sets or queries the advertising data.if left empty it will query what advdata is set. 
 * @param {string} t hex str format: xx:xx:xx:xx:xx.. (max 31 bytes)
 * @return {Promise} returns a promise
 * 
*/
(exports.at_advdata = (t) => (writeCmd(t ? "AT+ADVDATA=" + t : "AT+ADVDATA"), readLoop("at_advdata"))),
/**
 * @at_advdatai
 * Sets advertising data in a way that lets it be used as an iBeacon.
        Format = (UUID)(MAJOR)(MINOR)(TX)
        Example: at_advdatai(5f2dd896-b886-4549-ae01-e41acd7a354a0203010400).
 * @param {string} t  if left empty it will query what advdata is set
 * @return {Promise} returns a promise
 * 
*/
(exports.at_advdatai = function (t) {
    return writeCmd("AT+ADVDATAI=" + t), readLoop("at_advdatai");
}),
/**
 * @at_advresp
 *  Sets or queries scan response data. Data must be provided as hex string.
 * @param {string} t if left empty it will query what advdata is set.hex str format: xx:xx:xx:xx:xx.. (max 31 bytes)
 * @return {Promise} returns a promise
 * 
*/
(exports.at_advresp = function (t) {
    return writeCmd(t ? "AT+ADVRESP=" + t : "AT+ADVRESP"), readLoop("at_advresp");
}),
/**
 * @at_cancelconnect
 * While in Central Mode, cancels any ongoing connection attempts.
 * @return {Promise} returns a promise
 * 
*/
(exports.at_cancelconnect = function () {
    return writeCmd("AT+CANCELCONNECT"), readLoop("at_cancelconnect");
}),
/**
 * @at_enterpasskey
 * Enter the 6-digit passkey to continue the pairing and bodning request.
 * @param {string} t Enter the 6-digit passkey.
 * @return {Promise} returns a promise
 * 
*/
(exports.at_enterpasskey = function (t=123456) {
    return writeCmd("AT+ENTERPASSKEY=" + t), readLoop("at_enterpasskey");
}),
/** @at_numcompa
* Used for accepting a numeric comparison authentication request or enabling/disabling auto-accepting numeric comparisons.
* @param {number} t 0 or 1. 0 for disabled 1 for enable. Enabled by default.
* @return {Promise} returns a promise
* 
*/
(exports.at_numcompa = function (t) {
    return writeCmd(t ? "AT+NUMCOMPA=" + t : "AT+NUMCOMPA"), readLoop("at_numcompa");
 }),
/**
 * @at_gapiocap
 * Sets or queries what input and output capabilities the device has.
 * @param {number} t int between 0 to 4. 0 - Display only, 1 - Display + yes & no, 2 - Keyboard only, 3- No input no output, 4 - Keyboard + display
 * @return {Promise} returns a promise
 * 
*/
(exports.at_gapiocap = function (t=1) {
    return writeCmd("AT+GAPIOCAP=" + t), readLoop("at_gapiocap");
}),
/**
 * @at_gappair
 * Starts a pairing or bonding procedure. Depending on whether the device is master or slave on the connection, it will send a pairing or a security request respectively.
Only usable when connected to a device.
 * @param {number} t leave blank for pairing and write BOND for bonding.
 * @return {Promise} returns a promise
 * 
*/
(exports.at_gappair = function (t) {
    return writeCmd(t ? "AT+GAPPAIR=" + t : "AT+GAPPAIR"), readLoop("at_gappair");
}),
/**
 * @at_gapunpair
 * Unpair paired devices. This will also remove the device bond data from BLE storage. Usable both when device is connected and when not. 
 * @param {number} t Leave blank to unpair all paired devices or selected paired device (device_mac_address). Public= [0] or private= [1] address type prefix required before mac address. ex: [x]xx:xx:xx:xx:xx:xx
 * @return {Promise} returns a promise
 * 
*/
(exports.at_gapunpair = function (t) {
    return writeCmd(t ? "AT+GAPUNPAIR=" + t : "AT+GAPUNPAIR"), readLoop("at_gapunpair");
}),
/**
 * @at_gapscan
 * Starts a Bluetooth device scan with or without timer set in seconds. If no timer is set, it will scan for only 1 second.
 * @param {number} t int (time in seconds)
 * @param {boolean} e true/false, true will show real time device in console
 * @return {Promise} returns a promise
 * 
*/
(exports.at_gapscan = function (t = 1,e=true) {
    return writeCmd("AT+GAPSCAN=" + t), readLoop("at_gapscan",e);
}),
/** @at_seclvl
* Sets or queries what minimum security level will be used when connected to other devices.
* @param {number} t leave blank for quering security level or set security level from 1 to 3. 1- No authentication and no encryption, 2-Unauthenticated pairing with encryption, 3 -Authenticated pairing with encryption
* @return {Promise} returns a promise
* 
*/
(exports.at_seclvl = function (t) {
    return writeCmd(t ? "AT+SECLVL=" + t : "AT+SECLVL"), readLoop("at_seclvl");
 }),
/** @at_setpasskey
* Setting or quering set passkey for passkey authentication.
* @param {string} t leave blank for quering passkey or set six digit passkey.
* @return {Promise} returns a promise
* 
*/
(exports.at_setpasskey = function (t) {
   return writeCmd(t ? "AT+SETPASSKEY=" + t : "AT+SETPASSKEY"), readLoop("at_setpasskey");
}),
/**
 * @at_findscandata
 * Scans for all advertising/response data which contains the search params. ex. at_findscandata('FF5',10)
 * @param {string} t search params.
 * @param {number} e number of responses.
 * @return {Promise} returns a promise
 * 
*/
(exports.at_findscandata = function (t = 1,e=5) {
    return writeCmd("AT+FINDSCANDATA=" + t), readLoop("at_findscandata",e);
}),
/**
 * @at_gapconnect
 * Initiates a connection with a specific slave device.
 * @param {string} t hex str format: xx:xx:xx:xx:xx:xx
 * @return {Promise} returns a promise
 * 
*/
(exports.at_gapconnect = function (t) {
    return writeCmd("AT+GAPCONNECT=" + t), readLoop("at_gapconnect");
}),
/**
 * @at_gapdisconnect
 * Disconnects from a peer Bluetooth device.
 * @return {Promise} returns a promise
 * 
*/
(exports.at_gapdisconnect = function () {
    return writeCmd("AT+GAPDISCONNECT"), readLoop("at_gapdisconnect");
}),
/**
 * @at_getservices
 * Rediscovers a peripheral's services and characteristics.
 * @return {Promise} returns a promise
 * 
*/
(exports.at_getservices = function () {
    return writeCmd("AT+GETSERVICES"), readLoop("at_getservices");
}),
/**
 * @at_scantarget
 * Scan a target device. Displaying it's advertising and response data as it updates.
 * @param {string} t hex str format: xx:xx:xx:xx:xx:xx
 * @param {Number} e Number of responses
 * @return {Promise} returns a promise
 * 
*/
(exports.at_scantarget = function (t, e = 1) {
    return writeCmd("AT+SCANTARGET=" + t), readLoop("at_scantarget", e+2);
}),
/**
 * @at_setnoti
 * Enable notification for selected characteristic.
 * @param {string} t notification handle
 * @return {Promise} returns a promise
 * 
*/
(exports.at_setnoti = function (t) {
    return writeCmd("AT+SETNOTI=" + t),  readLoop("at_setnoti");
}),
/**
 * @at_spssend
 * Send a message or data via the SPS profile.Without parameters it opens a stream for continiously sending data.
 * @param {string} t if left empty it will open Streaming mode
 * @return {Promise} returns a promise
 * 
*/
(exports.at_spssend = function (t) {
        return writeCmd(t ? "AT+SPSSEND=" + t : "AT+SPSSEND"),  readLoop("at_spssend");
}),
/**
 * @at_gapstatus
 * Reports the Bluetooth role.
 * @return {Promise} returns a promise
 * 
*/
(exports.at_gapstatus = function () {
    return writeCmd("AT+GAPSTATUS"), readLoop("at_gapstatus");
}),
/**
 * @at_gattcwrite
 * Write attribute to remote GATT server in ASCII. Can only be used in Central role and when connected to a peripheral. ex at_gattcwrite('001B','HELLO')
 * @param {string} handle_param pass handle param as string
 * @param {string} msg pass msg as string. 
 * @return {Promise} returns a promise
 * 
*/
(exports.at_gattcwrite = function (handle_param,msg) {
    return writeCmd("AT+GATTCWRITE="+handle_param+" "+msg), readLoop("at_gattcwrite");
}),
/**
 * @at_gattcwriteb
 * Write attribute to remote GATT server in Hex. Can only be used in Central role and when connected to a peripheral.ex at_gattcwriteb('001B','0101')
 * @param {string} handle_param pass handle param as string
 * @param {string} msg pass msg as string.
 * @return {Promise} returns a promise
 * 
*/
(exports.at_gattcwriteb = function () {
    return writeCmd("AT+GATTCWRITEB="+handle_param+" "+msg), readLoop("at_gattcwriteb");
}),
/**
 * @at_gattcread
 * Read attribute of remote GATT server. Can only be used in Central role and when connected to a peripheral. ex at_gattcread('001B')
 * @param {string} handle_param pass handle param as string
 * @return {Promise} returns a promise
 * 
*/
(exports.at_gattcread = function () {
    return writeCmd("AT+GATTCREAD="+handle_param), readLoop("at_gattcread");
}),
/**
 * @help
 * Shows all AT-Commands.
 * @return {Promise} returns a promise
 * 
*/
(exports.help = function () {
    return writeCmd("--H"), readLoop("help");
}),
/**
 * @stop
 * Stops Current process.
 * @return {Promise} returns a promise
 * 
*/
(exports.stop = function () {
    return writeCmd(""), "Process Stopped";
});
class LineBreakTransformer {
    constructor() {
        this.container = "";
    }
    transform(t, e) {
        this.container += t;
        const r = this.container.split("\r\n");
        (this.container = r.pop()), r.forEach((t) => e.enqueue(t));
    }
    flush(t) {
        t.enqueue(this.container);
    }
}
async function readLoop(t, e) {
    for (arr = []; ; ) {
        const { done: r, value: a } = await reader.read();
        switch ((a && arr.push(a), t)) {

            case "ati":
                if (arr.includes("Not Advertising") || arr.includes("Advertising")) return arr;
                break;
            case "ate":
                if (arr.includes("ECHO OFF") || arr.includes("ECHO ON")) return arr;
                break;
            case "at_central":
                return "Central Mode";
            case "at_peripheral":
                return "Peripheral Mode";
            case "at_advstart":
                return "Advertising";
            case "at_advstop":
                return "Advertising Stopped";
            case "at_advdata":
            case "at_advdatai":
            case "at_advresp":
                if (2 == arr.length) return arr;
                break;
            case "at_cancelconnect":
                if (arr.includes("ERROR") || arr.includes("OK")) return arr;
                break;
            case "at_enterpasskey":
                if (2 == arr.length) return arr;
                break;
            case "atr":
                return "Trigger platform reset";
            case "at_findscandata":                
                if (arr.length == e) {
                    const t = outputStream.getWriter();
                    return t.write(""), t.releaseLock(), arr;
                }
                break;
            case "at_gapiocap":
                if (3 == arr.length) return arr;
                break;            
            case "at_gappair":
                if (arr.includes("PAIRING SUCCESS") || arr.includes("BONDING SUCCESS")) return arr;
                break;
            case "at_gapunpair":
                if (arr.includes("UNPARIED.")|| 3 == arr.length) return arr;
                break;
            case "at_gapscan":
                if(e===true)
                    arr.some(function(v){ if (v.indexOf("RSSI")>=0 && a!='') console.log(a) })
                if (arr.includes("SCAN COMPLETE")) return arr;
                break;
            case "at_scantarget":
                if (arr.length == e) {
                    const t = outputStream.getWriter();
                    return t.write(""), t.releaseLock(), arr.slice(2);
                }
                break;  
            case "at_setpasskey":
                if (2 == arr.length) return arr;
                break;          
            case "at_gattcwrite":
                if (4 == arr.length) return arr;
                break;
            case "at_gapstatus":
                if (arr.includes("Not Advertising") || arr.includes("Advertising")) return arr;
                break;
            case "at_gattcwrite":
                if (4 == arr.length) return arr;
                break;
            case "at_gattcwriteb":
                if (4 == arr.length) return arr;
                break;
            case "at_gattcread":
                if (4 == arr.length) return arr;
                break;
            case "at_gapconnect":
                if (arr.includes("CONNECTED.") || arr.includes("DISCONNECTED.") || arr.includes("ERROR") || arr.includes("PAIRING SUCCESS")) return arr;
                break;
            case "at_getservices":
                if (arr.includes("Value received: ")) return arr;
                break;
            case "at_gapdisconnect":
                return "Disconnected.";
            case "at_numcompa":
                if (arr.includes("ERROR") || arr.includes("OK")) return arr;
                break;
            case "at_seclvl":
                if ((2 == arr.length))  return arr;
                break;
            case "at_setnoti":
                if (20 == arr.length) return arr;
                break;
            case "at_spssend":                
            if (2 == arr.length || arr.includes("[Sent]")) return arr;    
            case "help":
                if (arr.includes("[A] = Usable in All Roles")) return arr;
                break;
            default:
                return "Nothing!";
        }
    }
}