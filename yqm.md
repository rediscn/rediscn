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
		<option value="521503946">Redis中国用户组(CRUG)1群（已满）</option>
		<option value="374538650">Redis中国用户组(CRUG)2群（已满）</option>
		<option value="46859267" >Redis中国用户组(CRUG)3群（已满）</option>
		<option value="112121693">Redis中国用户组(CRUG)4群（已满）</option>
		<option value="187095642">Redis中国用户组(CRUG)5群（已满）</option>
		<option value="492022240">Redis中国用户组(CRUG)6群 492022240</option>
		<option value="163264749">Redis java群1 （已满）</option>
		<option value="209751645">Redis java群2 （已满）</option>
		<option value="197643943">Redis java群3 197643943</option>
		<option value="69287882" >Redis 脚本群1 （已满）</option>
		<option value="197102873">Redis 脚本群2 197102873</option>
		<option value="163269313">Redis c,c++,c#群1（已满）</option>
		<option value="196677856">Redis c,c++,c#群2 196677856</option>
		<option value="163265386">Redis PHP群1 （已满）</option>
		<option value="196677618">Redis PHP群2 196677618</option>
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