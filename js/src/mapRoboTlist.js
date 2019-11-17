// map = new AMap.Map("container", {
//     resizeEnable: true,
//     zoom:16,
//     center : [116.4203240000,39.9083130000] ,
//     zooms:[8,16],//地图缩放级别范围：最大16，最小8
//  lang:'zh_en',//地图语言，有zh_cn中文简体（默认），这里zh_en为中英对照
  //  expandZoomRange :true,//是否支持可以扩展最大缩放级别,和zooms属性配合使用 设置为true的时候，zooms的最大级别在PC上可以扩大到20级
//  dragEnable : false, //地图是否可通过鼠标拖拽平移
//  zoomEnable:false,   //地图是否可缩放
//  doubleClickZoom:false, //双击放大地图
//  keyboardEnable:false, //可否键盘控制地图  方向键平移，+-缩放
//  scrollWheel:false    //地图是否可通过鼠标滚轮缩放（跟zoomEnable的区别是：zoomEnable禁止了所有的缩放，比如键盘）
    //以上5个默认值都是true
//  features :["bg","road"] //地图上显示元素的种类，有四种 地图背景： bg, 标注：point，道路：road，建筑物：building //如果不写，默认为全部都有
// });




// var map = new AMap.Map("container",{
//     resizeEnable:true,
//     doubleClickZoom: false,
//     center : [116.4203240000,39.9083130000]
// })
//鼠标单击左键事件
// map.on('click',function(e){
//     //将当前点击的经纬度赋值到文本框
//     document.getElementById("lnglat").value = e.lnglat.getLng() +","+e.lnglat.getLat();
// //    var sl = document.getElementById("lnglat").value = e.lnglat.getLng()
    

//     // map.add(marker)
//     // 创建一个 Marker 实例：
// // var marker = new AMap.Marker({
// //     position: new AMap.LngLat(sl),   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
// //     title: '北京'
// // });
// // map.add(marker);
    
// })
// //鼠标单击右键事件
// map.on('rightclick',function(){
//     //地图级别放大
//     map.zoomIn();
// })
// //鼠标双击事件
// map.on('dblclick',function(){
//     //弹出当前地图级别
//     alert(map.getZoom())
// })



//·······
// $(document).on('click', '.change-info', function () {
//     // 获取对应userid
//     var userid = $(this).attr('data-userid');
//     proveForAli(userid) 
//     $.ajax({
//         type: "get",
//         cache: false,
//         url:  "http://test.manage.faceying.com/ly-manage/api/admin/userDetails",
//         data: {
//             userId: userid
//         },
//         dataType: "json",
//         xhrFields: { withCredentials: true },
//         success: function (response) {
//             console.log(response);
            
//         }
//     });
// })




// $(function () {
//     var center= new AMap.LngLat(113.324691,23.1373);
//     //比例尺(左下，代表地图中的一厘米对应实际的距离)
//     // var scale = new AMap.Scale(),
//     //工具条（左上，可以使用工具条进行上下左右和缩放）
//     // toolBar = new AMap.ToolBar(),
//     //鹰眼 （相当于打游戏的小地图）
//     // overView = new AMap.OverView({
//     //   //  鹰眼是默认不展开的，设置isOpen为true可以默认展开
//     //     isOpen:true
//     // }),
//     map = new AMap.Map('container', {
//         zoom: 15,//缩放层级
//         center:center,//当前地图中心点
//         resizeEnable: true,//调整窗口大小
//          autoFitView : true
//     });
//      //往地图中添加这三个插件
// map.addControl(scale);
// map.addControl(toolBar);
// map.addControl(overView);
//      //为自定义的图标,可调用     
// var icon = new AMap.Icon({
//         image : 'http://vdata.amap.com/icons/b18/1/2.png',//图片大小为24px*24px
//         //icon可缺省，缺省时为默认的蓝色水滴图标，
//         size : new AMap.Size(24,24)
// });
//  marker = new AMap.Marker({
//     // icon: icon, //图标可以用简单的图片路径
//     position: center,       //点标记在地图上显示的位置，默认为地图中心点
//     // offset: new AMap.Pixel(-10,-34),//位置偏移量，默认值为Pixel(-10，-34),(0,0)时marker左上角对准position的位置
//     title: "广州天河体育中心",      //鼠标滑过标记时的文字提示，不设置则鼠标滑过时没有文字提示
//     map: map            //要显示该Marker的地图对象
// });

//  map.on('click',function(e){
//     //将当前点击的经纬度赋值到文本框
//     console.log(e.lnglat.getLng() +","+e.lnglat.getLat());
// })

// //开启热点点击
// // function toggleIsHotspot(checkbox) {
// //  map.setStatus({isHotspot:checkbox.checked ? true : false});
// // }
// // //监听热点点击
// // var hotSpotMarker;
// // map.on("hotspotclick",function(e){
// //  if(hotSpotMarker){
// //      hotSpotMarker.setMap(null);
// //  }
// //  hotSpotMarker = new AMap.Marker({
// //      position:e.lnglat,
// //      map:map,
// //      content:'<div>'+ e.name +'</div>'
// //  });
// // });

// });



