const request = require('request');
const Accessory = require('./Accessory.js');

class ActorAccessory extends Accessory {

  constructor(log, url, accessToken, device, homebridge, ServiceType, CharacteristicType) {
    super(log, url, accessToken, device, homebridge, ServiceType, CharacteristicType);

    this.accessoryId = device.accessory_id;
    this.actorService = new ServiceType(this.name);
    this.actorService.getCharacteristic(CharacteristicType)
                     .on('set', this.setState.bind(this))
                     .on('get', this.getState.bind(this));

    this.services.push(this.actorService);
  }

  callParticleFunction(functionName, arg, callback, outputRAW) {
    const url = `${this.url}${this.deviceId}/${functionName}`;
    const allArgs = this.accessory_id != null ? `${arg}accessory_id=${this.accessory_id}` : arg;
    this.log('Calling function: "', url, '" with args: ', allArgs);
    const form = {
      access_token: this.accessToken,
      allArgs
    };
    if (outputRAW) {
      form.format = 'raw';
    }
    request.post(
      url,
      {
        form
      },
      callback
    );
  }

  getState(callback) {
    this.callParticleFunction("power", '?', (error, response, body) => {
      this.value = parseInt(body);
      try {
        callback(null, this.value);
      } catch (error) {
        this.log('Caught error '+ error + ' when calling homebridge callback.');
      }
    },
    true);
  }

  setState(functionName, value, callback) {
    this.value = value;
    this.callParticleFunction(functionName, value, (error, response, body) => this.callbackHelper(error, response, body, callback), true);
  }

  callbackHelper(error, response, body, callback) {
    if (!error) {
      callback();
    } else {
      this.log(error);
      this.log(response);
      this.log(body);
      callback(error);
    }
  }
}

module.exports = ActorAccessory;
