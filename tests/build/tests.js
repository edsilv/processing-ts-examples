
define('../../src/././utils/Color',["require", "exports"], function(require, exports) {
    var Color = (function () {
        function Color() {
        }
        Color.float32ColorToARGB = function (float32Color) {
            var a = (float32Color & 0xff000000) >>> 24;
            var r = (float32Color & 0xff0000) >>> 16;
            var g = (float32Color & 0xff00) >>> 8;
            var b = float32Color & 0xff;
            var result = [a, r, g, b];

            return result;
        };

        Color.componentToHex = function (c) {
            var hex = c.toString(16);
            return hex.length == 1 ? "0" + hex : hex;
        };

        Color.RGBToHexString = function (rgb) {
            Color.coalesce(rgb);
            return "#" + Color.componentToHex(rgb[0]) + Color.componentToHex(rgb[1]) + Color.componentToHex(rgb[2]);
        };

        Color.ARGBToHexString = function (argb) {
            return "#" + Color.componentToHex(argb[0]) + Color.componentToHex(argb[1]) + Color.componentToHex(argb[2]) + Color.componentToHex(argb[3]);
        };

        Color.coalesce = function (arr) {
            for (var i = 1; i < arr.length; i++) {
                if (typeof (arr[i]) === 'undefined')
                    arr[i] = arr[i - 1];
            }
        };
        return Color;
    })();

    
    return Color;
});

