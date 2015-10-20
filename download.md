---
layout: index
title: REDIS 3.0.5 下载 -- Redis中文资料站
excerpt: redis下载中心，下载各种版本的redis，包括最新redis 3.0.5稳定版redid,3.0.5-Beta版本以及win32/64版本
permalink: download.html
disqusIdentifier: download
disqusUrl: http://redis.cn/download.html
---
download
===
<div class='text'>          
          <p>
            Redis uses a standard practice for its versioning:
            <strong>major.minor.patchlevel</strong>.
            An even
            <strong>minor</strong>
            marks a
            <strong>stable</strong>
            release, like 1.2, 2.0, 2.2, 2.4, 2.6,
            2.8. Odd minors are used for
            <strong>unstable</strong>
            releases, for example 2.9.x releases
            are the unstable versions of what will be Redis 3.0 once stable.
          </p>
          <ul class='download-versions'>
            <li>
              <h2>
                Stable
                <span class='download-version'>(3.0)</span>
              </h2>
              Redis 3.0 introduces Redis Cluster, a distributed implementation of Redis with automatic data sharding and fault tolerance, important speed improvements under certain workloads, improved AOF rewriting, and more.
              <div class='download-links'>
                <a class='download-link' href='https://raw.githubusercontent.com/antirez/redis/3.0/00-RELEASENOTES'>
                  <i class='fa fa-file-text-o'></i>
                  Release notes
                </a>
                <a class='download-link' href='http://download.redis.io/releases/redis-3.0.5.tar.gz'>
                  <i class='fa fa-arrow-circle-o-down'></i>
                  Download
                  3.0.5
                </a>
              </div>
            </li>
            <li>
              <h2>
                Old
                <span class='download-version'>(2.8)</span>
              </h2>
              Redis 2.8 is the older stable version of Redis. It provided significant improvements over version 2.6, such as replication partial resynchronization, IPv6 support, config rewriting, keyspace changes notifications via Pub/Sub, and more.
              <div class='download-links'>
                <a class='download-link' href='https://raw.githubusercontent.com/antirez/redis/2.8/00-RELEASENOTES'>
                  <i class='fa fa-file-text-o'></i>
                  Release notes
                </a>
                <a class='download-link' href='https://github.com/antirez/redis/archive/2.8.22.tar.gz'>
                  <i class='fa fa-arrow-circle-o-down'></i>
                  Download
                  2.8.22
                </a>
              </div>
            </li>
            <li>
              <h2>
                Unstable
              </h2>
              This is where all the development happens. Only for hard-core hackers. Use only if you need to test the latest features or performance improvements. In a couple of months this is going to be frozen and used as the base for 3.2.
              <div class='download-links'>
                <a class='download-link' href='https://github.com/antirez/redis/archive/unstable.tar.gz'>
                  <i class='fa fa-arrow-circle-o-down'></i>
                  Download
                  unstable
                </a>
              </div>
            </li>
          </ul>
          <span id="other-versions" class=anchor></span><h2 ><a href="#other-versions" class=anchor-link>*</a>Other versions</h2>
          <h3>
            Older
            <span class='download-version'>(2.6)</span>
          </h3>
          Very old, you should not use Redis 2.6. Compared to 2.4 it introduced support for Lua scripting, milliseconds precision expires, improved memory usage, unlimited number of clients, improved AOF generation, better performance, a number of new commands and features.
          <br />
          See the
          <a href='https://raw.githubusercontent.com/antirez/redis/2.6/00-RELEASENOTES'>
            release notes
          </a>
          or
          <a href='http://download.redis.io/releases/redis-2.6.17.tar.gz'>
            download 2.6.17.
          </a>
          <h3>
            Windows
          </h3>
          The Redis project does not officially support Windows. However, the Microsoft Open Tech group develops and maintains this Windows port targeting Win64.
          <a href='https://github.com/MSOpenTech/redis'>Learn more</a>
          <span id="other" class=anchor></span><h3 ><a href="#other" class=anchor-link>*</a>Other</h3>
          Historical downloads are still available on
          <a href='https://code.google.com/p/redis/downloads/list?can=1'>Google Code</a>.
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
          <span id="how-to-verify-files-for-integrity" class=anchor></span><h2 ><a href="#how-to-verify-files-for-integrity" class=anchor-link>*</a>How to verify files for integrity</h2>
          <p>
            The Github repository
            <a href='https://github.com/antirez/redis-hashes/blob/master/README'>redis-hashes</a>
            contains a README file with SHA1 digests of released tarball archives.
          </p>
          <span id="installation" class=anchor></span><h2 ><a href="#installation" class=anchor-link>*</a>Installation</h2>
          <p>Download, extract and compile Redis with:</p>
          <pre><code>$ wget http://download.redis.io/releases/redis-3.0.5.tar.gz&#x000A;$ tar xzf redis-3.0.5.tar.gz&#x000A;$ cd redis-3.0.5&#x000A;$ make</code></pre>
          <p>
            The binaries that are now compiled are available in the
            <code>src</code>
            directory. Run Redis with:
          </p>
          <pre><code>$ src/redis-server</code></pre>
          <p>You can interact with Redis using the built-in client:</p>
          <pre><code>$ src/redis-cli&#x000A;redis&gt; set foo bar&#x000A;OK&#x000A;redis&gt; get foo&#x000A;&quot;bar&quot;</code></pre>
          <p>
            Are you new to Redis? Try our
            <a href='http://try.redis.io'>online, interactive tutorial</a>.
          </p>
        </div>