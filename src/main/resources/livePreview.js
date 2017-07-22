(function(){
	  $("").ready(function(){
		 var scr_height=window.screen.height;
		  $("#chart").css("height",scr_height*0.65);
		  $("#taskrecord").css("height",scr_height*0.29);
          $("#latestMissions").css("height",scr_height*0.20);
		  var sketchpad=document.getElementById('sketchpad');
		   for(var i=1;i<12;i++){//y轴方向
		  	if(i%6==0){
                    continue;
            }
		  	for(var j=0;j<9;j++){//x轴方向

		  	 if(j==0) {
                 var r= document.createElementNS('http://www.w3.org/2000/svg','rect');
                 var x=5;
                 var y=5+(i-1)*10;
                 r.setAttribute('x', x);
                 r.setAttribute('y', y);
                 r.setAttribute('height',  10);
                 r.setAttribute('width',  10);
                 r.setAttribute('stroke-width',  1.0);
                 r.setAttribute('stroke',  "#000");
                 if(i==10||i==11){
                     r.setAttribute('fill', '#000000');
				 }else {
                     r.setAttribute('fill', '#D2E9E9');
                 }
                 r.setAttribute('id', 'rect'+x+y);
                 sketchpad.appendChild(r);
                 if(i!=11){
                 var r1 = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                 var x1 = 25;
                 var y1 = 5 + (i - 1) * 10;
                 r1.setAttribute('x', x1);
                 r1.setAttribute('y', y1);
                 r1.setAttribute('height', 10);
                 r1.setAttribute('width', 10);
                 r1.setAttribute('stroke-width', 1.0);
                 r1.setAttribute('stroke', "#000");
                 r1.setAttribute('fill', '#D2E9E9');
                 r1.setAttribute('id', 'rect' + x1 + y1);
                 sketchpad.appendChild(r1);
                 }
             }else{
		  	 	if((i==10||i==11)&&(j==3)){
                    var r= document.createElementNS('http://www.w3.org/2000/svg','rect');
                    var x=5+j*30;
                    var y=5+(i-1)*10;
                    r.setAttribute('x', x);
                    r.setAttribute('y', y);
                    r.setAttribute('height',  10);
                    r.setAttribute('width',  10);
                    r.setAttribute('stroke-width',  1.0);
                    r.setAttribute('stroke',  "#000");
					r.setAttribute('fill', '#000000');
                    sketchpad.appendChild(r);
				}
				if(!(j==3&&(i==9||i==10||i==11))){
                 var r= document.createElementNS('http://www.w3.org/2000/svg','rect');
                 var x=15+j*30;
                 var y=5+(i-1)*10;
                 r.setAttribute('x', x);
                 r.setAttribute('y', y);
                 r.setAttribute('height',  10);
                 r.setAttribute('width',  10);
                 r.setAttribute('stroke-width',  1.0);
                 r.setAttribute('stroke',  "#000");
                 if((i==10||i==11)&&(j==5||j==8)){
                     r.setAttribute('fill', '#000000');
                     r.setAttribute('id', 'rect'+x+y);
                     sketchpad.appendChild(r);
                 }else if(i!=11){
                     r.setAttribute('fill', '#D2E9E9');
                     r.setAttribute('id', 'rect'+x+y);
                     sketchpad.appendChild(r);
                 }
                }
                 var r1 = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                 var x1 = 25 + j * 30;
                 var y1 = 5 + (i - 1) * 10;
                 r1.setAttribute('x', x1);
                 r1.setAttribute('y', y1);
                 r1.setAttribute('height', 10);
                 r1.setAttribute('width', 10);
                 r1.setAttribute('stroke-width', 1.0);
                 r1.setAttribute('stroke', "#000");
                 if((i==10||i==11)&&(j==2||j==5||j==8)){
                     r1.setAttribute('fill', '#000000');
                     r1.setAttribute('id', 'rect' + x1 + y1);
                     sketchpad.appendChild(r1);
                 }else if(i!=11){
                     r1.setAttribute('fill', '#D2E9E9');
                     r1.setAttribute('id', 'rect' + x1 + y1);
                     sketchpad.appendChild(r1);
                 }

			 }
		  	}
		  }
 /************************************************************************/
	//SVG的pan和zoom
	 SVGNavigator(sketchpad);
/************************************************************************/
	//页面适配
	 responsiveIt();
	 window.onresize = function() {responsiveIt();};
/************************************************************************/
	//日期时间显示
	 getNowFormatDate();
/************************************************************************/
	//自定义滚动条
	$('#AGVstatus').jscrollbar({width:3});
	$('#latestMissions').jscrollbar({width:3});

/************************************************************************/
	//到出任务记录，生成excel文档
	$('#toexport').click(function(){
		window.open($("#contextpath").val()+"/jsp/fileExport.jsp","下载任务记录",
				"height=400px,dependent=yes,width=400px,toolbar=no,menubar=no,scrollbars=no,resizable=no,location=no,status=no,top=200,left=500");
	});
/************************************************************************/
//显示或取消路径
	init();
	$("#showroad").click(function(){
		$("#cancelroad").val(1);

	});
	$("#cancelroad").click(function(){
		$(this).val(0);
		$("[role='road']").remove();
	});
/************************************************************************/
//信息显示框消失
	document.onmouseup=function (e) {
	var e=e||window.event;
	var target=e.target||e.srcElement;
    var _tar= document.createElementNS('http://www.w3.org/2000/svg','circle');
	if(target!=_tar){
        $("#rect1").remove();
        $("#text1").remove();
	}
}
/************************************************************************/
	  });//ready
	  
 })();
