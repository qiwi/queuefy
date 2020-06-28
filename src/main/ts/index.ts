export type TInsideOutPromise = {
  promise: Promise<any>,
  resolve: Function,
  reject: Function
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
  target
    && typeof target.then === 'function'
    && typeof target.catch === 'function'

export const compose = (cb: Function, next: Function) => <V>(v: V): void => {
  cb(v)
  next()
}

export const invoke = (fn: IAsyncFn, task: ITask, next: Function): void => {
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

export const queuefy = <T extends IAsyncFn>(fn: T): T => {
  const queue: ITaskQueue = []
  const processQueue = (): void => {
    const task = queue[0]

    if (!task) {
      return
    }

    invoke(fn, task, next)
  }
  const next = () => {
    queue.shift()
    processQueue()
  }

  return ((...args: any[]): any => {
    const iop = getPromise()

    queue.push({args, iop})

    if (queue.length === 1) {
      processQueue()
    }

    return iop.promise
  }) as T
}
