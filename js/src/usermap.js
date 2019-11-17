$(function () {
	// getmap 获取用的分布的数据
	function getMap() {
		$.ajax({
			type: "get",
			cache: false,
			url: adders + '/ly-manage/api/homepage/userDistribution',
			dataType: "json",
			xhrFields: { withCredentials: true },
			success: function (response) {
				if (response.errCode == 0) {
					recentTime();
					var arr = [];
					// 遍历请求的数据 地图需要的数据是 第1箱是经度lon 第二项是纬度lat 第三项是value值
					response.data.forEach(function (item) {
						// var newArr = [item.lon, item.lat, item.val]
						var obj = {
							name: item.city,
							value: [
								item.lon,
								item.lat,
								item.val
							]
						}
						arr.push(obj)
					});
					// 拿到数据转化好 echarts的所需的数据后 调用initMap函数 并将数据传入
					var echartsMap = document.querySelector('.echarts-map');
					var myEcharts = echarts.init(echartsMap);
					initMap(myEcharts, arr)
				}
			}
		});
	}
	getMap()
	// 初始化地图
	function initMap(myEcharts, arr) {
		var option = {
			title: {
				text: '每日用户在线地图分布',
				left: 'left',
				show: false,
				textStyle: {
					color: '#fff'
				}
			},
			// roam: true,
			// backgroundColor: '#fff',
			tooltip: {
				trigger: 'item',
				formatter: function (params) {
					// 提示中显示的数据的处理函数 
					var toolTiphtml = ''
					for (var i = 0; i < arr.length; i++) {
						if (params.name == arr[i].name) {
							toolTiphtml += arr[i].name + ':  ' + arr[i].value[2]
						}
					}
					return toolTiphtml;
				}
			},
			legend: {
				orient: 'vertical',
				top: 'bottom',
				left: 'right',
				data: ['用户在线数量'],
				textStyle: {
					color: '#fff'
				}
			},
			visualMap: {
				type: 'piecewise',
				pieces: [
					{ gt: 150, color: '#e02121' },  // (310, 1000]
					{ gt: 100, lte: 150, color: '#d6591e' },   // (200, 300]
					{ gt: 50, lte: 100, color: '#ddcd05' },       // (10, 200]
					{ lte: 50, color: '#00cc3e' }                 // (-Infinity, 50)
				],
				splitNumber: 4,
				textStyle: {
					color: '#1a345c'
				},
				itemSymbol: 'roundRect'
			},
			toolbox: {
				show: true,
				orient: 'vertical',
				left: '98%',
				top: 'center',
				feature: {
					dataView: { readOnly: false },
					restore: {},
					saveAsImage: {}
				}
			},
			geo: {
				map: 'china',
				label: {
					show: true,
					emphasis: {
						show: false,
						color: '#1a345c',
					},
					normal: {
						show: true, //省份名称  
						color: '#000', // 字体的颜色
					},
				},
				itemStyle: {
					normal: {
						areaColor: '#a9acab',
						borderWidth: '1',
						borderColor: '#fff'
					},
					emphasis: {
						areaColor: '#e1e6fc'
					}
				},
				scaleLimit: {
					min: .5,
				}
			},
			series: [
				{
					rippleEffect: {              //涟漪特效相关配置。
						period: 4,               //动画的时间。
						scale: 2.5,              //动画中波纹的最大缩放比例。
						brushType: 'fill',      //波纹的绘制方式，可选 'stroke' 和 'fill'。
					},
					name: '在线用户',
					// type: 'effectScatter',
					type: 'scatter',
					coordinateSystem: 'geo',
					data: arr, // 数据
					symbolSize: 8,
					label: {
						normal: {
							show: false,
						},
						emphasis: {
							show: false
						}
					},
					itemStyle: {
						emphasis: {
							borderColor: '#fff',
							borderWidth: 1
						}
					},
					tooltip: {

					}
				}
			]
		}
		myEcharts.setOption(option);

	}

})