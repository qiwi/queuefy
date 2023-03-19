import {
  ICallable
} from '@qiwi/substrate'

export type TInsideOutPromise = {
  promise: Promise<any>,
  resolve: ICallable,
  reject: ICallable
}

export type IAsyncFn = (...args: any[]) => Promise<any>

export type ITask = {
  args: any[],
  iop: TInsideOutPromise
}
export type ITaskQueue = Array<ITask>

/**
 * TODO implement lightweight version of 'inside-out-promise'
 * @private
 */
export const getPromise = (): TInsideOutPromise => {
  const iop: any = {}

  iop.promise = new Promise((resolve, reject) => {
    iop.resolve = resolve
    iop.reject = reject
  })

  return iop
}

/**
 * @private
 * @param target
 */
export const isPromiseLike = (target: any): boolean =>
  !!target
    && typeof target.then === 'function'
    && typeof target.catch === 'function'

export const compose = (cb: ICallable, next: ICallable) => <V>(v: V): void => {
  cb(v)
  next()
}

export const invoke = (fn: IAsyncFn, task: ITask, next: ICallable): void => {
  const {iop, args} = task
  const resolve = compose(iop.resolve, next)
  const reject = compose(iop.reject, next)

  try {
    const res = fn(...args)

    if (isPromiseLike(res)) {
      res.then(resolve, reject)
    }
    else {
      resolve(res)
    }
  }
  catch (e) {
    reject(e)
  }
}

export const queuefy = <T extends IAsyncFn>(fn: T, limit = 1): T => {
  const queue: ITaskQueue = []
  const processQueue = (): void => {
    if (limit === 0) {
      return
    }

    const task = queue.shift()
    if (!task) {
      return
    }

    limit--
    invoke(fn, task, () => {
      limit++
      processQueue()
    })
  }

  return ((...args: any[]): any => {
    const iop = getPromise()

    queue.push({args, iop})
    processQueue()

    return iop.promise
  }) as T
}
