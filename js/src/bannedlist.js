$(function () {

	// 侧边栏
	var sidePage = {
		icon: "icon-shouye",
		menuName: "首页",
		path: "../overview/index.html",
		children: ''
	}
	// 侧边栏
	var sidebar = getSideBar(sidePage)
	var all = permissions(sidebar.data, 80102)
	// 初始化的列表的数据
	var data = {
		pageNum: 1,
		pageSize: 10
	}

	bannedlist(data)
	// 获取禁言用户列表
	function bannedlist(data) {
		$.ajax({
			type: "get",
			url: adders + "/ly-manage/api/chatroom/gagList",
			data: data,
			dataType: "json",
			xhrFields: { withCredentials: true },
			success: function (response) {
				if (response.succeed) {
					recentTime()
					if (response.data.total) {
						all.forEach(function(item){
							response.data[item.menuId] = true
							response.data[item.menuId] = item.menuName
						})
						var html = template('tmp-bannedlist', response)
						$('#Bannedlist').html(html)
						paging.render({ count: response.data.total, pagesize: data.pageSize, current: data.pageNum });
						$('#pageTool').show();
					} else {
						var html = template('no-data', response)
						$('#Bannedlist').html(html)
						$('#pageTool').hide();
					}
				} else {
					if (response.errCode == 403) {
						localStorage.removeItem('info')
						localStorage.removeItem('recentTime')
						location.href = '../../login.html?timeout'
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

	// 初始化时间选择
	var now = moment().format('YYYY-MM-DD')
	$('.J-datepicker-day').datePicker({
		format: 'YYYY-MM-DD',
		isRange: true,
		max: now,
		min: minDate
	});

	// 初始化分页插件
	var paging = new Paging();
	paging.init({
		target: '#pageTool', pagesize: 10, count: 100,
		toolbar: true,
		changePagesize: function (pagesize, num) {
			data.pageSize = pagesize;
			data.pageNum = 1
			bannedlist(data)
		},
		callback: function (page, size, count) {
			data.pageNum = page;
			data.pageSize = size;
			bannedlist(data)
		}
	});

	// 给查看按钮注册是点击事件
	$('.checkapp').click(function () {
		var beginDate = $('.beginDate').val();
		var endDate = $('.endDate').val();
		var userId = $('.keyworld').val();
		// 判断用户的输入的是不是9位的纯数字
		if (userId) {
			var reg = /^\d{9,10}$/;
			if (!reg.test(userId)) {
				$.message({
					type: 'error',
					message: '请输入正确的脸影号'
				})
				return;
			}
		}
		if (beginDate && endDate) {
			data.beginDate = beginDate + ' 00:00:00';
			data.endDate = endDate + ' 23:59:59';
		} else {
			delete data.beginDate;
			delete data.endDate
		}
		if (userId) {
			data.userId = userId
		} else {
			delete data.userId
		}
		data.pageNum = 1;
		bannedlist(data)
	})

	// 给remove-talk按钮注册点击事件
	$(document).on('click', '.remove-talk', function () {
		var id = $(this).attr('data-id')
		$('#remove-Banned').modal('show')
		$('#remove-Banned .btn-remove').attr('data-id', id);
	})

	// 解除禁言
	$('#remove-Banned .btn-remove').click(function () {
		var id = $(this).attr('data-id')
		$.ajax({
			type: "post",
			url: adders + "/ly-manage/api/chatroom/removeGag",
			data: {
				gagId: id
			},
			dataType: "json",
			xhrFields: { withCredentials: true },
			success: function (response) {
				if (response.succeed) {
					recentTime()
					bannedlist(data)
					$('#remove-Banned').modal('hide')
					$.message('禁言解除成功')
				} else {
					if (response.errCode == 403) {
						localStorage.removeItem('info')
						localStorage.removeItem('recentTime')
						location.href = '../../login.html?timeout'
					} else {
						$.message({
							type: 'error',
							message: response.errMsg
						})
					}
				}
			}
		});
	})
	// 重置
	$('.rest').click(function () {
		$('.beginDate').val('');
		$('.endDate').val('');
		$('.keyworld').val('');
	})

})