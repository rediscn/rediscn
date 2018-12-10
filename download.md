---
layout: index
title: Redis 5.0.2 下载
excerpt: Redis下载中心(Redis download)，下载各种版本的redis，包括最新redis 5.0.2稳定版redis,5.0.2-Beta版本以及win32/64版本
permalink: download.html
disqusIdentifier: download
disqusUrl: http://redis.cn/download.html
discuzTid: 854
---

<div class='text'>
          <span id="download" class="anchor"></span><h1><a href="#download" class="anchor-link">*</a>下载</h1>
          <p>
            Redis 使用标准版本标记进行版本控制：<span style="font-weight:bold;">major.minor.patchlevel</span>。偶数的版本号表示稳定的版本，
			例如 1.2，2.0，2.2，2.4，2.6，2.8，奇数的版本号用来表示非标准版本,例如2.9.x是非稳定版本，它的稳定版本是3.0。
          </p>
          <ul class='download-versions'>
            <li>
              <h2>
                非稳定版
              </h2>
              This is where all the development happens. Only for hard-core hackers. Use only if you need to test the latest features or performance improvements. This is going to be the next Redis release in a few months.
              <div class='download-links'>
                <a class='download-link' href='https://github.com/antirez/redis/archive/unstable.tar.gz'>
                  <i class='fa fa-arrow-circle-o-down'></i>
                  Download
                  unstable
                </a>
              </div>
            </li>
            <li>
              <h2>
                稳定版
                <span class='download-version'>(5.0)</span>
              </h2>
			  Redis 5.0 是第一个加入流数据类型（stream data type ）的版本，sorted sets blocking pop operations, LFU/LRU info in RDB, Cluster manager inside redis-cli, active defragmentation V2, HyperLogLogs improvements and many other improvements. Redis 5 was release as GA in October 2018.
              <div class='download-links'>
                <a class='download-link' href='https://raw.githubusercontent.com/antirez/redis/5.0/00-RELEASENOTES'>
                  <i class='fa fa-file-text-o'></i>
                  Release notes
                </a>
                <a class='download-link' href='http://download.redis.io/releases/redis-5.0.2.tar.gz'>
                  <i class='fa fa-arrow-circle-o-down'></i>
                  Download
                  5.0.2
                </a>
              </div>
            </li>
            <li>
              <h2>
                Docker
              </h2>
              It is possible to get Docker images of Redis from the Docker Hub. Multiple versions are available, usually updated in a short time after a new release is available.
              <div class='download-links'>
                <a class='download-link' href='https://hub.docker.com/_/redis/'>
                  <i class='fa fa-arrow-circle-o-down'></i>
                  Download
                  
                </a>
              </div>
            </li>
          </ul>
          <span id="other-versions" class="anchor"></span><h2 ><a href="#other-versions" class="anchor-link">*</a>历史版本</h2>
          <h3>
            Old
            <span class='download-version'>(4.0)</span>
          </h3>
          Redis 4.0 was released as GA in July 2017, newcomers should use Redis 5, but Redis 4 is currently the most production-proven release and will be updated for the next year until Redis 6 will be out. It contains several big improvements: a modules system, much better replication (PSYNC2), improvements to eviction policies, threaded DEL/FLUSH, mixed RDB+AOF format, Raspberry Pi support as primary platform, the new MEMORY command, Redis Cluster support for Nat/Docker, active memory defragmentation, memory usage and performance improvements, much faster Redis Cluster key creation, many other smaller features and a number of behavior fixed.
          <br>
          See the
          <a href='https://raw.githubusercontent.com/antirez/redis/4.0/00-RELEASENOTES'>
            release notes
          </a>
          or
          <a href='http://download.redis.io/releases/redis-4.0.11.tar.gz'>
            download 4.0.11.
          </a>
          <span id="other" class="anchor"></span><h3 ><a href="#other" class="anchor-link">*</a>更多</h3>
          更多的历史版本可以通过
          <a href='https://code.google.com/p/redis/downloads/list?can=1'>Google Code</a>进行下载。
          <p>
            <strong>Scripts and other automatic downloads</strong>
            can easily access the tarball of the latest Redis stable version at
            <a href='http://download.redis.io/redis-stable.tar.gz'>http://download.redis.io/redis-stable.tar.gz</a>.
            The source code of the latest stable release is
            <a href='http://download.redis.io/redis-stable'>always browsable here</a>,
            use the file
            <strong>src/version.h</strong>
            in order to extract the version in an automatic way.
          </p>
          <span id="how-to-verify-files-for-integrity" class="anchor"></span><h2 ><a href="#how-to-verify-files-for-integrity" class="anchor-link">*</a>如何验证文件的完整性</h2>
          <p>
            The Github repository
            <a href='https://github.com/antirez/redis-hashes/blob/master/README'>redis-hashes</a>
            contains a README file with SHA1 digests of released tarball archives.
            Note: the generic redis-stable.tar.gz tarball does not match any hash because it is modified to untar to the redis-stable directory.
          </p>
          <span id="installation" class="anchor"></span><h2 ><a href="#installation" class="anchor-link">*</a>安装</h2>
          <p>下载、解压、编译Redis</p>
          <pre><code>$ wget http://download.redis.io/releases/redis-5.0.2.tar.gz&#x000A;$ tar xzf redis-5.0.2.tar.gz&#x000A;$ cd redis-5.0.2&#x000A;$ make</code></pre>
          <p>
            进入到解压后的
            <code>src</code>
            目录，通过如下命令启动Redis:
          </p>
          <pre><code>$ src/redis-server</code></pre>
          <p>您可以使用内置的客户端与Redis进行交互:</p>
          <pre><code>$ src/redis-cli&#x000A;redis&gt; set foo bar&#x000A;OK&#x000A;redis&gt; get foo&#x000A;&quot;bar&quot;</code></pre>
          <p>
            您也可以试用<a href='http://try.redis.io' target="_blank">在线Redis</a>感受Redis的魅力。
          </p>
        </div>