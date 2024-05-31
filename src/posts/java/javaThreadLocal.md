---
title: Java ThreadLocal浅析
order: 1
author: Roy
date: 2024-02-01
category:
  - Java
tag:
  - Java
  - 笔记
sticky: false
star: true
copyright: Copyright © 2024 Roy
---

# Java ThreadLocal浅析

## 基本使用

从名字我们就可以看到 `ThreadLocal` 叫做本地线程变量，意思是说，`ThreadLocal` 中填充的的是当前线程的变量，该变量对其他线程而言是封闭且隔离的，所以 `ThreadLocal` 最大的作用是在多线程中保证变量的线程安全。

基本用法如下：

```java
public void tests() {
    ThreadLocal<String> local = new ThreadLocal<>();
    ThreadPoolExecutor POOL = new ThreadPoolExecutor(4, 4, 5L, TimeUnit.SECONDS, new SynchronousQueue<>(), new NamedThreadFactory("POOL", true), new ThreadPoolExecutor.CallerRunsPolicy());
    IntStream.range(0,4).forEach(i -> POOL.submit(() -> {
        local.set(Thread.currentThread().getName());
        System.out.println(local.get());
    }));
}
```

可以看到控制台输出，每个线程都有不同的值，互不干扰：

> POOL1
> POOL2
> POOL3
> POOL4

## 源码分析

`ThreadLocal` 最常用的有 set()，get()和 remove()方法，先来看 set()方法

### Set()

首先调用 getMap()方法，这个方法返回 `Thread` 内部变量 `ThreadLocal.ThreadLocalMap` ，这个 `ThreadLocalMap` 其实类似于 HashMap，如果这个 map != null 就将 threadLocal 这个变量作为 key，将值写入 thread 线程内部。

```java
/**
 * Sets the current thread's copy of this thread-local variable
 * to the specified value.  Most subclasses will have no need to
 * override this method, relying solely on the {@link #initialValue}
 * method to set the values of thread-locals.
 *
 * @param value the value to be stored in the current thread's copy of
 *        this thread-local.
 */
public void set(T value) {
    //首先获取当前线程对象
    Thread t = Thread.currentThread();
    //获取线程中变量 ThreadLocal.ThreadLocalMap
    ThreadLocalMap map = getMap(t);
    //如果不为空，
    if (map != null)
        map.set(this, value);
    else
        //如果为空，初始化该线程对象的map，其中key为当前的threadlocal
        createMap(t, value);
}
/**
 * Create the map associated with a ThreadLocal. Overridden in
 * InheritableThreadLocal.
 *
 * @param t the current thread
 * @param firstValue value for the initial entry of the map
 */
//初始化线程内部变量 threadLocals ，key 为当前 threadlocal
void createMap(Thread t, T firstValue) {
    t.threadLocals = new ThreadLocalMap(this, firstValue);
}
```

总的来说 `ThreadLocal` 像是一个工具类，真正的变量其实写入了 `Thread` 中的 threadLocals 里。

```java
public
class Thread implements Runnable {
    /* Make sure registerNatives is the first thing <clinit> does. */
    private static native void registerNatives();
    static {
        registerNatives();
    }

    private volatile String name;
    
    ...

    /* ThreadLocal values pertaining to this thread. This map is maintained
     * by the ThreadLocal class. */
    ThreadLocal.ThreadLocalMap threadLocals = null;
    
    ...
}
```

### get()

首先获取当前线程，然后通过 threadlocal 获取 `Thread` 线程内部的值。

那么如果我们没有 set()过值，直接 get()呢？这个 setInitialValue()方法会初始化线程的 `ThreadLocalMap`，然后返回 null

```java
/**
 * Returns the value in the current thread's copy of this
 * thread-local variable.  If the variable has no value for the
 * current thread, it is first initialized to the value returned
 * by an invocation of the {@link #initialValue} method.
 *
 * @return the current thread's value of this thread-local
 */
public T get() {
    Thread t = Thread.currentThread();
    ThreadLocalMap map = getMap(t);
    if (map != null) {
        ThreadLocalMap.Entry e = map.getEntry(this);
        if (e != null) {
            @SuppressWarnings("unchecked")
            T result = (T)e.value;
            return result;
        }
    }
    return setInitialValue();
}
```

### remove()

获取当前线程，然后删除这个值

```java
/**
 * Removes the current thread's value for this thread-local
 * variable.  If this thread-local variable is subsequently
 * {@linkplain #get read} by the current thread, its value will be
 * reinitialized by invoking its {@link #initialValue} method,
 * unless its value is {@linkplain #set set} by the current thread
 * in the interim.  This may result in multiple invocations of the
 * {@code initialValue} method in the current thread.
 *
 * @since 1.5
 */
 public void remove() {
     ThreadLocalMap m = getMap(Thread.currentThread());
     if (m != null)
         m.remove(this);
 }
```

