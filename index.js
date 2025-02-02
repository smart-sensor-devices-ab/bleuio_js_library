let port,
  reader,
  inputDone,
  outputDone,
  inputStream,
  outputStream,
  arr = [];
async function connect() {
  (port = await navigator.serial.requestPort()),
    await port.open({ baudRate: 9600 });
  const t = new TextEncoderStream();
  (outputDone = t.readable.pipeTo(port.writable)), (outputStream = t.writable);
  let e = new TextDecoderStream();
  (inputDone = port.readable.pipeTo(e.writable)),
    (inputStream = e.readable.pipeThrough(
      new TransformStream(new LineBreakTransformer())
    )),
    (reader = inputStream.getReader());
}
async function disconnect() {
  return (
    reader &&
      (await reader.cancel(),
      await inputDone.catch(() => {}),
      (reader = null),
      (inputDone = null)),
    outputStream &&
      (await outputStream.getWriter().close(),
      await outputDone,
      (outputStream = null),
      (outputDone = null)),
    await port.close(),
    (port = null),
    'Dongle Disconnected!'
  );
}
function writeCmd(t) {
  const e = outputStream.getWriter();
  e.write(t), '' !== t && e.write('\r'), e.releaseLock();
}
/**
 * @at_connect
 * Connects Device
 */
