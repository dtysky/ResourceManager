/**
 * Copyright(c) dtysky<dtysky@outlook.com>
 * Created: 14 Nov 2017
 * Description:
 */
export interface IResourceEntry {
    preload?: boolean;
    name: string;
    src: string;
    type: 'image' | 'video' | 'audio';
    weight?: number;
}
export interface IResourceElement extends IResourceEntry {
    element?: HTMLImageElement | HTMLVideoElement | HTMLAudioElement;
    progress?: number;
}
export default class ResourceManager {
    private resourceList;
    private resources;
    private onProgress;
    private onError;
    private onComplete;
    private length;
    private timeout;
    private loaded;
    init: (list: IResourceEntry[], timeout?: number) => void;
    load: (onProgress?: (progress: number, string: string) => void, onComplete?: () => void, onError?: (error: Error, current: string) => void) => void;
    private loadImage;
    private loadMedia;
    private handleMediaProgress;
    readonly progress: number;
    getSrc: (name: string) => string;
    registerOnProgress: (onProgress: (progress: number, string: string) => void) => void;
    registerOnError: (onError: (error: Error, current: string) => void) => void;
    registerOnComplete: (onComplete: () => void) => void;
    readonly loadDone: boolean;
    reset(): void;
}
