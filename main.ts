/**
 * Bits4Bots Weather Station Extension
 */
//% weight=100 color=#00CACA icon="\uf0c2" block="Weather Station"
namespace Bits4BotsWeatherStation {

/**    let display: TM1637.TM1637LEDs = null */

    /**
     * Initialize the TM1637 display
     * @param clk clock pin, eg: DigitalPin.P0
     * @param dio data pin, eg: DigitalPin.P1
     */
    //% blockId=weatherstation_init block="initialize display with CLK %clk| DIO %dio"
    let TM1637_CMD1 = 0x40;
    let TM1637_CMD2 = 0xC0;
    let TM1637_CMD3 = 0x80;
    let _SEGMENTS = [0x3F, 0x06, 0x5B, 0x4F, 0x66, 0x6D, 0x7D, 0x07, 0x7F, 0x6F, 0x77, 0x7C, 0x39, 0x5E, 0x79, 0x71];

    /**
     * TM1637 LED display
     */
    export class TM1637LEDs {
        buf: Buffer;
        clk: DigitalPin;
        dio: DigitalPin;
        _ON: number;
        brightness: number;
        count: number;  // number of LEDs

     /**
      * initial TM1637
      */
        init(): void {
            pins.digitalWritePin(this.clk, 0);
            pins.digitalWritePin(this.dio, 0);
            this._ON = 8;
            this.buf = pins.createBuffer(this.count);
            this.clear();
    }

    /**
     * Show a number on the TM1637 display
     * @param value number to show, eg: 25
     */
    //% blockId=weatherstation_showNumber block="show number %value on display"
    export function showNumber(value: number): void {
        if (display) {
            display.showNumber(value)
        }
    }

    /**
     * Get micro:bit temperature in °C
     */
    //% blockId=weatherstation_temp block="temperature (°C)"
    export function temperature(): number {
        return input.temperature()
    }

    /**
     * Get light level (0-255)
     */
    //% blockId=weatherstation_light block="light level"
    export function lightLevel(): number {
        return input.lightLevel()
    }

    /**
     * Read soil moisture sensor on pin
     * @param pin analog pin, eg: AnalogPin.P0
     */
    //% blockId=weatherstation_soil block="soil moisture on %pin"
    export function soilMoisture(pin: AnalogPin): number {
        return pins.analogReadPin(pin)
    }

    /**
     * Read humidity sensor on pin
     * @param pin analog pin, eg: AnalogPin.P1
     */
    //% blockId=weatherstation_humidity block="humidity on %pin"
    export function humidity(pin: AnalogPin): number {
        return pins.analogReadPin(pin)
    }

    /**
     * Read wind speed from anemometer (pulses per second)
     * @param pin digital pin, eg: DigitalPin.P8
     */
    //% blockId=weatherstation_wind block="wind speed on %pin"
    export function windSpeed(pin: DigitalPin): number {
        // This is a placeholder: counts rising edges in 1 second
        let count = 0
        pins.setPull(pin, PinPullMode.PullNone)
        pins.onPulsed(pin, PulseValue.High, function () {
            count++
        })
        basic.pause(1000)
        let result = count
        count = 0
        return result
    }
}
