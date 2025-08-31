/**
 * Bits4Bots Weather Station Extension
 */
//% weight=100 color=#00CACA icon="\uf0c2" block="Weather Station"
namespace WeatherStation {

    let display: TM1637.TM1637LEDs = null

    /**
     * Initialize the TM1637 display
     * @param clk clock pin, eg: DigitalPin.P1
     * @param dio data pin, eg: DigitalPin.P2
     */
    //% blockId=weatherstation_init block="initialize display with CLK %clk| DIO %dio"
    export function initDisplay(clk: DigitalPin, dio: DigitalPin): void {
        display = TM1637.create(clk, dio, 7, 4)
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
