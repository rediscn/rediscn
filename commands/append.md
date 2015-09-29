---
layout: commands
title: APPEND命令 -- Redis中文资料站
permalink: commands/append.html
disqusIdentifier: command_append
disqusUrl: http://redis.cn/commands/append.html
commandsType: strings
---


<p>If <code>key</code> already exists and is a string, this command appends the <code>value</code> at the end of the string.
If <code>key</code> does not exist it is created and set as an empty string, so <a href="/commands/append">APPEND</a>
will be similar to <a href="/commands/set">SET</a> in this special case.</p>

<span id="return-value" class=anchor></span><h2 ><a href="#return-value" class=anchor-link>*</a>Return value</h2>

<p><a href="/topics/protocol#integer-reply">Integer reply</a>: the length of the string after the append operation.</p>

<span id="examples" class=anchor></span><h2 ><a href="#examples" class=anchor-link>*</a>Examples</h2>

<div class='example' data-session='e7b04971fb064b518728b3a7c5a348b9'>
<span class='monospace prompt'>redis&gt;&nbsp;</span>
<span class='monospace command'>EXISTS mykey</span>
<pre>(integer) 0</pre>
<span class='monospace prompt'>redis&gt;&nbsp;</span>
<span class='monospace command'>APPEND mykey &quot;Hello&quot;</span>
<pre>(integer) 5</pre>
<span class='monospace prompt'>redis&gt;&nbsp;</span>
<span class='monospace command'>APPEND mykey &quot; World&quot;</span>
<pre>(integer) 11</pre>
<span class='monospace prompt'>redis&gt;&nbsp;</span>
<span class='monospace command'>GET mykey</span>
<pre>"Hello World"</pre><form>
<span class='monospace prompt'>redis&gt;&nbsp;</span>
<input autocomplete='off' name='command' spellcheck='false' type='text' />
</form></div>


<span id="pattern-time-series" class=anchor></span><h2 ><a href="#pattern-time-series" class=anchor-link>*</a>Pattern: Time series</h2>

<p>The <a href="/commands/append">APPEND</a> command can be used to create a very compact representation of a
list of fixed-size samples, usually referred as <em>time series</em>.
Every time a new sample arrives we can store it using the command</p>

<pre><code>APPEND timeseries &quot;fixed-size sample&quot;&#x000A;</code></pre>

<p>Accessing individual elements in the time series is not hard:</p>

<ul>
<li><a href="/commands/strlen">STRLEN</a> can be used in order to obtain the number of samples.</li>
<li><a href="/commands/getrange">GETRANGE</a> allows for random access of elements.
If our time series have associated time information we can easily implement
a binary search to get range combining <a href="/commands/getrange">GETRANGE</a> with the Lua scripting
engine available in Redis 2.6.</li>
<li><a href="/commands/setrange">SETRANGE</a> can be used to overwrite an existing time series.</li>
</ul>

<p>The limitation of this pattern is that we are forced into an append-only mode
of operation, there is no way to cut the time series to a given size easily
because Redis currently lacks a command able to trim string objects.
However the space efficiency of time series stored in this way is remarkable.</p>

<p>Hint: it is possible to switch to a different key based on the current Unix
time, in this way it is possible to have just a relatively small amount of
samples per key, to avoid dealing with very big keys, and to make this pattern
more friendly to be distributed across many Redis instances.</p>

<p>An example sampling the temperature of a sensor using fixed-size strings (using
a binary format is better in real implementations).</p>

<div class='example' data-session='e7b04971fb064b518728b3a7c5a348b9'>
<span class='monospace prompt'>redis&gt;&nbsp;</span>
<span class='monospace command'>APPEND ts &quot;0043&quot;</span>
<pre>(integer) 4</pre>
<span class='monospace prompt'>redis&gt;&nbsp;</span>
<span class='monospace command'>APPEND ts &quot;0035&quot;</span>
<pre>(integer) 8</pre>
<span class='monospace prompt'>redis&gt;&nbsp;</span>
<span class='monospace command'>GETRANGE ts 0 3</span>
<pre>"0043"</pre>
<span class='monospace prompt'>redis&gt;&nbsp;</span>
<span class='monospace command'>GETRANGE ts 4 7</span>
<pre>"0035"</pre><form>
<span class='monospace prompt'>redis&gt;&nbsp;</span>
<input autocomplete='off' name='command' spellcheck='false' type='text' />
</form></div>

