$(function () {
	var sidePage = {
		icon: "icon-shouye",
		menuName: "首页",
		path: "../overview/index.html",
		children: ''
	}
	// 侧边栏
	getSideBar(sidePage)
	// 默认的请求的数据
	var obj = {
		startRow: 0,
		endRow: 39
	}
	// 默认的长度
	var pagesize = 40;
	// var count = 1;
	var current = 1;
	// 请求接口 或获取后台访问日志的数据
	function getData(obj) {
		$.ajax({
			type: "get",
			cache: false,
			url: adders + "/ly-manage/api/system/manageVisitorHistoryList",
			data: obj,
			dataType: "json",
			xhrFields: { withCredentials: true },
			success: function (response) {
				if (response.errCode == 403) {
					localStorage.removeItem('recentTime');
					document.location.href = '../../login.html?timeout';
					return;
				}
				recentTime();
				// 使用模板引擎将数据渲染到页面中
				if (response.data.total) {
					var html = template('tmp-daily', response)
					$('.backstagedaily').html(html)
					$('#pageTool').show();
					// 重新渲染分页插件
					p.render({
						count: response.data.total,
						pagesize: pagesize,
						toolbar: true,
						current: current
					})
				} else {
					var html = template('no-data', response)
					$('.backstagedaily').html(html)
					$('#pageTool').hide();
				}
			}
		});
	}
	getData(obj)

	// 初始化分页插件
	var p = new Paging();
	p.init({
		target: '#pageTool',
		pagesize: pagesize,
		count: 10,
		toolbar: true,
		pageSizeList: [40, 60, 80, 100],
		changePagesize: function (ps) {
			obj.endRow = ps - 1
			getData(obj)
			pagesize = ps;
			current = 1;
		},
		callback: function (page, size, count) {
			current = page;
			pagesize = size;
			var obj1 = {
				startRow: obj.startRow + size * (page - 1),
				endRow: obj.endRow + size * (page - 1)
			}
			// 请求下一组数据
			getData(obj1)
		}
	})
})