/************************************************************************/
//连接获取comet4j数据
function init(){
	    JS.Engine.on({
	            socket : function(data){//侦听一个channel
	            	var btn=document.getElementById('cancelroad');
	            	var flag=parseInt($(btn).val());
	            	if(data.length==1){
						ids=data[0].id;
						status=data[0].status;
						xs=data[0].x;
						ys=data[0].y;
						var sketchpad=document.getElementById('sketchpad');
	                    var c=document.getElementById('car'+ids);
	                    var x=xs*10;y=ys*10;
	                    //判断小车是否在仓库
	           		   if(c==null){//2
						   var colorStr=getcolor();
						   c= document.createElementNS('http://www.w3.org/2000/svg','circle');
							c.setAttribute('cx', x);
							c.setAttribute('cy', y);
							c.setAttribute('r',  4);
							c.setAttribute('fill', '#fff');
							c.setAttribute("stroke", colorStr);
							c.setAttribute("stroke-width", 1);
							c.setAttribute('id', 'car'+ids);
							c.setAttribute('onclick','showmsg('+ids+','+x+','+y+')');
							sketchpad.appendChild(c);
							//判断小车的在线状态
							if(status!=3){
	           	    		
								var car_button=document.getElementById('car_B'+ids);	      
								if(car_button==null){
                                    var input = document.createElement("input");
                                    $(input).attr("type", "button");
                                    $(input).attr("id", "car_B"+ids);
                                    $(input).attr("class", "btn btn-block");
                                    $(input).attr("value",ids);
                                    $(input).attr("disabled","disabled");
                                    $(input).attr("onclick","agvbtaction("+ids+")");
                                    var input2=document.createElement("input");
                                    $(input2).attr("type","hidden");
                                    $(input2).attr("id","car_B_statusId_"+ids);
                                    $(input2).attr("name","car_B_statusId_"+ids);
                                    var agvId=document.getElementById("agvId");
                                    var agvstatus=document.getElementById("agvShow");
                                    $(input).appendTo(agvstatus);
                                    $(input2).appendTo(agvId);
                                    car_button=document.getElementById('car_B'+ids);

								}
                                car_button.style.color="#ffffff";
                                car_button.style.backgroundColor="#5bc0de";
                                car_button.style.borderColor="#46b8da";
                                car_button.removeAttribute("disabled");
                                $("#car_B_statusId_"+ids).val(0);

							}else if(status==3){
									var car_button=document.getElementById('car_B'+ids);	      
									if(car_button!=null){//6
										car_button.style.color="#ffffff";
										car_button.style.backgroundColor="red";
										car_button.style.borderColor="#46b8da";
										car_button.removeAttribute("disabled");
										$("#car_B_statusId_"+ids).val(3);
									}
							}  	
					   } else{
	           			   
								   var x0=c.getAttribute("cx");
								   var y0=c.getAttribute("cy");
								   var color=c.getAttribute("stroke");
                           			c.setAttribute('onclick','showmsg('+ids+','+x+','+y+')');
								if(x==x0&&y!=y0){//7
									 //alert("x==x0");
	            	        	     var ani = document.createElementNS("http://www.w3.org/2000/svg","animate");	        	  
									  ani.setAttribute("begin", "indefinite"); 	        	 
									  ani.setAttribute("dur", "2300ms");
									  ani.setAttribute("fill", "freeze");
									  ani.setAttribute("attributeName", "cy");        	       
									  ani.setAttribute("from", y0);
									  ani.setAttribute("to", y);
									  ani.setAttribute("id", "ani"+i);
									  c.appendChild(ani);
									  ani.beginElement();
									  c.setAttribute('cx', x);
									  c.setAttribute('cy', y);
									  sketchpad.appendChild(c);
	                 	     
								}else if(y==y0&&x!=x0){
									//alert("y==y0");
	            	        	  var ani = document.createElementNS("http://www.w3.org/2000/svg","animate"); 	        	
	                          	  ani.setAttribute("begin", "indefinite");
	                  	          ani.setAttribute("dur", "2300ms");
	                  	          ani.setAttribute("fill", "freeze");
	            	        	  ani.setAttribute("attributeName", "cx");        	       
	                	          ani.setAttribute("from", x0);
	                	          ani.setAttribute("to", x);  
	                	          ani.setAttribute("id", "ani"+i);
	                	          c.appendChild(ani);
								  ani.beginElement();
								  c.setAttribute('cx', x);
								  c.setAttribute('cy', y);
								  sketchpad.appendChild(c);
								}
	           			   
								 //表示工作或者待机
								 if(status==0 || status==1){
	           		    		
									var car_button=document.getElementById('car_B'+ids);
									if(car_button==null){
                                        var input = document.createElement("input");
                                        $(input).attr("type", "button");
                                        $(input).attr("id", "car_B"+ids);
                                        $(input).attr("class", "btn btn-block");
                                        $(input).attr("value",ids);
                                        $(input).attr("disabled","disabled");
                                        $(input).attr("onclick","agvbtaction("+ids+")");
                                        var input2=document.createElement("input");
                                        $(input2).attr("type","hidden");
                                        $(input2).attr("id","car_B_statusId_"+ids);
                                        $(input2).attr("name","car_B_statusId_"+ids);
                                        var agvId=document.getElementById("agvId");
                                        var agvstatus=document.getElementById("agvShow");
                                        $(input).appendTo(agvstatus);
                                        $(input2).appendTo(agvId);
                                        car_button=document.getElementById('car_B'+ids);
									}
										car_button.style.color="#ffffff";
										car_button.style.backgroundColor="#5bc0de";
										car_button.style.borderColor="#46b8da";
										car_button.removeAttribute("disabled");
										$("#car_B_statusId_"+ids).val(0);

								}else if(status==7){
	           				   
								   var rect=document.getElementById('rect'+(x-5)+(y-5));
								   if(rect!=null){
										rect.setAttribute("fill", "#f2a6a6");
									}
									c.setAttribute('fill', color);
								}else if(status==8){
									var rect=document.getElementById('rect'+(x-5)+(y-5));
									if(rect!=null){
										rect.setAttribute("fill", "#D2E9E9");
									}
										c.setAttribute('fill', '#fff');
								}else if(status==3){
									var car_button=document.getElementById('car_B'+ids);
									if(car_button!=null){
										car_button.style.color="#ffffff";
										car_button.style.backgroundColor="red";
										car_button.style.borderColor="red";
										car_button.removeAttribute("disabled");
										$("#car_B_statusId_"+ids).val(3);
									}
								}
								if(flag==1 && (status==7 || status==8 || status==9)){
									var points=document.getElementsByName("point"+ids);
									$(points).remove();
									var lines=document.getElementsByName("line"+ids);
									$(lines).remove();
								} //clear
							}
					}else if(flag==1&&data.length>1){
	            		console.log(data);
							 var ids =new Array();
							 var Xs =new Array();
							 var Ys =new Array();
							 var color;
							   for(var i=0;i<data.length;i++){
								 df=data[i].id;
								 ids.push(data[i].id);
								 Xs.push(data[i].x);
								 Ys.push(data[i].y);
								}
							 var len=ids.length;
	                   
							//x取值300,当星270时对应CSS文件中的450px，y取值范围150当y等于135时对应css文件中450px
						   //解析出来的x=x*6,y=y*3
							//var colorStr=getcolor();
							var sketchpad=document.getElementById('sketchpad');
							var c=document.getElementById('car'+ids[0]);
							color=c.getAttribute("stroke");
							  for(var i=0;i<len-1;i++){
									var x=Xs[i]*10;y=(Ys[i])*10;
									var x1=Xs[i+1]*10;var y1=(Ys[i+1])*10;

								   if(i==0){
										var head= document.createElementNS('http://www.w3.org/2000/svg','circle');
										head.setAttribute('cx', x);
										head.setAttribute('cy', y);
										head.setAttribute('r',  1);
										head.setAttribute('fill', color);
										head.setAttribute('name', "point"+df);
										head.setAttribute('role',"road");
										sketchpad.appendChild(head);
								   }

									   var line = document.createElementNS('http://www.w3.org/2000/svg','line');
										line.setAttribute('x1', x);
										line.setAttribute('y1', y);
										line.setAttribute('x2', x1);
										line.setAttribute('y2', y1);
										line.setAttribute('id', 'line');
										line.setAttribute('stroke',color );
										line.setAttribute('stroke-width',1 );
										line.setAttribute('stroke-linecap',"round" );
										line.setAttribute('name',"line"+df );
										line.setAttribute('role',"road");
										sketchpad.appendChild(line);
									if(i==(len-2)){
										  var tail= document.createElementNS('http://www.w3.org/2000/svg','circle');
										  tail.setAttribute('cx', x1);
										  tail.setAttribute('cy', y1);
										  tail.setAttribute('r',  1);
										  tail.setAttribute('fill', color);
										  tail.setAttribute('name', "point"+df);
										  tail.setAttribute('role',"road");
										  sketchpad.appendChild(tail);
									}
							  }//for
					}//d4
				},
				socket_for_order:function(data){

	           			  id=data[0].id;
	           			  status=data[0].status;
	           			  ecode=data[0].ecode;
	           			  if(ecode==null){
							  if(status==-1){
								cancelCarAndTask(id);
								  var newmsg=strFunction(id,"任务取消，小车下线");
								  getRunRecord(newmsg);
							  }
								task=data[0].curTask;
								if(task!=""){
									var newmsg=strFunction(id,"正在执行"+task+"任务");
									getRunRecord(newmsg);
								}
						  }else {
                              var newmsg=strFunction(id,ecode);
                              getRunRecord(newmsg);
						  }

	            }
	            
	    });
	    JS.Engine.start("conn");
	}
