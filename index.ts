/**
 * Copyright(c) dtysky<dtysky@outlook.com>
 * Created: 14 Nov 2017
 * Description:
 */
export interface IResourceEntry {
  preload?: boolean;
  name: string;
  src: string;
  // image or video
  type: 'image' | 'video' | 'audio';
  weight?: number;
}

export interface IResourceElement extends IResourceEntry {
  element?: HTMLImageElement | HTMLVideoElement | HTMLAudioElement;
  progress?: number;
}

export default class ResourceManager {
  private resourceList: IResourceEntry[] = [];
  private resources: {[name: string]: IResourceElement} = {};
  private onProgress = (progress: number, current: string) => {};
  private onError = (error: Error, current: string) => {};
  private onComplete = () => {};
  private length = 0;
  private timeout = 0;
  private loaded = false;

  public init = (list: IResourceEntry[], timeout?: number) => {
    this.length = 0;
    this.loaded = false;
    this.resourceList = list;
    this.timeout = timeout || 0;
    list.forEach(item => {
      if (item.preload === undefined) {
        item.preload = true;
      }
      if (item.preload) {
        this.length += item.weight || 1;
      }
    });
    return this;
  }

  public load = (
    onProgress?: (progress: number, string: string) => void,
    onComplete?: () => void,
    onError?: (error: Error, current: string) => void
  ) => {
    if (onProgress) {
      this.onProgress = onProgress;
    }

    if (onComplete) {
      this.onComplete = onComplete;
    }

    if (onError) {
      this.onError = onError;
    }

    const realList = this.resourceList.filter(item => item.preload);
    if (realList.length === 0) {
      this.loaded = true;
      this.onComplete();
      return this;
    }

    this.resourceList.forEach(item => {
      if (item.type === 'image') {
        this.loadImage(item);
      } else {
        this.loadMedia(item);
      }
    });

    if (this.timeout) {
      setTimeout(
        () => {
          if (!this.loaded) {
            this.loaded = true;
            this.onProgress(1, null);
            this.onComplete();
          }
        },
        this.timeout
      );
    }
    return this;
  }

  private loadImage = (resource: IResourceEntry) => {
    const {name, type, src, preload, weight} = resource;
    this.resources[name] = {
      preload,
      name,
      src,
      type,
      element: preload ? new Image() : undefined,
      weight: weight || 1,
      progress: preload ? 0 : 1
    };

    if (preload) {
      const element = this.resources[name].element;
      element.onload = () => {
        this.resources[name].progress = 1;
        this.handleOnLoad(name);
      };
      element.onerror = (errorEvent: ErrorEvent) => {
        this.onError(errorEvent.error, name);
      };
      element.src = this.resources[name].src;
    }
  }

  private loadMedia = (resource: IResourceEntry) => {
    const {name, type, src, preload, weight} = resource;
    this.resources[name] = {
      preload,
      name,
      src,
      type,
      weight: weight || 1,
      element: (() => {
        if (preload) {
          return type === 'video' ? document.createElement('video') : document.createElement('audio');
        }

        return null;
      })(),
      progress: preload ? 0 : 1
    };

    const element = <HTMLVideoElement | HTMLAudioElement>(this.resources[name].element);

    if (preload) {
      element.addEventListener('canplaythrough', this.handleMediaProgress(name));
      element.onerror = (errorEvent: ErrorEvent) => {
        this.onError(errorEvent.error, name);
      };
      element.muted = true;
      element.preload = 'auto';
      element.src = this.resources[name].src;

      element.style.position = 'fixed';
      element.style.transform = 'scale(-10000)';
      element.style.width = '0';
      element.style.height = '0';
      document.body.appendChild(this.resources[name].element);
      element.play();
    }
  }

  private handleMediaProgress = (name: string) => () => {
    const element = <HTMLVideoElement | HTMLAudioElement>(this.resources[name].element);

    if (element && element.duration) {
      const buffered = element.buffered.end(0);
      const end = buffered >= element.duration - .4;
      if (end) {
        this.resources[name].progress = 1;
      } else {
        this.resources[name].progress = buffered / element.duration;
      }
      this.handleOnLoad(name);

      element.currentTime = buffered;
      if (this.loaded || end) {
        element.pause();
        document.body.removeChild(element);
        this.resources[name].element = null;
      } else {
        element.play();
      }
    }
  }

  private handleOnLoad = (name: string) => {
    if (!this.loaded) {
      this.onProgress(this.progress, name);
    } else {
      this.onProgress(1, name);
      this.onComplete();
    }
  }

  public get progress() {
    if (this.loaded) {
      return 1;
    }
    let total = 0;
    this.resourceList.forEach(({name}) => {
      if (this.resources[name].preload) {
        total += this.resources[name].progress * this.resources[name].weight;
      }
    });
    const result = total / this.length;
    if (result === 1) {
      this.loaded = true;
    }
    return result;
  }

  public getSrc = (name: string) => {
    return this.resources[name].src;
  }

  public registerOnProgress = (onProgress: (progress: number, string: string) => void) => {
    this.onProgress = onProgress;
    return this;
  }

  public registerOnError = (onError: (error: Error, current: string) => void) => {
    this.onError = onError;
    return this;
  }

  public registerOnComplete = (onComplete: () => void) => {
    this.onComplete = onComplete;
    return this;
  }

  public get loadDone() {
    return this.loaded;
  }

  public reset() {
    this.resourceList = [];
    Object.keys(this.resources).forEach(name => {
      if (this.resources[name].element && this.resources[name].type !== 'image') {
        document.body.removeChild(this.resources[name].element);
      }
      this.resources[name].element = null;
    });
    this.resources = {};
    this.onProgress = () => {};
    this.onError = () => {};
    this.onComplete = () => {};
    this.length = 0;
    this.loaded = false;
    return this;
  }
}
