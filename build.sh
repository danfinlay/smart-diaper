#! /bin/bash

IDF_PATH=$HOME/esp32/esp-idf \
DEBUGGER_PORT=/dev/cu.DM02INUR \
UPLOAD_PORT=cu.usbmodem101 \
mcconfig -d -m -p esp32/esp32s3 -t xsbug
