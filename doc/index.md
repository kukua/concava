# ConCaVa

<h3>Configuration driven binary payload processor for Converting, Calibrating, and Validating dynamic sensor data.</h3>

This description is a mouthful, so let's break it down:

1. __Configuration driven:__ instead of writing custom software to handle sensor data, ConCaVa allows you to configure how the data of each device should be processed.
1. __Binary payload processor:__ Sensing sensor data in binary is efficient and cheap, but requires a conversion step (how to make sense of all the ones and zeros).
1. __Converting data:__ Converting bits into numbers.
1. __Calibrating data:__ Custom functionality to alter the data.
1. __Validating data:__ Making sure the data is correct, e.g. lies within the range in which the sensor can measure.
1. __Dynamic sensor data:__ Allowing different sensors to send their data to a single endpoint, no matter what the data format is.

## Challenges

Efficiently processing sensor data of a big variety of devices is hard. But there is plenty of room of doing it in a generic way. That's where ConCaVa comes into play. These are the common challenges:

1. __Limited bandwidth.__ When sensors are sending over 3G or LoRa, bandwidth is limited. In these situations the amount of data must be brought to a minimum. Using formats like XML or JSON includes the data format, which costs extra bytes. Binary is the most efficient way of sending sensor data, however introduces other challenges like data conversion.
1. __Converting data.__ Sensors provide different types of data and often via different protocols (LoRa, MQTT, SigFox, etc.). This data needs to be converted. Usually done by software that is specifically developed for that use case.
1. __Calibrating data.__ Measurements require different types of calibration. E.g. sending a temperature as 16bit integer and dividing it by 100 to get a two decimal precision.
1. __Validating data.__ Each type of sensor is validated differently. E.g. checking if the measurement of a temperature sensor lies between its maximum bounds of -40°C and +85°C. If below or above, correct or discard the data. Each of these rules are implemented seperately.
1. __Scalability.__ Adding new devices with different protocols requires changing the software that handles the incoming data.

The first point is solved by using binary data, points 2, 3, and 4 are solved by ConCaVa, and point 5 is solved by using a configuration driven approach.

## Dataflow

Before going into detail, it is important to know how the data flows through a system that's using ConCaVa:

![Dataflow](https://raw.githubusercontent.com/kukua/concava/master/doc/dataflow.jpg)

Sensors send their binary payload to the ConCaVa [HTTP API endpoint](api.md). If a sensor communicates via a different protocol (LoRa, SPUL, MQTT, etc.) a [connector](configuration.md#connectors) can be used to forward the data to ConCaVa, so the convert, calibrate, and validate steps can still be utilized. The image above shows usage of the [SPUL protocol and connector](http://kukua.github.io/concava-connector-spul/).

In the next chapters the installation and configuration will be handled.

---

For contributing, providing feedback, or support please go to the [Github repository](https://github.com/kukua/concava).<br/>
See the [introduction slides](https://rawgit.com/kukua/concava-intro/master/index.html) for a quick overview of ConCaVa.
