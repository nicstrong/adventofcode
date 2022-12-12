export default function seqitr<T>(items: Iterator<T>): never
export default function seqitr<T>(items: Iterable<T>): Seqitr<T>
export default function seqitr<T>(items: () => Iterable<T>): Seqitr<T>
export default function seqitr<T>(items: Iterable<T> | Iterator<T> | (() => Iterable<T>)) {
  return new Seqitr<T>(items as any)
}

export function range(count: number): Seqitr<number>
export function range(start: number, count: number): Seqitr<number>
export function range(start: number, count?: number): Seqitr<number> {
  if (count === undefined) {
    count = start
    start = 0
  } else {
    count += start
  }

  return new Seqitr(function*(){
    for (let i = start; i < count!; i++) {
      yield i
    }
  })
}

class Seqitr<T> {
  private readonly items: Iterable<T>

  constructor(items: Iterable<T>)
  constructor(items: () => Iterable<T>)
  constructor(items: Iterable<T> | (() => Iterable<T>)) {
    this.items = reiterable(typeof items === 'function' ? items : () => items)
  }

  map<R>(fn: (item: T, index: number) => R) {
    return this.run(function* (items) {
      let index = 0
      for (const item of items) {
        yield fn(item, index++)
      }
    })
  }

  filter<S extends T>(fn: (item: T, index: number) => item is S): Seqitr<S>
  filter(fn: (item: T, index: number) => unknown): Seqitr<T>
  filter(fn: (item: T, index: number) => unknown) {
    return this.run(function* (items) {
      let index = 0
      for (const item of items) {
        if (fn(item, index++)) {
          yield item
        }
      }
    })
  }

  flatMap<R>(fn: (item: T, index: number) => Iterable<R>) {
    return this.run(function* (items) {
      let index = 0
      for (const item of items) {
        yield* fn(item, index++)
      }
    })
  }

  reduce<A>(fn: (previousValue: T, currentValue: T, currentIndex: number) => A): A
  reduce<A>(fn: (acc: A, item: T, index: number) => A, acc: A): A
  reduce(fn: (acc: any, item: T, index: number) => any, acc?: any) {
    let index = 0
    for (const item of this.items) {
      if (acc === undefined && index === 0) {
        acc = item
      } else {
        acc = fn(acc, item, index)
      }
      index++
    }

    if (acc === undefined && index === 0) {
      throw new TypeError('reduce of empty iterable with no initial value')
    }

    return acc
  }

  unique<R>(fn?: (item: T, index: number) => R) {
    return this.run(function* (items) {
      const set = new Set()
      let index = 0
      for (const item of items) {
        const val = fn ? fn(item, index++) : item
        if (set.has(val)) { continue }
        set.add(val)
        yield item
      }
    })
  }

  concat<T2>(moreItems: Iterable<T2>) {
    return this.run(function* (items) {
      yield* items
      yield* moreItems
    })
  }

  sortBy<R>(fn: (item: T) => R) {
    return new SortedSeqitr(this.items, [{ fn, desc: false }])
  }

  sortByDesc<R>(fn: (item: T) => R) {
    return new SortedSeqitr(this.items, [{ fn, desc: true }])
  }

  toArray() {
    return [...this.items]
  }

  valueOf() {
    return this.items
  }

  [Symbol.iterator]() {
    return this.items[Symbol.iterator]()
  }

  toObject(getKey: (item: T) => string): Record<string, T>
  toObject<V>(getKey: (item: T) => string, getValue: (item: T) => V): Record<string, V>
  toObject<V>(getKey: (item: T) => string, getValue: (item: T) => V = emptyFn): Record<string, V> {
    const obj: Record<string, V> = {}
    for (const item of this.items) {
      obj[getKey(item)] = getValue(item)
    }
    return obj
  }

  toMap<K>(getKey: (item: T) => K): Map<K, T>
  toMap<K, V>(getKey: (item: T) => K, getValue: (item: T) => V): Map<K, V>
  toMap<K, V>(getKey: (item: T) => K, getValue: (item: T) => V = emptyFn): Map<K, V> {
    const map = new Map<K, V>()
    for (const item of this.items) {
      map.set(getKey(item), getValue(item))
    }
    return map
  }

  groupBy(getKey: (item: T) => string | number): Record<string, T[]>
  groupBy<V>(getKey: (item: T) => string | number, getValue: (item: T) => V): Record<string, V[]>
  groupBy<V>(getKey: (item: T) => string | number, getValue: (item: T) => V = emptyFn) {
    const obj: Record<string, V[]> = {}
    for (const item of this.items) {
      const key = getKey(item)
      if (!obj[key]) {
        obj[key] = [getValue(item)]
      } else {
        obj[key]!.push(getValue(item))
      }
    }
    return obj
  }

  first(): T | undefined
  first(fn: (item: T) => unknown): T | undefined
  first(fn?: (item: T) => unknown) {
    for (const item of this.items) {
      if (fn === undefined || fn(item)) {
        return item
      }
    }
    return undefined
  }

  some(): boolean
  some(fn: (item: T) => unknown): boolean
  some(fn?: (item: T) => unknown) {
    for (const item of this.items) {
      if (fn === undefined || fn(item)) {
        return true
      }
    }
    return false
  }

  every(fn: (item: T) => unknown) {
    for (const item of this.items) {
      if (!fn(item)) {
        return false
      }
    }
    return true
  }

  skip(count: number) {
    return this.run(function*(items) {
      for (const item of items) {
        if (count === 0) {
          yield item
        } else {
          count--
        }
      }
    })
  }

  take(count: number) {
    return this.run(function*(items) {
      for (const item of items) {
        if (count > 0) {
          yield item
          count--
        } else {
          break
        }
      }
    })
  }

  count(): number
  count(fn: (item: T) => unknown): number
  count(fn?: (item: T) => unknown) {
    let count = 0
    for (const item of this.items) {
      if (fn === undefined || fn(item)) {
        count++
      }
    }
    return count
  }

  protected run<R>(fn: (items: Iterable<T>) => Iterable<R>) {
    return new Seqitr(() => fn(this.items))
  }
}

function emptyFn<T, V>(item: T): V {
  return item as any
}

function reiterable<T>(getItems: () => Iterable<T>): Iterable<T> {
  return {
    [Symbol.iterator]: () => getItems()[Symbol.iterator](),
  }
}

type SortEntry<T> = {
  fn: (item: T) => any,
  desc: boolean
}

class SortedSeqitr<T> extends Seqitr<T> {
  private entries: SortEntry<T>[]
  private origItems: Iterable<T>

  constructor(items: Iterable<T>, entries: SortEntry<T>[]) {
    super(() => sort(items, entries))
    this.origItems = items
    this.entries = entries
  }

  thenBy<R>(fn: (item: T) => R) {
    return new SortedSeqitr(this.origItems, [...this.entries, { fn, desc: false }])
  }

  thenByDesc<R>(fn: (item: T) => R) {
    return new SortedSeqitr(this.origItems, [...this.entries, { fn, desc: true }])
  }
}

function* sort<T>(items: Iterable<T>, entries: SortEntry<T>[]) {
  const res = [...items].sort((a, b) => {
    for (const entry of entries) {
      const res = cmp(a, b, entry)
      if (res !== 0) { return res }
    }
    return 0
  })
  yield* res

  function cmp<T>(a: T, b: T, { fn, desc }: SortEntry<T>) {
    const pa = fn(a)
    const pb = fn(b)
    const f = desc ? -1 : 1

    if (pa < pb) {
      return -f
    } else if (pa > pb) {
      return f
    } else {
      return 0
    }
  }
}