define('../../src/./pgraphics',["require", "exports", "./utils/Color"], function(require, exports, __colorUtils__) {
    var colorUtils = __colorUtils__;

    (function (RectMode) {
        RectMode[RectMode["CORNER"] = 0] = "CORNER";
        RectMode[RectMode["CORNERS"] = 1] = "CORNERS";
        RectMode[RectMode["RADIUS"] = 2] = "RADIUS";
        RectMode[RectMode["CENTER"] = 3] = "CENTER";
    })(exports.RectMode || (exports.RectMode = {}));
    var RectMode = exports.RectMode;
    (function (EllipseMode) {
        EllipseMode[EllipseMode["CORNER"] = 0] = "CORNER";
        EllipseMode[EllipseMode["CORNERS"] = 1] = "CORNERS";
        EllipseMode[EllipseMode["RADIUS"] = 2] = "RADIUS";
        EllipseMode[EllipseMode["CENTER"] = 3] = "CENTER";
    })(exports.EllipseMode || (exports.EllipseMode = {}));
    var EllipseMode = exports.EllipseMode;

    var PGraphics = (function () {
        function PGraphics() {
        }
        PGraphics.init = function () {
            window.background = PGraphics.background;
            window.ellipse = PGraphics.ellipse;
            window.ellipseMode = PGraphics.ellipseMode;
            window.fill = PGraphics.fill;
            window.line = PGraphics.line;
            window.noFill = PGraphics.noFill;
            window.noStroke = PGraphics.noStroke;
            window.popMatrix = PGraphics.popMatrix;
            window.pushMatrix = PGraphics.pushMatrix;
            window.rect = PGraphics.rect;
            window.rectMode = PGraphics.rectMode;
            window.rotate = PGraphics.rotate;
            window.scale = PGraphics.scale;
            window.stroke = PGraphics.stroke;
            window.strokeWeight = PGraphics.strokeWeight;
            window.text = PGraphics.text;
            window.translate = PGraphics.translate;

            window.mouseX = null;
            window.mouseY = null;
        };

        PGraphics.background = function (r, g, b) {
            PGraphics.fill(r, g, b);
            PGraphics.rect(0, 0, width, height);
            PGraphics.noFill();
        };

        PGraphics.drawPath = function () {
            if (PGraphics.fillEnabled)
                context.fill();
            if (PGraphics.strokeEnabled)
                context.stroke();
        };

        PGraphics.ellipse = function (x, y, w, h) {
            if (!h)
                h = w;

            switch (PGraphics.currentEllipseMode) {
                case EllipseMode.CORNER:
                    x += (w / 2);
                    y += (h / 2);
                    break;
                case EllipseMode.CORNERS:
                    w *= 0.5;
                    h *= 0.5;
                    x += (w / 2);
                    y += (h / 2);
                    break;
                case EllipseMode.RADIUS:
                    w *= 2;
                    h *= 2;
                    break;
            }

            if (w === h) {
                context.beginPath();
                context.arc(x, y, w / 2, 0, Math.TAU, false);
                context.closePath();

                PGraphics.drawPath();

                return;
            }

            context.save();

            var r = (h / 2) / (w / 2) || 1;
            context.scale(1, r);
            context.beginPath();
            context.arc(x, y / r, w / 2, 0, Math.TAU, false);
            context.closePath();

            PGraphics.drawPath();

            context.restore();
        };

        PGraphics.ellipseMode = function (mode) {
            PGraphics.currentEllipseMode = mode;
        };

        PGraphics.fill = function (r, g, b) {
            PGraphics.fillEnabled = true;
            PGraphics.setFillStyle(r, g, b);
        };

        PGraphics.line = function (fromX, fromY, toX, toY) {
            context.beginPath();
            context.moveTo(fromX, fromY);
            context.lineTo(toX, toY);
            context.stroke();
        };

        PGraphics.noFill = function () {
            PGraphics.fillEnabled = false;
        };

        PGraphics.noStroke = function () {
            PGraphics.strokeEnabled = false;
        };

        PGraphics.popMatrix = function () {
            context.restore();
        };

        PGraphics.pushMatrix = function () {
            context.save();
        };

        PGraphics.rect = function (x, y, w, h) {
            context.beginPath();

            switch (PGraphics.currentRectMode) {
                case RectMode.CORNERS:
                    w -= x;
                    h -= y;
                    break;
                case RectMode.RADIUS:
                    x -= w;
                    y -= h;
                    w *= 2;
                    h *= 2;
                    break;
                case RectMode.CENTER:
                    x -= (w / 2);
                    y -= (h / 2);
                    break;
            }

            context.rect(x, y, w, h);

            context.closePath();

            PGraphics.drawPath();
        };

        PGraphics.rectMode = function (mode) {
            PGraphics.currentRectMode = mode;
        };

        PGraphics.rotate = function (angle) {
            context.rotate(angle);
        };

        PGraphics.scale = function (xScale, yScale) {
            context.scale(xScale, yScale);
        };

        PGraphics.setFillStyle = function (r, g, b) {
            context.fillStyle = colorUtils.RGBToHexString([r, g, b]);
        };

        PGraphics.setLineWidth = function (width) {
            context.lineWidth = width;
        };

        PGraphics.setStrokeStyle = function (r, g, b) {
            context.strokeStyle = colorUtils.RGBToHexString([r, g, b]);
        };

        PGraphics.stroke = function (r, g, b) {
            PGraphics.strokeEnabled = true;
            PGraphics.setStrokeStyle(r, g, b);
        };

        PGraphics.strokeWeight = function (weight) {
            PGraphics.setLineWidth(weight);
        };

        PGraphics.text = function (text, x, y) {
            context.fillText(text, x, y);
        };

        PGraphics.translate = function (x, y) {
            context.translate(x, y);
        };
        PGraphics.currentRectMode = RectMode.CORNER;
        PGraphics.currentEllipseMode = EllipseMode.CENTER;
        PGraphics.fillEnabled = false;
        PGraphics.strokeEnabled = false;
        return PGraphics;
    })();
    exports.PGraphics = PGraphics;
});

