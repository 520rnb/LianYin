$(function () {
	var sidePage = {
		icon: "icon-shouye",
		menuName: "首页",
		path: "../overview/index.html",
		children: ''
	}
	// 侧边栏
	getSideBar(sidePage)
	// 发送ajax请求 默认获取获取10条数据
	var obj = {
		startRow: 0,
		endRow: 39
	};
	var total = 0;
	var flag = true;
	getData(obj)
	// 获取数据的函数
	function getData(obj) {
		$.ajax({
			type: "get",
			cache: false,
			url: adders + "/ly-manage/api/system/visitorHistoryList",
			data: obj,
			dataType: "json",
			xhrFields: { withCredentials: true },
			success: function (response) {
				if (response.errCode === 403) {
					localStorage.removeItem('recentTime');
					document.location.href = '../../login.html?timeout'
				}
				total = response.data.total;
				recentTime();
				dataTo(response)
			}
		});

	}

	// 将数据渲染到页面中的函数
	function dataTo(response) {
		if (response.data.total) {	
			var html = template('tmp-daily', response)
			$('.daily').html(html)
			$('#pageTool').show();
		} else {
			var html = template('no-data', response)
			$('.daily').html(html)
			$('#pageTool').hide();
		}
		if (flag) {
			page(total)
		}
		flag = false;
	}
	// page() 分页初始化函数
	function page() {
		$('#pageTool').Paging({
			pagesize: 40, count: total, toolbar: true, pageSizeList: [40, 60, 80, 100], changePagesize: function (ps) {
				obj.endRow = ps - 1
				//调用函数
				getData(obj)
			}, callback: function (page, size, count) {
				// 这里是改变后的开始的条数和结束的条数
				var obj1 = {
					startRow: obj.startRow + size * (page - 1),
					endRow: obj.endRow + size * (page - 1)
				}
				getData(obj1)
			}
		});
	}
})