## 内存泄漏问题

接下来看一下 `ThreadLocalMap` 这个类

`ThreadLocalMap` 为 `ThreadLocal` 的一个静态内部类，里面定义了 `Entry` 来保存数据。而且是继承的弱引用。在 `Entry` 内部使用 `ThreadLocal` 作为 `key`，使用我们设置的 `value` 作为 `value`。

先来看下四大引用：

- 强引用：Java 中默认的引用类型，一个对象如果具有强引用那么只要这种引用还存在就不会被 GC。
- 软引用：简言之，如果一个对象具有弱引用，在 JVM 发生 OOM 之前（即内存充足够使用），是不会 GC 这个对象的；只有到 JVM 内存不足的时候才会 GC 掉这个对象。软引用和一个引用队列联合使用，如果软引用所引用的对象被回收之后，该引用就会加入到与之关联的引用队列中
- 弱引用（这里讨论 ThreadLocalMap 中的 Entry 类的重点）：如果一个对象只具有弱引用，那么这个对象就会被垃圾回收器 GC 掉(被弱引用所引用的对象只能生存到下一次 GC 之前，当发生 GC 时候，无论当前内存是否足够，弱引用所引用的对象都会被回收掉)。弱引用也是和一个引用队列联合使用，如果弱引用的对象被垃圾回收期回收掉，JVM 会将这个引用加入到与之关联的引用队列中。若引用的对象可以通过弱引用的 get 方法得到，当引用的对象呗回收掉之后，再调用 get 方法就会返回 null
- 虚引用：虚引用是所有引用中最弱的一种引用，其存在就是为了将关联虚引用的对象在被 GC 掉之后收到一个通知。（不能通过 get 方法获得其指向的对象）

```java
/**
 * ThreadLocalMap is a customized hash map suitable only for
 * maintaining thread local values. No operations are exported
 * outside of the ThreadLocal class. The class is package private to
 * allow declaration of fields in class Thread.  To help deal with
 * very large and long-lived usages, the hash table entries use
 * WeakReferences for keys. However, since reference queues are not
 * used, stale entries are guaranteed to be removed only when
 * the table starts running out of space.
 */
static class ThreadLocalMap {

    /**
     * The entries in this hash map extend WeakReference, using
     * its main ref field as the key (which is always a
     * ThreadLocal object).  Note that null keys (i.e. entry.get()
     * == null) mean that the key is no longer referenced, so the
     * entry can be expunged from table.  Such entries are referred to
     * as "stale entries" in the code that follows.
     */
    static class Entry extends WeakReference<ThreadLocal<?>> {
        /** The value associated with this ThreadLocal. */
        Object value;

        Entry(ThreadLocal<?> k, Object v) {
            super(k);
            value = v;
        }
    }

    /**
     * The initial capacity -- MUST be a power of two.
     */
    private static final int INITIAL_CAPACITY = 16;

    /**
     * The table, resized as necessary.
     * table.length MUST always be a power of two.
     */
    private Entry[] table;

    /**
     * The number of entries in the table.
     */
    private int size = 0;

    /**
     * The next size value at which to resize.
     */
    private int threshold; // Default to 0

    /**
     * Set the resize threshold to maintain at worst a 2/3 load factor.
     */
    private void setThreshold(int len) {
        threshold = len * 2 / 3;
    }

    /**
     * Increment i modulo len.
     */
    private static int nextIndex(int i, int len) {
        return ((i + 1 < len) ? i + 1 : 0);
    }

    /**
     * Decrement i modulo len.
     */
    private static int prevIndex(int i, int len) {
        return ((i - 1 >= 0) ? i - 1 : len - 1);
    }

    /**
     * Construct a new map initially containing (firstKey, firstValue).
     * ThreadLocalMaps are constructed lazily, so we only create
     * one when we have at least one entry to put in it.
     */
    ThreadLocalMap(ThreadLocal<?> firstKey, Object firstValue) {
        table = new Entry[INITIAL_CAPACITY];
        int i = firstKey.threadLocalHashCode & (INITIAL_CAPACITY - 1);
        table[i] = new Entry(firstKey, firstValue);
        size = 1;
        setThreshold(INITIAL_CAPACITY);
    }
    
    ...
}
```

threadLocal 变量实际上存在每个线程内部的变量 threadLocals 中，考虑这个 threadLocal 变量没有其他强引用，如果当前线程还存在，由于线程的 `ThreadLocalMap` 里面的 key 是弱引用，所以当前线程的 `ThreadLocalMap` 里面的 `ThreadLocal` 变量的**弱引用**在 gc 的时候就被回收，但是对应的 value 还是存在的。这就可能造成内存泄漏(因为这个时候 `ThreadLocalMap` 会存在 key 为 null 但是 value 不为 null 的 entry)。

使用完 `ThreadLocal` 后，执行 remove()方法，避免出现内存泄露情况。