define('../../src/./pmath',["require", "exports"], function(require, exports) {
    var PMath = (function () {
        function PMath() {
        }
        PMath.init = function () {
            window.acos = PMath.acos;
            window.asin = PMath.asin;
            window.atan = PMath.atan;
            window.atan2 = PMath.atan2;
            window.clamp = PMath.clamp;
            window.constrain = PMath.constrain;
            window.cos = PMath.cos;
            window.degrees = PMath.degrees;
            window.dist = PMath.dist;
            window.lerp = PMath.lerp;
            window.mag = PMath.mag;
            window.map = PMath.map;
            window.norm = PMath.norm;
            window.radians = PMath.radians;
            window.random = PMath.random;
            window.sin = PMath.sin;
            window.sq = PMath.sq;
            window.tan = PMath.tan;
        };

        PMath.acos = function (angle) {
            return Math.acos(angle);
        };

        PMath.asin = function (angle) {
            return Math.asin(angle);
        };

        PMath.atan = function (angle) {
            return Math.atan(angle);
        };

        PMath.atan2 = function (y, x) {
            return Math.atan2(y, x);
        };

        PMath.clamp = function (amt, low, high) {
            return Math.min(Math.max(amt, low), high);
        };

        PMath.constrain = function (amt, low, high) {
            return clamp(amt, low, high);
        };

        PMath.cos = function (angle) {
            return Math.cos(angle);
        };

        PMath.degrees = function (radians) {
            return (radians * 360) / Math.TAU;
        };

        PMath.dist = function (x1, y1, x2, y2) {
            return Math.sqrt(sq(x2 - x1) + sq(y2 - y1));
        };

        PMath.lerp = function (start, stop, amt) {
            return start + (stop - start) * amt;
        };

        PMath.mag = function (a, b, c) {
            return Math.sqrt(a * a + b * b + c * c);
        };

        PMath.map = function (value, start1, stop1, start2, stop2) {
            return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));
        };

        PMath.norm = function (value, start, stop) {
            return (value - start) / (stop - start);
        };

        PMath.radians = function (degrees) {
            return Math.TAU * (degrees / 360);
        };

        PMath.random = function (low, high) {
            if (!high) {
                high = low;
                low = 0;
            }

            if (low >= high)
                return low;

            return low + (high - low) * Math.random();
        };

        PMath.sin = function (angle) {
            return Math.sin(angle);
        };

        PMath.sq = function (n) {
            return n * n;
        };

        PMath.tan = function (angle) {
            return Math.tan(angle);
        };
        return PMath;
    })();
    exports.PMath = PMath;
});

define('../../src/./pvector',["require", "exports"], function(require, exports) {
    var PVector = (function () {
        function PVector(x, y) {
            this.x = x;
            this.y = y;
        }
        PVector.prototype.get = function () {
            return new PVector(this.x, this.y);
        };

        PVector.prototype.set = function (x, y) {
            this.x = x;
            this.y = y;
        };

        PVector.prototype.add = function (v) {
            this.x += v.x;
            this.y += v.y;
        };

        PVector.add = function (v1, v2) {
            return new PVector(v1.x + v2.x, v1.y + v2.y);
        };

        PVector.prototype.sub = function (v) {
            this.x -= v.x;
            this.y -= v.y;
        };

        PVector.sub = function (v1, v2) {
            return new PVector(v1.x - v2.x, v1.y - v2.y);
        };

        PVector.prototype.mult = function (n) {
            this.x = this.x * n;
            this.y = this.y * n;
        };

        PVector.mult = function (v1, v2) {
            return new PVector(v1.x * v2.x, v1.y * v2.y);
        };

        PVector.multN = function (v1, n) {
            return new PVector(v1.x * n, v1.y * n);
        };

        PVector.prototype.div = function (n) {
            this.x = this.x / n;
            this.y = this.y / n;
        };

        PVector.div = function (v1, v2) {
            return new PVector(v1.x / v2.x, v1.y / v2.y);
        };

        PVector.divN = function (v1, n) {
            return new PVector(v1.x / n, v1.y / n);
        };

        PVector.prototype.mag = function () {
            return Math.sqrt(this.x * this.x + this.y * this.y);
        };

        PVector.prototype.magSq = function () {
            return (this.x * this.x + this.y * this.y);
        };

        PVector.prototype.normalize = function () {
            var m = this.mag();
            if (m != 0 && m != 1) {
                this.div(m);
            }
        };

        PVector.prototype.limit = function (max) {
            if (this.magSq() > max * max) {
                this.normalize();
                this.mult(max);
            }
        };

        PVector.prototype.heading = function () {
            var angle = Math.atan2(-this.y, this.x);
            return -1 * angle;
        };

        PVector.random2D = function () {
            return PVector.fromAngle((Math.random() * Math.TAU));
        };

        PVector.fromAngle = function (angle) {
            return new PVector(Math.cos(angle), Math.sin(angle));
        };
        return PVector;
    })();

    
    return PVector;
});