(exports.at_connect = async function () {
  return await connect(), 'device connected';
}),
  /**
   * @at_connect
   * Disconnects Device
   */
  (exports.at_disconnect = async function () {
    return await disconnect(), 'device disconnected';
  }),
  /**
   * @ata
   * Shows/hides ASCII values from notification/indication/read responses.
   * ata(0) hides the ASCII values,
   * ata(1) shows the ASCII values.
   * @return {Promise} returns promise
   *
   */
  (exports.ata = function (status) {
    return writeCmd('ATA' + status), readLoop('ata');
  }),
  /**
   * @atasps
   * Toggle between ascii and hex responses received from SPS.
   * atasps(0) shows hex values, atasps(1) shows ASCII. ASCII is on by default.
   * @return {Promise} returns promise
   *
   */
  (exports.atasps = function (status) {
    return writeCmd('ATASPS' + status), readLoop('atasps');
  }),
  /**
   * @atds
   * Turns auto discovery of services when connecting on/off.
   * ATDS0 off, ATDS1 on.
   * On by default. This command can be used in both central and peripheral role.
   * @return {Promise} returns promise
   *
   */
  (exports.atds = function (status) {
    return writeCmd('ATDS' + status), readLoop('atds');
  }),
  /**
   * @ati
   * Device information query.
   * @return {Promise} returns promise
   *
   */
  (exports.ati = () =>
    port ? (writeCmd('ATI'), readLoop('ati')) : 'Device not connected.'),
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
    return writeCmd('ATE' + status), readLoop('ate');
  }),
  /**
   * @at_central
   * Sets the device Bluetooth role to central role.
   * @return {Promise} returns promise
   *
   */
  (exports.at_central = function () {
    return writeCmd('AT+CENTRAL'), readLoop('at_central');
  }),
  /**
   * @at_devicename
   * Get or sets the device name used for GAP service. Cannot be set while connected or advertising.
   * @param {string} t  if left empty it will query what device name is is set
   * @return {Promise} returns a promise
   *
   */
  /**
   * @at_customservice
   * Sets or queries Custom Service. Max 5 Characteristics can be added.
   * Pass value in this format at_customservice('0=UUID=ee6ec068-7447-4045-9fd0-593f3ba3c2ee')
   * Follow BleuIO documentaion for AT+CUSTOMSERVICE
   * _Several values cannot be changed while connected/connecting or advertising.
   * @return {Promise} returns promise
   *
   */
  (exports.at_customservice = function (t) {
    return (
      writeCmd(t ? 'AT+CUSTOMSERVICE=' + t : 'AT+CUSTOMSERVICE'),
      readLoop('at_customservice')
    );
  }),
  /**
   * @at_customservicestart
   * Starts the Custom Service based on the settings set by AT+CUSTOMSERVICE= Command.
   * Cannot be started while connected/connecting or advertising.
   * @return {Promise} returns promise
   *
   */
  (exports.at_customservicestart = function (t) {
    return writeCmd('AT+CUSTOMSERVICESTART'), readLoop('at_customservicestart');
  }),
  /**
   * @at_customservicestop
   * Stops the Custom Service.
   * Cannot be changed while connected/connecting or advertising.
   * @return {Promise} returns promise
   *
   */
  (exports.at_customservicestop = function (t) {
    return writeCmd('AT+CUSTOMSERVICESTOP'), readLoop('at_customservicestop');
  }),
  /**
   * @at_customservicereset
   * Stops the Custom Service and resets the Custom Service settings set by the AT+CUSTOMSERVICE= command to it's default values.
   * Cannot be changed while connected/connecting or advertising.
   * @return {Promise} returns promise
   *
   */
  (exports.at_customservicereset = function (t) {
    return writeCmd('AT+CUSTOMSERVICERESET'), readLoop('at_customservicereset');
  }),
  /**
   * @at_devicename
   * Get or sets the device name used for GAP service. Cannot be set while connected or advertising.
   * @param {string} t  if left empty it will query what device name is is set
   * @return {Promise} returns a promise
   *
   */
  (exports.at_devicename = function (t) {
    return (
      writeCmd(t ? 'AT+DEVICENAME=' + t : 'AT+DEVICENAME'),
      readLoop('at_devicename')
    );
  }),
  /**
   * @at_connectbond
   * Scan for and initiates a connection with a selected bonded device. Works even if the peer bonded device is advertising with a Private Random Resolvable Address.
   * @param {string} t provide bonded address for example at_connectbond('40:48:FD:EA:E8:38')
   * Follow BleuIO documentation about AT+CONNECTBOND
   * @return {Promise} returns a promise
   *
   */
  (exports.at_connectbond = function (t) {
    return writeCmd('AT+CONNECTBOND=' + t), readLoop('at_connectbond');
  }),
  /**
   * @at_connparam
   * Sets or displays preferred connection parameters. When run while connected will update connection parameters on the current target connection.
   * @param {string} t provide connection parameters for example at_connparam('intv_min=intv_max=slave_latency=supervision_timeout'),at_connparam('30=60=1=1000')
   * Follow BleuIO documentation about AT+CONNPARAM
   * @return {Promise} returns a promise
   *
   */
  (exports.at_connparam = function (t) {
    return (
      writeCmd(t ? 'AT+CONNPARAM=' + t : 'AT+CONNPARAM'),
      readLoop('at_connparam')
    );
  }),
  /**
   * @at_connscanparam
   * Set or queries the connection scan window and interval used.
   * @param {string} t provide connection scan parameters for example at_connscanparam('scan intv ms=scan win ms'),at_connscanparam('200=100')
   * Follow BleuIO documentation about AT+CONNSCANPARAM
   * @return {Promise} returns a promise
   *
   */
  (exports.at_connscanparam = function (t) {
    return (
      writeCmd(t ? 'AT+CONNSCANPARAM=' + t : 'AT+CONNSCANPARAM'),
      readLoop('at_connscanparam')
    );
  }),
  /**
   * @at_scanparam
   * Set or queries the scan parameters used.
   * @param {string} t provide scan parameters for example at_scanparam('scan mode=scan type=scan intv ms=scan win ms=filt dupl'),at_scanparam('2=0=200=100=0')
   * Follow BleuIO documentation about AT+SCANPARAM
   * @return {Promise} returns a promise
   *
   */
  (exports.at_scanparam = function (t) {
    return (
      writeCmd(t ? 'AT+SCANPARAM=' + t : 'AT+SCANPARAM'),
      readLoop('at_scanparam')
    );
  }),
  /**
   * @at_dis
   * Shows the Device Information Service information to be used.
   * @return {Promise} returns promise
   *
   */
  (exports.at_dis = function () {
    return writeCmd('AT+DIS'), readLoop('at_dis');
  }),
  /**
   * @at_peripheral
   * Sets the device Bluetooth role to peripheral.
   * @return {Promise} returns promise
   *
   */
  (exports.at_peripheral = function () {
    return writeCmd('AT+PERIPHERAL'), readLoop('at_peripheral');
  }),
  /**
   * @atr
   * Trigger platform reset.
   * @return {Promise} returns promise
   *
   */
  (exports.atr = function () {
    return writeCmd('ATR'), readLoop('atr');
  }),
  /**
   * @at_advstart
   * Starts advertising .
   * @return {Promise} returns promise
   *
   */
  (exports.at_advstart = function () {
    return writeCmd('AT+ADVSTART'), readLoop('at_advstart');
  }),
  /**
   * @at_advstop
   * Stops advertising .
   * @return {Promise} returns promise
   *
   */
  (exports.at_advstop = function () {
    return writeCmd('AT+ADVSTOP'), readLoop('at_advstop');
  }),
  /**
   * @at_advdata
   * Sets or queries the advertising data.if left empty it will query what advdata is set.
   * @param {string} t hex str format: xx:xx:xx:xx:xx.. (max 31 bytes)
   * @return {Promise} returns a promise
   *
   */
  (exports.at_advdata = (t) => (
    writeCmd(t ? 'AT+ADVDATA=' + t : 'AT+ADVDATA'), readLoop('at_advdata')
  )),
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
    return writeCmd('AT+ADVDATAI=' + t), readLoop('at_advdatai');
  }),
  /**
   * @at_advresp
   *  Sets or queries scan response data. Data must be provided as hex string.
   * @param {string} t if left empty it will query what advdata is set.hex str format: xx:xx:xx:xx:xx.. (max 31 bytes)
   * @return {Promise} returns a promise
   *
   */
  (exports.at_advresp = function (t) {
    return (
      writeCmd(t ? 'AT+ADVRESP=' + t : 'AT+ADVRESP'), readLoop('at_advresp')
    );
  }),
  /**
   * @at_autoexec
   *  Sets or displays up to 10 commands that will be run upon the BleuIO starting up.
   * example at_autoexec('AT+ADVSTART')
   * @param {string} t if left empty it will show a list of auto execution query set previously.
   * @return {Promise} returns a promise
   */
  (exports.at_autoexec = function (t) {
    return (
      writeCmd(t ? 'AT+AUTOEXEC=' + t : 'AT+AUTOEXEC'), readLoop('at_autoexec')
    );
  }),
  /**
   * @at_clrautoexec
   *  Clear any commands in the auto execute (AUTOEXEC) list.
   * @return {Promise} returns a promise
   *
   */
  (exports.at_clrautoexec = function () {
    return writeCmd('AT+CLRAUTOEXEC'), readLoop('at_clrautoexec');
  }),
  /**
   * @at_cancelconnect
   * While in Central Mode, cancels any ongoing connection attempts.
   * @return {Promise} returns a promise
   *
   */
  (exports.at_cancelconnect = function () {
    return writeCmd('AT+CANCELCONNECT'), readLoop('at_cancelconnect');
  }),
  /**
   * @at_client
   * Only usable in Dual role. Sets the dongle role towards the targeted connection to client.
   * @return {Promise} returns a promise
   *
   */
  (exports.at_client = function () {
    return writeCmd('AT+CLIENT'), readLoop('at_client');
  }),
  /**
   * @at_clearnoti
   * Disables notification for selected characteristic.
   * @param {string} t notification handle string.
   * @return {Promise} returns a promise
   *
   */
  (exports.at_clearnoti = function (t) {
    return writeCmd('AT+CLEARNOTI=' + t), readLoop('at_clearnoti');
  }),
  /**
   * @at_dual
   * Sets the device Bluetooth role to dual role. This means it has the capabilities of both Central and Peripheral role. Advertising must be stopped and, any connection must be terminated before the role change is accepted.
   * @return {Promise} returns a promise
   *
   */
  (exports.at_dual = function () {
    return writeCmd('AT+DUAL'), readLoop('at_dual');
  }),
  /**
   * @at_enterpasskey
   * Enter the 6-digit passkey to continue the pairing and bodning request.
   * @param {string} t Enter the 6-digit passkey.
   * @return {Promise} returns a promise
   *
   */
  (exports.at_enterpasskey = function (t = 123456) {
    return writeCmd('AT+ENTERPASSKEY=' + t), readLoop('at_enterpasskey');
  }),
  /** @at_numcompa
   * Used for accepting a numeric comparison authentication request or enabling/disabling auto-accepting numeric comparisons.
   * @param {number} t 0 or 1. 0 for disabled 1 for enable. Enabled by default.
   * @return {Promise} returns a promise
   *
   */
  (exports.at_numcompa = function (t) {
    return (
      writeCmd(t ? 'AT+NUMCOMPA=' + t : 'AT+NUMCOMPA'), readLoop('at_numcompa')
    );
  }),
  /**
   * @at_gapiocap
   * Sets or queries what input and output capabilities the device has.
   * @param {number} t int between 0 to 4. 0 - Display only, 1 - Display + yes & no, 2 - Keyboard only, 3- No input no output, 4 - Keyboard + display
   * @return {Promise} returns a promise
   *
   */
  (exports.at_gapiocap = function (t = 1) {
    return writeCmd('AT+GAPIOCAP=' + t), readLoop('at_gapiocap');
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
    return (
      writeCmd(t ? 'AT+GAPPAIR=' + t : 'AT+GAPPAIR'), readLoop('at_gappair')
    );
  }),
  /**
   * @at_gapunpair
   * Unpair paired devices. This will also remove the device bond data from BLE storage. Usable both when device is connected and when not.
   * @param {number} t Leave blank to unpair all paired devices or selected paired device (device_mac_address). Public= [0] or private= [1] address type prefix required before mac address. ex: [x]xx:xx:xx:xx:xx:xx
   * @return {Promise} returns a promise
   *
   */
  (exports.at_gapunpair = function (t) {
    return (
      writeCmd(t ? 'AT+GAPUNPAIR=' + t : 'AT+GAPUNPAIR'),
      readLoop('at_gapunpair')
    );
  }),
  /**
   * @at_gapdisconnectall
   * Disconnects from all connected peer Bluetooth devices. This command can be used in both central and peripheral role.
   * @return {Promise} returns a promise
   *
   */
  (exports.at_gapdisconnectall = function () {
    return writeCmd('AT+GAPDISCONNECTALL'), readLoop('at_gapdisconnectall');
  }),
  /**
   * @at_gapscan
   * Starts a Bluetooth device scan with or without timer set in seconds. If no timer is set, it will scan for only 1 second.
   * @param {number} t int (time in seconds)
   * @param {boolean} e true/false, true will show real time device in console
   * @return {Promise} returns a promise
   *
   */
  (exports.at_gapscan = function (t = 1, e = true) {
    return writeCmd('AT+GAPSCAN=' + t), readLoop('at_gapscan', e);
  }),
  /** @at_seclvl
   * Sets or queries what minimum security level will be used when connected to other devices.
   * @param {number} t leave blank for quering security level or set security level from 1 to 4. 1- No authentication and no encryption, 2-Unauthenticated pairing with encryption, 3 -Authenticated pairing with encryption, 4-Authenticated LE Secure Connections pairing with encryption.
   * @return {Promise} returns a promise
   *
   */
  (exports.at_seclvl = function (t) {
    return writeCmd(t ? 'AT+SECLVL=' + t : 'AT+SECLVL'), readLoop('at_seclvl');
  }),
  /** @at_setpasskey
   * Setting or quering set passkey for passkey authentication.
   * @param {string} t leave blank for quering passkey or set six digit passkey.
   * @return {Promise} returns a promise
   *
   */
  (exports.at_setpasskey = function (t) {
    return (
      writeCmd(t ? 'AT+SETPASSKEY=' + t : 'AT+SETPASSKEY'),
      readLoop('at_setpasskey')
    );
  }),
  /** @at_setuoi
   * Set Unique Organization ID. It will be stored in flash memory, and will persist through power cycles. If set, the Unique Organization ID string will be displayed in the ATI command's response. Will clear any previous set Unique Organization ID when set. Max length: 100 characters.
   * @param {string} t Unique Organization ID string. example at_setuoi('Your Unique Organization ID')
   * @return {Promise} returns a promise
   *
   */
  (exports.at_setuoi = function (t) {
    return writeCmd('AT+SETUOI=' + t), readLoop('at_setuoi');
  }),
  /** @at_clruoi
   * Clear any set Unique Organization ID.
   * @return {Promise} returns a promise
   *
   */
  (exports.at_clruoi = function (t) {
    return writeCmd('AT+CLRUOI'), readLoop('at_clruoi');
  }),
  /** @at_siv
   * Turns showing verbose scan result index on/off.
   * @param {string} t 1 for on , 0 for off. Example at_siv(1)
   * @return {Promise} returns a promise
   *
   */
  (exports.at_siv = function (t) {
    return writeCmd('ATSIV' + t), readLoop('at_siv');
  }),
  /** @at_sra
   * Turns showing verbose scan result index on/off.
   * @param {string} t 1 for on , 0 for off. Example at_sra(1)
   * @return {Promise} returns a promise
   *
   */
  (exports.at_sra = function (t) {
    return writeCmd('ATSRA' + t), readLoop('at_sra');
  }),
  /** @at_assn
   * Turns on/off showing device names, if present, in scan results from AT+FINDSCANDATA and AT+SCANTARGET scans. (Off per default).
   * @param {string} t 1 for on , 0 for off. Example at_assn(1)
   * @return {Promise} returns a promise
   *
   */
  (exports.at_assn = function (t) {
    return writeCmd('ATASSN' + t), readLoop('at_assn');
  }),
  /** @at_assm
   * Turns on/off showing Manufacturing Specific ID (Company ID), if present, in scan results from AT+GAPSCAN, AT+FINDSCANDATA and AT+SCANTARGET scans. (Off per default).
   * @param {string} t 1 for on , 0 for off. Example at_assm(1)
   * @return {Promise} returns a promise
   *
   */
  (exports.at_assm = function (t) {
    return writeCmd('ATASSN' + t), readLoop('at_assm');
  }),
  /** @at_sat
   * Turns on/off showing address types in scan results from AT+FINDSCANDATA and AT+SCANTARGET scans. (Off per default).
   * @param {string} t 1 for on , 0 for off. Example at_sat(1)
   * @return {Promise} returns a promise
   *
   */
  (exports.at_sat = function (t) {
    return writeCmd('ATSAT' + t), readLoop('at_sat');
  }),
  /**
   * @at_findscandata
   * Scans for all advertising/response data which contains the search params. ex. at_findscandata('FF5',10)
   * @param {string} t search params.
   * @param {number} e number of seconds to scan.
   * @return {Promise} returns a promise
   *
   */
  (exports.at_findscandata = function (t = 1, e = 5) {
    console.log('AT+FINDSCANDATA=' + t + '=' + e);
    return (
      writeCmd('AT+FINDSCANDATA=' + t + '=' + e), readLoop('at_findscandata', e)
    );
  }),
  /**
   * @at_frssi
   * Sets RSSI filter for scan results, afterwards scans will only show results with the chosen max value or below.
   * @param {string} t number : Acceptable parameter range: -1 to -99
   * @return {Promise} returns a promise
   *
   */
  (exports.at_frssi = function (t) {
    return writeCmd('AT+FRSSI=' + t), readLoop('at_frssi');
  }),
  /**
   * @at_gapaddrtype
   * Sets or queries what address type the dongle will use. Changing address type cannot be done while advertising or while connected to other devices.
   * @param {string} t number : example at_gapaddrtype(1) or at_gapaddrtype(2) or at_gapaddrtype(3) or at_gapaddrtype(4) or at_gapaddrtype(5)
   * 1  Public Static Address, 2 Private Static Address, 3 Private Random Resolvable Address, 4 Private Random Non-resolvable Address, 5 Private Random Resolvable address using Bluetooth LE Privacy v1.2	
   *
   
   * @return {Promise} returns a promise
   *
   */
  (exports.at_gapaddrtype = function (t) {
    return writeCmd('AT+GAPADDRTYPE=' + t), readLoop('at_gapaddrtype');
  }),
  /**
   * @at_gapconnect
   * Initiates a connection with a specific slave device.
   * @param {string} t hex str format: xx:xx:xx:xx:xx:xx
   * @return {Promise} returns a promise
   *
   */
  (exports.at_gapconnect = function (t) {
    return writeCmd('AT+GAPCONNECT=' + t), readLoop('at_gapconnect');
  }),
  /**
   * @at_gapdisconnect
   * Disconnects from a peer Bluetooth device.
   * @return {Promise} returns a promise
   *
   */
  (exports.at_gapdisconnect = function () {
    return writeCmd('AT+GAPDISCONNECT'), readLoop('at_gapdisconnect');
  }),
  /**
   * @at_getconn
   * Gets a list of currently connected devices along with their mac addresses, connection index, our role towards this connection and if it's bonded/paired.
   * @return {Promise} returns a promise
   *
   */
  (exports.at_getconn = async function () {
    return writeCmd('AT+GETCONN'), readLoop('at_getconn');
  }),
  /**
   * @at_getservices
   * Rediscovers a peripheral's services and characteristics.
   * @return {Promise} returns a promise
   *
   */
  (exports.at_getservices = function () {
    return writeCmd('AT+GETSERVICES'), readLoop('at_getservices');
  }),
  /**
   * @at_getservicesonly
   * Discovers a peripherals services.
   * @return {Promise} returns a promise
   *
   */
  (exports.at_getservicesonly = function () {
    return writeCmd('AT+GETSERVICESONLY'), readLoop('at_getservicesonly');
  }),
  /**
   * @at_getservicesdetails
   * Discovers all characteristics and descriptors of a selected service. Must run at_getservicesonly() first to get the service handle.
   * Example : at_getservicesdetails('0001')
   * @param {string} t service param
   * @return {Promise} returns a promise
   *
   */
  (exports.at_getservicesdetails = function (t) {
    return (
      writeCmd('AT+GETSERVICEDETAILS=' + t), readLoop('at_getservicesdetails')
    );
  }),
  /**
   * @at_indi
   * Shows list of set indication handles along with the connection index so you can see what indication you have enabled on which connected device.
   * @return {Promise} returns a promise
   *
   */
  (exports.at_indi = function () {
    return writeCmd('AT+INDI'), readLoop('at_indi');
  }),
  /**
   * @at_noti
   * Shows list of set notification handles along with the connection index so you can see what notification you have enabled on which connected device.
   * @return {Promise} returns a promise
   *
   */
  (exports.at_noti = function () {
    return writeCmd('AT+NOTI'), readLoop('at_noti');
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
    return writeCmd('AT+SCANTARGET=' + t), readLoop('at_scantarget', e + 2);
  }),
  /**
   * @at_setdis
   * Sets the Device Information Service information. example at_setdis(MAN_NAME,MOD_NUM,HW_REV,FW_REV,SW_REV)
   * @param {string} name Manufacturer Name
   * @param {string} num Model Number
   * @param {string} serial Serial Number
   * @param {string} hrev Hardware revision
   * @param {string} frev Firmware revision
   * @param {string} srev Software revision
   * @return {Promise} returns a promise
   *
   */
  (exports.at_setdis = function (name, num, serial, hrev, frev, srev) {
    return (
      writeCmd(
        'AT+SETDIS=' +
          name +
          '=' +
          num +
          '=' +
          serial +
          '=' +
          hrev +
          '=' +
          frev +
          '=' +
          srev
      ),
      readLoop('at_setdis')
    );
  }),
  /**
   * @at_getbond
   * Displays all MAC address of bonded devices.
   * @return {Promise} returns a promise
   *
   */
  (exports.at_getbond = function () {
    return writeCmd('AT+GETBOND'), readLoop('at_getbond');
  }),
  /**
   * @at_getmac
   * Returns MAC address of the BleuIO device.
   * @return {Promise} returns a promise
   *
   */
  (exports.at_getmac = function () {
    return writeCmd('AT+GETMAC'), readLoop('at_getmac');
  }),
  /**
   * @at_server
   * Only usable in Dual role. Sets the dongle role towards the targeted connection to server.
   * @return {Promise} returns a promise
   *
   */
  (exports.at_server = function () {
    return writeCmd('AT+SERVER'), readLoop('at_server');
  }),
  /**
   * @at_setnoti
   * Enable notification for selected characteristic.
   * @param {string} t notification handle
   * @return {Promise} returns a promise
   *
   */
  (exports.at_setnoti = function (t) {
    return writeCmd('AT+SETNOTI=' + t), readLoop('at_setnoti');
  }),
  /**
   * @at_setindi
   * Enable indication for selected characteristic.
   * @param {string} t indication  handle
   * @return {Promise} returns a promise
   *
   */
  (exports.at_setindi = function (t) {
    return writeCmd('AT+SETINDI=' + t), readLoop('at_setindi');
  }),
  /**
   * @at_suotastart
   * Enables the SUOTA Service and start the SUOTA Advertising.
   * Cannot be started while connected/connecting or advertising.
   * @return {Promise} returns a promise
   *
   */
  (exports.at_suotastart = function () {
    return writeCmd('AT+SUOTASTART'), readLoop('at_suotastart');
  }),
  /**
   * @at_suotastop
   * Disables the SUOTA Service and stops the SUOTA Advertising.
   * Cannot be used while connected/connecting.
   * @return {Promise} returns a promise
   *
   */
  (exports.at_suotastop = function () {
    return writeCmd('AT+SUOTASTOP'), readLoop('at_suotastop');
  }),
  /**
   * @at_mtu
   * Sets  the max allowed MTU size. Cannot be changed while connected/connecting or advertising.
   * @param {number} t Minimum allowed value: 67, Maximum allowed value: 512
   * @return {Promise} returns a promise
   *
   */
  (exports.at_mtu = function (t) {
    return writeCmd(t ? 'AT+MTU=' + t : 'AT+MTU'), readLoop('at_mtu');
  }),
  /**
   * @at_spssend
   * Send a message or data via the SPS profile.Without parameters it opens a stream for continiously sending data.
   * @param {string} t if left empty it will open Streaming mode
   * @return {Promise} returns a promise
   *
   */
  (exports.at_spssend = function (t) {
    return (
      writeCmd(t ? 'AT+SPSSEND=' + t : 'AT+SPSSEND'), readLoop('at_spssend')
    );
  }),
  /**
 * @at_targetconn
 * Setting or querying the connection index to use as the targeted connection.
When connected to several devices, the target connection decides which device you target when using commands such as AT+GATTCREAD, AT+GATTCWRITE, AT+GAPDISCONNECT, AT+GAPPAIR or AT+SPSSEND etc.
 * @param {string} t write connecton index of target device. if left empty it will show what device you are targeting at the momment.
 * @return {Promise} returns a promise
 * 
*/
  (exports.at_targetconn = function (t) {
    return (
      writeCmd(t ? 'AT+TARGETCONN=' + t : 'AT+TARGETCONN'),
      readLoop('at_targetconn')
    );
  }),
  /**
   * @at_gapstatus
   * Reports the Bluetooth role.
   * @return {Promise} returns a promise
   *
   */
  (exports.at_gapstatus = function () {
    return writeCmd('AT+GAPSTATUS'), readLoop('at_gapstatus');
  }),
  /**
   * @at_gattcwrite
   * Write attribute to remote GATT server in ASCII. Can only be used in Central role and when connected to a peripheral. ex at_gattcwrite('001B','HELLO')
   * @param {string} handle_param pass handle param as string
   * @param {string} msg pass msg as string.
   * @return {Promise} returns a promise
   *
   */
  (exports.at_gattcwrite = function (handle_param, msg) {
    return (
      writeCmd('AT+GATTCWRITE=' + handle_param + ' ' + msg),
      readLoop('at_gattcwrite')
    );
  }),
  /**
   * @at_gattcwriteb
   * Write attribute to remote GATT server in Hex. Can only be used in Central role and when connected to a peripheral.ex at_gattcwriteb('001B','0101')
   * @param {string} handle_param pass handle param as string
   * @param {string} msg pass msg as string.
   * @return {Promise} returns a promise
   *
   */
  (exports.at_gattcwriteb = function (handle_param, msg) {
    return (
      writeCmd('AT+GATTCWRITEB=' + handle_param + ' ' + msg),
      readLoop('at_gattcwriteb')
    );
  }),
  /**
   * @at_gattcwritewr
   * Write (without response) attribute to remote GATT server in ASCII. Can only be used in Central role and when connected to a peripheral.
   * @param {string} handle_param pass handle param as string
   * @param {string} msg pass msg as string.
   * @return {Promise} returns a promise
   *
   */
  (exports.at_gattcwritewr = function (handle_param, msg) {
    return (
      writeCmd('AT+GATTCWRITEWR=' + handle_param + ' ' + msg),
      readLoop('at_gattcwritewr')
    );
  }),
  /**
   * @at_gattcwritewrb
   * Write (without response) attribute to remote GATT server in Hex. Can only be used in Central role and when connected to a peripheral.
   * @param {string} handle_param pass handle param as string
   * @param {string} msg pass msg as string.
   * @return {Promise} returns a promise
   *
   */
  (exports.at_gattcwritewrb = function (handle_param, msg) {
    return (
      writeCmd('AT+GATTCWRITEWRB=' + handle_param + ' ' + msg),
      readLoop('at_gattcwritewrb')
    );
  }),
  /**
   * @at_gattcread
   * Read attribute of remote GATT server. Can only be used in Central role and when connected to a peripheral. ex at_gattcread('001B')
   * @param {string} handle_param pass handle param as string
   * @return {Promise} returns a promise
   *
   */
  (exports.at_gattcread = function (handle_param) {
    return writeCmd('AT+GATTCREAD=' + handle_param), readLoop('at_gattcread');
  }),
  /**
   * @help
   * Shows all AT-Commands.
   * @return {Promise} returns a promise
   *
   */
  (exports.help = function () {
    return writeCmd('--H'), readLoop('help');
  }),
  /**
   * @stop
   * Stops Current process.
   * @return {Promise} returns a promise
   *
   */
  (exports.stop = function () {
    return writeCmd(''), 'Process Stopped';
  });
