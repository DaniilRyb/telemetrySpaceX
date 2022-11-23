import {dataOfTelemetry} from "./data.js";

let buttonStart = document.getElementById("start")
let timer = document.getElementById("timer")
let buttonAbort = document.getElementById("abort")
let buttonReset = document.getElementById("reset")
let messagesLog = document.getElementById("messages")
let speedElement = document.getElementById("speedElement")
let altitudeElement = document.getElementById("altitude")

let speed = 0,
    altitude = 0,
    seconds = 0,
    minutes = 0,
    hours = 0

let time = ''

let intervalTime,
    intervalSpeed,
    intervalAltitude,
    intervalSpeedDown,
    speedCurrentTelemetry,
    cancelAnimationSpeed,
    cancelAnimationAltitude,
    altitudeCurrentTelemetry,
    intervalSpeedCurrentTelemetry,
    intervalAltitudeCurrentTelemetry

const timeout = 50
altitudeElement.innerText = '0.00'
buttonStart.addEventListener("click", () => {

    console.log("Let's start!!!")

    messagesLog.innerHTML = `<div>
            <div class="div_next_stage">
                <h3 class="title_next_stage"><span class="title_next_stage_span">liftoff</span></h3>
            </div>
        <div class="logs">
            <h3 class="title_desc">STARTUP</h3>
            <p class="desc">The Falcon 9 flight computers have taken control of the countdown</p></div>
    </div>`


    /* интервал, отвечающий за текущее время */
    intervalTime = setInterval(() => { // интервал, отвечающий за время старта и полета
        timer.innerText = time =
            (hours < 10 ? '0' + hours : hours) + ":" +
            (minutes < 10 ? '0' + minutes : minutes) + ":" +
            (seconds > 9 ? seconds : "0" + seconds)
        ++seconds
        if (seconds > 59) {
            seconds = 0
            ++minutes
            if (minutes > 59) {
                ++hours
                minutes = 0
            }
        }

        switch (time) {
            case "T+00:00:03": {
                return messagesLog.innerHTML = `<div>
                <div class="div_next_stage">
                <h3 class="title_next_stage"><span class="title_next_stage_span">max-q</span></h3>
            </div>
    <div class="logs">
    <h3 class="liftoff">LIFTOFF</h3>
    <p class="desc">The holddown clamps have released falcon 9 and
        we have begun our flight to low earth orbit</p>
        </div>
        </div>`
            }
            case "T+00:01:17": {
                return messagesLog.innerHTML = `<div>
                <div class="div_next_stage">
                <h3 class="title_next_stage"><span class="title_next_stage_span">meco</span></h3>
            </div>
    <div class="logs">
    <h3 class="liftoff">MAX-Q</h3>
    <p class="desc">maximum dynamic pressure condition is the point when an aerospace vehicle's atmospheric flight 
    reaches the maximum difference between the fluid dynamics total pressure and the ambient static pressure</p>
        </div>
        </div>`
            }
            case "T+00:02:29": {
                return messagesLog.innerHTML = `<div>
    <div class="div_next_stage">
        <h3 class="title_next_stage"><span class="title_next_stage_span">entry</span></h3>
    </div>
    <div class="logs">
        <h3 class="liftoff">MECO</h3>
        <p class="desc">Main engine cutoff Stage 1 of the Falcon 9</p>
    </div>
</div>`
            }
            case "T+00:06:55": {
                return messagesLog.innerHTML = `<div>
        <div class="div_next_stage">
            <h3 class="title_next_stage"><span class="title_next_stage_span">landing</span></h3>
        </div>
        <div class="logs">
            <h3 class="liftoff">ENTRY</h3>
            <p class="desc">The main engines is on to reduce speed stage 1 of the Falcon 9</p>
        </div>
    </div>`
            }
            case "T+00:07:08": {
                return messagesLog.innerHTML = `<div>
        <div class="div_next_stage">
            <h3 class="title_next_stage"><span class="title_next_stage_span">landing!</span></h3>
        </div>
        <div class="logs">
            <h3 class="liftoff">LANDING</h3>
            <p class="desc">Falcon 9 has landed on the platform JTRI</p>
        </div>
    </div>`
            }
        }
    }, timeout)

    let velocity = 0
    let altitudeCount = 0

    /* интервал, отвечающий за текущую скорость */
    intervalSpeed = setInterval(() => {
        velocity = dataOfTelemetry.velocity[speed] * 3.6
        if (Number.isNaN(velocity)) {
            velocity = 0
            clearInterval(intervalTime)
        }
        speedElement.innerText = Math.round(velocity).toString()
        speed += 28
    }, timeout)

    /* интервал, отвечающий за текущую высоту */
    intervalAltitude = setInterval(() => {
        altitudeCount = dataOfTelemetry.altitude[altitude]
        altitudeElement.innerText = altitudeCount.toFixed(2)
        altitude += 28

    }, timeout)

    const startAngle = 5 * Math.PI / 6
    let deltaAngle = 0
    let ctxSpeedCurrent = speedCurrentCanvas.getContext('2d')
    let ctxAltitudeCurrent = altitudeCurrentCanvas.getContext('2d')

    speedCurrentTelemetry = () => {
        intervalSpeedCurrentTelemetry = setInterval(() => {
            deltaAngle = velocity / (Math.PI * 700)
            ctxSpeedCurrent.clearRect(0, 0, 300, 300)
            ctxSpeedCurrent.strokeStyle = 'rgb(255,255,255)'
            ctxSpeedCurrent.beginPath()
            ctxSpeedCurrent.lineWidth = lineWidth
            ctxSpeedCurrent.arc(x, y, radius, startAngle, deltaAngle + startAngle, false)
            ctxSpeedCurrent.stroke()
            ctxSpeedCurrent.fill()
            ctxSpeedCurrent.fillStyle = 'rgba(255,255,255,0)'
        }, 50)
    }

    altitudeCurrentTelemetry = () => {
        intervalAltitudeCurrentTelemetry = setInterval(() => {
            deltaAngle = altitudeCount / (Math.PI * 11)
            ctxAltitudeCurrent.clearRect(0, 0, 300, 300)
            ctxAltitudeCurrent.strokeStyle = 'rgb(255,255,255)'
            ctxAltitudeCurrent.beginPath()
            ctxAltitudeCurrent.lineWidth = lineWidth
            ctxAltitudeCurrent.arc(x, y, radius, startAngle, deltaAngle + startAngle, false)
            ctxAltitudeCurrent.stroke()
            ctxAltitudeCurrent.fill()
            ctxAltitudeCurrent.fillStyle = 'rgba(255,255,255,0)'
        }, 50)
    }

    cancelAnimationSpeed = requestAnimationFrame(speedCurrentTelemetry)
    cancelAnimationAltitude = requestAnimationFrame(altitudeCurrentTelemetry)
})

