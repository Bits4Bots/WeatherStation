//% weight=90 color=#6ff2ec icon="\uf185"
namespace Bits4Bots_Weather {

    let clkPin: DigitalPin
    let dioPin: DigitalPin

    /**
     * Initialize 4-digit 7-seg TM1637 display
     * @param clk clock pin
     * @param dio data pin
     */
    //% block="init 7-seg display CLK %clk DIO %dio"
    export function initDisplay(clk: DigitalPin, dio: DigitalPin): void {
        clkPin = clk
        dioPin = dio
        tm1637Init()
    }

    /**
     * Show number on 7-seg display
     * @param value number to display (-999 to 9999)
     */
    //% block="show number %value on 7-seg"
    export function showNumber(value: number): void {
        tm1637ShowNumber(value)
    }

    /**
     * Show sensor value on 7-seg display
     * @param sensor select sensor to display
     */
    //% block="show %sensor on 7-seg"
    export function showSensor(sensor: SensorType): void {
        let v = 0
        if (sensor == SensorType.Soil) v = soilMoisture()
        else if (sensor == SensorType.Light) v = lightLevel()
        else if (sensor == SensorType.Temp) v = readDHT11(0)
        else if (sensor == SensorType.Humidity) v = readDHT11(1)
        else if (sensor == SensorType.BMPTemp) v = bmpTemperature()
        showNumber(v)
    }

    /**
     * Cycle through all sensors and display each for 2 seconds
     */
    //% block="cycle all sensor values on 7-seg"
    export function cycleSensors(): void {
        while (true) {
            showSensor(SensorType.Temp)
            basic.pause(2000)
            showSensor(SensorType.Humidity)
            basic.pause(2000)
            showSensor(SensorType.Soil)
            basic.pause(2000)
            showSensor(SensorType.Light)
            basic.pause(2000)
        }
    }

    /**
     * Sensor type dropdown
     */
    export enum SensorType {
        //% block="soil moisture"
        Soil,
        //% block="light level"
        Light,
        //% block="temperature (DHT11)"
        Temp,
        //% block="humidity (DHT11)"
        Humidity,
        //% block="BMP280 temperature"
        BMPTemp
    }

    // ===== TM1637 driver =====
    const TM1637_CMD1 = 0x40
    const TM1637_CMD2 = 0xC0
    const TM1637_CMD3 = 0x88

    let brightness = 7

    const TubeTab = [0x3f, 0x06, 0x5b, 0x4f, 0x66,
        0x6d, 0x7d, 0x07, 0x7f, 0x6f]

    function writeByte(wrData: number) {
        for (let i = 0; i < 8; i++) {
            pins.digitalWritePin(clkPin, 0)
            if (wrData & 0x01)
                pins.digitalWritePin(dioPin, 1)
            else
                pins.digitalWritePin(dioPin, 0)
            wrData >>= 1
            pins.digitalWritePin(clkPin, 1)
        }
        pins.digitalWritePin(clkPin, 0)
        pins.digitalWritePin(dioPin, 1)
        pins.digitalWritePin(clkPin, 1)
    }

    function start() {
        pins.digitalWritePin(clkPin, 1)
        pins.digitalWritePin(dioPin, 1)
        pins.digitalWritePin(dioPin, 0)
        pins.digitalWritePin(clkPin, 0)
    }

    function stop() {
        pins.digitalWritePin(clkPin, 0)
        pins.digitalWritePin(dioPin, 0)
        pins.digitalWritePin(clkPin, 1)
        pins.digitalWritePin(dioPin, 1)
    }

    function tm1637Init() {
        setBrightness(7)
        clear()
    }

    function setBrightness(b: number) {
        brightness = b & 0x07
        start()
        writeByte(TM1637_CMD3 + brightness)
        stop()
    }

    function clear() {
        start()
        writeByte(TM1637_CMD1)
        stop()
        start()
        writeByte(TM1637_CMD2)
        for (let i = 0; i < 4; i++) {
            writeByte(0x00)
        }
        stop()
    }

    function tm1637ShowNumber(num: number) {
        let digits: number[] = [0, 0, 0, 0]
        let isNegative = num < 0
        if (isNegative) num = -num

        for (let i = 3; i >= 0; i--) {
            digits[i] = num % 10
            num = Math.idiv(num, 10)
        }

        start()
        writeByte(TM1637_CMD1)
        stop()

        start()
        writeByte(TM1637_CMD2)
        for (let i = 0; i < 4; i++) {
            if (isNegative && i == 0) writeByte(0x40) // minus sign
            else writeByte(TubeTab[digits[i]])
        }
        stop()
    }

    // ===== Placeholder sensor functions =====
    function soilMoisture(): number {
        return pins.analogReadPin(AnalogPin.P1)
    }

    function lightLevel(): number {
        return input.lightLevel()
    }

    function readDHT11(mode: number): number {
        // Placeholder: replace with actual DHT11 code
        if (mode == 0) return 23 // temp
        return 45 // humidity
    }

    function bmpTemperature(): number {
        // Placeholder: replace with actual BMP280 driver
        return 22
    }
}