define('../../src/./utils/events',["require", "exports"], function(require, exports) {
    var Events = (function () {
        function Events() {
        }
        Events.addEventListener = function (obj, evt, fnc) {
            if (obj.addEventListener) {
                obj.addEventListener(evt, fnc, false);
                return true;
            } else if (obj.attachEvent) {
                return obj.attachEvent('on' + evt, fnc);
            } else {
                evt = 'on' + evt;
                if (typeof obj[evt] === 'function') {
                    fnc = (function (f1, f2) {
                        return function () {
                            f1.apply(this, arguments);
                            f2.apply(this, arguments);
                        };
                    })(obj[evt], fnc);
                }
                obj[evt] = fnc;
                return true;
            }
            return false;
        };
        return Events;
    })();

    
    return Events;
});

define('../../src/./utils/extensions',["require", "exports"], function(require, exports) {
    var Extensions = (function () {
        function Extensions() {
        }
        Extensions.init = function () {
            var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
            window.requestAnimationFrame = requestAnimationFrame;

            Math.TAU = Math.PI * 2;

            String.prototype.format = function () {
                var s = arguments[0];
                for (var i = 0; i < arguments.length - 1; i++) {
                    var reg = new RegExp("\\{" + i + "\\}", "gm");
                    s = s.replace(reg, arguments[i + 1]);
                }

                return s;
            };

            String.prototype.startsWith = function (str) {
                return this.indexOf(str) == 0;
            };
            String.prototype.trim = function () {
                return this.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
            };
            String.prototype.ltrim = function () {
                return this.replace(/^\s+/, '');
            };
            String.prototype.rtrim = function () {
                return this.replace(/\s+$/, '');
            };
            String.prototype.fulltrim = function () {
                return this.replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g, '').replace(/\s+/g, ' ');
            };
            String.prototype.toFileName = function () {
                return this.replace(/[^a-z0-9]/gi, '_').toLowerCase();
            };

            if (!Array.prototype.indexOf) {
                Array.prototype.indexOf = function (searchElement, fromIndex) {
                    var i = (fromIndex || 0);
                    var j = this.length;

                    for (i; i < j; i++) {
                        if (this[i] === searchElement) {
                            return i;
                        }
                    }
                    return -1;
                };
            }

            Array.prototype.clone = function () {
                return this.slice(0);
            };

            if (!Array.prototype.last) {
                Array.prototype.last = function () {
                    return this[this.length - 1];
                };
            }
            ;
        };
        return Extensions;
    })();

    
    return Extensions;
});

