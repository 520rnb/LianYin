$(function () {
	var sidePage = {
		icon: "icon-shouye",
		menuName: "首页",
		path: "../overview/index.html",
		children: ''
	}
	// 侧边栏
	getSideBar(sidePage)
	var data = {
		pageSize: 10,
		pageNum: 1
	};
	var pages = 1;
	function getData(data) {
		$.ajax({
			type: "get",
			cache: false,
			url: adders + "/ly-manage/api/dynamic/dynamicShareList",
			data: data,
			dataType: "json",
			xhrFields: { withCredentials: true },
			success: function (response) {
				if (response.succeed) {
					recentTime();
					if (response.data.total) {
						var html = template('tmp-share', response);
						$('.dynamic-share').html(html);
						// 重新渲染分页插件
						p.render({
							count: response.data.total,
							pagesize: data.pageSize,
							toolbar: true,
							current: data.pageNum
						})
						$('#pageTool').show();
					} else {
						var html = template('no-data', response);
						$('.dynamic-share').html(html);
						// 重新渲染分页插件
						$('#pageTool').hide();
					}
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
	getData(data);
	//  初始化分页插件
	var p = new Paging();
	p.init({
		target: '#pageTool',
		pagesize: 10,
		count: 100,
		toolbar: true,
		callback: function (page, size, count) {
			pages = page;
			data.pageNum = page;
			data.pageSize = size;
			getData(data)
		},
		changePagesize: function (ps) {
			pages = 1;
			data.pageNum = 1;
			data.pageSize = ps;
			getData(data)
		}
	})

	var max = moment(new Date()).format('YYYY-MM-DD')
	// 时间选择器初始化
	$('.J-datepicker-day').datePicker({
		format: 'YYYY-MM-DD',
		isRange: true,
		max: max
	});
	// 查看按钮的事件
	$('.checkapp').click(function (e) {
		// 获取的输入的内容
		var beginDate = $('.beginDate').val();
		var endDate = $('.endDate').val()
		if (beginDate && endDate) {
			data.beginDate = beginDate + ' 00:00:00';
			data.endDate = endDate + ' 23:59:59';
		} else {
			delete data.beginDate
			delete data.endDate
		}
		var userId = $('.userId').val();
		if (userId) {
			var reg = /^\d{9,10}$/;
			if (reg.test(userId)) {
				data.userId = userId
			} else {
				$.message({
					type: 'error',
					message: '请输入正确的脸影号'
				})
				return;
			}
		} else {
			delete data.userId
		}
		var dynamicId = $('.dynamicId').val();
		if (dynamicId) {
			var reg = /^\d+$/
			if (reg.test(dynamicId)){
				data.dynamicId = dynamicId
			} else {
				$.message({
					type: 'error',
					message: '输入的只能是数字'
				})
				return
			}
		} else {
			delete data.dynamicId
		}
		var shareId = $('.shareId').val();
		if (shareId) {
			var reg = /^\d+$/;
			if (reg.test(shareId)) {
				data.shareId = shareId
			} else {
				$.message({
					type: 'error',
					message: '输入的只能是数字'
				})
				return;
			}
		} else {
			delete data.shareId
		}
		data.pageNum = 1
		getData(data)
	});
	// 重置事件
	$('.rest').click(function () {
		// 清除用户上一次输入的值
		$('.beginDate').val([''])
		$('.endDate').val([''])
		$('.userId').val([''])
		$('.dynamicId').val([''])
		$('.shareId').val([''])
	})
})