---
layout: index
title: Redis 3.2.1 下载
excerpt: Redis下载中心(Redis download)，下载各种版本的redis，包括最新redis 3.2.1稳定版redis,3.2.1-Beta版本以及win32/64版本
permalink: download.html
disqusIdentifier: download
disqusUrl: http://redis.cn/download.html
---


<div class='text'>          
   <div class="text">
          <span id="download" class="anchor"></span><h1><a href="download.html#download" class="anchor-link">*</a>下载</h1>
          <p>
            Redis 版本号采用标准惯例：<strong>主版本号.副版本号.补丁级别</strong>,一个副版本号就标记为一个标准发行版本，例如 1.2，2.0，2.2，2.4，2.6，2.8，奇数的副版本号用来表示<strong>非标准</strong>版本,例如2.9.x发行版本是Redis 3.0标准版本的非标准发行版本。
          </p>
          <ul class="download-versions">
            <li>
              <h2>
                标准版本
                <span class="download-version">(3.0)</span>
              </h2>
              Redis 3.0 包含了Redis集群，一个分布式特性的Redis，能够自动分片数据，错误容忍，并提升了在工作负载下的处理速度，改善了AOF重写等。
              <div class="download-links">
                <a class="download-link" href="https://raw.githubusercontent.com/antirez/redis/3.0/00-RELEASENOTES">
                  <i class="fa fa-file-text-o"></i>
                  发布日志
                </a>
                <a class="download-link" href="http://download.redis.io/releases/redis-3.2.1.tar.gz">
                  <i class="fa fa-arrow-circle-o-down"></i>
                  下载 3.2.1
                </a>
              </div>
            </li>
            <li>
              <h2>
                旧的
                <span class="download-version">(2.8)</span>
              </h2>
              Redis 2.8 是相对较旧的标准版本. 和2.6相比, 该版本更加完善，提供了部分再同步的复制机制，IPv6的支持，配置文件动态重写，通过Pub/Sub实现的键空间通知等诸多特性。
              <div class="download-links">
                <a class="download-link" href="https://raw.githubusercontent.com/antirez/redis/2.8/00-RELEASENOTES">
                  <i class="fa fa-file-text-o"></i>
                  发布日志
                </a>
                <a class="download-link" href="https://github.com/antirez/redis/archive/2.8.19.tar.gz">
                  <i class="fa fa-arrow-circle-o-down"></i>
                  下载 2.8.19
                </a>
              </div>
            </li>
            <li>
              <h2>
                非标准版本
              </h2>
              该版本为开发版本，如果你需要测试最新特性或者需要提升性能的话，可以下载使用。几个月以后会发布基于3.2的标准发行版本。
              <div class="download-links">
                <a class="download-link" href="https://github.com/antirez/redis/archive/unstable.tar.gz">
                  <i class="fa fa-arrow-circle-o-down"></i>
                  下载非标准版本
                </a>
              </div>
            </li>
          </ul>
          <span id="other-versions" class="anchor"></span><h2><a href="http://redis.cn/download.html#other-versions" class="anchor-link">*</a>其他版本</h2>
          <h3>
            比较旧的
            <span class="download-version">(2.6)</span>
          </h3>
          非常旧的版本，不推荐使用，相对于2.4，该版本支持了lua脚本，毫秒级别的过期，改善了内存的使用，不限制客户端的数量，提升了AOF，更好的性能，一些新的命令和特性。
          <br>
           查看
          <a href="https://raw.githubusercontent.com/antirez/redis/2.6/00-RELEASENOTES">
            发布日志
          </a>
          or
          <a href="http://download.redis.io/releases/redis-2.6.17.tar.gz">
            下载 2.6.17.
          </a>
          <h3>
            Windows
          </h3>
          非官方支持，微软开放技术小组针对win64开发的该版本。
          <a href="https://github.com/MSOpenTech/redis">了解更多</a>
          <span id="other" class="anchor"></span><h3><a href="http://redis.cn/download.html#other" class="anchor-link">*</a>其他</h3>
          历史版本依然可以下载
          <a href="https://code.google.com/p/redis/downloads/list?can=1">Google Code</a>.
          <p>
            <strong>脚本和其他自动化组件下载</strong>
            最新Redis 标准发行版本tarball下载
            <a href="http://download.redis.io/redis-stable.tar.gz">http://download.redis.io/redis-stable.tar.gz</a>.
            最新Redis标准发行版本源代码<a href="http://download.redis.io/redis-stable">浏览这里</a>,
            使用<strong>src/version.h</strong>文件来自动获得版本信息。
          </p>
          <span id="how-to-verify-files-for-integrity" class="anchor"></span><h2><a href="http://redis.cn/download.html#how-to-verify-files-for-integrity" class="anchor-link">*</a>如何检查文件的完整性</h2>
          <p>
            Github 镜像
            <a href="https://github.com/antirez/redis-hashes/blob/master/README">redis-hashes</a>
            包含了README文件,文件中有发行版本tarball的SHA1值。
          </p>
          <span id="installation" class="anchor"></span><h2><a href="http://redis.cn/download.html#installation" class="anchor-link">*</a>安装</h2>
          <p>下载，解压，编译:</p>
          <pre><code>$ wget http://download.redis.io/releases/redis-3.2.1.tar.gz
$ tar xzf redis-3.2.1.tar.gz
$ cd redis-3.2.1
$ make</code></pre>
          <p>
            二进制文件是编译完成后在<code>src</code>目录下. 运行如下:
          </p>
          <pre><code>$ src/redis-server</code></pre>
          <p>You can interact with Redis using the built-in client:</p>
          <pre><code>$ src/redis-cli
redis&gt; set foo bar
OK
redis&gt; get foo
"bar"</code></pre>
          <p>
            你刚开始接触Redis? 试试我们的
            <a href="http://try.redis-db.com/">在线交互教程</a>.
          </p>
        </div>
        </div>