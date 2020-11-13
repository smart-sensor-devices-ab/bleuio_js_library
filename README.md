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
npm i bleuio_test_lib
```
In the js file, import
```sh
import * as my_dongle from 'bleuio_test_lib'
```

You are set to go. 



### Basic Usage
call my_dongle.at_connect() to connect to the dongle. 
Note : you have to wait for the dongle to load.

**console.log(my_dongle.ati())** will return a promise with device information.
**my_dongle.at_central()** will set te device into central mode.

###Example 
***index.html***
```sh
<script src="./index.js"></script>
<button id="connect">Connect</button>
<button id="deviceinfo">Device Info</button>
<button id="central">Central Mode</button>
<button id="peripheral">Peripheral Mode</button>
    .....
```
***index.js***
```sh
import * as my_dongle from 'bleuio_test_lib'
document.getElementById('connect').addEventListener('click', function(){
  my_dongle.at_connect()
})
document.getElementById('deviceinfo').addEventListener('click', function(){
  //my_dongle.ati().then((data)=>console.log(data))
  console.log(my_dongle.ati())
})
....
```
### Available functions
| Nmae | Details |
| ------ | ------ |
| at_connect() | Connects to dongle |
| at_disconnect() | Disconnects the dongle.  |
| ati() | Device information query. Returns firmware version, hardware type and unique organization identifier. ex: my_dongle.ati() |
| at_central() | Sets the device Bluetooth role to central role. ex: my_dongle.at_central() |
| at_peripheral() |Sets the device Bluetooth role to peripheral. ex: my_dongle.at_peripheral() |
| at_advstart() |Starts advertising.   ex: my_dongle.at_advstart()|
| at_advstop() | Stops advertising. Returns ERROR if not already advertising. ex: my_dongle.at_advstop() |
| at_advdata() | Sets or queries the advertising data. Data must be provided as hex string. |
| at_advdatai() | Sets advertising data in a way that let's it be used as an iBeacon.ex: my_dongle.at_advdatai('ebbaaf47-0e4f-4c65-8b08-dd07c98c41ca0000000000') |
| at_advresp() | Sets or queries scan response data. Data must be provided as hex string. Changes to take effect after restart of advertising. ex: my_dongle.at_advresp('04:09:43:41:54') |
| at_gapscan() |Starts a Bluetooth device scan with timer set in seconds. Only accepted when device is in central role and not connected. ex: my_dongle.at_gapscan(5)  |
| at_gapconnect() | Initiates a connection with a specific slave device. Upon succesfully connecting atempts to display device name, advertising and response data and the services of the peripheral. The local device must be in central role. ex: my_dongle.at_gapconnect('[1]F3:D1:ED:AD:8A:10') |
| at_gapdisconnect() | Disconnects from a peer Bluetooth device. This command can be used in both central and peripheral role. |
| at_spssend() | Send a message or data via the SPS profile. Without parameters it opens a stream for continiously sending data. ex: my_dongle.at_spssend('Hello') |
| at_scantarget() | Scan a target device. Displaying it's advertising data as it updates. You need to add target device information and number of response . ex : my_dongle.at_scantarget('[1]FE:D4:2E:CD:72:78',15) |
| atr() | Trigger platform reset |
| at_gapstatus() | Reports the Bluetooth role  |
| help() | prints AT command list of the dongle |
| stop() | Stops current process |

**Enjoy !**


License
----

MIT



