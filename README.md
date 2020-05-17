## queuefy
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
