---
title: MongoDB优化大量插入
order: 1
author: Roy
date: 2024-03-01
category:
  - 数据库
tag:
  - 数据库
  - MongoDB
sticky: false
star: true
copyright: Copyright © 2024 Roy
---

# MongoDB优化大量插入

## MongoDB 的插入操作有哪些？

在预测预警模块中的滚动计算中，每次计算需要插入约 33w 行数据到 MongoDB 的 6 张表中，而我们使用的正是 MongoTemplate 提供的接口。但问题是 MongoTemplate 提供了 2 个接口进行大量写入，用哪个性能更好呢？

### mongoTemplate.insert()

mongoTemplate.insert(Collection <? extends T> batchToSave, String collectionName)

一个看上去平平无奇的接口，可以将集合中的元素全部插入，那么它底层是如何实现的呢？

```java
protected List<Object> insertDocumentList(String collectionName, List<Document> documents) {

    if (documents.isEmpty()) {
       return Collections.emptyList();
    }

    if (LOGGER.isDebugEnabled()) {
       LOGGER.debug("Inserting list of Documents containing {} items", documents.size());
    }

    execute(collectionName, collection -> {

       MongoAction mongoAction = new MongoAction(writeConcern, MongoActionOperation.INSERT_LIST, collectionName, null,
             null, null);
       WriteConcern writeConcernToUse = prepareWriteConcern(mongoAction);

       if (writeConcernToUse == null) {
          collection.insertMany(documents);
       } else {
          collection.withWriteConcern(writeConcernToUse).insertMany(documents);
       }

       return null;
    });

    return MappedDocument.toIds(documents);
}
```

可以看到它调用了 collection.insertMany()方法，这正是 mongosh 命令行中的方法 insertMany()，默认情况下，按顺序插入文档。如果 `ordered` 设置为 false，则文档将以无序格式插入，并且可以通过重新排序来提高性能。

### mongoTemplate.bulkOps()

mongoTemplate.bulkOps(BulkMode mode, @Nullable Class<?> entityType, String collectionName).insert(_List_<? _extends _Object> documents).execute()

一个看起来很厉害的接口，可以设置有序插入或者无序插入。当使用 ordered 的时候如果前一条操作命令失败则终止，如果使用 unordered 模式，执行失败的语句会跳过，直至全部语句执行完毕。理论上来说 unordered 语句效率高于 ordered 语句。**但实测后差距不明显。**

bulkOps()底层使用 db.collection.bulkWrite()，但是 mongodb.collection.bulkWrite()不支持 insertMany，这个接口是如何实现大量插入的呢？

```java
public BulkOperations insert(List<? extends Object> documents) {
    Assert.notNull(documents, "Documents must not be null!");
    documents.forEach(this::insert);
    return this;
}
```

使用了循环，调用自身的 insert()方法。

至此，我们应该能从理论上分析出，mongoTemplate.insert()方法的性能**理论上**优于 mongoTemplate.bulkOps().insert().execute()，**另外**，bulkOps()方法可以设置有序或者无序，而 insert()方法默认有序且只能有序。

## MongoDB 的插入性能测试

测试数据：30w 行

测试数据库：150 MongoDB

测试数据表：swmm_test1, swmm_test2, swmm_test3, swmm_test4

### 单线程 mongoTemplate.insert()

单线程顺序分别插入 4 张表，测试代码将在最后展示。

耗时：24698，22438，29554，23347，30795

**平均耗时：26166.4ms**

### 单线程 mongoTemplate.bulkOps()

单线程顺序分别插入 4 张表，测试代码将在最后展示。

耗时：27221，22923，25696，23181，24925

**平均耗时：24789.2ms**

### 单线程总结

可以得出，在单线程下，两个接口的**性能差距在 5% **以内，可以说**性能几乎一致**。虽然与理论分析不相符，但考虑到 150 服务器的**单核性能**，以及 MongoTemplate 对 bulkOps()方法的优化，这是有可能的。

