$(function () {
	var sidePage = {
		icon: "icon-shouye",
		menuName: "首页",
		path: "../overview/index.html",
		children: ''
	}
	// 侧边栏
	getSideBar(sidePage)
	var obj = {
		startRow: 0,
		endRow: 39
	}
	var pagesize = 40;
	var current = 1;
	getData(obj)
	function getData(obj) {
		$.ajax({
			type: "get",
			cache: false,
			url: adders + "/ly-manage/api/system/manageSystemErrList",
			data: obj,
			dataType: "json",
			xhrFields: { withCredentials: true },
			success: function (response) {
				if (response.errCode == 403) {
					localStorage.removeItem('recentTime');
					document.location.href = '../../login.html?timeout';
				}
				recentTime();
				if (response.data.total) {
					var html = template('tmp-errDaily', response)
					$('.backstageErrdaily').html(html)
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
					$('.backstageErrdaily').html(html)
					$('#pageTool').hide();
				}
				
			}
		});
	}

	// 初始化分页插件
	var p = new Paging();
	p.init({
		target: '#pageTool',
		pageszie: pagesize,
		// count: 10,
		toolbar: true,
		pageSizeList: [40, 60, 80, 100],
		changePagesize: function (ps) {
			obj.endRow = ps - 1;
			getData(obj);
			current = 1;
			pagesize = ps;
		},
		callback: function (page, size, count) {
			current = page
			pagesize = size;
			var obj1 = {
				startRow: obj.startRow + size * (page - 1),
				endRow: obj.endRow + size * (page - 1)
			}
			getData(obj1)
		}
	})
})