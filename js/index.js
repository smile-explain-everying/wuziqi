$(function(){
  var ctx = $('#canvas').get(0).getContext('2d');
  var canvasS =600;
  var row = 15;
  var blockS = canvasS/row;

  $('#canvas').get(0).width = canvasS;
  $('#canvas').get(0).height= canvasS;
  //////////画棋盘
  var draw = function(){

    var jianxi = blockS/2 +0.5;
    var lineWidth = canvasS - blockS;

    ////////////画横线
    ctx.save();
    ctx.beginPath();
    ctx.translate(jianxi,jianxi);
    ctx.moveTo(0,0);
    ctx.lineTo(lineWidth,0);
    for(var i=0;i<row;i++){
      ctx.translate(0,blockS);
      ctx.moveTo(0,0);
      ctx.lineTo(lineWidth,0);
    }
    ctx.stroke();
    ctx.closePath();
    ctx.restore();
    //////////////画竖线
    ctx.save();
    ctx.beginPath();
    ctx.translate(jianxi,jianxi);
    ctx.moveTo(0,0);
    ctx.lineTo(0,lineWidth);
    for(var i=0;i<row;i++){
      ctx.translate(blockS,0);
      ctx.moveTo(0,0);
      ctx.lineTo(0,lineWidth);
    }
    ctx.stroke();
    ctx.closePath();
    ctx.restore();

    /////////////画圆点
    var point=[3.5*blockS+0.5,11.5*blockS+0.5];

    for(var i=0;i<2;i++){
      for(var j=0;j<2;j++){
        var x=point[i];
        var y=point[j];
        ctx.save();
        ctx.beginPath();
        ctx.translate(x,y);
        ctx.arc(0,0,3,0,(Math.PI/180)*360);
        ctx.fill();
        ctx.closePath();
        ctx.restore();

      }
    }
    ctx.save();
    ctx.beginPath();
    ctx.translate(7.5*blockS+0.5,7.5*blockS+0.5);
    ctx.arc(0,0,3,0,(Math.PI/180)*360);
    ctx.fill();
    ctx.closePath();
    ctx.restore();

  }
  draw();
  var qiziRadius = blockS/2*0.8;
  var drop=function(qizi){
    ctx.save();
    ctx.translate((qizi.x+0.5)*blockS,(qizi.y+0.5)*blockS);
    ctx.beginPath();
    ctx.arc(0,0,qiziRadius,0,(Math.PI/180)*360);
    if(qizi.color===1){
      ctx.fillStyle='blick'
      // var img = new Image();
      // img.src = 'hei.png';
      // img.onload = function(){
      //   var ptrn = ctx.createPattern(img,'no-repeat');
      //   ctx.fillStyle = ptrn;
      //   ctx.fill(0,0,30,30);
      //   // ctx.fillRect(0,0,30,30);
      // }
    }else{
      ctx.fillStyle='#fff'
    //   var img = new Image();
    //   img.src = 'bai.png';
    //   img.onload = function(){
    //     var ptrn = ctx.createPattern(img,'no-repeat');
    //     ctx.fillStyle = ptrn;
    //   }
    }
    ctx.fill();
    ctx.closePath();
    ctx.restore();
  }
  var kaiguan=true;
  var step=0;
  var All ={};
  var panduan = function(qizi){
      var shuju = {};
      $.each(All,function(k,v){
        if( v.color === qizi.color ){
          shuju[k] = v;
        }
      })
      var shu = 1,hang=1,zuoxie=1,youxie=1;
      var tx,ty;

      /*|*/
      tx = qizi.x; ty = qizi.y;
      while ( shuju [ tx + '-' + (ty + 1) ]){
        shu ++;ty++;
      }
      tx = qizi.x; ty = qizi.y;
      while ( shuju [ tx + '-' + (ty - 1) ]){
        shu ++; ty--;
      }

      /*-*/
      tx = qizi.x ; ty = qizi.y;
      while( shuju[ (tx+1) + '-' + ty ] ){
        hang++;tx++;
      }
      tx = qizi.x ; ty = qizi.y;
      while( shuju[ (tx-1) + '-' + ty ] ){
        hang++;tx--;
      }

      tx = qizi.x ; ty = qizi.y;
      while( shuju[ (tx-1) + '-' + (ty-1) ] ){
        zuoxie++;tx--;ty--;
      }
      tx = qizi.x ; ty = qizi.y;
      while( shuju[ (tx+1) + '-' + (ty+1) ] ){
        zuoxie++;tx++;ty++;
      }

      tx = qizi.x ; ty = qizi.y;
      while( shuju[ (tx+1) + '-' + (ty-1) ] ){
        youxie++;tx++;ty--;
      }
      tx = qizi.x ; ty = qizi.y;
      while( shuju[ (tx-1) + '-' + (ty+1) ] ){
        youxie++;tx--;ty++;
      }

      if( shu >=5  || hang>=5 || zuoxie>=5 || youxie>=5){
        return true;
      }
  }
  $('#canvas').on('click',function(e){
    var x = Math.floor(e.offsetX/blockS);
    var y = Math.floor(e.offsetY/blockS);

    if( All[ x + '-' + y ]){
      return;
    }

    var qizi;
    if(kaiguan){
      qizi = {x:x,y:y,color:1};
      drop(qizi);
      if( panduan(qizi) ){
        $('.cartel.a').show();
        return;
      };
    }else{
      qizi = {x:x,y:y,color:0};
      drop(qizi);
      if( panduan(qizi) ){
      $('.cartel.b').show();
        return;
      };
    }
    kaiguan = !kaiguan;
    All[ x + '-' + y ] = qizi;

  });
  $(".restart").on('click',function(){
    $('.cartel').hide();
    ctx.clearRect(0,0,600,600);
    draw();
    kaiguan = true;
    all = {};
    step = 1;
  })

  $('.qipu').on('click',function(){
    $('.cartel').hide();
    $('#save').show();
    ctx.save();
    ctx.font = "20px consolas";
    for( var i in all){
      if( all[i].color === 1){
        ctx.fillStyle = '#fff';
      }else{
        ctx.fillStyle = 'black';
      }
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(all[i].step,
        (all[i].x+0.5)*blockS,
        (all[i].y+0.5)*blockS);
      }
      ctx.restore();
      var image = $('#canvas').get(0).toDataURL('image/jpg',1);
      $('#save').attr('href',image);
      $('#save').attr('download','qipu.png');
    })

    $('.tips').on('click',false);
    $('#close').on('click',function(){
      $('.cartel').hide();
    })
    $('.cartel').on('click',function(){
      $(this).hide();
    })
    $('.start').on('click',function(){
      $('.box').hide();
    })
})