因此，后续的测试都使用 **bulkOps()**方法并设置为**无序**插入。

### 线程池参数的设置

线程池的参数共有 7 个，而每一个都很重要，每一个参数都可以写一篇文章。

这里我们自己创建线程池，**而不是**使用 Executers 里的线程池，因为 **Alibaba 编程规范**中提到过：【强制】线程池**不允许**使用 Executors 去创建，而是通过 **ThreadPoolExecutor** 的方式，这样的处理方式让写的同学更加明确线程池的运行规则，规避资源耗尽的风险。

**再强调一遍，使用 Executors 创建的线程池无一例外都使用了无界队列 new LinkedBlockingQueue()，其默认大小为 Integer.MAX_VALUE，会导致队列堆积大量任务，最终 OOM。**

**再强调一遍，使用 Executors 创建的线程池无一例外都使用了无界队列 new LinkedBlockingQueue()，其默认大小为 Integer.MAX_VALUE，会导致队列堆积大量任务，最终 OOM。**

**再强调一遍，使用 Executors 创建的线程池无一例外都使用了无界队列 new LinkedBlockingQueue()，其默认大小为 Integer.MAX_VALUE，会导致队列堆积大量任务，最终 OOM。**

手动创建线程池（单例模式下）（如果非单例模式，需要写入 @Configuration）：

```java
private static final ThreadPoolExecutor writer = new ThreadPoolExecutor(4, 8, 5L, TimeUnit.SECONDS,
        new LinkedBlockingQueue<>(10), new NamedThreadFactory("writer pool"), new ThreadPoolExecutor.CallerRunsPolicy());
```

这里的参数仅仅作为参考。

关于**核心线程数**以及**最大线程数**：

从经验来说，IO 密集型的任务应该将线程数设置为 2*CPU 核心数，考虑到我们的生产环境是四核 CPU，那么将线程数设置为 **8** 是最合理的。这里我们测试了不同的线程数，期望找出最合适的线程数大小。

BTW，所谓的经验值怎么来的？

**计算密集型应用** 以第一种计算方式来看，对于计算密集型应用，假定等待时间趋近于 0，是的 CPU 利用率达到 100%，那么线程数就是 CPU 核心数，那这个 +1 意义何在呢？ 《Java 并发编程实践》这么说：

> 计算密集型的线程恰好在某时因为发生一个页错误或者因其他原因而暂停，刚好有一个“额外”的线程，可以确保在这种情况下 CPU 周期不会中断工作。

所以 N+1 确实是一个经验值。

**IO 密集型应用** 同样以第一种方式来看，对于 IO 密集型应用，假定所有的操作时间几乎都是 IO 操作耗时，那么 W/C 的值就为 1，那么对应的线程数确实为 2N。

从实际来看，我们应该从服务器上的 **MongoDB 负载情况**算出其 **QPS**，再用 **QPS** 逆推出合适的线程数量，很可惜，目前无从得知 **QPS**。

### 2 线程分表插入

2 个线程异步插入 4 张表，测试代码将在最后展示。

耗时（人工计时）：25000，25000，25000, 25000, 24000

**平均耗时：24800ms**

### 4 线程分表插入

4 个线程异步插入 4 张表，测试代码将在最后展示。

耗时（人工计时）：19000，26000，17000, 26000, 23000

**平均耗时：22200ms**

### 4 线程分片插入

4 个线程异步分片插入 4 张表，**每个分片的大小为 5000**，测试代码将在最后展示。

值得一提的是，因为线程池的阻塞队列大小为 10，而分片数量(60*4)很显然超过了 10+4，因此线程池会执行**拒绝策略**（CallerRunsPolicy），主线程也会执行插入数据库任务，**此时的线程数量达到了 5 个**。日志将在最后展示。

耗时（人工计时）：19000，18000，17000, 20000, 19000

**平均耗时：18600ms**

### 8 线程分片插入