function showmsg(ids,x,y){
	$("#rect1").remove();
	$("#text1").remove();
	var name="Agv name: car"+ids;
	var location="location:X="+x/10+";Y="+y/10;
	var dx=(x>845?x-155:x+5);
	var dy=(y>365?y-105:y+5);
    var rect = document.createElementNS('http://www.w3.org/2000/svg','rect');
    var sketchpad=document.getElementById('sketchpad');
    rect.setAttribute('height','100');
    rect.setAttribute('width','150');
    rect.setAttribute('x',dx);
    rect.setAttribute('y',dy);
    rect.setAttribute('stroke-width','1.0');
    rect.setAttribute('stroke','#000');
    rect.setAttribute('fill','#fff');
    rect.setAttribute('id','rect1');
    var text = document.createElementNS('http://www.w3.org/2000/svg','text');
    text.setAttribute('x',dx);
    text.setAttribute('y',dy+20);
    text.setAttribute('id','text1');
    text.setAttribute('font-size','9');
    var tspan1 = document.createElementNS('http://www.w3.org/2000/svg','tspan');
    var tspan2 = document.createElementNS('http://www.w3.org/2000/svg','tspan');
    tspan1.setAttribute('dx',5);
    tspan2.setAttribute('x',dx+5);
    tspan2.setAttribute('dy',25);
    var textRData1 = document.createTextNode(name);
    var textRData2 = document.createTextNode(location);
    tspan1.appendChild(textRData1);
    tspan2.appendChild(textRData2);
    text.appendChild(tspan1);
    text.appendChild(tspan2);
	sketchpad.appendChild(rect);
    sketchpad.appendChild(text);
}
//生成固定字符串函数
function strFunction(carNumber,str){
    var myDate = new Date();
    var hh=checkTime(myDate.getHours());
    var mm= checkTime(myDate.getMinutes());
    var ss=checkTime(myDate.getSeconds());
    return msg=">"+hh + ":" + mm + ":" + ss + " Car" +carNumber+str+"<br>";
}
//将页面信息进行排序筛选，并显示
function getRunRecord(newmsg){
    var s=document.getElementById('latestMissions');
    var content = $(s).find('.jscrollbar');
    var msg=newmsg+content.html();
    var msgs=msg.split("<br>");

    for(var i=1;i<51;i++){
        if(i>msgs.length-1)break;
        newmsg=newmsg+msgs[i]+"<br>";
    }
    content.html("");
    content.append(newmsg);
    $(s).data('jsb_data').update('top');

}
//获取日期时间函数
function getNowFormatDate() {
    var date = new Date();
    var month = checkTime(date.getMonth() + 1);
    var strDate = checkTime(date.getDate());
    var hours=checkTime(date.getHours());
    var minutes=checkTime(date.getMinutes());
    var seconds=checkTime(date.getSeconds());
    var weekday=date.getDay();
    switch(weekday){
    case 0:weekday="星期日";break;
    case 1:weekday="星期一";break;
    case 2:weekday="星期二";break;
    case 3:weekday="星期三";break;
    case 4:weekday="星期四";break;
    case 5:weekday="星期五";break;
    case 6:weekday="星期六";break;
    	
    }

    $("#showNowTime").html(date.getFullYear() +"年" + month + "月" + strDate
            + "日" +" "+weekday+" "+hours + ":" +minutes
            + ":" + seconds);
    setTimeout(getNowFormatDate,1000);
}
//页面适配函数
function responsiveIt() {
	responsivePage({
		selector : '.mod-responsive',
		sliceWidth : 1280,
		center : false
	});
}

