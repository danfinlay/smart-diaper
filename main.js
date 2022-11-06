/*
 * Copyright (c) 2016-2020  Moddable Tech, Inc.
 *
 *   This file is part of the Moddable SDK.
 * 
 *   This work is licensed under the
 *       Creative Commons Attribution 4.0 International License.
 *   To view a copy of this license, visit
 *       <http://creativecommons.org/licenses/by/4.0>.
 *   or send a letter to Creative Commons, PO Box 1866,
 *   Mountain View, CA 94042, USA.
 *
 */
 /*
	https://www.bluetooth.com/wp-content/uploads/Sitecore-Media-Library/Gatt/Xml/Services/org.bluetooth.service.health_thermometer.xml
	https://www.bluetooth.com/wp-content/uploads/Sitecore-Media-Library/Gatt/Xml/Characteristics/org.bluetooth.characteristic.temperature_measurement.xml
 */

import BLEServer from "bleserver";
import {uuid} from "btutils";
import Timer from "timer";

const TEMP_SERVICE_UUID = uuid`1809`;
const HUMIDITY_SERVICE_UUID = uuid`7c94aa248193472096268dedb07baf6f`

class SmartDiaperService extends BLEServer {
	onReady() {
		this.deviceName = "SmartyPants";
		// this.sensor = new I2C({address: 0x40 /* might be 0x41 */});
		this.sensor = new I2C({sda: 41, scl: 40, address: 0x40 /* might be 0x41 */});
		this.reading = new UInt8Array(2);
		this.onDisconnected();
	}
	onConnected() {
		this.stopAdvertising();
	}
	onDisconnected() {
		this.stopMeasurements();
		this.startAdvertising({
			advertisingData: {flags: 6, completeName: this.deviceName, completeUUID16List: [TEMP_SERVICE_UUID, HUMIDITY_SERVICE_UUID]}
		});
	}
	onCharacteristicNotifyEnabled(characteristic) {
		this.startMeasurements(characteristic);
	}
	onCharacteristicNotifyDisabled(characteristic) {
		this.stopMeasurements();
	}
	get temperature() {
		sensor.read(4, this.reading);
		return this.reading;
	}
	startMeasurements(characteristic) {
		this.timer = Timer.repeat(id => {
			this.notifyValue(characteristic, this.reading);
		}, 5000);
	}
	stopMeasurements() {
		if (this.timer) {
			Timer.clear(this.timer);
			delete this.timer;
		}
	}
}

let sds = new SmartDiaperService;
