define(function(b,a,c){a.draw_stockchart=function(e,v,ak,J,W,T){if(!e||!ak){return idb("Paper or Data is empty.")}var H=b("./infoviz.core");var F=H.merge_options(J),z=[],X,V,al,ag=0;var P=ak.data,D=[],aj,ai,ah,L;var I=ak.horizontal_field,f=ak.vertical_field;var l,h,U,M,G=Infinity,am=-Infinity,R=Infinity,r=-Infinity;var n={};for(var s in P){for(aj=0;aj<P[s]["data"].length;++aj){L=P[s]["data"][aj];if(L[I]!==undefined){l=L[I]}else{l="N/A"}if(l>am){am=l}if(l<G){G=l}if(H.in_array(l,D)===-1){D.push(l);n[l]={min:Infinity,max:-Infinity}}if(H.is_number(L[f.max])){h=L[f.max]}else{continue}if(H.is_number(L[f.min])){M=L[f.min]}else{continue}if(h>n[l]["max"]){n[l]["max"]=h}if(M<n[l]["min"]){n[l]["min"]=M}}++ag}for(var aa in n){if(n[aa]["max"]>r){r=n[aa]["max"]}if(n[aa]["min"]<R){R=n[aa]["min"]}}R=Math.floor(R/10)*10;r=Math.ceil(r/10)*10;var ab=v["top-left"][0]+F.stockchart["padding-left"];var af=v["bottom-left"][1]-F.stockchart["padding-bottom"];var S=(af-v["top-left"][1]-F.stockchart["padding-top"])/(r-R);var g={};var A=(af-v["top-left"][1]-F.stockchart["padding-top"])/(F.grid["vertical-label-count"]-1);var o=Math.floor((r-R)/(F.grid["vertical-label-count"]-1));z=[];X=v["top-left"][0]-F.grid["vertical-bar-width"];V=af;var m=R;for(aj=0;aj<F.grid["vertical-label-count"];++aj){z.push("M"+X+","+V+"L"+v["top-left"][0]+","+V);e.path(z.join("")).attr({stroke:F.grid["axis-color"],"stroke-opacity":F.grid["axis-alpha"],"stroke-width":F.grid["axis-width"]}).translate(0.5,0.5);e.text(X-F.grid["vertical-bar-width"],V,m.toFixed(F.grid["vertical-label-round"])).attr({"text-anchor":"end",fill:F.grid["vertical-label-color"],"font-size":F.grid["vertical-label-size"]}).translate(0.5,0.5);V-=A;m+=o}var E=(v.width-F.stockchart["padding-left"]-F.stockchart["padding-right"]-(D.length-1)*F.stockchart["group-margin"])/D.length;var Q=(E-(ag-1)*F.stockchart["bar-margin"])/ag;var q,u;z=[];X=ab+E/2;V=v["bottom-right"][1]+F.grid["horizontal-name-size"]/2+F.grid["horizontal-label-margin"]*2;for(aj=0;aj<D.length;++aj){z.push("M"+X+","+v["bottom-left"][1]);z.push("L"+X+","+v["top-left"][1]);g[D[aj]]=X-E/2;u=e.text(X,V,D[aj]).attr({"text-anchor":"middle","font-size":F.grid["horizontal-label-size"],fill:F.grid["horizontal-label-color"]}).translate(0.5,0.5);if(F.grid["horizontal-label-rotate"]){u.transform("r"+F.grid["horizontal-label-rotate"])}X+=E+F.stockchart["group-margin"]}q=e.path(z.join(""));q.attr({stroke:F.grid["grid-color"],"stroke-dasharray":"--..","stroke-linecap":"butt","stroke-width":F.grid["grid-width"],"stroke-opacity":F.grid["grid-alpha"]});q.translate(0.5,0.5);var O=0,K,d=[],Z;var Y=[];for(var s in P){var C,w,B,ae;K=F.color[(O%F.color.length)];for(aj=0;aj<P[s]["data"].length;++aj){L=P[s]["data"][aj];X=g[L[I]]+(O)*(Q+F.stockchart["bar-margin"]);ae=af-(L[f.max]-R)*S;B=af-(L[f.middle]-R)*S;w=af-(L[f.min]-R)*S;Z=e.rect(X,ae,Q,(w-ae));Z.attr({stroke:K.color,"stroke-opacity":K["dark-alpha"],"stroke-width":F.stockchart["border-width"],fill:K.color,"fill-opacity":K["light-alpha"]}).translate(0.5,0.5);if(F.layout["shadow-enabled"]){Z.glow({width:F.layout["shadow-width"],fill:false,opacity:F.layout["shadow-alpha"],offsetx:F.layout["shadow-offset-x"],offsety:F.layout["shadow-offset-y"],color:F.layout["shadow-color"]})}d.push(Z);var ac=F.stockchart["middle-line-color"];if(!ac){ac=K.color}e.path("M"+(X-F.stockchart["bar-margin"])+","+B+"L"+(X+Q+F.stockchart["bar-margin"])+","+B).attr({stroke:ac,"stroke-width":F.stockchart["middle-line-width"],"stroke-opacity":F.stockchart["middle-line-alpha"]}).translate(0.5,0.5);if(W&&typeof(W)==="function"){Z.data("info",{x:X,min_y:w,middle_y:B,max_y:ae,h_value:L[I],v_value:L[f],data:L,callback:W,that:T});Z.click(H.element_action)}if(ak.tooltip_title||ak.tooltip_content){var N=ak.tooltip_title;var t=ak.tooltip_content;for(var ad in L){N=N.replace("{"+ad+"}",L[ad]);t=t.replace("{"+ad+"}",L[ad])}Z.data("tooltip",{id:s+aj,title:N,content:t,color:K,x:X,y:ae,element:Z,options:F,paper:e});Z.hover(H.element_tooltip)}}Y.push({label:P[s]["name"],color:K,type:"box"});O++}H.draw_legend(e,v,Y,F);for(aj=0;aj<d.length;++aj){(function(i){i.mouseover(function(){i.stop().animate({"fill-opacity":F.color[0]["dark-alpha"]},F.layout["speed"],">")});i.mouseout(function(){i.stop().animate({"fill-opacity":F.color[0]["light-alpha"]},F.layout["speed"],"<")})})(d[aj])}}});