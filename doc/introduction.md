# Introduction

This chapter introduces the problem ConCaVa is trying to solve.

## Problem

Efficiently processing sensor data is hard. As developers of IoT hardware we had the following problems:

1. __Limited bandwidth.__ Sending data over the internet or 3G must be done in binary, since other formats (XML, JSON) include the data format, and therefore unnecessarily consume bandwidth.
1. __Different protocols.__ Sensors provide different types of data and often via a different protocol (LoRa, MQTT, SigFox, etc.).
1. __Calibrating and vaidating data.__ Measurement require different types of calibration/validation. Each of them has to be implemented seperately.

## Solution

__A generic approach.__ A server that processes binary payloads in a dynamic and standardized way. ConCaVa, which stands for <b>Co</b>nvert, <b>Ca</b>librate, and <b>Va</b>lidate, provides an HTTP API that processes a binary payload in three steps, before sending it to (cloud) storage. The dataflow is as follow:

![Dataflow](https://raw.githubusercontent.com/kukua/concava/master/doc/dataflow.jpg)

<!-- TODO: Link to HTTP requests chapter -->

1. Sensors gather measurements and send it to a connector (independent of the protocol).
1. The connector forwards the data in a standardized packet (HTTP request). Containing the device ID and payload in binary format.
1. ConCaVa then Converts, Calibrates, and Validates the data before forwarding it to the storage component.
1. The storage component stores the data (usually in the cloud).

The use of connectors allow sensor data, that is coming from various protocols (like TCP, LoRa, JSON, XML, MQTT, SigFox, SPUL), to be send to a central server in a standardized way. This central server, ConCaVa, will process the data in three steps:

1. Convert: use dynamic metadata to parse the binary payload in to usable data.  
	This metadata is determined by given device ID.

1. Calibrate: transform data to a desired format using sandboxed JavaScript function body.

	- Simple example: e.g. convert Fahrenheit to Celcius (`return (value - 32) / 1.8`)
	- Advanced example: transform non-linear measurements to linear data

1. Validate: correct invalid data (e.g. values that are out of sensor range).
