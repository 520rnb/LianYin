$(function () {
	var pages = {
		icon: "icon-shouye",
		menuName: "首页",
		path: "../overview/index.html",
		children: ''
	}
	getSideBar (pages)
	// 默认是折线图
	var type = 'line'
	// 时间选择控件默认是有值 给时间选择加上值
	var timeData = {};
	function defalutTime() {
		var now = new Date()
		var ago = new Date(now).getTime() - (6 * 3600 * 24 * 1000)
		now = moment(now).format('YYYY-MM-DD')
		ago = moment(ago).format('YYYY-MM-DD')
		// 给表单加上默认值
		$('.beginDateLine').val(ago);
		$('.endDateLine').val(now);
	}
	defalutTime()
	// 获取每日动态数量
	function trendsNum(object, type) {
		// 默认是获取昨天到今天的数据
		var obj = object || maxAgo()
		$.ajax({
			type: "get",
			cache: false,
			url: adders + '/ly-manage/api/homepage/dynamicStatistics',
			data: obj,
			dataType: "json",
			xhrFields: { withCredentials: true },
			success: function (response) {
				if (response.succeed) {
					recentTime();
					var xline = [];
					var user = [];
					var tips = [];
					// ecahrt容器
					var element = document.querySelector('.line')
					response.data.forEach(function (item) {
						xline.push(item.date)
						user.push(item.dynamicCount)
					});
					echartsInit(element, xline, user, {
						title: '每日动态发送数量',
						tips: '动态数量',
						type: type
					})
				} else {
					if (response.errCode == 403) {
						localStorage.removeItem('recentTime');
						document.location.href = '../../login.html?timeout';
						return;
					} else {
						$.message({
							type: 'error',
							message: response.errMsg
						})
					}
				}
			}
		});
	}
	// 执行默认获取用户发送动态的数据
	trendsNum()

	// 页面一打开默认获取的的是7天数据
	function maxAgo(num) {
		var num = num || 6 // 默认是7天
		// 今天的时间
		var now = new Date()
		// 七天之前的时间
		var weekAgo = new Date(now.getTime() - num * 24 * 3600 * 1000)
		// 今天的日期和七天的之前的日期
		return {
			beginDate: moment(weekAgo).format("YYYY-MM-DD"),
			endDate: moment(now).format("YYYY-MM-DD")
		}
	}


	var echartsArr = [];
	// 初始化时间选择控件
	$('.J-datepicker-day').datePicker({
		max: moment(new Date()).format('YYYY-MM-DD'),
		isRange: true, // 是否开启时间选择 默认是false 选择
		format: 'YYYY-MM-DD',
		min: minDate
	});
	// echarts初始化函数
	function echartsInit(element, xline, user, obj) {
		// 选中的echarts初始化的容器
		// 初始化一个echarts实例
		var ecahrtsLines = echarts.init(element);
		// 将echart对象的存到数组中
		echartsArr.push(ecahrtsLines)
		var option = {
			title: {
				show: false,
				text: obj.title
			},
			toolbox: {
				feature: {
					magicType: { show: true, type: ['line', 'bar'] },
					restore: { show: true },
					saveAsImage: { show: true }
				}
			},
			lineStyle: {
				color: '#448bf2'
			},
			barStyle: {
				color: '#448bf2'
			},
			tooltip: {
				trigger: 'axis',
				axisPointer: {
					type: 'cross',
					label: {
						backgroundColor: '#6a7985'
					}
				}
			},
			legend: {
				type: 'scroll',
				show: false
			},
			xAxis: {
				data: xline,
				min: 0,
				name: '时间',
				nameLocation: 'end',
				nameGap: 20,
				axisLine: {
					show: true
				}
			},
			grid: {
				x: 50,
				y: 45,
				x2: 20,
				y2: 20,
				borderWidth: 1
			},
			yAxis: {},
			series: [
				{
					name: obj.tips,
					type: obj.type || 'line',
					data: user,
					itemStyle: {
						normal: {
							color: new echarts.graphic.LinearGradient(
								0, 0, 0, 1,
								[
									{ offset: 0, color: '#83bff6' },
									{ offset: 0.5, color: '#188df0' },
									{ offset: 1, color: '#188df0' }
								]
							)
						}
					},
					lineStyle: {
						// color: 'red',
						borderWidth: 3,
						borderColor: 'red',
						borderType: 'solid'
					},
					areaStyle: {
						normal: {
							color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
								offset: 0,
								color: 'rgba(121,191,250,0.5)'
							}, {
								offset: 1,
								color: 'rgba(255,255,255,0)'
							}])
						}
					},
				},
			]
		};
		// 使用echarts的实例的setOption方法生成图表
		ecahrtsLines.setOption(option);
		// 初始话好的图标跟句宽度的改变而改变 
		window.onresize = function () {
			echartsArr.forEach(function (item) {
				item.resize();
			})
		};
	};

	// 给查看按钮注册点击事件  app用户动态的发送数量折线图
	$('.checkLine').click(function (e) {
		// 获取的开始的时间 和结束的日期
		var beginDate = $('.dynamicbeginDateLine').val() + ' 00:00:00';
		var endDate = $('.dynamicendDateLine').val() + ' 23:59:59';
		// 执行 checkTime函数
		timeData = {
			beginDate: beginDate,
			endDate: endDate
		}
		checkTime(beginDate, endDate, function () {
			// 执行 trendsNum函数
			trendsNum({
				beginDate: beginDate,
				endDate: endDate
			}, type)
		})
	});

	// 获取每天用户注册量的数据
	function appNum(obj) {
		var obj = obj || maxAgo()
		$.ajax({
			type: "get",
			cache: false,
			url: adders + "/ly-manage/api/homepage/registerStatistics",
			data: obj,
			dataType: "json",
			xhrFields: { withCredentials: true },
			success: function (response) {
				if (response.succeed) {
					recentTime();
					// 获取需要初始化的容器
					var element = document.querySelector('.appline')
					var xline = [];
					var user = [];
					response.data.forEach(function (item) {
						xline.push(item.date)
						user.push(item.registerCount)
					});
					// 指向echartInit函数
					echartsInit(element, xline, user, {
						title: '用户每日注册量',
						tips: '注册量',
						type: type
					})
				} else {
					if (response.errCode == 403) {
						localStorage.removeItem('recentTime');
						document.location.href = '../../login.html?timeout';
					} else {
						$.message({
							type: 'error',
							message: response.errMsg
						})
					}
				}
			}
		});
	}
	// 执行 用户注册量的函数
	appNum()
	// 给用户注册量的按钮注册点击事件
	$('.checkAppLine').click(function () {
		// 获取用户选择的时间
		var beginDate = $('.userbeginDateLine').val() + ' 00:00:00';
		var endDate = $('.userendDateLine').val() + " 23:59:59";
		checkTime(beginDate, endDate, function () {
			appNum({
				beginDate: beginDate,
				endDate: endDate
			})
		})

	})

	// 判断用户选择的日期是否正确的函数
	function checkTime(beginDate, endDate, callback) {
		// 判断用户是否选择了时间 没有选择时间则提示用户选择时间
		if (beginDate == ' 00:00:00' || endDate == ' 23:59:59') {
			$.message({
				type: 'error',
				message: '请选择时间'
			});
			return;
		}
		// 执行回调函数
		callback()
	}

	// 地图的初始化
	function getMap() {
		$.ajax({
			type: "get",
			cache: false,
			url: adders + '/ly-manage/api/homepage/userDistribution',
			dataType: "json",
			xhrFields: { withCredentials: true },
			success: function (response) {
				if (response.succeed) {
					var arr = [];
					// 遍历请求的数据 地图需要的数据是 第1箱是经度lon 第二项是纬度lat 第三项是value值
					response.data.forEach(function (item) {
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
					initMap(arr)
				} else {
					if (response.errCode == 403) {
						localStorage.removeItem('recentTime');
						document.location.href = '../../login.html?timeout'
					} else {
						$.message({
							type: 'error',
							message: response.errMsg
						})
					}
				}
			}
		});
	}
	getMap()

	function initMap(res) {
		var myChart = echarts.init(document.getElementById('echarts-map'));
		myChart.setOption({
			title: {
				text: '当日活跃用户地域分布图',
				left: 'center',
				top: 10,
				textStyle: {
					color: '#000',
					fontSize: '25'
				}
			},
			amap: {
				center: [103.4590412100, 35.8448593900],
				zoomEnable: false,
				dragEnable: false,
				maxPitch: 60,
				pitch: 10, //45 俯仰角
				viewMode: '3D',
				zoom: 4.5,
				expandZoomRange: true,
				zooms: [3, 20],
				mapStyle: 'amap://styles/a47e13cfd8f50d3763ce1c09601c8450', //地图主题
				rotation: 0,  //顺时针旋转角度
				resizeEnable: true
			},
			tooltip: {
				trigger: 'item',
				zlevel: 100,
				formatter: function (params) {
					// 提示中显示的数据的处理函数 
					var toolTiphtml = ''
					for (var i = 0; i < res.length; i++) {
						if (params.name == res[i].name) {
							toolTiphtml += res[i].name + ' :  ' + res[i].value[2]
						}
					}
					return toolTiphtml;
				}
			},
			// 工具箱
			toolbox: {
				show: true,
				orient: 'vertical',
				left: '98%',
				top: 'center',
				zlevel: 60,
				z: 200,
				feature: {
					dataView: { readOnly: false },
					restore: {},
					saveAsImage: {}
				},
				textStyle: {
					color: '#fff'
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
				left: 'right',
				// dimension: 0,
				// show: false,
				pieces: [
					{
						gte: 0,
						lt: 50
						// color: '#00cc3e'
					},
					{
						gte: 50,
						lt: 100
						// color: '#edee02'
					},
					{
						gt: 100
						// color: '#ec0202'
					}
				],
				// minOpen: false,
				// maxOpen: false,
				color: ['#ec0202', '#edee02', '#00cc3e'],
				// textStyle: {
				// 	color: '#fff',
				// },
			},
			data: res,
			animation: true,
		});
		//上面的部分是echarts的配置，需要注意的是amap，这里的配置就是针对 高德地图 的配置了，而支持哪些配置
		//可以去高德地图的开发平台去查看
		var map = new AMap.Map('container', {
			zoom: 12,
			center: [103.4590412100, 35.8448593900],
		});


		var map = myChart.getModel().getComponent('amap').getAMap();
		var layer = myChart.getModel().getComponent('amap').getLayer();

		var series = [
			{
				name: '用户分布',
				// type: 'effectScatter',
				type: 'scatter',
				hoverAnimation: true,
				coordinateSystem: 'amap',
				//数据载入，这里需要自己定义自己的数据，主要是[{name : ***, value : ***}]
				data: res,
				hoverAnimation: true,
				symbolSize: 8,
				//配置标签的显示
				label: {
					// normal: {
					// 	formatter: '{b}',
					// 	position: 'right',
					// 	show: false
					// },
					emphasis: {
						show: false
					},
					showEffectOn: 'render',
					large: true,
					effectType: "",
					rippleEffect: {              //涟漪特效相关配置。
						period: 0,               //动画的时间。
						scale: 0,              //动画中波纹的最大缩放比例。
						brushType: 'fill',      //波纹的绘制方式，可选 'stroke' 和 'fill'。
					}
				}
			}
		];

		myChart.setOption({
			series: series
		});

		//下面是确保高德地图渲染的时候，echarts同时也需要再次渲染一次，保持位置的同步
		layer.render = function () {
			myChart.setOption({
				series: series
			});
		}
	}

	//  主页统计活跃度及留存统计
	function vitalityStatistics() {
		$.ajax({
			type: "get",
			url: adders + "/ly-manage/api/homepage/vitalityStatistics",
			dataType: "json",
			xhrFields: { withCredentials: true },
			success: function (response) {
				var html = template('tmp-statistical', response);
				$('.statistical').html(html)
			}
		});
	}

	vitalityStatistics()
})