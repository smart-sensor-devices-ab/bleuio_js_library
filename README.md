# BleuIO

[![N|Solid](https://www.bleuio.com/getting_started//img/logo.png)](https://www.bleuio.com/getting_started//img/logo.png)

Javascript Library for BleuIO

# Requirments

- Chrome 78 or later and you need to enable the **#enable-experimental-web-platform-features** flag in chrome://flags
- [BleuIO](https://www.bleuio.com/)

To enable the flag Open **chrome://flags/#enable-experimental-web-platform-features** in Google Chrome browser.

### Installation

Install the library by running

```sh
npm i bleuio
```

In the js file, import

```sh
import * as my_dongle from 'bleuio'
```

You are set to go.

### Basic Usage

call my_dongle.at_connect() to connect to the dongle.
Note : you have to wait for the dongle to load.

**console.log(my_dongle.ati())** will return a promise with device information.
**my_dongle.at_central()** will set te device into central mode.

###Example
**_index.html_**

```sh

<button id="connect">Connect</button>
<button id="deviceinfo">Device Info</button>
<button id="central">Central Mode</button>
<button id="peripheral">Peripheral Mode</button>
    .....
<script src="./index.js"></script>
```

**_index.js_**

```sh
import * as my_dongle from 'bleuio'
document.getElementById('connect').addEventListener('click', function(){
  my_dongle.at_connect()
})
document.getElementById('deviceinfo').addEventListener('click', function(){
  //my_dongle.ati().then((data)=>console.log(data))
  console.log(my_dongle.ati())
})
....
```

To run the script you need a web application bundler. You can use parceljs. https://parceljs.org/getting_started.html
Follow this video for better understanding
https://youtu.be/MZfeV61gjeY

### Available functions

| Nmae               | Details                                                                                                                                                                                                                                                                                                                               |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| at_connect()       | Connects to dongle                                                                                                                                                                                                                                                                                                                    |
| at_disconnect()    | Disconnects the dongle.                                                                                                                                                                                                                                                                                                               |
| ati()              | Device information query. Returns firmware version, hardware type and unique organization identifier. ex: my_dongle.ati()                                                                                                                                                                                                             |
| ate()              | Turn echo on/off. 0/1 (On per default). ex my_dongle.ate(0)                                                                                                                                                                                                                                                                           |
| at_central()       | Sets the device Bluetooth role to central role. ex: my_dongle.at_central()                                                                                                                                                                                                                                                            |
| at_peripheral()    | Sets the device Bluetooth role to peripheral. ex: my_dongle.at_peripheral()                                                                                                                                                                                                                                                           |
| at_advstart()      | Starts advertising. ex: my_dongle.at_advstart()                                                                                                                                                                                                                                                                                       |
| at_advstop()       | Stops advertising. Returns ERROR if not already advertising. ex: my_dongle.at_advstop()                                                                                                                                                                                                                                               |
| at_advdata()       | Sets or queries the advertising data. Data must be provided as hex string.                                                                                                                                                                                                                                                            |
| at_advdatai()      | Sets advertising data in a way that let's it be used as an iBeacon.ex: my_dongle.at_advdatai('ebbaaf47-0e4f-4c65-8b08-dd07c98c41ca0000000000')                                                                                                                                                                                        |
| at_advresp()       | Sets or queries scan response data. Data must be provided as hex string. Changes to take effect after restart of advertising. ex: my_dongle.at_advresp('04:09:43:41:54')                                                                                                                                                              |
| at_cancelconnect() | While in Central Mode, cancels any ongoing connection attempts. ex: my_dongle.at_cancelconnect()                                                                                                                                                                                                                                      |
| at_enterpasskey()  | Enter the 6-digit passkey to continue the pairing and bodning request. ex: my_dongle.at_enterpasskey('123456')                                                                                                                                                                                                                        |
| at_findscandata()  | Scans for all advertising/response data which contains the search params with number of responses. ex. at_findscandata('FF5',10)                                                                                                                                                                                                      |
| at_gapscan()       | Starts a Bluetooth device scan with timer set in seconds. Only accepted when device is in central role and not connected. ex: my_dongle.at_gapscan(5)                                                                                                                                                                                 |
| at_gapconnect()    | Initiates a connection with a specific slave device. Upon succesfully connecting atempts to display device name, advertising and response data and the services of the peripheral. The local device must be in central role. ex: my_dongle.at_gapconnect('[1]F3:D1:ED:AD:8A:10')                                                      |
| at_gapdisconnect() | Disconnects from a peer Bluetooth device. This command can be used in both central and peripheral role.                                                                                                                                                                                                                               |
| at_gapiocap()      | Sets or queries what input and output capabilities the device has. pass number between 0 to 4. 0 - Display only, 1 - Display + yes & no, 2 - Keyboard only, 3- No input no output, 4 - Keyboard + display                                                                                                                             |
| at_gappair()       | Starts a pairing or bonding procedure. Depending on whether the device is master or slave on the connection, it will send a pairing or a security request respectively. Only usable when connected to a device.                                                                                                                       |
| at_gapunpair()     | Unpair paired devices. This will also remove the device bond data from BLE storage. Usable both when device is connected and when not. Leave blank to unpair all paired devices or selected paired device (device_mac_address). Public= [0] or private= [1] address type prefix required before mac address. ex: [x]xx:xx:xx:xx:xx:xx |
| at_gattcread()     | Read attribute of remote GATT server. Can only be used in Central role and when connected to a peripheral. ex at_gattcread('001B')                                                                                                                                                                                                    |
| at_gattcwrite()    | Write attribute to remote GATT server in ASCII. Can only be used in Central role and when connected to a peripheral. ex at_gattcwrite('001B','HELLO')                                                                                                                                                                                 |
| at_gattcwriteb()   | Write attribute to remote GATT server in Hex. Can only be used in Central role and when connected to a peripheral.ex at_gattcwriteb('001B','0101')                                                                                                                                                                                    |
| at_getservices()   | Rediscovers a peripheral's services and characteristics.                                                                                                                                                                                                                                                                              |
| at_numcompa()      | Used for accepting a numeric comparison authentication request or enabling/disabling auto-accepting numeric comparisons. 0 or 1. 0 for disabled 1 for enable. Enabled by default.                                                                                                                                                     |
| at_spssend()       | Send a message or data via the SPS profile. Without parameters it opens a stream for continiously sending data. ex: my_dongle.at_spssend('Hello')                                                                                                                                                                                     |
| at_scantarget()    | Scan a target device. Displaying it's advertising data as it updates. You need to add target device information and number of response . ex : my_dongle.at_scantarget('[1]FE:D4:2E:CD:72:78',15)                                                                                                                                      |
| at_seclvl()        | Sets or queries what minimum security level will be used when connected to other devices.leave blank for quering security level or set security level from 1 to 3. 1- No authentication and no encryption, 2-Unauthenticated pairing with encryption, 3 -Authenticated pairing with encryption                                        |
| at_setnoti()       | Enable notification for selected characteristic.                                                                                                                                                                                                                                                                                      |
| at_setpasskey()    | Setting or quering set passkey for passkey authentication. leave blank for quering passkey or set six digit passkey.                                                                                                                                                                                                                  |
| atr()              | Trigger platform reset                                                                                                                                                                                                                                                                                                                |
| at_gapstatus()     | Reports the Bluetooth role                                                                                                                                                                                                                                                                                                            |
| help()             | prints AT command list of the dongle                                                                                                                                                                                                                                                                                                  |
| stop()             | Stops current process                                                                                                                                                                                                                                                                                                                 |

**Enjoy !**

## License

MIT
