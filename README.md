# ResourceManager

A class for better loading and managing resources.

## Demo

[You can view the live demo here.](http://resource-manager.dtysky.moe)
## Usage

```shell
npm install res-manager --save
```

### IResourceEntry

This interface is used for describing a resource.

```ts
interface IResourceEntry {
  // a switch for preloading
  preload: boolean;
  // name of this resource
  name: string;
  // url of this resource
  src: string;
  // type of this resource
  type: 'image' | 'video' | 'audio';
  // weight of this resource
  weight: number;
}
```

### ResourceManager

Main class for managing resources.

|Method|Type|Description|
|-|-|-|
|constructor|() => ResourceManager|Constructor function.|
|registerOnProgress|(onProgress: (progress: number, string: string) => ResourceManager) => void|Register an callback for progress.|
|registerOnError|onError: (error: Error, current: string) => ResourceManager) => ResourceManager|Register an callback for error.|
|registerOnComplete|onComplete: () => ResourceManager) => ResourceManager|Register an callback for completing.|
|init|(list: IResourceEntry[], timeout?: number) => ResourceManager|Initialize manager by new resources and timeout.|
|load|(onProgress?: (progress: number, string: string) => void, onComplete?: () => void, onError?: (error: Error, current: string) => void) => ResourceManager|Trigger loading, you can register callbacks here.|
|getSrc|(name: string) => string|Get source by name.|
|reset|() => ResourceManager|Reset all options and state.|

|Accessors|Type|Description|
|-|-|-|
|progress|number|Progress of loading.|
|loadDone|boolean|If the loading was done.|

```ts
import {IResourceEntry}, ResourceManager from 'res-manager';

const resourceManager = new ResourceManager();
const resources: IResourceEntry = [
  {
    preload: true,
    name: 'H光大小姐',
    src: 'http://oekm6wrcq.bkt.clouddn.com/hh.png',
    type: 'image',
    weight: 1
  },
  {
    preload: true,
    name: '秦皇岛',
    src: 'http://oekm6wrcq.bkt.clouddn.com/秦皇岛.mp3',
    type: 'audio',
    weight: 1
  },
  {
    preload: true,
    name: 'bml2017',
    src: 'http://oekm6wrcq.bkt.clouddn.com/bml-h5.mp4',
    type: 'video',
    weight: 1
  }
];
resourceManager.load(
  (progress, current) => {
    console.log(current, progress);
  },
  (error, current) => {
    console.log(error, progress);
  }
);
const imgSrc = resourceManager.getSrc('H光大小姐');
```

## Contribute

### Development

Run:

```bash
npm run dev
```

then open `localhost:4444`.

### Build

Run:

```bash
npm run build
```

## License

Copyright © 2017, 戴天宇, Tianyu Dai (dtysky < dtysky@outlook.com >). All Rights Reserved.
This project is free software and released under the **[MIT License](https://opensource.org/licenses/MIT)**.