define('../../src/sketch',["require", "exports", "./pgraphics", "./pmath", "./pvector", "./utils/events", "./utils/extensions"], function(require, exports, __graphics__, __math__, __vector__, __events__, __extensions__) {
    var graphics = __graphics__;
    var math = __math__;
    var vector = __vector__;
    var events = __events__;
    var extensions = __extensions__;

    var Sketch = (function () {
        function Sketch() {
            var _this = this;
            this.container = document.getElementById('main');
            canvas = document.createElement('canvas');

            while (this.container.hasChildNodes()) {
                this.container.removeChild(this.container.lastChild);
            }

            this.container.appendChild(canvas);

            if (!canvas.getContext) {
                alert('Your browser does not support Canvas, sorry!');
                return;
            }

            if (typeof requestAnimationFrame === 'undefined') {
                alert('Your browser does not support Canvas animations, sorry!');
                return;
            }

            context = canvas.getContext('2d');

            events.addEventListener(this.container, 'mousemove', function (e) {
                mouseX = e.offsetX;
                mouseY = e.offsetY;
            });

            events.addEventListener(this.container, 'mousedown', function (e) {
                _this.mousePressed();
            });

            events.addEventListener(this.container, 'mouseup', function (e) {
                _this.mouseReleased();
            });

            events.addEventListener(window, 'resize', function (e) {
                _this.resize();
            });

            this.resize();

            extensions.init();
            graphics.PGraphics.init();
            math.PMath.init();

            frameCount = 0;

            requestAnimationFrame(function (timestamp) {
                return _this.tick(timestamp);
            });

            this.setup();
        }
        Sketch.prototype.tick = function (timestamp) {
            var _this = this;
            if (!this.startTime)
                this.startTime = timestamp;

            millis = timestamp - this.startTime;
            frameCount++;

            this.reset();
            this.draw();

            requestAnimationFrame(function (timestamp) {
                return _this.tick(timestamp);
            });
        };

        Sketch.prototype.reset = function () {
            context.setTransform(1, 0, 0, 1, 0, 0);

            context.clearRect(0, 0, width, height);

            noFill();
            noStroke();
            rectMode(graphics.RectMode.CORNER);
            ellipseMode(graphics.EllipseMode.RADIUS);
        };

        Sketch.prototype.setup = function () {
        };
        Sketch.prototype.draw = function () {
        };
        Sketch.prototype.mousePressed = function () {
        };
        Sketch.prototype.mouseReleased = function () {
        };

        Sketch.prototype.resize = function () {
            canvas.width = width = this.container.clientWidth;
            canvas.height = height = this.container.clientHeight;
        };
        return Sketch;
    })();

    
    return Sketch;
});

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define('rect',["require", "exports", "../../src/sketch"], function(require, exports, __Sketch__) {
    
    var Sketch = __Sketch__;

    var Rect = (function (_super) {
        __extends(Rect, _super);
        function Rect() {
            _super.apply(this, arguments);
        }
        Rect.prototype.setup = function () {
        };

        Rect.prototype.draw = function () {
            background(225);

            fill(255, 0);
            stroke(0, 0, 255);
            rect(25, 25, 50, 50);
        };
        return Rect;
    })(Sketch);

    
    return Rect;
});

define('../../src/./utils/Color',["require", "exports"], function(require, exports) {
    var Color = (function () {
        function Color() {
        }
        Color.float32ColorToARGB = function (float32Color) {
            var a = (float32Color & 0xff000000) >>> 24;
            var r = (float32Color & 0xff0000) >>> 16;
            var g = (float32Color & 0xff00) >>> 8;
            var b = float32Color & 0xff;
            var result = [a, r, g, b];

            return result;
        };

        Color.componentToHex = function (c) {
            var hex = c.toString(16);
            return hex.length == 1 ? "0" + hex : hex;
        };

        Color.RGBToHexString = function (rgb) {
            Color.coalesce(rgb);
            return "#" + Color.componentToHex(rgb[0]) + Color.componentToHex(rgb[1]) + Color.componentToHex(rgb[2]);
        };

        Color.ARGBToHexString = function (argb) {
            return "#" + Color.componentToHex(argb[0]) + Color.componentToHex(argb[1]) + Color.componentToHex(argb[2]) + Color.componentToHex(argb[3]);
        };

        Color.coalesce = function (arr) {
            for (var i = 1; i < arr.length; i++) {
                if (typeof (arr[i]) === 'undefined')
                    arr[i] = arr[i - 1];
            }
        };
        return Color;
    })();

    
    return Color;
});

