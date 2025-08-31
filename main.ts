/**
 * Bits4Bots Weather Station Extension
 * 
 * Includes support for TM1637 4-digit display + Weather Station sensors.
 * 
 * Based on the original TM1637 extension:
 * https://github.com/makecode-extensions/TM1637
 * 
 * Credits to the MakeCode community for TM1637 driver logic.
 */
//% weight=100 color=#00CFFF icon="\uf0c2" block="Bits4Bots Weather Station"
namespace bits4bots {

    /**
     * TM1637 4-digit display driver
     */
    export class TM1637 {
        clk: DigitalPin;
        dio: DigitalPin;
        brightnessLevel: number;
        buf: Buffer;

        constructor(clk: DigitalPin, dio: DigitalPin) {
            this.clk = clk;
            this.dio = dio;
            this.brightnessLevel = 7;
            this.buf = pins.createBuffer(4);
            this.init();
        }

        private init() {
            this.setBrightness(7);
            this.clear();
        }

        private writeByte(b: number) {
            for (let i = 0; i < 8; i++) {
                pins.digitalWritePin(this.clk, 0);
                pins.digitalWritePin(this.dio, (b >> i) & 1);
                pins.digitalWritePin(this.clk, 1);
            }
            pins.digitalWritePin(this.clk, 0);
            pins.digitalReadPin(this.dio);
            pins.digitalWritePin(this.clk, 1);
        }

        private start() {
            pins.digitalWritePin(this.clk, 1);
            pins.digitalWritePin(this.dio, 1);
            pins.digitalWritePin(this.dio, 0);
            pins.digitalWritePin(this.clk, 0);
        }

        private stop() {
            pins.digitalWritePin(this.clk, 0);
            pins.digitalWritePin(this.dio, 0);
            pins.digitalWritePin(this.clk, 1);
            pins.digitalWritePin(this.dio, 1);
        }

        private coding(d: number): number {
            const TubeTab = [
                0x3f, 0x06, 0x5b, 0x4f,
                0x66, 0x6d, 0x7d, 0x07,
                0x7f, 0x6f, 0x77, 0x7c,
                0x39, 0x5e, 0x79, 0x71
            ];
            return TubeTab[d];
        }

        //% blockId="TM1637_showNumber" block="TM1637 show number %num"
        //% weight=90
        showNumber(num: number) {
            let n = Math.abs(num);
            for (let i = 0; i < 4; i++) {
                this.buf[i] = this.coding(n % 10);
                n = Math.idiv(n, 10);
            }
            this.display();
        }

        private display() {
            this.start();
            this.writeByte(0x40);
            this.stop();
            this.start();
            this.writeByte(0xc0);
            for (let i = 0; i < 4; i++) {
                this.writeByte(this.buf[i]);
            }
            this.stop();
            this.start();
            this.writeByte(0x88 + this.brightnessLevel);
            this.stop();
        }

        //% blockId="TM1637_clear" block="TM1637 clear"
        clear() {
            for (let i = 0; i < 4; i++) this.buf[i] = 0;
            this.display();
        }

        //% blockId="TM1637_brightness" block="TM1637 brightness %level"
        setBrightness(level: number) {
            this.brightnessLevel = Math.constrain(level, 0, 7);
        }
    }

    //% blockId="TM1637_create" block="create TM1637 with CLK %clk|DIO %dio"
    //% weight=100
    export function createTM1637(clk: DigitalPin, dio: DigitalPin): TM1637 {
        return new TM1637(clk, dio);
    }

    /**
     * Weather Station Sensors
     */

    //% blockId="weather_temp" block="read temperature (C) at pin %pin"
    export function readTemperature(pin: AnalogPin): number {
        return pins.analogReadPin(pin) * (3.3 / 1023) * 100; // Example formula
    }

    //% blockId="weather_humidity" block="read humidity at pin %pin"
    export function readHumidity(pin: AnalogPin): number {
        return pins.analogReadPin(pin) / 10; // Example placeholder
    }

    //% blockId="weather_soil" block="read soil moisture at pin %pin"
    export function readSoil(pin: AnalogPin): number {
        return pins.analogReadPin(pin);
    }

    //% blockId="weather_light" block="read light level at pin %pin"
    export function readLight(pin: AnalogPin): number {
        return pins.analogReadPin(pin);
    }

    //% blockId="weather_wind" block="read wind speed at pin %pin"
    export function readWind(pin: DigitalPin): number {
        // Example: counts pulses
        let count = 0;
        const start = input.runningTime();
        while (input.runningTime() - start < 1000) {
            if (pins.digitalReadPin(pin) == 1) {
                count++;
                basic.pause(10);
            }
        }
        return count;
    }
}
