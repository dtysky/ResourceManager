"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ResourceManager = /** @class */ (function () {
    function ResourceManager() {
        var _this = this;
        this.resourceList = [];
        this.resources = {};
        this.onProgress = function (progress, current) { };
        this.onError = function (error, current) { };
        this.onComplete = function () { };
        this.length = 0;
        this.timeout = 0;
        this.loaded = false;
        this.init = function (list, timeout) {
            _this.length = 0;
            _this.loaded = false;
            _this.resourceList = list;
            _this.timeout = timeout || 0;
            list.forEach(function (item) {
                if (item.preload === undefined) {
                    item.preload = true;
                }
                if (item.preload) {
                    _this.length += item.weight || 1;
                }
            });
            return _this;
        };
        this.load = function (onProgress, onComplete, onError) {
            if (onProgress) {
                _this.onProgress = onProgress;
            }
            if (onComplete) {
                _this.onComplete = onComplete;
            }
            if (onError) {
                _this.onError = onError;
            }
            var realList = _this.resourceList.filter(function (item) { return item.preload; });
            if (realList.length === 0) {
                _this.loaded = true;
                _this.onComplete();
                return _this;
            }
            _this.resourceList.forEach(function (item) {
                if (item.type === 'image') {
                    _this.loadImage(item);
                }
                else {
                    _this.loadMedia(item);
                }
            });
            if (_this.timeout) {
                setTimeout(function () {
                    if (!_this.loaded) {
                        _this.loaded = true;
                        _this.onProgress(1, null);
                        _this.onComplete();
                    }
                }, _this.timeout);
            }
            return _this;
        };
        this.loadImage = function (resource) {
            var name = resource.name, type = resource.type, src = resource.src, preload = resource.preload, weight = resource.weight;
            _this.resources[name] = {
                preload: preload,
                name: name,
                src: src,
                type: type,
                element: preload ? new Image() : undefined,
                weight: weight || 1,
                progress: preload ? 0 : 1
            };
            if (preload) {
                var element = _this.resources[name].element;
                element.onload = function () {
                    _this.resources[name].progress = 1;
                    _this.handleOnLoad(name);
                };
                element.onerror = function (errorEvent) {
                    _this.onError(errorEvent.error, name);
                };
                element.src = _this.resources[name].src;
            }
        };
        this.loadMedia = function (resource) {
            var name = resource.name, type = resource.type, src = resource.src, preload = resource.preload, weight = resource.weight;
            _this.resources[name] = {
                preload: preload,
                name: name,
                src: src,
                type: type,
                weight: weight || 1,
                element: (function () {
                    if (preload) {
                        return type === 'video' ? document.createElement('video') : document.createElement('audio');
                    }
                    return null;
                })(),
                progress: preload ? 0 : 1
            };
            var element = (_this.resources[name].element);
            if (preload) {
                element.addEventListener('canplaythrough', _this.handleMediaProgress(name));
                element.onerror = function (errorEvent) {
                    _this.onError(errorEvent.error, name);
                };
                element.muted = true;
                element.preload = 'auto';
                element.src = _this.resources[name].src;
                element.style.position = 'fixed';
                element.style.transform = 'scale(-10000)';
                element.style.width = '0';
                element.style.height = '0';
                document.body.appendChild(_this.resources[name].element);
                element.play();
            }
        };
        this.handleMediaProgress = function (name) { return function () {
            var element = (_this.resources[name].element);
            if (element && element.duration) {
                var buffered = element.buffered.end(0);
                var end = buffered >= element.duration - .4;
                if (end) {
                    _this.resources[name].progress = 1;
                }
                else {
                    _this.resources[name].progress = buffered / element.duration;
                }
                _this.handleOnLoad(name);
                element.currentTime = buffered;
                if (_this.loaded || end) {
                    element.pause();
                    document.body.removeChild(element);
                    _this.resources[name].element = null;
                }
                else {
                    element.play();
                }
            }
        }; };
        this.handleOnLoad = function (name) {
            if (!_this.loaded) {
                _this.onProgress(_this.progress, name);
            }
            else {
                _this.onProgress(1, name);
                _this.onComplete();
            }
        };
        this.getSrc = function (name) {
            return _this.resources[name].src;
        };
        this.registerOnProgress = function (onProgress) {
            _this.onProgress = onProgress;
            return _this;
        };
        this.registerOnError = function (onError) {
            _this.onError = onError;
            return _this;
        };
        this.registerOnComplete = function (onComplete) {
            _this.onComplete = onComplete;
            return _this;
        };
    }
    Object.defineProperty(ResourceManager.prototype, "progress", {
        get: function () {
            var _this = this;
            if (this.loaded) {
                return 1;
            }
            var total = 0;
            this.resourceList.forEach(function (_a) {
                var name = _a.name;
                if (_this.resources[name].preload) {
                    total += _this.resources[name].progress * _this.resources[name].weight;
                }
            });
            var result = total / this.length;
            if (result === 1) {
                this.loaded = true;
            }
            return result;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceManager.prototype, "loadDone", {
        get: function () {
            return this.loaded;
        },
        enumerable: true,
        configurable: true
    });
    ResourceManager.prototype.reset = function () {
        var _this = this;
        this.resourceList = [];
        Object.keys(this.resources).forEach(function (name) {
            if (_this.resources[name].element && _this.resources[name].type !== 'image') {
                document.body.removeChild(_this.resources[name].element);
            }
            _this.resources[name].element = null;
        });
        this.resources = {};
        this.onProgress = function () { };
        this.onError = function () { };
        this.onComplete = function () { };
        this.length = 0;
        this.loaded = false;
        return this;
    };
    return ResourceManager;
}());
exports.default = ResourceManager;
