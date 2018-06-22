$(function(){
	$("input[type='number']").keyup(function(){  //keyup事件处理 
        $(this).val($(this).val().replace(/[^\d]/g,''));  
    });
	$("input[type='number']").bind("paste",function(){       
    	$(this).val($(this).val().replace(/[^\d]/g,''));       
    });
	
    $("#btnClick").click(function(){
        var size = 0;
        var total_size = 0;
        var strSize=0;
        var listSize=0;
        var hashSize=0;
        var setSize=0;
        var zsetSize=0;
        if (true){
            var key_num = parseInt($("tbody").find("tr").eq(1).find('input').eq(0).val());
            var key_len = parseInt($("tbody").find("tr").eq(1).find('input').eq(1).val());
            var value_len = parseInt($("tbody").find("tr").eq(1).find('input').eq(4).val());
			if(!isNaN(key_num) || !isNaN(key_len) || !isNaN(value_len)){
				if(!key_num){ alert('请输入string的Key个数'); return false;}
				if(!key_len){ alert('请输入string的Key长度'); return false; }
				if(!value_len){ alert('请输入string的Value长度'); return false; }
			}
			
            size = (56 + key_len + 8 + value_len + 1 ) * key_num / 1024 / 1024 * 1.2;
            if(!isNaN(size)){
                strSize=size.toFixed(2)
                total_size += size;
                size = 0;
            }
        }
        if (true) {
            var key_num = parseInt($("tbody").find("tr").eq(2).find('input').eq(0).val());
            var key_len = parseInt($("tbody").find("tr").eq(2).find('input').eq(1).val());
            var mem_num = parseInt($("tbody").find("tr").eq(2).find('input').eq(2).val());
            var mem_len = parseInt($("tbody").find("tr").eq(2).find('input').eq(3).val());
			if(!isNaN(key_num) || !isNaN(key_len) || !isNaN(mem_num) || !isNaN(mem_len)){
				if(!key_num){ alert('请输入list的Key个数'); return false;}
				if(!key_len){ alert('请输入list的Key长度'); return false; }
				if(!mem_num){ alert('请输入list的元素/字段数'); return false; }
				if(!mem_len){ alert('请输入list的元素/字段长度'); return false; }
			}
            size = (56 + key_len + mem_num * (1 + 1 + mem_len)) * key_num / 1024 / 1024 * 1.2;
            if(!isNaN(size)){
                listSize=size.toFixed(2);
                total_size += size;
                size = 0;
            }
        }
        if (true) {
            var key_num = parseInt($("tbody").find("tr").eq(3).find('input').eq(0).val());
            var key_len = parseInt($("tbody").find("tr").eq(3).find('input').eq(1).val());
            var mem_num = parseInt($("tbody").find("tr").eq(3).find('input').eq(2).val());
            var mem_len = parseInt($("tbody").find("tr").eq(3).find('input').eq(3).val());
            var value_len = parseInt($("tbody").find("tr").eq(3).find('input').eq(4).val());
			if(!isNaN(key_num) || !isNaN(key_len) || !isNaN(mem_num) || !isNaN(mem_len)|| !isNaN(value_len)){
				if(!key_num){ alert('请输入hash的Key个数'); return false;}
				if(!key_len){ alert('请输入hash的Key长度'); return false; }
				if(!mem_num){ alert('请输入hash的元素/字段数'); return false; }
				if(!mem_len){ alert('请输入hash的元素/字段长度'); return false; }
				if(!value_len){ alert('请输入hash的Value长度'); return false; }
			}
            size = (56 + key_len + mem_num * (4 + 1 + mem_len + 1 + 1 + value_len)) * key_num / 1024 / 1024 * 1.2;
            if(!isNaN(size)){
                hashSize=size.toFixed(2);
                total_size += size;
                size = 0;
            }
        }
        if (true) {
            var key_num = parseInt($("tbody").find("tr").eq(4).find('input').eq(0).val());
            var key_len = parseInt($("tbody").find("tr").eq(4).find('input').eq(1).val());
            var mem_num = parseInt($("tbody").find("tr").eq(4).find('input').eq(2).val());
            var mem_len = parseInt($("tbody").find("tr").eq(4).find('input').eq(3).val());
			if(!isNaN(key_num) || !isNaN(key_len) || !isNaN(mem_num) || !isNaN(mem_len)){
				if(!key_num){ alert('请输入set的Key个数'); return false;}
				if(!key_len){ alert('请输入set的Key长度'); return false; }
				if(!mem_num){ alert('请输入set的元素/字段数'); return false; }
				if(!mem_len){ alert('请输入set的元素/字段长度'); return false; }
			}
            size = (56 + key_len + mem_num * (1 + 1 + mem_len)) * key_num / 1024 / 1024 * 1.2;
            if(!isNaN(size)){
                setSize=size.toFixed(2);
                total_size += size;
                size = 0;
            }
        }
        if (true) {
            var key_num = parseInt($("tbody").find("tr").eq(5).find('input').eq(0).val());
            var key_len = parseInt($("tbody").find("tr").eq(5).find('input').eq(1).val());
            var mem_num = parseInt($("tbody").find("tr").eq(5).find('input').eq(2).val());
            var mem_len = parseInt($("tbody").find("tr").eq(5).find('input').eq(3).val());
            var value_len = parseInt($("tbody").find("tr").eq(5).find('input').eq(4).val());
			if(!isNaN(key_num) || !isNaN(key_len) || !isNaN(mem_num) || !isNaN(mem_len)|| !isNaN(value_len)){
				if(!key_num){ alert('请输入zset的Key个数'); return false;}
				if(!key_len){ alert('请输入zset的Key长度'); return false; }
				if(!mem_num){ alert('请输入zset的元素/字段数'); return false; }
				if(!mem_len){ alert('请输入zset的元素/字段长度'); return false; }
				if(!value_len){ alert('请输入zset的Value长度'); return false; }
			}
            size = (56 + key_len + mem_num * (11 + value_len * (mem_len + 5))) * key_num / 1024 / 1024 * 1.2;
            if(!isNaN(size)){
                zsetSize=size.toFixed(2);
                total_size += size;
                size = 0;
            }
        }
        result = '所需总内存：' + total_size.toFixed(2) + 'M';
        $("#calSize").empty().append(result);

        option = {
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b}: {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                x: 'left',
                data:['STRING','LIST','HASH','SET','ZSET']
            },
            series: [
                {
                    name:'Redis',
                    type:'pie',
                    radius: ['40%', '55%'],
                    label: {
                        normal: {
                            formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
                            backgroundColor: '#eee',
                            borderColor: '#aaa',
                            borderWidth: 1,
                            borderRadius: 4,
                            rich: {
                                a: {
                                    color: '#999',
                                    lineHeight: 22,
                                    align: 'center'
                                },
                                hr: {
                                    borderColor: '#aaa',
                                    width: '100%',
                                    borderWidth: 0.5,
                                    height: 0
                                },
                                b: {
                                    fontSize: 16,
                                    lineHeight: 33
                                },
                                per: {
                                    color: '#eee',
                                    backgroundColor: '#334455',
                                    padding: [2, 4],
                                    borderRadius: 2
                                }
                            }
                        }
                    },
                    data:[
                        {value:strSize, name:'STRING'},
                        {value:listSize, name:'LIST'},
                        {value:hashSize, name:'HASH'},
                        {value:setSize, name:'SET'},
                        {value:zsetSize, name:'ZSET'}
                    ]
                }
            ]
        };
        var myChart = echarts.init(document.getElementById('conMain'));

        //使用制定的配置项和数据显示图表
        myChart.setOption(option);
    });
})