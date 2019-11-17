/* 推送列表 */
$(function () {
	// 侧边栏
	var sidePage = {
		icon: "icon-shouye",
		menuName: "首页",
		path: "../overview/index.html",
		children: ''
	}
	// 侧边栏
	getSideBar(sidePage)
	/*
	 *  获取推送列表的数据
	 *  参数 pushlistData
	 **/
	var pushlistData = {
		pageNum: 1,
		pageSize: 10
	}
	getPushList(pushlistData)

	function getPushList(data) {
		// return;
		$.ajax({
			type: "get",
			url: adders + "/ly-manage/api/push/notifyPushRecord",
			data: data,
			dataType: "json",
			xhrFields: { withCredentials: true },
			success: function (response) {
				if (response.succeed) {
					if (response.data.total) {
						var html = template('tmp-pushlist', response.data)
						$('.pushlist tbody').html(html)
						// 重新渲染分页插件
						pg.render({
							pagesize: data.pageSize,
							toolbar: true,
							count: response.data.total,
							current: data.pageNum
						})
						$('#pageTool').show()
					} else {
						var html = template('no-data', response)
						$('.pushlist tbody').html(html)
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

	/* 初始化分页插件 */
	var pg = new Paging()
	pg.init({
		target: '#pageTool',
		pagesize: 10,
		toolbar: true,
		total: 100,
		changePagesize: function (ps) {
			pushlistData.pageSize = ps
			pushlistData.pageNum = 1
			getPushList(pushlistData)
		},
		callback: function (page, size, count) {
			pushlistData.pageNum = page;
			pushlistData.pageSize = size;
			getPushList(pushlistData)
		}
	})

	/* 初始化时间选择插件 */
	$('.J-datepicker-day').datePicker({
		max: moment(new Date()).format('YYYY-MM-DD'),
		isRange: true, // 是否开启时间选择 默认是false 选择
		format: 'YYYY-MM-DD',
		min: minDate
	});

	/* 查看按钮的事件 */
	$('.checkapp').click(function () {
		var loading = template('tmp-loading', {})
		$('.pushlist').html(loading)
		pushlistData.pageNum = 1
		var beginDate = $('.beginDate').val();
		var endDate = $('.endDate').val()
		if (beginDate && endDate) {
			beginDate = beginDate + ' 00:00:00';
			endDate = endDate + ' 23:59:59';
			pushlistData.beginDate = beginDate;
			pushlistData.endDate = endDate;
		} else {
			delete pushlistData.beginDate;
			delete pushlistData.endDate;
		}
		var targetType = $(".targetType option:selected").val();
		var status = $(".status option:selected").val();
		pushlistData.targetType = targetType
		if (status) {
			pushlistData.status = status
		} else {
			delete pushlistData.status
		}
		getPushList(pushlistData)
	})

	/* 重置按钮的点击事件 */
	$('.rest').click(function () {
		$('.beginDate').val('');
		$('.endDate').val('');
		$(".targetType option:first").prop("selected", 'selected');
		$(".status option:first").prop("selected", 'selected');
	})

	// 设备id
	$(document).on('click', 'td .iconfont', function () {
		var id = $(this).attr('data-id')
		$('#shebei .modal-body').html(id)
		$('#shebei').modal('show')
	})
})