**Particle.io device plugin for Homebridge**
-------------------------------------

As you all know in the new version of [Homebridge](https://github.com/nfarina/homebridge), the plugin architecture is changed. In new Homebridge, plugins are published through NPM with name starts with *homebridge-*. Users can install the plugin using NPM.

You can install it using NPM like all other modules, using:

`npm install -g homebridge-particle-io`.

In this version, I have made some changes from the older version. Mainly the plugin is now a Homebridge Platform. Also in this version accessories are defined in `config.json` file. The plugin loads the accessories from the `config.json` file and create accessory dynamically. A sample configuration file is like:

  {
    "bridge": {
      "name": "Homebridge",
      "username": "CC:22:3D:E3:CE:39",
      "port": 51826,
      "pin": "031-45-154"
    },

    "description": "This is an example configuration file with one Particle platform and 3 accessories, two lights and a temperature sensor. You should replace the access token and device id placeholder with your access token and device id",

    "platforms": [
      {
        "platform": "Particle",
        "name": "Particle Devices",
        "access_token": "<<access token>>",
        "cloud_url": "https://api.particle.io/v1/devices/",
        "devices": [
          {
            "name": "Bedroom Light",
            "type": "lightbulb",
            "device_id": "<<device id>>",
            "function_name": "onoff",
            "args": "0={STATE}"
          },
          {
            "name": "Kitchen Light",
            "type": "lightbulb",
            "device_id": "<<device id>>",
            "function_name": "onoff",
            "args": "1={STATE}"
          },
          {
            "name": "Kitchen Temperature",
            "type": "temperaturesensor",
            "device_id": "<<device id>>",
            "sensorType": "temperature",
            "key": "temperature",
            "event_name": "tvalue"
          }
        ]
      }
    ]
  }

As you can see from the above example this `config.json` file defines 3 accessories. 2 Lights and one Temperature Sensor. The **access_token** defines the Particle Access Token and **cloud_url** defines the base Particle API url. If you are using the Particle Cloud, then the value of *cloud_url* should be https://api.particle.io/v1/devices/. If you are using local cloud, then replace with your sensor address.

The `devices` array contains all the accessories. You can see the accessory object defines following string objects:

 - ***name*** - Display name, this is the name to be displayed on the HomeKit app.
 - ***type*** - Type of the accessory. As of now, the plugin supports 3 types: `lightbulb`, `temperaturesensor` and `humiditysensor`.
 - ***device_id*** - Device ID of the Particle Device (Core, Photon or Electron). It is defined in accessory so that you can use different Particle Devices for different accessory.
 - ***event_name*** - The name of the event to listen for sensor value update. This is only valid if the accessory type is SENSOR. If the accessory is a type of SENSOR, then the plugin listens for events published from Particle Device (using `Particle.publish`). The device firmware should publish the sensor values in the format `key=value`. The key identifies the sensor value. For a temperature sensor the key should be ***temperature***. For a humidity sensor the key should be ***humidity***. For light sensor it should be ***light***.
 - ***key*** - Name of the key, this is not used in this version of the plugin. This is included for future purpose.