buttonAbort.addEventListener("click", e => {
    e.preventDefault()
    clearInterval(intervalSpeedDown)
    clearInterval(intervalTime)
    clearInterval(intervalAltitude)
    clearInterval(intervalSpeed)
    clearInterval(intervalSpeedCurrentTelemetry)
    clearInterval(intervalAltitudeCurrentTelemetry)
    cancelAnimationFrame(cancelAnimationSpeed)
    cancelAnimationFrame(cancelAnimationAltitude)
})

buttonReset.addEventListener("click", () => {
    speed = seconds = minutes = hours = altitude = 0
    clearInterval(intervalTime)
    clearInterval(intervalAltitude)
    clearInterval(intervalSpeed)
    clearInterval(intervalSpeedCurrentTelemetry)
    clearInterval(intervalAltitudeCurrentTelemetry)
    cancelAnimationFrame(cancelAnimationSpeed)
    cancelAnimationFrame(cancelAnimationAltitude)

    altitudeElement.innerText = speedElement.innerText = '0'
    timer.innerText = 'T+00:00:00'
})

let speedCurrentCanvas = document.getElementById('circle-speed-current')
let speedCanvas = document.getElementById('circle-speed')

//let color = "rgb(176,9,36)"
let radius = 105
let x = Math.round(speedCurrentCanvas.width / 2)
let y = Math.round(speedCurrentCanvas.height / 2)
let lineWidth = 15

let ctxSpeed = speedCanvas.getContext('2d')
ctxSpeed.strokeStyle = 'rgba(255,255,255,0.22)'
ctxSpeed.beginPath()
ctxSpeed.lineWidth = lineWidth
ctxSpeed.arc(x, y, radius, Math.PI / 6, 5 * Math.PI / 6, true);
ctxSpeed.stroke()

let ctxLimitSpeed = speedCanvas.getContext('2d')
ctxLimitSpeed.strokeStyle = "rgb(176,9,36)"
ctxLimitSpeed.beginPath()
ctxLimitSpeed.lineWidth = lineWidth
ctxLimitSpeed.arc(x, y, radius, Math.PI / 6, 11.5 * Math.PI / 6, true);
ctxLimitSpeed.stroke()

let altitudeCurrentCanvas = document.getElementById('circle-altitude-current')
let altitudeCanvas = document.getElementById('circle-altitude')

let ctx = altitudeCanvas.getContext('2d')
ctx.strokeStyle = 'rgba(255,255,255,0.22)'
ctx.beginPath()
ctx.lineWidth = lineWidth
ctx.arc(x, y, radius, Math.PI / 6, 5 * Math.PI / 6, true);
ctx.stroke();

let ctxLimitAltitude = altitudeCanvas.getContext('2d')
ctxLimitAltitude.strokeStyle = "rgb(176,9,36)"
ctxLimitAltitude.beginPath()
ctxLimitAltitude.lineWidth = lineWidth
ctxLimitAltitude.arc(x, y, radius, Math.PI / 6, 11.5 * Math.PI / 6, true)
ctxLimitAltitude.stroke()
