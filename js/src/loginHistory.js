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
	// 这里是默认的数据
	var obj = {
		pageSize: 10,
		pageNum: 1
	}
	pagesize = 10;
	// getData(obj)
	// 获取数据
	function getData(obj) {
		$.ajax({
			type: "get",
			cache: false,
			url: adders + "/ly-manage/api/admin/userLoginHistory",
			data: obj,
			dataType: "json",
			xhrFields: { withCredentials: true },
			success: function (response) {
				$('#load').hide();
				recentTime()
				if (response.succeed) {
					// 判断拿到数据是不是为0
					if (response.data.data.length != 0) {
						p.render({
							pagesize: pagesize,
							toolbar: true,
							count: response.data.total,
							current: obj.pageNum
						})
						var html = template('tmp-history', response)
						$('#pageTool').show();
					} else {
						var html = template('no-data', response);
						$('#pageTool').hide();
					}
					$('.history-data tbody').html(html);
					recentTime();
					//  重新渲染分页插件

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

	$('.btn-history').click(function () {
		var id = $('.btn-user').val().trim();
		var beginDate = $('.beginDateLine').val();
		var endDate = $('.endDateLine').val();
		if (beginDate != '') {
			obj.beginDate = beginDate + ' 00:00:00';
		} else {
			delete obj.beginDate
		}
		if (endDate != '') {
			obj.endDate = endDate + ' 23:59:59';
		} else {
			delete obj.endDate
		}
		if (id != '') {
			var reg = /^\d{9,10}$/;
			if (!reg.test(id)) {
				$.message({
					type: 'error',
					message: '请输入正确的脸影号'
				});
				return;
			}
			obj.userId = id;
			$('#load').show();
			obj.pageNum = 1
			getData(obj);
		} else {
			$.message({
				type: 'error',
				message: '请输入脸影号'
			})
		}

	})
	//  初始化分页插件
	var p = new Paging();
	p.init({
		target: '#pageTool',
		pagesize: 10,
		toolbar: true,
		changePagesize: function (ps) {
			pagesize = +ps;
			obj.pageSize = ps;
			obj.pageNum = 1;
			getData(obj)
		},
		callback: function (page, size, count) {
			obj.pageNum = page
			getData(obj)
		}
	});
	// 初始时间控件
	$('.J-datepicker-day').datePicker({
		max: moment(new Date()).format('YYYY-MM-DD'),
		isRange: true, // 是否开启时间选择 默认是false 选择
		format: 'YYYY-MM-DD',
		min: '2018-07-31'
	});

	// 重置按钮的事件函数
	$('.btn-resize').click(function () {
		$('.btn-user').val('');
		$('.beginDateLine').val('');
		$('.endDateLine').val('');
	})
})