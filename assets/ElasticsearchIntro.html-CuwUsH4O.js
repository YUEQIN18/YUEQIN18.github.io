import{_ as n}from"./plugin-vue_export-helper-DlAUqK2U.js";import{o as s,c as e,b as a}from"./app-DI4bkZkG.js";const i={},l=a(`<h1 id="elasticsearch基础篇" tabindex="-1"><a class="header-anchor" href="#elasticsearch基础篇"><span>Elasticsearch基础篇</span></a></h1><h2 id="elasticsearch-是什么" tabindex="-1"><a class="header-anchor" href="#elasticsearch-是什么"><span><strong>Elasticsearch 是什么</strong></span></a></h2><p>Elasticsearch(ES)是一个基于 Apache 的开源索引库 Lucene 而构建的 <strong>开源、分布式、具有 RESTful 接口的全文搜索引擎</strong>, 还是一个 <strong>分布式文档数据库</strong></p><p>ES 可以轻松扩展数以百计的服务器(水平扩展), 用于存储和处理数据. 它可以在很短的时间内存储、搜索和分析海量数据, 通常被作为复杂搜索场景下的核心引擎</p><blockquote><p>由于 Lucene 提供的 API 操作起来非常繁琐, 需要编写大量的代码, Elasticsearch 对 Lucene 进行了封装与优化, 并提供了 REST 风格的操作接口, 开箱即用, 很大程度上方便了开发人员的使用</p></blockquote><h2 id="elasticsearch-的优点" tabindex="-1"><a class="header-anchor" href="#elasticsearch-的优点"><span><strong>Elasticsearch 的优点</strong></span></a></h2><ol><li>横向可扩展性：作为大型分布式集群, 很容易就能扩展新的服务器到 ES 集群中; 也可运行在单机上作为<strong>轻量级搜索引擎</strong>使用</li><li>更丰富的功能：与传统关系型数据库相比, ES 提供了<strong>全文检索</strong>、同义词处理、相关度排名、复杂数据分析、海量数据的近实时处理等功能</li><li>分片机制提供更好地分布性：同一个索引被分为多个分片(Shard), 利用分而治之的思想提升处理效率</li><li>高可用：提供副本(Replica)机制, 一个分片可以设置多个副本, 即使在某些服务器宕机后, 集群仍能正常工作</li><li>开箱即用：提供简单易用的 API, 服务的搭建、部署和使用都很容易操作</li></ol><h2 id="elasticsearch-的使用场景" tabindex="-1"><a class="header-anchor" href="#elasticsearch-的使用场景"><span>**Elasticsearch **的使用场景</span></a></h2><ol><li>维基百科：全文检索, 高亮, 搜索推荐</li><li>新闻检索：用户行为日志(点击, 浏览, 收藏, 评论) + 社交网络数据(对某某新闻的相关看法), 数据分析(将公众对文章的反馈提交至文章作者)</li><li>日志分析：ELK 技术栈(Elasticsearch + Logstash + Kibana)对日志数据进行采集&amp;分析</li><li>数据分析：BI 系统(Business Intelligence, 商业智能): 分析某区域最近 3 年的用户消费额的趋势、用户群体的组成结构等</li><li>其他应用：电商、招聘、门户等网站的内部搜索服务, IT 系统(OA, CRM, ERP 等)的内部搜索服务</li></ol><h2 id="elasticsearch-的核心概念" tabindex="-1"><a class="header-anchor" href="#elasticsearch-的核心概念"><span>**Elasticsearch **的核心概念</span></a></h2><h3 id="集群-cluster" tabindex="-1"><a class="header-anchor" href="#集群-cluster"><span><strong>集群（cluster）</strong></span></a></h3><p>代表一个集群，集群中有多个节点（node），其中有一个为主节点，这个主节点是可以通过选举产生的，主从节点是对于集群内部来说的。es 的一个概念就是去中心化，字面上理解就是无中心节点，这是对于集群外部来说的，因为从外部来看 es 集群，在逻辑上是个整体，你与任何一个节点的通信和与整个 es 集群通信是等价的。</p><h3 id="索引-index" tabindex="-1"><a class="header-anchor" href="#索引-index"><span><strong>索引（index）</strong></span></a></h3><p>Elasticsearch 将它的数据存储在一个或多个索引（index）中。用 SQL 领域的术语来类比，索引就像数据库，可以向索引写入文档或者从索引中读取文档，并通过 Elasticsearch 内部使用 Lucene 将数据写入索引或从索引中检索数据。</p><h3 id="分片和副本-shards-and-replicas" tabindex="-1"><a class="header-anchor" href="#分片和副本-shards-and-replicas"><span><strong>分片和副本（shards and replicas）</strong></span></a></h3><p>一个索引可以存储超出单个结点硬件限制的大量数据。比如，一个具有 10 亿文档的索引占据 1TB 的磁盘空间，而任一节点可能没有这样大的磁盘空间来存储或者单个节点处理搜索请求，响应会太慢。</p><p>为了解决这个问题，Elasticsearch 提供了将索引划分成多片的能力，这些片叫做分片。当你创建一个索引的时候，你可以指定你想要的分片的数量。每个分片本身也是一个功能完善并且独立的&quot;索引&quot;，这个&quot;索引&quot; 可以被放置到集群中的任何节点上。</p><p>分片之所以重要，主要有两方面的原因：</p><ul><li>允许你水平分割/扩展你的内容容量</li><li>允许你在分片（位于多个节点上）之上进行分布式的、并行的操作，进而提高性能/吞吐量 至于一个分片怎样分布，它的文档怎样聚合回搜索请求，是完全由 Elasticsearch 管理的，对于作为用户的你来说，这些都是透明的。</li></ul><p>在一个网络/云的环境里，失败随时都可能发生。在某个分片/节点因为某些原因处于离线状态或者消失的情况下，故障转移机制是非常有用且强烈推荐的。为此， Elasticsearch 允许你创建分片的一份或多份拷贝，这些拷贝叫做<strong>副本分片</strong>，或者直接叫<strong>副本</strong>。</p><p>副本之所以重要，有两个主要原因：</p><ul><li>在分片/节点失败的情况下，复制提供了<strong>高可用性</strong>。复制分片不与原/主要分片置于同一节点上是非常重要的。因为搜索可以在所有的复制上并行运行，复制可以扩展你的搜索量/吞吐量</li><li>总之，每个索引可以被分成多个分片。一个索引也可以被复制 0 次（即没有复制） 或多次。一旦复制了，每个索引就有了主分片和副本分片（主分片的拷贝）。</li><li>分片和副本的数量可以在索引创建的时候指定。在索引创建之后，你可以在任何时候动态地改变副本的数量，但是你不能再改变分片的数量。</li><li>ES6.0 版本之前默认配置：5 个主分片，1 个副本分片</li></ul><p>默认情况下，Elasticsearch 中的每个索引分配 5 个主分片和 1 个副本。这意味着，如果你的集群中<strong>至少有两个节点</strong>，你的索引将会有 5 个主分片和另外 5 个副本分片（1 个完全拷贝），这样每个索引总共就有 10 个分片。</p><h3 id="映射-mapping" tabindex="-1"><a class="header-anchor" href="#映射-mapping"><span><strong>映射（mapping）</strong></span></a></h3><p>所有文档写进索引之前都会先进行分析，如何将输入的文本分割为词条、哪些词条又会被过滤，这种行为叫做映射（mapping）。一般由用户自己定义规则。</p><h3 id="类型-type" tabindex="-1"><a class="header-anchor" href="#类型-type"><span><strong>类型（type）</strong></span></a></h3><p>每个文档都有与之对应的类型（type）定义。这允许用户在一个索引中存储多种文档类型，并为不同文档提供类型提供不同的映射。</p><h3 id="文档-document" tabindex="-1"><a class="header-anchor" href="#文档-document"><span><strong>文档（document）</strong></span></a></h3><p>文档（document）是 Elasticsearch 中的主要实体。对所有使用 Elasticsearch 的案例来说，他们最终都可以归结为对文档的搜索。文档由字段构成。</p><h1 id="安装与部署" tabindex="-1"><a class="header-anchor" href="#安装与部署"><span>安装与部署</span></a></h1><h1 id="配置文件" tabindex="-1"><a class="header-anchor" href="#配置文件"><span>配置文件</span></a></h1><blockquote><p>config/elasticsearch.yml 主配置文件 config/jvm.options jvm 参数配置文件 cofnig/log4j2.properties 日志配置文件</p></blockquote><h2 id="elasticsearch-yml-详解" tabindex="-1"><a class="header-anchor" href="#elasticsearch-yml-详解"><span><strong>elasticsearch.yml 详解</strong></span></a></h2><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token comment">##################### Elasticsearch Configuration Example ##################### </span>
<span class="token comment">#</span>
<span class="token comment"># 只是挑些重要的配置选项进行注释,其实自带的已经有非常细致的英文注释了!</span>
<span class="token comment"># https://www.elastic.co/guide/en/elasticsearch/reference/current/modules.html</span>
<span class="token comment">#</span>
<span class="token comment">################################### Cluster ################################### </span>
<span class="token comment"># 代表一个集群,集群中有多个节点,其中有一个为主节点,这个主节点是可以通过选举产生的,主从节点是对于集群内部来说的. </span>
<span class="token comment"># es的一个概念就是去中心化,字面上理解就是无中心节点,这是对于集群外部来说的,因为从外部来看es集群,在逻辑上是个整体,你与任何一个节点的通信和与整个es集群通信是等价的。 </span>
<span class="token comment"># cluster.name可以确定你的集群名称,当你的elasticsearch集群在同一个网段中elasticsearch会自动的找到具有相同cluster.name的elasticsearch服务. </span>
<span class="token comment"># 所以当同一个网段具有多个elasticsearch集群时cluster.name就成为同一个集群的标识. </span>

<span class="token comment"># cluster.name: elasticsearch </span>

<span class="token comment">#################################### Node ##################################### </span>
<span class="token comment"># https://www.elastic.co/guide/en/elasticsearch/reference/5.1/modules-node.html#master-node</span>
<span class="token comment"># 节点名称同理,可自动生成也可手动配置. </span>
<span class="token comment"># node.name: node-1</span>

<span class="token comment"># 允许一个节点是否可以成为一个master节点,es是默认集群中的第一台机器为master,如果这台机器停止就会重新选举master. </span>
<span class="token comment"># node.master: true </span>

<span class="token comment"># 允许该节点存储数据(默认开启) </span>
<span class="token comment"># node.data: true </span>

<span class="token comment"># 配置文件中给出了三种配置高性能集群拓扑结构的模式,如下： </span>
<span class="token comment"># 1. 如果你想让节点从不选举为主节点,只用来存储数据,可作为负载器 </span>
<span class="token comment"># node.master: false </span>
<span class="token comment"># node.data: true </span>
<span class="token comment"># node.ingest: true  #默认true</span>

<span class="token comment"># 2. 如果想让节点成为主节点,且不存储任何数据,并保有空闲资源,可作为协调器 </span>
<span class="token comment"># node.master: true </span>
<span class="token comment"># node.data: false</span>
<span class="token comment"># node.ingest: true</span>

<span class="token comment"># 3. 如果想让节点既不称为主节点,又不成为数据节点,那么可将他作为搜索器,从节点中获取数据,生成搜索结果等 </span>
<span class="token comment"># node.master: false </span>
<span class="token comment"># node.data: false </span>
<span class="token comment"># node.ingest: true</span>
<span class="token comment">#</span>

<span class="token comment"># 4. 仅作为协调器 </span>
<span class="token comment"># node.master: false </span>
<span class="token comment"># node.data: false</span>
<span class="token comment"># node.ingest: false</span>

<span class="token comment"># 监控集群状态有一下插件和API可以使用: </span>
<span class="token comment"># Use the Cluster Health API [http://localhost:9200/_cluster/health], the </span>
<span class="token comment"># Node Info API [http://localhost:9200/_nodes] or GUI tools # such as &lt;http://www.elasticsearch.org/overview/marvel/&gt;, </span>


<span class="token comment"># A node can have generic attributes associated with it, which can later be used </span>
<span class="token comment"># for customized shard allocation filtering, or allocation awareness. An attribute </span>
<span class="token comment"># is a simple key value pair, similar to node.key: value, here is an example: </span>
<span class="token comment"># 每个节点都可以定义一些与之关联的通用属性，用于后期集群进行碎片分配时的过滤</span>
<span class="token comment"># node.rack: rack314 </span>

<span class="token comment"># 默认情况下，多个节点可以在同一个安装路径启动，如果你想让你的es只启动一个节点，可以进行如下设置</span>
<span class="token comment"># node.max_local_storage_nodes: 1 </span>

<span class="token comment">#################################### Index #################################### </span>
<span class="token comment"># 设置索引的分片数,默认为5 </span>
<span class="token comment">#index.number_of_shards: 5 </span>

<span class="token comment"># 设置索引的副本数,默认为1: </span>
<span class="token comment">#index.number_of_replicas: 1 </span>

<span class="token comment"># 配置文件中提到的最佳实践是,如果服务器够多,可以将分片提高,尽量将数据平均分布到大集群中去</span>
<span class="token comment"># 同时,如果增加副本数量可以有效的提高搜索性能 </span>
<span class="token comment"># 需要注意的是,&quot;number_of_shards&quot; 是索引创建后一次生成的,后续不可更改设置 </span>
<span class="token comment"># &quot;number_of_replicas&quot; 是可以通过API去实时修改设置的 </span>

<span class="token comment">#################################### Paths #################################### </span>
<span class="token comment"># 配置文件存储位置 </span>
<span class="token comment"># path.conf: /path/to/conf </span>

<span class="token comment"># 数据存储位置(单个目录设置) </span>
<span class="token comment"># path.data: /path/to/data </span>
<span class="token comment"># 多个数据存储位置,有利于性能提升 </span>
<span class="token comment"># path.data: /path/to/data1,/path/to/data2 </span>

<span class="token comment"># 临时文件的路径 </span>
<span class="token comment"># path.work: /path/to/work </span>

<span class="token comment"># 日志文件的路径 </span>
<span class="token comment"># path.logs: /path/to/logs </span>

<span class="token comment"># 插件安装路径 </span>
<span class="token comment"># path.plugins: /path/to/plugins </span>

<span class="token comment">#################################### Plugin ################################### </span>
<span class="token comment"># 设置插件作为启动条件,如果一下插件没有安装,则该节点服务不会启动 </span>
<span class="token comment"># plugin.mandatory: mapper-attachments,lang-groovy </span>

<span class="token comment">################################### Memory #################################### </span>
<span class="token comment"># 当JVM开始写入交换空间时（swapping）ElasticSearch性能会低下,你应该保证它不会写入交换空间 </span>
<span class="token comment"># 设置这个属性为true来锁定内存,同时也要允许elasticsearch的进程可以锁住内存,linux下可以通过 \`ulimit -l unlimited\` 命令 </span>
<span class="token comment"># bootstrap.mlockall: true </span>

<span class="token comment"># 确保 ES_MIN_MEM 和 ES_MAX_MEM 环境变量设置为相同的值,以及机器有足够的内存分配给Elasticsearch </span>
<span class="token comment"># 注意:内存也不是越大越好,一般64位机器,最大分配内存别才超过32G </span>

<span class="token comment">############################## Network And HTTP ############################### </span>
<span class="token comment"># 设置绑定的ip地址,可以是ipv4或ipv6的,默认为0.0.0.0 </span>
<span class="token comment"># network.bind_host: 192.168.0.1   #只有本机可以访问http接口</span>

<span class="token comment"># 设置其它节点和该节点交互的ip地址,如果不设置它会自动设置,值必须是个真实的ip地址 </span>
<span class="token comment"># network.publish_host: 192.168.0.1 </span>

<span class="token comment"># 同时设置bind_host和publish_host上面两个参数 </span>
<span class="token comment"># network.host: 192.168.0.1    #绑定监听IP</span>

<span class="token comment"># 设置节点间交互的tcp端口,默认是9300 </span>
<span class="token comment"># transport.tcp.port: 9300 </span>

<span class="token comment"># 设置是否压缩tcp传输时的数据，默认为false,不压缩</span>
<span class="token comment"># transport.tcp.compress: true </span>

<span class="token comment"># 设置对外服务的http端口,默认为9200 </span>
<span class="token comment"># http.port: 9200 </span>

<span class="token comment"># 设置请求内容的最大容量,默认100mb </span>
<span class="token comment"># http.max_content_length: 100mb </span>

<span class="token comment"># 使用http协议对外提供服务,默认为true,开启 </span>
<span class="token comment"># http.enabled: false </span>

<span class="token comment">###################### 使用head等插件监控集群信息，需要打开以下配置项 ###########</span>
<span class="token comment"># http.cors.enabled: true</span>
<span class="token comment"># http.cors.allow-origin: &quot;*&quot;</span>
<span class="token comment"># http.cors.allow-credentials: true</span>

<span class="token comment">################################### Gateway ################################### </span>
<span class="token comment"># gateway的类型,默认为local即为本地文件系统,可以设置为本地文件系统 </span>
<span class="token comment"># gateway.type: local </span>

<span class="token comment"># 下面的配置控制怎样以及何时启动一整个集群重启的初始化恢复过程 </span>
<span class="token comment"># (当使用shard gateway时,是为了尽可能的重用local data(本地数据)) </span>

<span class="token comment"># 一个集群中的N个节点启动后,才允许进行恢复处理 </span>
<span class="token comment"># gateway.recover_after_nodes: 1 </span>

<span class="token comment"># 设置初始化恢复过程的超时时间,超时时间从上一个配置中配置的N个节点启动后算起 </span>
<span class="token comment"># gateway.recover_after_time: 5m </span>

<span class="token comment"># 设置这个集群中期望有多少个节点.一旦这N个节点启动(并且recover_after_nodes也符合), </span>
<span class="token comment"># 立即开始恢复过程(不等待recover_after_time超时) </span>
<span class="token comment"># gateway.expected_nodes: 2</span>

 <span class="token comment">############################# Recovery Throttling ############################# </span>
<span class="token comment"># 下面这些配置允许在初始化恢复,副本分配,再平衡,或者添加和删除节点时控制节点间的分片分配 </span>
<span class="token comment"># 设置一个节点的并行恢复数 </span>
<span class="token comment"># 1.初始化数据恢复时,并发恢复线程的个数,默认为4 </span>
<span class="token comment"># cluster.routing.allocation.node_initial_primaries_recoveries: 4 </span>

<span class="token comment"># 2.添加删除节点或负载均衡时并发恢复线程的个数,默认为2 </span>
<span class="token comment"># cluster.routing.allocation.node_concurrent_recoveries: 2 </span>

<span class="token comment"># 设置恢复时的吞吐量(例如:100mb,默认为0无限制.如果机器还有其他业务在跑的话还是限制一下的好) </span>
<span class="token comment"># indices.recovery.max_bytes_per_sec: 20mb </span>

<span class="token comment"># 设置来限制从其它分片恢复数据时最大同时打开并发流的个数,默认为5 </span>
<span class="token comment"># indices.recovery.concurrent_streams: 5 </span>
<span class="token comment"># 注意: 合理的设置以上参数能有效的提高集群节点的数据恢复以及初始化速度 </span>

<span class="token comment">################################## Discovery ################################## </span>
<span class="token comment"># 设置这个参数来保证集群中的节点可以知道其它N个有master资格的节点.默认为1,对于大的集群来说,可以设置大一点的值(2-4) </span>
<span class="token comment"># discovery.zen.minimum_master_nodes: 1 </span>
<span class="token comment"># 探查的超时时间,默认3秒,提高一点以应对网络不好的时候,防止脑裂 </span>
<span class="token comment"># discovery.zen.ping.timeout: 3s </span>

<span class="token comment"># For more information, see </span>
<span class="token comment"># &lt;http://elasticsearch.org/guide/en/elasticsearch/reference/current/modules-discovery-zen.html&gt; </span>

<span class="token comment"># 设置是否打开多播发现节点.默认是true. </span>
<span class="token comment"># 当多播不可用或者集群跨网段的时候集群通信还是用单播吧 </span>
<span class="token comment"># discovery.zen.ping.multicast.enabled: false </span>

<span class="token comment"># 这是一个集群中的主节点的初始列表,当节点(主节点或者数据节点)启动时使用这个列表进行探测 </span>
<span class="token comment"># discovery.zen.ping.unicast.hosts: [&quot;host1&quot;, &quot;host2:port&quot;] </span>

<span class="token comment"># Slow Log部分与GC log部分略,不过可以通过相关日志优化搜索查询速度 </span>

<span class="token comment">################  X-Pack ###########################################</span>
<span class="token comment"># 官方插件 相关设置请查看此处</span>
<span class="token comment"># https://www.elastic.co/guide/en/x-pack/current/xpack-settings.html</span>
<span class="token comment"># </span>
<span class="token comment">############## Memory(重点需要调优的部分) ################ </span>
<span class="token comment"># Cache部分: </span>
<span class="token comment"># es有很多种方式来缓存其内部与索引有关的数据.其中包括filter cache </span>

<span class="token comment"># filter cache部分: </span>
<span class="token comment"># filter cache是用来缓存filters的结果的.默认的cache type是node type.node type的机制是所有的索引内部的分片共享filter cache.node type采用的方式是LRU方式.即:当缓存达到了某个临界值之后，es会将最近没有使用的数据清除出filter cache.使让新的数据进入es. </span>

<span class="token comment"># 这个临界值的设置方法如下：indices.cache.filter.size 值类型：eg.:512mb 20%。默认的值是10%。 </span>

<span class="token comment"># out of memory错误避免过于频繁的查询时集群假死 </span>
<span class="token comment"># 1.设置es的缓存类型为Soft Reference,它的主要特点是据有较强的引用功能.只有当内存不够的时候,才进行回收这类内存,因此在内存足够的时候,它们通常不被回收.另外,这些引用对象还能保证在Java抛出OutOfMemory异常之前,被设置为null.它可以用于实现一些常用图片的缓存,实现Cache的功能,保证最大限度的使用内存而不引起OutOfMemory.在es的配置文件加上index.cache.field.type: soft即可. </span>

<span class="token comment"># 2.设置es最大缓存数据条数和缓存失效时间,通过设置index.cache.field.max_size: 50000来把缓存field的最大值设置为50000,设置index.cache.field.expire: 10m把过期时间设置成10分钟. </span>
<span class="token comment"># index.cache.field.max_size: 50000 </span>
<span class="token comment"># index.cache.field.expire: 10m </span>
<span class="token comment"># index.cache.field.type: soft </span>

<span class="token comment"># field data部分&amp;&amp;circuit breaker部分： </span>
<span class="token comment"># 用于fielddata缓存的内存数量,主要用于当使用排序,faceting操作时,elasticsearch会将一些热点数据加载到内存中来提供给客户端访问,但是这种缓存是比较珍贵的,所以对它进行合理的设置. </span>

<span class="token comment"># 可以使用值：eg:50mb 或者 30％(节点 node heap内存量),默认是：unbounded #indices.fielddata.cache.size： unbounded </span>
<span class="token comment"># field的超时时间.默认是-1,可以设置的值类型: 5m #indices.fielddata.cache.expire: -1 </span>

<span class="token comment"># circuit breaker部分: </span>
<span class="token comment"># 断路器是elasticsearch为了防止内存溢出的一种操作,每一种circuit breaker都可以指定一个内存界限触发此操作,这种circuit breaker的设定有一个最高级别的设定:indices.breaker.total.limit 默认值是JVM heap的70%.当内存达到这个数量的时候会触发内存回收</span>

<span class="token comment"># 另外还有两组子设置： </span>
<span class="token comment">#indices.breaker.fielddata.limit:当系统发现fielddata的数量达到一定数量时会触发内存回收.默认值是JVM heap的70% </span>
<span class="token comment">#indices.breaker.fielddata.overhead:在系统要加载fielddata时会进行预先估计,当系统发现要加载进内存的值超过limit * overhead时会进行进行内存回收.默认是1.03 </span>
<span class="token comment">#indices.breaker.request.limit:这种断路器是elasticsearch为了防止OOM(内存溢出),在每次请求数据时设定了一个固定的内存数量.默认值是40% </span>
<span class="token comment">#indices.breaker.request.overhead:同上,也是elasticsearch在发送请求时设定的一个预估系数,用来防止内存溢出.默认值是1 </span>

<span class="token comment"># Translog部分: </span>
<span class="token comment"># 每一个分片(shard)都有一个transaction log或者是与它有关的预写日志,(write log),在es进行索引(index)或者删除(delete)操作时会将没有提交的数据记录在translog之中,当进行flush 操作的时候会将tranlog中的数据发送给Lucene进行相关的操作.一次flush操作的发生基于如下的几个配置 </span>
<span class="token comment">#index.translog.flush_threshold_ops:当发生多少次操作时进行一次flush.默认是 unlimited #index.translog.flush_threshold_size:当translog的大小达到此值时会进行一次flush操作.默认是512mb </span>
<span class="token comment">#index.translog.flush_threshold_period:在指定的时间间隔内如果没有进行flush操作,会进行一次强制flush操作.默认是30m #index.translog.interval:多少时间间隔内会检查一次translog,来进行一次flush操作.es会随机的在这个值到这个值的2倍大小之间进行一次操作,默认是5s </span>
<span class="token comment">#index.gateway.local.sync:多少时间进行一次的写磁盘操作,默认是5s </span>

<span class="token comment"># 以上的translog配置都可以通过API进行动态的设置 - See more at: http://bigbo.github.io/pages/2015/04/10/elasticsearch_config/#sthash.AvOSUcQ4.dpuf</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,34),c=[l];function t(o,d){return s(),e("div",null,c)}const p=n(i,[["render",t],["__file","ElasticsearchIntro.html.vue"]]),v=JSON.parse('{"path":"/posts/database/ElasticsearchIntro.html","title":"Elasticsearch基础篇","lang":"zh-CN","frontmatter":{"title":"Elasticsearch基础篇","order":1,"author":"Roy","date":"2024-03-01T00:00:00.000Z","category":["数据库"],"tag":["数据库","MongoDB"],"sticky":false,"star":true,"copyright":"Copyright © 2024 Roy","description":"Elasticsearch基础篇 Elasticsearch 是什么 Elasticsearch(ES)是一个基于 Apache 的开源索引库 Lucene 而构建的 开源、分布式、具有 RESTful 接口的全文搜索引擎, 还是一个 分布式文档数据库 ES 可以轻松扩展数以百计的服务器(水平扩展), 用于存储和处理数据. 它可以在很短的时间内存储、搜...","head":[["meta",{"property":"og:url","content":"https://YUEQIN18.github.io/posts/database/ElasticsearchIntro.html"}],["meta",{"property":"og:site_name","content":"Roy的博客"}],["meta",{"property":"og:title","content":"Elasticsearch基础篇"}],["meta",{"property":"og:description","content":"Elasticsearch基础篇 Elasticsearch 是什么 Elasticsearch(ES)是一个基于 Apache 的开源索引库 Lucene 而构建的 开源、分布式、具有 RESTful 接口的全文搜索引擎, 还是一个 分布式文档数据库 ES 可以轻松扩展数以百计的服务器(水平扩展), 用于存储和处理数据. 它可以在很短的时间内存储、搜..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2024-05-31T10:27:11.000Z"}],["meta",{"property":"article:author","content":"Roy"}],["meta",{"property":"article:tag","content":"数据库"}],["meta",{"property":"article:tag","content":"MongoDB"}],["meta",{"property":"article:published_time","content":"2024-03-01T00:00:00.000Z"}],["meta",{"property":"article:modified_time","content":"2024-05-31T10:27:11.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"Elasticsearch基础篇\\",\\"image\\":[\\"\\"],\\"datePublished\\":\\"2024-03-01T00:00:00.000Z\\",\\"dateModified\\":\\"2024-05-31T10:27:11.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"Roy\\"}]}"]]},"headers":[{"level":2,"title":"Elasticsearch 是什么","slug":"elasticsearch-是什么","link":"#elasticsearch-是什么","children":[]},{"level":2,"title":"Elasticsearch 的优点","slug":"elasticsearch-的优点","link":"#elasticsearch-的优点","children":[]},{"level":2,"title":"**Elasticsearch **的使用场景","slug":"elasticsearch-的使用场景","link":"#elasticsearch-的使用场景","children":[]},{"level":2,"title":"**Elasticsearch **的核心概念","slug":"elasticsearch-的核心概念","link":"#elasticsearch-的核心概念","children":[{"level":3,"title":"集群（cluster）","slug":"集群-cluster","link":"#集群-cluster","children":[]},{"level":3,"title":"索引（index）","slug":"索引-index","link":"#索引-index","children":[]},{"level":3,"title":"分片和副本（shards and replicas）","slug":"分片和副本-shards-and-replicas","link":"#分片和副本-shards-and-replicas","children":[]},{"level":3,"title":"映射（mapping）","slug":"映射-mapping","link":"#映射-mapping","children":[]},{"level":3,"title":"类型（type）","slug":"类型-type","link":"#类型-type","children":[]},{"level":3,"title":"文档（document）","slug":"文档-document","link":"#文档-document","children":[]}]},{"level":2,"title":"elasticsearch.yml 详解","slug":"elasticsearch-yml-详解","link":"#elasticsearch-yml-详解","children":[]}],"git":{"createdTime":1717151231000,"updatedTime":1717151231000,"contributors":[{"name":"YUEQIN18","email":"qinyue12345@gmail.com","commits":1}]},"readingTime":{"minutes":15.61,"words":4682},"filePathRelative":"posts/database/ElasticsearchIntro.md","localizedDate":"2024年3月1日","excerpt":"\\n<h2><strong>Elasticsearch 是什么</strong></h2>\\n<p>Elasticsearch(ES)是一个基于 Apache 的开源索引库 Lucene 而构建的 <strong>开源、分布式、具有 RESTful 接口的全文搜索引擎</strong>, 还是一个 <strong>分布式文档数据库</strong></p>\\n<p>ES 可以轻松扩展数以百计的服务器(水平扩展), 用于存储和处理数据. 它可以在很短的时间内存储、搜索和分析海量数据, 通常被作为复杂搜索场景下的核心引擎</p>\\n<blockquote>\\n<p>由于 Lucene 提供的 API 操作起来非常繁琐, 需要编写大量的代码, Elasticsearch 对 Lucene 进行了封装与优化, 并提供了 REST 风格的操作接口, 开箱即用, 很大程度上方便了开发人员的使用</p>\\n</blockquote>","autoDesc":true}');export{p as comp,v as data};