8 个线程异步分片插入 4 张表，**每个分片的大小为 5000**，测试代码将在最后展示。

值得一提的是，因为线程池的阻塞队列大小为 10，而分片数量(60*4)很显然超过了 10+8，因此线程池会执行**拒绝策略**（CallerRunsPolicy），主线程也会执行插入数据库任务，**此时的线程数量达到了 9 个**。日志将在最后展示。

耗时（人工计时）：18000，19000，15000, 15000, 19000

**平均耗时：17200ms**

### 16 线程分片插入

16 个线程异步分片插入 4 张表，**每个分片的大小为 5000**，测试代码将在最后展示。

值得一提的是，因为线程池的阻塞队列大小为 10，而分片数量(60*4)很显然超过了 10+16，因此线程池会执行**拒绝策略**（CallerRunsPolicy），主线程也会执行插入数据库任务，**此时的线程数量达到了 17 个**。日志将在最后展示。

耗时（人工计时）：17000，16000，15000, 15000, 18000

**平均耗时：16200ms**

### 32 线程分片插入

32 个线程异步分片插入 4 张表，**每个分片的大小为 5000**，测试代码将在最后展示。

值得一提的是，因为线程池的阻塞队列大小为 10，而分片数量(60*4)很显然超过了 10+32，因此线程池会执行**拒绝策略**（CallerRunsPolicy），主线程也会执行插入数据库任务，**此时的线程数量达到了 33 个**。日志将在最后展示。

耗时（人工计时）：16000，15000，13000, 14000, 15000

**平均耗时：14600ms**

### 64 线程分片插入

64 个线程异步分片插入 4 张表，**每个分片的大小为 5000**，测试代码将在最后展示。

值得一提的是，因为线程池的阻塞队列大小为 10，而分片数量(60*4)很显然超过了 10+64，因此线程池会执行**拒绝策略**（CallerRunsPolicy），主线程也会执行插入数据库任务，**此时的线程数量达到了 65 个**。日志将在最后展示。

耗时（人工计时）：15000，15000，19000, 19000, 16000

**平均耗时：16800ms**

### 为什么没有 128 线程插入测试？

MongoDB 使用的存储引擎 WiredTiger 的默认同时写入请求为 128，超过 128 之外的写入请求将被**阻塞**。这个设置可以更改。

其次，考虑到 150 服务器的性能，128 个线程同时请求写入将极大地提升 MongoDB 的负载，可能导致崩溃。

另外，为什么没有考虑其他服务器如 53、54 呢？因为使用 VPN 连接的 MongoDB 在大量写入时可能会被 VPN 拦截请求，导致 MongoConnection 断开报错。

### 多线程总结

- 在 2 线程分表插入测试中，相比单线程响应时间缩短约 0%，可以忽略不计
- 在 4 线程分表插入测试中，相比单线程响应时间缩短约 **10.44%**
- 在 4 线程分片插入测试中，相比单线程响应时间缩短约 **24.97%**
- 在 8 线程分片插入测试中，相比单线程响应时间缩短约 **30.61%**
- 在 16 线程分片插入测试中，相比单线程响应时间缩短约 **34.65%**
- 在 32 线程分片插入测试中，相比单线程响应时间缩短约 **41.10%**
- 在 64 线程分片插入测试中，相比单线程响应时间缩短约 **32.23%**

可以得出以下结论：

- 多线程插入的性能要比单线程更好
- 分片插入要比分表插入**性能更好**，利用线程池的**效率更高**
- 随着线程池线程数量的提升，整体插入**性能提升**，**响应时间缩短**
- 随着线程池线程数量的提升，整体插入性能的提升有**极限**，这个极限取决于部署 MongoDB 的**服务器性能**、MongoDB 的**部署方式**（单机，复制集，分片集群）以及 MongoDB 的**配置**（同时写入请求数）

## 参考资料

