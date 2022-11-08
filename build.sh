#! /bin/bash

IDF_PATH=$HOME/esp32/esp-idf UPLOAD_PORT=/dev/cu.usbmodem1101 mcconfig -d -m -p esp32/esp32s3 -t xsbug