class LineBreakTransformer {
  constructor() {
    this.container = '';
  }
  transform(t, e) {
    this.container += t;
    const r = this.container.split('\r\n');
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
      case 'ata':
        if (2 == arr.length) return arr;
        break;
      case 'atasps':
        if (2 == arr.length) return arr;
        break;
      case 'atds':
        if (2 == arr.length) return arr;
        break;
      case 'ati':
        if (arr.includes('Not Advertising') || arr.includes('Advertising'))
          return arr;
        break;
      case 'ate':
        if (arr.includes('ECHO OFF') || arr.includes('ECHO ON')) return arr;
        break;
      case 'at_central':
        return 'Central Mode';
      case 'at_dis':
        if (arr.includes('dis_info_end')) return arr;
        break;
      case 'at_customservice':
        if (arr.length == 2) return arr;
        break;
      case 'at_customservicestart':
        if (arr.length == 2) return arr;
        break;
      case 'at_customservicestop':
        if (arr.length == 2) return arr;
        break;
      case 'at_customservicereset':
        if (arr.length == 2) return arr;
        break;
      case 'at_peripheral':
        return 'Peripheral Mode';
      case 'at_advstart':
        return 'Advertising';
      case 'at_advstop':
        return 'Advertising Stopped';
      case 'at_advdata':
      case 'at_advdatai':
      case 'at_advresp':
        if (2 == arr.length) return arr;
        break;
      case 'at_cancelconnect':
        if (arr.includes('ERROR') || arr.includes('OK')) return arr;
        break;
      case 'at_client':
        return 'Client';
      case 'at_clearnoti':
        if (2 == arr.length) return arr;
        break;
      case 'at_dual':
        return 'Dual Mode';
      case 'at_enterpasskey':
        if (2 == arr.length) return arr;
        break;
      case 'atr':
        return 'Trigger platform reset';
      case 'at_findscandata':
        if (arr.includes('SCAN COMPLETE')) return arr;
        break;
      case 'at_gapdisconnectall':
        if (arr.includes('All connections terminated.')) return arr;
        break;
      case 'at_gapiocap':
        if (3 == arr.length) return arr;
        break;
      case 'at_gappair':
        if (arr.includes('PAIRING SUCCESS') || arr.includes('BONDING SUCCESS'))
          return arr;
        break;
      case 'at_gapunpair':
        if (arr.includes('UNPARIED.') || 3 == arr.length) return arr;
        break;
      case 'at_gapscan':
        if (e === true)
          arr.some(function (v) {
            if (v.indexOf('RSSI') >= 0 && a != '') console.log(a);
          });
        if (arr.includes('SCAN COMPLETE')) return arr;
        break;
      case 'at_getconn':
        if (arr.includes('No Connections found.') || 2 == arr.length) {
          return arr;
        }
      case 'at_indi':
        if (2 == arr.length) return arr;
        break;
      case 'at_noti':
        if (2 == arr.length) return arr;
        break;
      case 'at_scantarget':
        if (arr.length == e) {
          const t = outputStream.getWriter();
          return t.write(''), t.releaseLock(), arr.slice(2);
        }
        break;
      case 'at_setdis':
        if (2 == arr.length) return arr;
        break;
      case 'at_setpasskey':
        if (2 == arr.length) return arr;
        break;
      case 'at_sra':
        if (2 == arr.length) return arr;
        break;
      case 'at_siv':
        if (2 == arr.length) return arr;
        break;
      case 'at_assn':
        if (2 == arr.length) return arr;
        break;
      case 'at_assm':
        if (2 == arr.length) return arr;
        break;
      case 'at_sat':
        if (2 == arr.length) return arr;
        break;
      case 'at_gattcwrite':
        if (4 == arr.length) return arr;
        break;
      case 'at_gapstatus':
        if (arr.includes('Not Advertising') || arr.includes('Advertising'))
          return arr;
        break;
      case 'at_gattcwrite':
        if (4 == arr.length) return arr;
        break;
      case 'at_gattcwriteb':
        if (4 == arr.length) return arr;
        break;
      case 'at_mtu':
        if (2 == arr.length) return arr;
        break;
      case 'at_gattcwritewr':
        if (2 == arr.length) return arr;
        break;
      case 'at_gattcwritewrb':
        if (2 == arr.length) return arr;
        break;
      case 'at_getbond':
        if (2 == arr.length) return arr;
        break;
      case 'at_getmac':
        if (3 == arr.length) return arr;
        break;
      case 'at_gattcread':
        if (arr.length > 1) {
          let dt = arr[arr.length - 1];
          console.log(dt);
          if (dt.includes('Value read:')) return arr;
          break;
        }
      case 'at_gapconnect':
        //if (arr.includes("CONNECTED.") || arr.includes("DISCONNECTED.") ||  arr.includes("PAIRING SUCCESS") || 4 == arr.length) return arr;
        if (
          arr.includes(
            'handle_evt_gattc_browse_completed: conn_idx=0000 status=0'
          )
        )
          return arr;
        break;
      case 'at_getservices':
        //if (arr.includes("Value received: ")) return arr;
        if (
          arr.includes(
            'handle_evt_gattc_browse_completed: conn_idx=0000 status=0'
          )
        )
          return arr;
        break;
      case 'at_getservicesonly':
        if (
          arr.includes(
            'handle_evt_gattc_discover_completed: conn_idx=0000 type=SVC status=0'
          )
        )
          return arr;
        break;
      case 'at_getservicesdetails':
        if (
          arr.includes(
            'handle_evt_gattc_browse_completed: conn_idx=0000 status=0'
          )
        )
          return arr;
        break;

      case 'at_gapdisconnect':
        return 'Disconnected.';
      case 'at_numcompa':
        if (arr.includes('ERROR') || arr.includes('OK')) return arr;
        break;
      case 'at_seclvl':
        if (2 == arr.length) return arr;
        break;
      case 'at_gapaddrtype':
        if (2 == arr.length) return arr;
        break;
      case 'at_autoexec':
        if (2 == arr.length) return arr;
        break;
      case 'at_clrautoexec':
        if (2 == arr.length) return arr;
        break;
      case 'at_connectbond':
        if (2 == arr.length || arr.includes('SCAN COMPLETE')) return arr;
        break;
      case 'at_connparam':
        if (2 == arr.length) return arr;
        break;
      case 'at_connscanparam':
        if (2 == arr.length) return arr;
        break;
      case 'at_scanparam':
        if (2 == arr.length) return arr;
        break;
      case 'at_frssi':
        if (2 == arr.length) return arr;
        break;
      case 'at_server':
        return 'Server';
      case 'at_setnoti':
        if (20 == arr.length) return arr;
        break;
      case 'at_setindi':
        if (2 == arr.length) return arr;
        break;
      case 'at_setuoi':
        if (2 == arr.length) return arr;
        break;
      case 'at_clruoi':
        if (2 == arr.length) return arr;
        break;
      case 'at_spssend':
        if (2 == arr.length || arr.includes('[Sent]')) return arr;
      case 'at_suotastart':
        if (2 == arr.length) return arr;
        break;
      case 'at_suotastop':
        if (2 == arr.length) return arr;
        break;
      case 'at_targetconn':
        if (2 == arr.length) return arr;
      case 'help':
        if (arr.includes('[A] = Usable in All Roles')) return arr;
        break;
      default:
        return 'Nothing!';
    }
  }
}
