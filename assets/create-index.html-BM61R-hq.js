import{_ as n,c as i,b as a,o as s}from"./app--XYqrjBE.js";const l={};function t(r,e){return s(),i("div",null,e[0]||(e[0]=[a(`<h1 id="建立索引" tabindex="-1"><a class="header-anchor" href="#建立索引"><span>建立索引</span></a></h1><p>MYSQL 索引有很多用途，例如。</p><ul><li>保持数据完整性（主键，外键以及唯一键）</li><li>优化数据访问性能</li><li>改进表的连接操作(join)</li><li>对结果进行排序（order）</li><li>简化聚合数据操作(group)</li></ul><p>但添加索引会导致数据表插入慢数倍。</p><p>mk-duplicate-key-checker</p><p>通常建立索引是数据库优化的重要方式，在决定添加索引之前，通常应该至少做两项检查: 首先验证表现有的结构，然后确认表的大小。</p><p>展示 table_name 的结构，\\G 语句终止符可以让返回的结果垂直展示。</p><div class="language-SQL line-numbers-mode" data-highlighter="prismjs" data-ext="SQL" data-title="SQL"><pre><code><span class="line">SHOW CREATE TABLE table_name\\G</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><div class="language-SQL line-numbers-mode" data-highlighter="prismjs" data-ext="SQL" data-title="SQL"><pre><code><span class="line">SHOW INDEXES FROM table_name\\G</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><div class="language-SQL line-numbers-mode" data-highlighter="prismjs" data-ext="SQL" data-title="SQL"><pre><code><span class="line">SHOW TABLE STATUS LIKE table_name\\G</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>对于 InnoDB 表， SHOW TABLE STATUS 除了表保留的物理大小外，没有给出准确的统计数据。行数只是 SQL 优化中使用的粗略估计。</p><p>在分析完数据表后，就可以创建索引了。</p><p>注意： 当创建非主键索引时，KEY 和 INDEX 关键字可以互换。但创建主键索引时只能使用 KEY 关键宇</p><div class="language-SQL line-numbers-mode" data-highlighter="prismjs" data-ext="SQL" data-title="SQL"><pre><code><span class="line">ALTER TABLE &lt;table&gt;</span>
<span class="line">    ADD PRIMARY KEY [index-name] (&lt;column&gt;)</span>
<span class="line"></span>
<span class="line">ALTER TABLE &lt;table&gt;</span>
<span class="line">    ADD [UNIQUE] KEY|INDEX [index-name] (&lt;column&gt;):</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>添加倒叙索引。</p><p>创建索引是一件非常耗时的工作，并且会阻塞其他操作。 开发者可以使用一条 ALTER 语句将给定表上多个索引创建的语句合并 起来。</p><p>https://dev.mysql.com/doc/refman/8.0/en/switchable-optimizations.html</p><div class="language-SQL line-numbers-mode" data-highlighter="prismjs" data-ext="SQL" data-title="SQL"><pre><code><span class="line">SET (@session.optimizerswitch=&#39;indexmerge intersection=off&#39;</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>索引合并（Index Merge）：MySQL把使用多个索引来完成一次查询的执行方法称之为index merge（索引合并）。将把从多个辅助索引获得的主键ID值取Intersection交集、Union并集、Sort-Union排序并集后再统一回表，以减少回表次数（随机IO）。</p><p>索引条件下推（Index Condition Pushdown,ICP）：ICP是一种在存储引擎层使用索引过滤数据的一种优化方式。是对联合索引进行二次过滤之后回表。用于二级索引的range、 ref、 eq_ref或ref_or_null扫描，如果部分where条件能使用索引的字段，MySQL Server会把这部分下推到引擎层，可以利用index过滤的where条件在存储引擎层进行数据过滤。</p><p>基于块的嵌套循环连接（Block Nested-Loop Join，BNL）：先将驱动表得到的结果集存放在Join Buffer内存结构中，再和被驱动表进行匹配查询。减少被驱动表的I/O代价。</p><p>Multi-Range Read（MRR）：MRR在本质上是一种用空间换时间的算法。MRR 通过把「随机磁盘读」，转化为「顺序磁盘读」，从而提高了索引查询的性能。严格意义上说属于非Join的优化算法，对于辅助索引上的范围查询进行优化，收集辅助索引对应主键id，进行排序后再回表，每次传递一组排好序的主键id值给被驱动表，随机IO转换成顺序IO。</p><p>Batched Key Access（BKA）：BKA算法结合了NLJ、BNL、MRR算法的特性。即用到了NLJ的被驱动表关联字段索引减少关联匹配的次数；又使用到了BNL的Join Buffer，用以暂存驱动表连接数据减少访问驱动表；还用到了MRR的收集辅助索引主键id后排序再回表查询，随机IO转换成顺序IO等优化特性集一身，可以把BKA看做是NLJ算法的加强版。即一次性将驱动表存放在Join Buffer中查询所需的一组字段值经过MRR接口将对应主键ID值排好序后再与被驱动表的连接字段（有索引）进行Join操作。</p><p>嵌套循环连接（Simple Nested-Loop Join/Nested-Loop Join）：笛卡尔积。</p><p>基于索引的嵌套循环连接（Index Nested-Loop Join，NLJ）：进行Join查询时，可以用上被驱动表的索引。</p><p>oak-online-alter-table</p><p>删除无效的索引其实更是一种优化。</p>`,27)]))}const p=n(l,[["render",t],["__file","create-index.html.vue"]]),c=JSON.parse('{"path":"/mysql/performance/create-index.html","title":"建立索引","lang":"zh-CN","frontmatter":{},"headers":[],"git":{"updatedTime":1691424102000,"contributors":[{"name":"wsafight","email":"984292420@qq.com","commits":1}]},"filePathRelative":"mysql/performance/create-index.md"}');export{p as comp,c as data};