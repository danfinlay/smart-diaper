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
	https://www.bluetooth.com/wp-content/uploads/Sitecore-Media-Library/Gatt/Xml/Services/org.bluetooth.service.heart_rate.xml
	https://www.bluetooth.com/wp-content/uploads/Sitecore-Media-Library/Gatt/Xml/Services/org.bluetooth.service.generic_access.xml
	https://www.bluetooth.com/wp-content/uploads/Sitecore-Media-Library/Gatt/Xml/Services/org.bluetooth.service.battery_service.xml
	https://www.bluetooth.com/wp-content/uploads/Sitecore-Media-Library/Gatt/Xml/Characteristics/org.bluetooth.characteristic.heart_rate_measurement.xml
	https://www.bluetooth.com/wp-content/uploads/Sitecore-Media-Library/Gatt/Xml/Characteristics/org.bluetooth.characteristic.body_sensor_location.xml
 */

import BLEServer from "bleserver";
import {uuid} from "btutils";
import Timer from "timer";

const DIAPER_SERVICE_UUID = uuid`0817a335-f1cb-42c2-946c-60441c01055e`;
const sensor = new I2C({sda: 41, scl: 40, address: 0x40 /* might be 0x41 */});

class HeartRateService extends BLEServer {
	onReady() {
		this.deviceName = "SmartyPants";
        this.reading = new UInt8Array(4);
		this.onDisconnected();
	}
	onConnected() {
		// Trying out continuing to advertise, since now supporting up to 3 connections:
		// this.stopAdvertising();
	}
	onDisconnected() {
		this.stopMeasurements();
		this.startAdvertising({
			advertisingData: {flags: 6, completeName: this.deviceName, completeUUID16List: [DIAPER_SERVICE_UUID]}
		});
	}
	onCharacteristicNotifyEnabled(characteristic) {
		this.startMeasurements(characteristic);
	}
	onCharacteristicNotifyDisabled(characteristic) {
		this.stopMeasurements();
	}
	startMeasurements(characteristic) {
		this.timer = Timer.repeat(id => {
			sensor.read(2, this.reading);
			this.notifyValue(characteristic, this.reading);
		}, 1000);
	}
	stopMeasurements() {
		if (this.timer) {
			Timer.clear(this.timer);
			delete this.timer;
		}
	}
}

let hrs = new HeartRateService;



