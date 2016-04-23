/*line chart默认配置*/
$.elycharts.templates['base']={
 type:'line',
 defaultSeries : {
    fill : true,
    min:20,
    plotProps:{
      "stroke-width" :2
    },
    fillProps:{
      opacity:0.2
    },
    dotProps:{stroke : "#ff4100","stroke-width":2,fill:"#fff",size:3},
    dot:true,
     tooltip : {
      frameProps:{fill:"#ff4100",stroke:"#ff4100"},
      width:32,
      height:24,
      offset:[20,16],
      contentStyle:{"text-align":"center",color: "#fff"}
    },
    highlight:{
     scale:2
    }
  },
  series : {
    "line":{color:'#ff4100'}
  },
  defaultAxis : {
    labels : true,
    labelsProps: { fill:"#b5b5b5"}
  },
  axis:{
   l:{
   	 labelsDistance:12
   },
   x:{
   	labelsDistance:12
   }
  },
  label:{
   style:{color:"red"},
   frameAnchor:"middle"
  },
  features : {
    grid : {
      draw:true,
      forceBorder:true,
      ny:10,
      props : {
         stroke : '#dcdcdc',
         "stroke-dasharray" : "-"
      },
       extra : [0, 14, 0, 14]
    }
  }
} 

function showChart(id,options){
  $('#'+id).chart('clear');
  var data = options.data || [],
    length = data.length,
    labels=options.labels || [],
    laLength=labels.length,
    iMax = 0;
    //防止y轴刻度出现小数
    for (var i = 0; i < length; i++) {
      if (parseInt(data[i]) >= parseInt(iMax)) {
        iMax = parseInt(data[i]);
      }
    }
  if(iMax<10){
    $.elycharts.templates['base'].axis.l.max=10;
  }else{
    delete $.elycharts.templates['base'].axis.l.max;
  }
  $('#'+id).chart({
    template:options.templateName || "base",
    values:{
     "line":data
    },
    labels:labels,
    tooltips:{
      "line":data
    },
    margins:options.margins || [18,20, 20,50],
    width:options.width || 500,
    height:options.height || 300 
  });	
}
