
// Bits4Bots Weather Station Extension
// TM1637 support + sensors
// Company: Bits4Bots

//% color="#00CED1" icon=""
namespace weatherstation {
    //% block="show number %num on display"
    export function showNumber(num: number): void {
        tm1637.showNumber(num)
    }

    //% block="show temperature %temp °C"
    export function showTemperature(temp: number): void {
        tm1637.showNumber(temp)
    }

    //% block="show humidity %humidity %%"
    export function showHumidity(humidity: number): void {
        tm1637.showNumber(humidity)
    }

    //% block="show soil moisture %moisture"
    export function showSoilMoisture(moisture: number): void {
        tm1637.showNumber(moisture)
    }

    //% block="show light %light"
    export function showLight(light: number): void {
        tm1637.showNumber(light)
    }

    //% block="show wind speed %wind m/s"
    export function showWind(wind: number): void {
        tm1637.showNumber(wind)
    }
}