// function initGDmap(){
//     var longitude     =   "121.503396";
//     var latitude      =   "31.277239";
//     var map = new AMap.Map("map", {
//           resizeEnable: true,
//           zoom: 13,//地图显示的缩放级别
//           center: [longitude, latitude]
//       });
//       var marker    =   new AMap.Marker({
//           map: map,
//           position: [longitude, latitude]
//       });                 
//     //为地图注册click事件获取鼠标点击出的经纬度坐标
//     var clickEventListener = map.on('click', function(e) {
//           document.getElementById("longitude").value = e.lnglat.getLng(); 
//           document.getElementById("latitude").value = e.lnglat.getLat();
//           lnglatXY = [e.lnglat.getLng(),e.lnglat.getLat()]; //已知点坐标   
//           marker.setPosition(lnglatXY); 
//           regeocoder(lnglatXY);
//     });
//     AMap.plugin('AMap.Autocomplete',function(){   
//     var auto = new AMap.Autocomplete({
//         input: "keywords"
//     });
//     AMap.event.addListener(auto, "select", select);//注册监听，当选中某条记录时会触发
//     function select(e) {
//         if (e.poi && e.poi.location) {
//             map.setZoom(15);
//             map.setCenter(e.poi.location);
//         }
//       }
//     })    
// }

// //逆地理编码
// function regeocoder(lnglatXY) {  
//     AMap.plugin('AMap.Geocoder',function(){   
//      var geocoder = new AMap.Geocoder({
//           radius: 1000,
//           extensions: "all"
//       });        
//       geocoder.getAddress(lnglatXY, function(status, result) {
//           if (status === 'complete' && result.info === 'OK') {
//                 var address = result.regeocode.formattedAddress; //返回地址描述
//                 document.getElementById("address").value = address;
//           }
//       });        
//       var marker = new AMap.Marker({  //加点
//           map: map,
//           position: lnglatXY
//       });
//       map.setFitView();
//     })    
// }



/**
 * 高德地图获取地址和经纬度
 */
// function searchByStationName(ylng,ylat) {
//     var proviceAndCityAndCounty=$("#proviceAndCityAndCounty").val();//省市区名
//     var city=$("#county").val();//区县名
//     // var street=$("#street").val();//街道详细地址
//     var address =proviceAndCityAndCounty; //要搜索的地址内容
 
//     if(address==null||address==''){
//         address='上海市';
//     }
 
//     //默认定位：初始化加载地图时，center及level属性缺省，地图默认显示用户所在城市范围
//     var map = new AMap.Map("allmap", {
//         center:[116.379391,39.861536],
//         resizeEnable: true
//     });
 
//     var geocoder,marker;
//     if(!geocoder){
//         geocoder = new AMap.Geocoder({
//             city: city // city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
            
//         });
//     }
 
//     //地理编码（地址->经纬度）（作用：根据输入的中文地址定位地图初始位置）
//     geocoder.getLocation(address.replace('-',''), function(status, result) {
//         if (status === 'complete'&&result.geocodes.length) {
//             var lnglat = result.geocodes[0].location;//经纬度信息集合 eg：c {O: 26.100779, P: 119.295144, lng: 119.295144, lat: 26.100779}
//             //初始位置点标记
//             if(!marker){
//                 marker = new AMap.Marker();
//                 map.add(marker);
//             }
//             //如果传了经纬度参数，就地位标记到传过来的经纬度位置
//             if(ylng!=null && ylng!='' && ylat!=null && ylat!=''){
//                 marker.setPosition(new AMap.LngLat(ylng,ylat));
//             }else{
//                 marker.setPosition(lnglat);
//             }
 
//             map.setFitView(marker);
//         }else{alert(JSON.stringify(result))}
//     });
 
//     //为地图注册click事件获取鼠标点击出的经纬度坐标
//     map.on('click', function(e) {
//         var lng=e.lnglat.getLng(); //经度
//         var lat=e.lnglat.getLat(); //维度
//         //点标记
//         if(!marker){
//             marker = new AMap.Marker();
//             map.add(marker);
//         }
//         marker.setPosition(new AMap.LngLat(lng,lat));
//         map.setFitView(marker);
//         //经纬度赋值
//         $("#longitude").val(lng);
//         $("#latitude").val(lat);
 
//     });
// }


function mapInit (container, changeLocation){
    var map = new AMap.Map(container,{
        zoom:10,
        center:[121.470181,31.241289]
    });
    
    map.setDefaultCursor('pointer');
    
    var marker = new AMap.Marker({
        icon:'https://a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png',
        position:[116,39]
    })
    
    map.on('click',function(e){
        changeLocation = e.lnglat.getLng() +","+e.lnglat.getLat();
        map.remove([marker])
        marker = new AMap.Marker({
            icon:'https://a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png',
            position:[e.lnglat.getLng(),e.lnglat.getLat()],
            offset:new AMap.Pixel(-10,-20)
        });
        
        map.add([marker]);
    })
    return map;
}

var map = new AMap.Map('container',{
    zoom:10,
    center:[121.470181,31.241289]
});

map.setDefaultCursor('pointer');

var marker = new AMap.Marker({
    icon:'https://a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png',
    position:[116,39]
})

map.on('click',function(e){
    console.log(e);
    
//    document.getElementById("lnglat").value = e.lnglat.getLng() +","+e.lnglat.getLat();
    changeLocation = e.lnglat.getLng() +","+e.lnglat.getLat();
    console.log(changeLocation)
 
    map.remove([marker])
    marker = new AMap.Marker({
        icon:'https://a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png',
        position:[e.lnglat.getLng(),e.lnglat.getLat()],
        offset:new AMap.Pixel(-10,-20)
    });
    
    map.add([marker]);
})