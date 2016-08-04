---
layout: index
title: Redis入群邀请码
excerpt: 欢迎加入Redis技术交流群，入群需要邀请码，请输入您的QQ号获取对应群的邀请码。
permalink: yqm.html
---

<script type="text/javascript">
    var cpro_id = "u2567475";
</script>
<script src="http://cpro.baidustatic.com/cpro/ui/c.js" type="text/javascript"></script>

<h1>Redis入群邀请码生成器</h1>

<div class='home-intro home-section'>
	请选择要加入的群 ：
	<select id="qunList">
		<option value="112121693">redis千人群1 （已满）</option>
		<option value="187095642">redis千人群2 187095642</option>
		<option value="163264749">redis java分群一 （已满）</option>
		<option value="209751645">redis java分群二 （已满）</option>
		<option value="209751645">redis java分群二 197643943</option>
		<option value="69287882">redis 脚本群一 （已满）</option>
		<option value="69287882">redis 脚本群二 197102873</option>
		<option value="163269313">Redis c,c++,c#分群（已满）</option>
		<option value="163269313">Redis c,c++,c#分群二 196677856</option>
		<option value="163265386">Redis□PHP分群一 （已满）</option>
		<option value="163265386">Redis□PHP分群二 196677618</option>
	</select>
	<br/>
	<br/>
	请输入您的QQ号码：<input type="text" id="qqcode" />
	<br/>
	<br/>
	<input type="button" value="点击生成邀请码" onclick="generateCode()"/>
	<br/>
	<br/>
	<h2 id="yqmcode" style="color:#ff0000;">&nbsp;</h2>
</div>

<script src='/js/md5.js'></script>

<script>
	function generateCode(){
		var qunId = $("#qunList").val();
		var qqCode = $("#qqcode").val();
		if(qqCode==""){
			alert("QQ号码不能为空哦");
			return;
		}
		var r=/^[0-9]+.?[0-9]*$/;
        if(!r.test(qqCode)){ //isNaN也行的,正则可以随意扩展
            alert('请输入全数字的QQ号码');
			return;
        }
		
		var hash = hex_md5(qunId+"-"+qqCode);
		var yqm = "redis-"+ hash.substring(0,4) + "-" + hash.substring(28,32);
		$("#yqmcode").html("您的邀请码是："+yqm);
	}
</script>

<script type="text/javascript">
    var cpro_id = "u2582069";
</script>
<script src="http://cpro.baidustatic.com/cpro/ui/c.js" type="text/javascript"></script>