//获取颜色
function getcolor(){

	  return  '#' +

	    (function(color){

	    return (color +=  '0123456789abcdef'[Math.floor(Math.random()*16)])

	      && (color.length == 6) ?  color : arguments.callee(color);

	  })('');

	}
//时间格式化函数
function checkTime(i)
{
if (i<10) 
  {i="0" + i}
  return i
}

//小车在线状态函数
function agvbtaction(carButtonId){
	
	$("#carChoseId").val(carButtonId);
	if(0==document.getElementById("car_B_statusId_"+carButtonId).value){ 		
		var control_button1=document.getElementById("c1");	 		
		control_button1.removeAttribute("disabled"); 
		var control_button1=document.getElementById("c2");	 		
		control_button1.removeAttribute("disabled"); 
		var control_button1=document.getElementById("c4");	 		
		control_button1.removeAttribute("disabled"); 
		// var control_button3=document.getElementById("c3");
        // control_button3.setAttribute("disabled","disabled");
        var control_button1=document.getElementById("c3");
        control_button1.removeAttribute("disabled");
        var control_button1=document.getElementById("c5");
        control_button1.removeAttribute("disabled");
    }else if(3==document.getElementById("car_B_statusId_"+carButtonId).value){
		var control_button3=document.getElementById("c3");	 		
		control_button3.removeAttribute("disabled"); 
		var control_button1=document.getElementById("c1");	 		
		control_button1.setAttribute("disabled","disabled"); 
		var control_button1=document.getElementById("c2");	 		
		control_button1.setAttribute("disabled","disabled"); 
		var control_button1=document.getElementById("c4");	 
		control_button1.setAttribute("disabled","disabled"); 
	}
}
//手动控制函数
function agvcontrol(controlId){
	var carChoseIdValue=$("#carChoseId").val();
	$.ajax({
         type : "POST",
         dataType:"json",
         url : $("#contextpath").val()+"/livepreview/agvcontrol",
         data:{carChoseId:carChoseIdValue,controlId:controlId},
         success : function(flag) {

             //console.log("SUCCESS: ", data);
        	 // var s=document.getElementById('latestMissions');
		  	//   var li= document.createElement("li");
		  	var myDate = new Date();
		  	//时间未进行格式化
		  	var hh=checkTime(myDate.getHours());
		  	var mm= checkTime(myDate.getMinutes());
		  	var ss=checkTime(myDate.getSeconds());
		  	var newmsg;
		  	if(1==parseInt(flag)) {
                if (controlId == 1) {
                    // newmsg = ">"+hh + ":" + mm + ":" + ss + " Car" + carChoseIdValue + "继续运行<br>";
                    newmsg=strFunction(carChoseIdValue,"上升结束");
                } else if (controlId == 2) {
                    newmsg=strFunction(carChoseIdValue,"下降结束");
                	// newmsg = ">"+hh + ":" + mm + ":" + ss + " Car" + carChoseIdValue + "停止运行<br>";
                } else if (controlId == 3) {
                    newmsg=strFunction(carChoseIdValue,"顺时针旋转90度");
                	// newmsg =">"+ hh + ":" + mm + ":" + ss + " Car" + carChoseIdValue + "充电<br>";
                } else if(controlId == 5){
                    newmsg=strFunction(carChoseIdValue,"逆时针旋转90度");
				}else if (controlId == 4) {
                  cancelCarAndTask(carChoseIdValue);
                    newmsg=strFunction(carChoseIdValue,"任务取消，小车下线");
                	// newmsg = ">"+hh + ":" + mm + ":" + ss + " Car" + carChoseIdValue + "取消任务<br>";
                }
            }else{
                newmsg=strFunction(carChoseIdValue,"手动操作失败");
                // newmsg = ">"+hh + ":" + mm + ":" + ss + " Car" + carChoseIdValue + "手动操作失败!<br>";
			}
		  		getRunRecord(newmsg);
         }
     });
}
//小车下线并取消任务函数
function cancelCarAndTask(carId) {
    var c=document.getElementById('car'+carId);
    var view=document.getElementById('sketchpad');
    view.removeChild(c);
    var curCar_Button=document.getElementById('car_B'+carId);
    curCar_Button.style.color="#000000";
    curCar_Button.style.backgroundColor="#E9E9E9";
    curCar_Button.style.borderColor="#E9E9E9";
    curCar_Button.setAttribute("disabled","disabled");
}