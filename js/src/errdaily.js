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
	};
	var flag = true;
	var total = 0;
	getData(obj)

	// 获取数据
	function getData(obj) {
		$.ajax({
			type: "get",
			cache: false,
			url: adders + '/ly-manage/api/system/systemErrList',
			data: obj,
			dataType: "json",
			xhrFields: { withCredentials: true },
			success: function (response) {
				if (response.errCode == 403) {
					localStorage.removeItem('recentTime');
					document.location.href = '../../login.html?timeout';
				}
				recentTime();
				// 将数据渲染到页面中
				// arttemplate 的过滤函数
				total = response.data.total;
				if (total) {
					var html = template('tmp-errdaily', response)
					$('.errdaily').html(html)
					$('#pageTool').show();
				} else {
					var html = template('no-data', response)
					$('.errdaily').html(html)
					$('#pageTool').hide();
				}
				// flag = false;
				if (flag) {
					pageInit(total)
				}
				flag = false;
			}
		});
	}
	// 初始化分页函数
	function pageInit(total) {

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