1. [线程池的阻塞队列的选择](https://www.jianshu.com/p/f6024f806534)
2. [https://zhuanlan.zhihu.com/p/116426107](https://zhuanlan.zhihu.com/p/116426107)
3. [Spring MongoTemplate 批量操作源码跟踪与最佳实践](https://www.jianshu.com/p/04fb85fe8ba4)

## 测试代码

### 单线程 mongoTemplate.insert()

```java
@Test
    public void insertSingleThreadTest() {
        List<String> collectionList = Arrays.asList("swmm_test1", "swmm_test2", "swmm_test3", "swmm_test4");
        List<TSPairObject> res = new ArrayList<>();
        Date time = TimeUtil.getExactlyDate(2023,5,12, 6, 10, 30);
        for (int i = 0; i < 300000; i++) {
            time = TimeUtil.getDateHowManyMinutesAgo(time, -1);
            res.add(new TSPairObject(time, new Random().nextDouble()));
        }
        List<Document> documentList = new ArrayList<>();
        for (TSPairObject ts : res) {
            Document document = new Document();
            document.put("feature_id", "test");
            document.put("TT", ts.getDt());
            document.put("stepvalue", ts.getValue());
            documentList.add(document);
        }

        for (String collectionName : collectionList) {
            long start = System.currentTimeMillis();
            mongoTemplate.insert(documentList, collectionName);
            long end = System.currentTimeMillis();
            log.info("BulkInsert into {}, taking {}ms, size = {}", collectionName, end - start, documentList.size());
        }
    }
```

### 单线程 mongoTemplate.bulkOps()

```java
@Test
    public void insertSingleThreadTest() {
        List<String> collectionList = Arrays.asList("swmm_test1", "swmm_test2", "swmm_test3", "swmm_test4");
        List<TSPairObject> res = new ArrayList<>();
        Date time = TimeUtil.getExactlyDate(2023,5,12, 6, 10, 30);
        for (int i = 0; i < 300000; i++) {
            time = TimeUtil.getDateHowManyMinutesAgo(time, -1);
            res.add(new TSPairObject(time, new Random().nextDouble()));
        }
        List<Document> documentList = new ArrayList<>();
        for (TSPairObject ts : res) {
            Document document = new Document();
            document.put("feature_id", "test");
            document.put("TT", ts.getDt());
            document.put("stepvalue", ts.getValue());
            documentList.add(document);
        }

        for (String collectionName : collectionList) {
            long start = System.currentTimeMillis();
            mongoTemplate.bulkOps(BulkOperations.BulkMode.UNORDERED, FileEntity.class, collectionName).insert(documentList).execute();
            long end = System.currentTimeMillis();
            log.info("BulkInsert into {}, taking {}ms, size = {}", collectionName, end - start, documentList.size());
        }
    }
```

### 多线程分表插入

```java
private static final ThreadPoolExecutor writer = new ThreadPoolExecutor(2, 2, 5L, TimeUnit.SECONDS,
        new LinkedBlockingQueue<>(10), new NamedThreadFactory("writer pool"), new ThreadPoolExecutor.CallerRunsPolicy());

@Test
public void insertTest() throws InterruptedException {
        List<String> collectionList = Arrays.asList("swmm_test1", "swmm_test2", "swmm_test3", "swmm_test4");
        List<TSPairObject> res = new ArrayList<>();
        Date time = TimeUtil.getExactlyDate(2023,5,12, 6, 10, 30);
        for (int i = 0; i < 300000; i++) {
            time = TimeUtil.getDateHowManyMinutesAgo(time, -1);
            res.add(new TSPairObject(time, new Random().nextDouble()));
        }
        List<Document> documentList = new ArrayList<>();
        for (TSPairObject ts : res) {
            Document document = new Document();
            document.put("feature_id", "test");
            document.put("TT", ts.getDt());
            document.put("stepvalue", ts.getValue());
            documentList.add(document);
        }

        for (String collectionName : collectionList) {
            insertBulk(documentList, collectionName);
        }
        Thread.sleep(200000);
    }

private void insertBulk(List<Document> documentList, String collectionName) {
    writer.submit(()->{
        long start = System.currentTimeMillis();
        mongoTemplate.bulkOps(BulkOperations.BulkMode.UNORDERED, FileEntity.class, collectionName).insert(documentList).execute();
        long end = System.currentTimeMillis();
        log.info("BulkInsert into {}, taking {}ms, size = {}", collectionName, end - start, documentList.size());
    });
}
```

### 多线程分片插入

```java
private static final ThreadPoolExecutor writer = new ThreadPoolExecutor(4, 4, 5L, TimeUnit.SECONDS,
        new LinkedBlockingQueue<>(10), new NamedThreadFactory("writer pool"), new ThreadPoolExecutor.CallerRunsPolicy());

@Test
public void shardingInsertTest() throws InterruptedException {
    List<String> collectionList = Arrays.asList("swmm_test1", "swmm_test2", "swmm_test3", "swmm_test4");
    List<TSPairObject> res = new ArrayList<>();
    Date time = TimeUtil.getExactlyDate(2023,5,12, 6, 10, 30);
    for (int i = 0; i < 300000; i++) {
        time = TimeUtil.getDateHowManyMinutesAgo(time, -1);
        res.add(new TSPairObject(time, new Random().nextDouble()));
    }
    List<Document> documentList = new ArrayList<>();
    for (TSPairObject ts : res) {
        Document document = new Document();
        document.put("feature_id", "test");
        document.put("TT", ts.getDt());
        document.put("stepvalue", ts.getValue());
        documentList.add(document);
    }
    int batchSize = 5000;
    double length = documentList.size();
    int shardingSize = (int) Math.ceil(length / batchSize);
    for (String collectionName : collectionList) {
        for (int i = 0; i < shardingSize; i++) {
            List<Document> sharingList;
            if (i + 1 == shardingSize) {
                int startIndex = i * batchSize;
                int endIndex = (int) length;
                sharingList = documentList.subList(startIndex, endIndex);
            } else {
                int startIndex = i * batchSize;
                int endIndex = (i + 1) * batchSize;
                sharingList = documentList.subList(startIndex, endIndex);
            }
            insertBulk(sharingList, collectionName);
        }
    }
    Thread.sleep(200000);
}
private void insertBulk(List<Document> documentList, String collectionName) {
    writer.submit(()->{
        long start = System.currentTimeMillis();
        mongoTemplate.bulkOps(BulkOperations.BulkMode.UNORDERED, FileEntity.class, collectionName).insert(documentList).execute();
        long end = System.currentTimeMillis();
        log.info("BulkInsert into {}, taking {}ms, size = {}", collectionName, end - start, documentList.size());
    });
}
```

这里可以看到，主线程也在执行插入任务。

```shell
2023-05-16 14:04:43.517  INFO 7268 --- [  writer pool-3] com.hj2.forecast.xxljob.MongoInsertTest  : BulkInsert into swmm_test1, taking 608ms, size = 10000
2023-05-16 14:04:43.619  INFO 7268 --- [  writer pool-4] com.hj2.forecast.xxljob.MongoInsertTest  : BulkInsert into swmm_test1, taking 461ms, size = 10000
2023-05-16 14:04:43.635  INFO 7268 --- [  writer pool-2] com.hj2.forecast.xxljob.MongoInsertTest  : BulkInsert into swmm_test1, taking 670ms, size = 10000
2023-05-16 14:04:43.689  INFO 7268 --- [    writer pool] com.hj2.forecast.xxljob.MongoInsertTest  : BulkInsert into swmm_test1, taking 532ms, size = 10000
2023-05-16 14:04:43.729  INFO 7268 --- [           main] com.hj2.forecast.xxljob.MongoInsertTest  : BulkInsert into swmm_test1, taking 701ms, size = 10000
```