define('../../src/pgraphics',["require", "exports", "./utils/Color"], function(require, exports, __colorUtils__) {
    var colorUtils = __colorUtils__;

    (function (RectMode) {
        RectMode[RectMode["CORNER"] = 0] = "CORNER";
        RectMode[RectMode["CORNERS"] = 1] = "CORNERS";
        RectMode[RectMode["RADIUS"] = 2] = "RADIUS";
        RectMode[RectMode["CENTER"] = 3] = "CENTER";
    })(exports.RectMode || (exports.RectMode = {}));
    var RectMode = exports.RectMode;
    (function (EllipseMode) {
        EllipseMode[EllipseMode["CORNER"] = 0] = "CORNER";
        EllipseMode[EllipseMode["CORNERS"] = 1] = "CORNERS";
        EllipseMode[EllipseMode["RADIUS"] = 2] = "RADIUS";
        EllipseMode[EllipseMode["CENTER"] = 3] = "CENTER";
    })(exports.EllipseMode || (exports.EllipseMode = {}));
    var EllipseMode = exports.EllipseMode;

    var PGraphics = (function () {
        function PGraphics() {
        }
        PGraphics.init = function () {
            window.background = PGraphics.background;
            window.ellipse = PGraphics.ellipse;
            window.ellipseMode = PGraphics.ellipseMode;
            window.fill = PGraphics.fill;
            window.line = PGraphics.line;
            window.noFill = PGraphics.noFill;
            window.noStroke = PGraphics.noStroke;
            window.popMatrix = PGraphics.popMatrix;
            window.pushMatrix = PGraphics.pushMatrix;
            window.rect = PGraphics.rect;
            window.rectMode = PGraphics.rectMode;
            window.rotate = PGraphics.rotate;
            window.scale = PGraphics.scale;
            window.stroke = PGraphics.stroke;
            window.strokeWeight = PGraphics.strokeWeight;
            window.text = PGraphics.text;
            window.translate = PGraphics.translate;

            window.mouseX = null;
            window.mouseY = null;
        };

        PGraphics.background = function (r, g, b) {
            PGraphics.fill(r, g, b);
            PGraphics.rect(0, 0, width, height);
            PGraphics.noFill();
        };

        PGraphics.drawPath = function () {
            if (PGraphics.fillEnabled)
                context.fill();
            if (PGraphics.strokeEnabled)
                context.stroke();
        };

        PGraphics.ellipse = function (x, y, w, h) {
            if (!h)
                h = w;

            switch (PGraphics.currentEllipseMode) {
                case EllipseMode.CORNER:
                    x += (w / 2);
                    y += (h / 2);
                    break;
                case EllipseMode.CORNERS:
                    w *= 0.5;
                    h *= 0.5;
                    x += (w / 2);
                    y += (h / 2);
                    break;
                case EllipseMode.RADIUS:
                    w *= 2;
                    h *= 2;
                    break;
            }

            if (w === h) {
                context.beginPath();
                context.arc(x, y, w / 2, 0, Math.TAU, false);
                context.closePath();

                PGraphics.drawPath();

                return;
            }

            context.save();

            var r = (h / 2) / (w / 2) || 1;
            context.scale(1, r);
            context.beginPath();
            context.arc(x, y / r, w / 2, 0, Math.TAU, false);
            context.closePath();

            PGraphics.drawPath();

            context.restore();
        };

        PGraphics.ellipseMode = function (mode) {
            PGraphics.currentEllipseMode = mode;
        };

        PGraphics.fill = function (r, g, b) {
            PGraphics.fillEnabled = true;
            PGraphics.setFillStyle(r, g, b);
        };

        PGraphics.line = function (fromX, fromY, toX, toY) {
            context.beginPath();
            context.moveTo(fromX, fromY);
            context.lineTo(toX, toY);
            context.stroke();
        };

        PGraphics.noFill = function () {
            PGraphics.fillEnabled = false;
        };

        PGraphics.noStroke = function () {
            PGraphics.strokeEnabled = false;
        };

        PGraphics.popMatrix = function () {
            context.restore();
        };

        PGraphics.pushMatrix = function () {
            context.save();
        };

        PGraphics.rect = function (x, y, w, h) {
            context.beginPath();

            switch (PGraphics.currentRectMode) {
                case RectMode.CORNERS:
                    w -= x;
                    h -= y;
                    break;
                case RectMode.RADIUS:
                    x -= w;
                    y -= h;
                    w *= 2;
                    h *= 2;
                    break;
                case RectMode.CENTER:
                    x -= (w / 2);
                    y -= (h / 2);
                    break;
            }

            context.rect(x, y, w, h);

            context.closePath();

            PGraphics.drawPath();
        };

        PGraphics.rectMode = function (mode) {
            PGraphics.currentRectMode = mode;
        };

        PGraphics.rotate = function (angle) {
            context.rotate(angle);
        };

        PGraphics.scale = function (xScale, yScale) {
            context.scale(xScale, yScale);
        };

        PGraphics.setFillStyle = function (r, g, b) {
            context.fillStyle = colorUtils.RGBToHexString([r, g, b]);
        };

        PGraphics.setLineWidth = function (width) {
            context.lineWidth = width;
        };

        PGraphics.setStrokeStyle = function (r, g, b) {
            context.strokeStyle = colorUtils.RGBToHexString([r, g, b]);
        };

        PGraphics.stroke = function (r, g, b) {
            PGraphics.strokeEnabled = true;
            PGraphics.setStrokeStyle(r, g, b);
        };

        PGraphics.strokeWeight = function (weight) {
            PGraphics.setLineWidth(weight);
        };

        PGraphics.text = function (text, x, y) {
            context.fillText(text, x, y);
        };

        PGraphics.translate = function (x, y) {
            context.translate(x, y);
        };
        PGraphics.currentRectMode = RectMode.CORNER;
        PGraphics.currentEllipseMode = EllipseMode.CENTER;
        PGraphics.fillEnabled = false;
        PGraphics.strokeEnabled = false;
        return PGraphics;
    })();
    exports.PGraphics = PGraphics;
});

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define('rectMode',["require", "exports", "../../src/pgraphics", "../../src/sketch"], function(require, exports, __graphics__, __Sketch__) {
    var graphics = __graphics__;
    var Sketch = __Sketch__;

    var RectMode = (function (_super) {
        __extends(RectMode, _super);
        function RectMode() {
            _super.apply(this, arguments);
        }
        RectMode.prototype.setup = function () {
        };

        RectMode.prototype.draw = function () {
            background(225);

            rectMode(graphics.RectMode.CORNER);
            fill(255);
            rect(25, 25, 50, 50);

            rectMode(graphics.RectMode.CORNERS);
            fill(100);
            rect(25, 25, 50, 50);

            rectMode(graphics.RectMode.RADIUS);
            fill(255);
            rect(50, 125, 25, 25);

            rectMode(graphics.RectMode.CENTER);
            fill(100);
            rect(50, 125, 25, 25);
        };
        return RectMode;
    })(Sketch);

    
    return RectMode;
});

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define('ellipseMode',["require", "exports", "../../src/pgraphics", "../../src/sketch"], function(require, exports, __graphics__, __Sketch__) {
    var graphics = __graphics__;
    var Sketch = __Sketch__;

    var EllipseMode = (function (_super) {
        __extends(EllipseMode, _super);
        function EllipseMode() {
            _super.apply(this, arguments);
        }
        EllipseMode.prototype.setup = function () {
        };

        EllipseMode.prototype.draw = function () {
            background(225);

            stroke(0);

            ellipseMode(graphics.EllipseMode.RADIUS);
            fill(255);
            ellipse(50, 50, 30, 30);

            ellipseMode(graphics.EllipseMode.CENTER);
            fill(100);
            ellipse(50, 50, 30, 30);

            ellipseMode(graphics.EllipseMode.CORNER);
            fill(255);
            ellipse(25, 100, 50, 50);

            ellipseMode(graphics.EllipseMode.CORNERS);
            fill(100);
            ellipse(25, 100, 50, 50);
        };
        return EllipseMode;
    })(Sketch);

    
    return EllipseMode;
});

