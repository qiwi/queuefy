# queuefy
[![Build Status](https://travis-ci.com/qiwi/queuefy.svg?branch=master)](https://travis-ci.com/qiwi/queuefy)
[![npm (tag)](https://img.shields.io/npm/v/queuefy)](https://www.npmjs.com/package/queuefy)
[![deps](https://img.shields.io/david/qiwi/queuefy)](https://david-dm.org/qiwi/queuefy)
[![Maintainability](https://api.codeclimate.com/v1/badges/2392bab0fb3bfa330f74/maintainability)](https://codeclimate.com/github/qiwi/queuefy/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/2392bab0fb3bfa330f74/test_coverage)](https://codeclimate.com/github/qiwi/queuefy/test_coverage)
[![CodeStyle](https://img.shields.io/badge/code%20style-tslint--config--qiwi-brightgreen.svg)](https://github.com/qiwi/tslint-config-qiwi)

Wrapper to make any async handler be like a single thread with queue.

## Install
```shell script
yarn add queuefy
npm i queuefy
```

## Usage
```typescript
import {queuefy} from 'queuefy'

let count = 0
const target = (param: number) => new Promise(resolve =>
  setTimeout(() => {
    count++
    resolve(count + param)
  }, Math.random() * 100),
)
const fn = queuefy(target)
const [r0, r1, r2, r3, r4] = await Promise.all([fn(4), fn(3), fn(2), fn(1), fn(0)])

// r0 is 5
// r1 is 5
// r2 is 5
// ... 
```

## License
[MIT](./LICENSE)
