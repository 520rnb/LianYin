$(function () {
	/**
	 * 这里是公告列表的页面
	 */
	var sidePage = {
		icon: "icon-shouye",
		menuName: "首页",
		path: "../overview/index.html",
		children: ''
	}
	// 侧边栏
	getSideBar(sidePage)
	/**
	* 初始化事件选择控件
	*/
	var now = moment().format('YYYY-MM-DD')
	$('.J-datepicker-day').datePicker({
		format: 'YYYY-MM-DD',
		isRange: true,
		max: now,
		min: minDate
	});

	var data = {
		pageNum: 1,
		pageSize: 10
	}
	/**
	 * 聊天室公告列表接口
	 */
	getBulletinList(data)
	function getBulletinList(data) {
		$.ajax({
			type: "get",
			url: adders + "/ly-manage/api/chatroom/bulletinList",
			data: data,
			dataType: "json",
			xhrFields: { withCredentials: true },
			success: function (response) {
				if (response.succeed) {
					recentTime()
					if (response.data.total) {
						var html = template('tmp-bulletinList', response.data)
						paging.render({ count: response.data.total, pagesize: data.pageSize, current: data.pageNum });
						$('#Bannedlist > table > tbody').html(html)
						$("#pageTool").show()
					} else {
						var html = template('no-data', response.data)
						$('#Bannedlist > table > tbody').html(html)
						$("#pageTool").hide()
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

	// 初始化分页插件
	var paging = new Paging();
	paging.init({
		target: '#pageTool', pagesize: 10, count: 100,
		toolbar: true,
		changePagesize: function (pagesize, num) {
			data.pageSize = pagesize;
			data.pageNum = 1
			getBulletinList(data)
		},
		callback: function (page, size, count) {
			data.pageNum = page;
			data.pageSize = size;
			getBulletinList(data)
		}
	});

	// 查看按钮
	$('.checkapp').click(function () {
		var beginDate = $(".beginDate").val();
		var endDate = $('.endDate').val();
		var userName = $('.keyworld').val();
		if (beginDate && endDate) {
			data.beginDate = beginDate + ' 00:00:00';
			data.endDate = endDate + ' 23:59:59';
		} else {
			delete data.beginDate
			delete data.endDate
		}

		if (userName) {
			data.userName = userName
		} else {
			delete data.userName
		}
		data.pageNum = 1;
		getBulletinList(data)
	})

	//  重置按钮
	$('.rest').click(function () {
		$(".beginDate").val('');
		$('.endDate').val('');
		$('.keyworld').val('');
	})
})