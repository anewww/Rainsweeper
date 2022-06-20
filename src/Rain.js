

var canvas1 = document.getElementById('canvas1');
var canvas2 = document.getElementById('canvas2');
var canvas3 = document.getElementById('canvas3');
var ctx1 = canvas1.getContext('2d');
var ctx2 = canvas2.getContext('2d');
var ctx3 = canvas3.getContext('2d');

var rainthroughnum = 500;
var speedRainTrough = 25;
var RainTrough = [];

var rainnum = 500;
var rain = [];

var lightning = [];
var lightTimeCurrent = 0;
var lightTimeTotal = 0;

var w = canvas1.width = canvas2.width = canvas3.width = window.innerWidth;
var h = canvas1.height = canvas2.height = canvas3.height = window.innerHeight;

window.addEventListener('resize', function() {
    w = canvas1.width = canvas2.width = canvas3.width = window.innerWidth;
    h = canvas1.height = canvas2.height = canvas3.height = window.innerHeight;
});

export default class Rain {
    constructor() {

    }

    init() {
        this.createRainTrough();
        this.createRain();
        window.addEventListener('resize', this.createRainTrough.bind(this));
    }
    
    animloop() {
        this.animateRainTrough();
        this.animateRain();
        this.animateLightning();
        window.requestAnimationFrame(() => {this.animloop()});
    }

    random(min, max) {
        return Math.random() * (max - min + 1) + min;
    }
    
    clearcanvas1() {
        // this.layer1.remove();
        ctx1.clearRect(0, 0, w, h);
    }
    
    clearcanvas2() {
        // this.layer2.remove();
        ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
    }
    
    clearCanvas3() {

        ctx3.globalCompositeOperation = 'destination-out';
        ctx3.fillStyle = 'rgba(0,0,0,' + this.random(1, 30) / 100 + ')';
        ctx3.fillRect(0, 0, w, h);
        ctx3.globalCompositeOperation = 'source-over';
    };
    
    createRainTrough() {
        for (var i = 0; i < rainthroughnum; i++) {
            RainTrough[i] = {
                x: this.random(0, w),
                y: this.random(0, h),
                length: Math.floor(this.random(1, 830)),
                opacity: Math.random() * 0.2,
                xs: this.random(-2, 2),
                ys: this.random(10, 20)
            };
        }
    }
    
    createRain() {
        for (var i = 0; i < rainnum; i++) {
            rain[i] = {
            x: Math.random() * w,
            y: Math.random() * h,
            l: Math.random() * 1,
            xs: -4 + Math.random() * 4 + 2,
            ys: Math.random() * 10 + 10
            };
        }
    }
    
    createLightning() {
    var x = this.random(100, w - 100);
    var y = this.random(0, h / 4);
    
    var createCount = this.random(1, 3);
    for (var i = 0; i < createCount; i++) {
        let single = {
            x: x,
            y: y,
            xRange: this.random(5, 30),
            yRange: this.random(10, 25),
            path: [{
                x: x,
                y: y
            }],
            pathLimit: this.random(40, 55)
        };
        lightning.push(single);
    }
    };
    
    drawRainTrough(i) {
        ctx1.beginPath();
        var grd = ctx1.createLinearGradient(0, RainTrough[i].y, 0, RainTrough[i].y + RainTrough[i].length);
        grd.addColorStop(0, "rgba(255,255,255,0)");
        grd.addColorStop(1, "rgba(255,255,255," + RainTrough[i].opacity + ")");
        
        ctx1.fillStyle = grd;
        ctx1.fillRect(RainTrough[i].x, RainTrough[i].y, 1, RainTrough[i].length);
        ctx1.fill();
    }
    
    drawRain(i) {
        ctx2.beginPath();
        ctx2.moveTo(rain[i].x, rain[i].y);
        ctx2.lineTo(rain[i].x + rain[i].l * rain[i].xs, rain[i].y + rain[i].l * rain[i].ys);
        ctx2.strokeStyle = 'rgba(174,194,224,0.5)';
        ctx2.lineWidth = 1;
        ctx2.lineCap = 'round';
        ctx2.stroke();
    }
    
    drawLightning() {
        for (var i = 0; i < lightning.length; i++) {
            var light = lightning[i];
        
            light.path.push({
                x: light.path[light.path.length - 1].x + (this.random(0, light.xRange) - (light.xRange / 2)),
                y: light.path[light.path.length - 1].y + (this.random(0, light.yRange))
            });
        
            if (light.path.length > light.pathLimit) {
                lightning.splice(i, 1);
            }
        
            ctx3.strokeStyle = 'rgba(255, 255, 255, .1)';
            ctx3.lineWidth = 3;
            if (this.random(0, 15) === 0) {
                ctx3.lineWidth = 6;
            }
            if (this.random(0, 30) === 0) {
                ctx3.lineWidth = 8;
            }
        
            ctx3.beginPath();
            ctx3.moveTo(light.x, light.y);
            for (var pc = 0; pc < light.path.length; pc++) {
            ctx3.lineTo(light.path[pc].x, light.path[pc].y);
            }
            if (Math.floor(this.random(0, 30)) === 1) { //to fos apo piso
            ctx3.fillStyle = 'rgba(255, 255, 255, ' + this.random(1, 3) / 100 + ')';
            ctx3.fillRect(0, 0, w, h);
            }
            ctx3.lineJoin = 'miter';
            ctx3.stroke();
        }
    };
    
    animateRainTrough() {
        this.clearcanvas1();
        for (var i = 0; i < rainthroughnum; i++) {
            if (RainTrough[i].y >= h) {
            RainTrough[i].y = h - RainTrough[i].y - RainTrough[i].length * 5;
            } else {
            RainTrough[i].y += speedRainTrough;
            }
            this.drawRainTrough(i);
        }
    }
    
    animateRain() {
        this.clearcanvas2();
        for (var i = 0; i < rainnum; i++) {
            rain[i].x += rain[i].xs;
            rain[i].y += rain[i].ys;
            if (rain[i].x > w || rain[i].y > h) {
            rain[i].x = Math.random() * w;
            rain[i].y = -20;
            }
            this.drawRain(i);
        }
    }
    
    animateLightning() {
        this.clearCanvas3();
        lightTimeCurrent++;
        if (lightTimeCurrent >= lightTimeTotal) {
            this.createLightning();
            lightTimeCurrent = 0;
            lightTimeTotal = 200;  //rand(100, 200)
        }
        this.drawLightning();
    }
}