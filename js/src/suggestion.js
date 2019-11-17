$(function () {

var sidePage = {
	icon: "icon-shouye",
	menuName: "首页",
	path: "../overview/index.html",
	children: ''
}
// 侧边栏
var sidebar = getSideBar(sidePage)
var all = permissions(sidebar.data, 20106)
	var obj = {
		pageSize: 10,
		pageNum: 1
	};
	var pages = 1;
	var size = 10
	getData(obj)
	function getData() {
		$.ajax({
			type: "get",
			cache: false,
			url: adders + "/ly-manage/api/feedback/list",
			data: obj,
			dataType: "json",
			xhrFields: { withCredentials: true },
			success: function (response) {
				$('#load').hide();
				if (response.succeed) {
					recentTime();
					if (response.data.data.length != 0) {
						p.render({ pagesize: size, count: response.data.total, current: obj.pageNum })
						all.forEach(function(item) {
								response.data[item.menuId] = true
						})
						var html = template('root-suggest', response)
						$('#pageTool').show()
						$('.suggest').html(html)
					} else {
						var html = template('no-data', response)
						$('.suggest').html(html)
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

	// 初始话分页插件
	var p = new Paging();
	p.init({
		target: '#pageTool', pagesize: 10, count: 100, toolbar: true, callback: function (page, size, current) {
			obj.pageNum = page
			pages = page
			getData(obj)
		}, changePagesize: function (ps) {
			obj.pageSize = ps;
			obj.pageNum = 1;
			size = ps;
			pages = 1;
			getData(obj)
		}
	});

	$(document).on('click', '.icon-hover', function () {
		var id = $(this).attr('data-id');
		$('.handle-yes').attr('data-id', id);
		$('#handle').modal();
	})

	$('.handle-yes').click(function (e) {
		var id = $(this).attr('data-id');
		$.ajax({
			type: "post",
			url: adders + "/ly-manage/api/feedback/markFeedback",
			data: {
				id: id
			},
			dataType: "json",
			xhrFields: { withCredentials: true },
			success: function (response) {
				if (response.succeed) {
					recentTime();
					$('#handle').modal('hide');
					$.message({
						type: 'success',
						message: '操作成功'
					});
					getData(obj)
				} else {
					if (response.errCode == 403) {
						localStorage.removeItem('recentTime');
						document.location.href = '../../login.html?timeout';
					} else {
						$('#handle').modal('hide');
						$.message({
							type: 'error',
							message: response.errMsg
						})
						$('#handle').modal('hide');
					}
				}
			}
		});
	});

	$('.btn-search').click(function () {
		var solveType = $('.flag option:selected').val();
		if (solveType == '') {
			delete obj.solveType
		} else {
			obj.solveType = solveType;
		}
		obj.pageNum = 1;
		pages = 1;
		$('#load').show();
		getData(obj)
	})
})