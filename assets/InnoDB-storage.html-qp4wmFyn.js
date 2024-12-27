import{_ as a,c as n,b as l,o as i}from"./app--XYqrjBE.js";const s={};function t(h,e){return i(),n("div",null,e[0]||(e[0]=[l('<h1 id="写给的-mysql-初学者的查询指南" tabindex="-1"><a class="header-anchor" href="#写给的-mysql-初学者的查询指南"><span>写给的 MySQL 初学者的查询指南</span></a></h1><p>学习 MySQL 数据库是笔者今年的首要任务。在这篇文章中我将使用问答的形式来讲述目前学习到的知识点。</p><h2 id="数据库存储" tabindex="-1"><a class="header-anchor" href="#数据库存储"><span>数据库存储</span></a></h2><p>对比其他数据库，MySQL 是特殊的。它支持多种存储引擎。InnoDB 是 MySQL 的默认存储引擎，当前的优化都是基于此引擎。</p><h3 id="innodb-是如何存储的数据的" tabindex="-1"><a class="header-anchor" href="#innodb-是如何存储的数据的"><span>InnoDB 是如何存储的数据的？</span></a></h3><p>InnoDB 既可以将数据持久化的放到磁盘中，又可以在内存中处理数据。在数据库运行的过程中，数据引擎不断的在磁盘和内存中进行交互。在交互的过程中为了提升性能，将数据划分为许多页（避免一条一条交互）。InnoDB 存储引擎一页默认的大小为 16KB（通过 innodb_page_size 修改）。也就是说，一次至少从磁盘中读取 16KB 的数据到内存中，即使当前只读取了页中的某一条数据。同时一次也会把 16KB 的数据写入磁盘中。</p><p>可以简单的理解，数据库页中存储了多条记录。而这些页以双向链表的形式链接。目前如果需要查询数据的话，我们得从第一页中检索数据直到最后一页。这是不可接受的，这时候就得依靠树结构来优化查询了。</p><p>[数据项 1 - 100] &lt;=&gt; [数据项 101 - 198] &lt;=&gt; [数据项 302 - 400]</p><h3 id="数据表为什么要建立主键-为什么要自增呢" tabindex="-1"><a class="header-anchor" href="#数据表为什么要建立主键-为什么要自增呢"><span>数据表为什么要建立主键？为什么要自增呢？</span></a></h3><p>首先，我们目前的数据页是没有顺序的，我们先考虑先加一个数据项，这里先叫做 id。这时候我们可以在页中添加当前页数据的最大值以及最小值。</p><p>[1,100 数据项 1 - 100] &lt;=&gt; [101,198 数据项 101 - 198] &lt;=&gt; [302,400 数据项 302 - 400]</p><p>接下来我们开始构建树，构建一个多级目录。</p><p>[1,1 101,2 392,3 ]</p><p>[页 1 1,100 数据项 1 - 100] &lt;=&gt; [页2 101,198 数据项 101 - 198] &lt;=&gt; [页3 302,400 数据项 302 - 400]</p><p>假定一页能存储 100 条数据记录，以及 200 条索引记录。那么 4 层结构就是 200 * 200 * 200 * 100 条数据。</p><p>此时我们查询就变成二分查找到第二层，依次进行了 4 次二分查找，耗时很短。</p><p>此时就是聚簇索引：以主键的大小作为记录的规则排序，在叶子节点储存表中所有的列。</p><p>事实上，InnoDB 会为所有没有主键的表建立，如果超过了 2 的 48 次方后就会清零，所以我们需要为每一个表建立主键。不可靠远比不可用更危险。</p><h3 id="索引是如何能够优化查询的" tabindex="-1"><a class="header-anchor" href="#索引是如何能够优化查询的"><span>索引是如何能够优化查询的？</span></a></h3><p>如果我们是以主键作为查询条件，我</p><h2 id="索引优化" tabindex="-1"><a class="header-anchor" href="#索引优化"><span>索引优化</span></a></h2><h3 id="什么是覆盖索引-有什么作用" tabindex="-1"><a class="header-anchor" href="#什么是覆盖索引-有什么作用"><span>什么是覆盖索引？有什么作用？</span></a></h3><p>针对二级索引，我们是需要先去查一次索引，然后再去回表。但实际上，我们如果只需要查询索引和主键的话，我们就可以不用回表了。</p><p>也就是说我们</p><h3 id="有什么不好的查询吗" tabindex="-1"><a class="header-anchor" href="#有什么不好的查询吗"><span>有什么不好的查询吗？</span></a></h3><p>条件字段函数操作</p><p>隐式类型转换</p><h3 id="什么是前缀索引-有什么作用" tabindex="-1"><a class="header-anchor" href="#什么是前缀索引-有什么作用"><span>什么是前缀索引？有什么作用？</span></a></h3><h3 id="什么是唯一索引-有什么作用" tabindex="-1"><a class="header-anchor" href="#什么是唯一索引-有什么作用"><span>什么是唯一索引？有什么作用？</span></a></h3><h3 id="什么是索引合并-有什么作用" tabindex="-1"><a class="header-anchor" href="#什么是索引合并-有什么作用"><span>什么是索引合并？有什么作用？</span></a></h3><h3 id="什么是组合索引-有什么作用" tabindex="-1"><a class="header-anchor" href="#什么是组合索引-有什么作用"><span>什么是组合索引？有什么作用？</span></a></h3><h3 id="使用-in-会影响索引吗-数量呢" tabindex="-1"><a class="header-anchor" href="#使用-in-会影响索引吗-数量呢"><span>使用 in 会影响索引吗？数量呢？</span></a></h3>',32)]))}const p=a(s,[["render",t],["__file","InnoDB-storage.html.vue"]]),d=JSON.parse('{"path":"/mysql/performance/InnoDB-storage.html","title":"写给的 MySQL 初学者的查询指南","lang":"zh-CN","frontmatter":{},"headers":[{"level":2,"title":"数据库存储","slug":"数据库存储","link":"#数据库存储","children":[{"level":3,"title":"InnoDB 是如何存储的数据的？","slug":"innodb-是如何存储的数据的","link":"#innodb-是如何存储的数据的","children":[]},{"level":3,"title":"数据表为什么要建立主键？为什么要自增呢？","slug":"数据表为什么要建立主键-为什么要自增呢","link":"#数据表为什么要建立主键-为什么要自增呢","children":[]},{"level":3,"title":"索引是如何能够优化查询的？","slug":"索引是如何能够优化查询的","link":"#索引是如何能够优化查询的","children":[]}]},{"level":2,"title":"索引优化","slug":"索引优化","link":"#索引优化","children":[{"level":3,"title":"什么是覆盖索引？有什么作用？","slug":"什么是覆盖索引-有什么作用","link":"#什么是覆盖索引-有什么作用","children":[]},{"level":3,"title":"有什么不好的查询吗？","slug":"有什么不好的查询吗","link":"#有什么不好的查询吗","children":[]},{"level":3,"title":"什么是前缀索引？有什么作用？","slug":"什么是前缀索引-有什么作用","link":"#什么是前缀索引-有什么作用","children":[]},{"level":3,"title":"什么是唯一索引？有什么作用？","slug":"什么是唯一索引-有什么作用","link":"#什么是唯一索引-有什么作用","children":[]},{"level":3,"title":"什么是索引合并？有什么作用？","slug":"什么是索引合并-有什么作用","link":"#什么是索引合并-有什么作用","children":[]},{"level":3,"title":"什么是组合索引？有什么作用？","slug":"什么是组合索引-有什么作用","link":"#什么是组合索引-有什么作用","children":[]},{"level":3,"title":"使用 in 会影响索引吗？数量呢？","slug":"使用-in-会影响索引吗-数量呢","link":"#使用-in-会影响索引吗-数量呢","children":[]}]}],"git":{"updatedTime":1691424102000,"contributors":[{"name":"wsafight","email":"984292420@qq.com","commits":1}]},"filePathRelative":"mysql/performance/InnoDB-storage.md"}');export{p as comp,d as data};