define('../../src/pvector',["require", "exports"], function(require, exports) {
    var PVector = (function () {
        function PVector(x, y) {
            this.x = x;
            this.y = y;
        }
        PVector.prototype.get = function () {
            return new PVector(this.x, this.y);
        };

        PVector.prototype.set = function (x, y) {
            this.x = x;
            this.y = y;
        };

        PVector.prototype.add = function (v) {
            this.x += v.x;
            this.y += v.y;
        };

        PVector.add = function (v1, v2) {
            return new PVector(v1.x + v2.x, v1.y + v2.y);
        };

        PVector.prototype.sub = function (v) {
            this.x -= v.x;
            this.y -= v.y;
        };

        PVector.sub = function (v1, v2) {
            return new PVector(v1.x - v2.x, v1.y - v2.y);
        };

        PVector.prototype.mult = function (n) {
            this.x = this.x * n;
            this.y = this.y * n;
        };

        PVector.mult = function (v1, v2) {
            return new PVector(v1.x * v2.x, v1.y * v2.y);
        };

        PVector.multN = function (v1, n) {
            return new PVector(v1.x * n, v1.y * n);
        };

        PVector.prototype.div = function (n) {
            this.x = this.x / n;
            this.y = this.y / n;
        };

        PVector.div = function (v1, v2) {
            return new PVector(v1.x / v2.x, v1.y / v2.y);
        };

        PVector.divN = function (v1, n) {
            return new PVector(v1.x / n, v1.y / n);
        };

        PVector.prototype.mag = function () {
            return Math.sqrt(this.x * this.x + this.y * this.y);
        };

        PVector.prototype.magSq = function () {
            return (this.x * this.x + this.y * this.y);
        };

        PVector.prototype.normalize = function () {
            var m = this.mag();
            if (m != 0 && m != 1) {
                this.div(m);
            }
        };

        PVector.prototype.limit = function (max) {
            if (this.magSq() > max * max) {
                this.normalize();
                this.mult(max);
            }
        };

        PVector.prototype.heading = function () {
            var angle = Math.atan2(-this.y, this.x);
            return -1 * angle;
        };

        PVector.random2D = function () {
            return PVector.fromAngle((Math.random() * Math.TAU));
        };

        PVector.fromAngle = function (angle) {
            return new PVector(Math.cos(angle), Math.sin(angle));
        };
        return PVector;
    })();

    
    return PVector;
});

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define('circleProperties',["require", "exports", "../../src/sketch", "../../src/pvector"], function(require, exports, __Sketch__, __PVector__) {
    
    var Sketch = __Sketch__;
    var PVector = __PVector__;

    var CircleProperties = (function (_super) {
        __extends(CircleProperties, _super);
        function CircleProperties() {
            _super.apply(this, arguments);
        }
        CircleProperties.prototype.setup = function () {
            this.radius = height * 0.25;
        };

        CircleProperties.prototype.draw = function () {
            background(255);

            var center = new PVector(width / 2, height / 2);

            translate(center.x, center.y);

            stroke(0);
            ellipse(0, 0, this.radius);

            var mouse = new PVector(mouseX, mouseY);

            mouse.sub(center);
            mouse.normalize();

            var angle = atan2(mouse.y, mouse.x) * -1;
            if (angle < 0)
                angle = Math.TAU + angle;

            var turn = angle / Math.TAU;

            mouse.mult(this.radius);

            line(0, 0, mouse.x, mouse.y);

            fill(0);
            ellipse(mouse.x, mouse.y, 4);

            translate(center.x * -1, center.y * -1);
            text(String(turn), 20, 20);
        };
        return CircleProperties;
    })(Sketch);

    
    return CircleProperties;
});

require([
    './rect',
    './rectMode',
    './ellipseMode',
    './circleProperties'
], function (rect, rectMode, ellipseMode, circleProperties) {
    sketch = new rect();
});

define("tests", function(){});
