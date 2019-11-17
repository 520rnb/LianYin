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
 var all = permissions(sidebar.data, 20105)
	// 默认请求数据的参数
	var obj = {
		type: '',
		informType: '',
		pageNum: 1,
		pageSize: 10,
	}
	// 存储分页的页数
	var pages = 1;
	function getData(obj) {
		$.ajax({
			type: "get",
			cache: false,
			url: adders + "/ly-manage/api/inform/list",
			data: obj,
			dataType: "json",
			xhrFields: { withCredentials: true },
			success: function (response) {
				if (response.succeed) {
					recentTime();
					$('#load').hide();
					if (response.data.total != 0) {
						all.forEach(function(item){
							// response.data[item.menuId] = item.menuName
							response.data[item.menuId] = true
						})
						var html = template('report-root', response)
						$('#pageTool').show();

					} else {
						var html = template('no-data', response)
						$('#pageTool').hide();
					}
					$('.report-info').html(html);
					// 重新渲染分页插件
					p.render({ count: response.data.total, pagesize: obj.pageSize, toolbar: true, current: pages })
				} else {
					if (response.errCode == 403) {
						localStorage.removeItem('recentTime')
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

	getData(obj);

	$('.btn-search').click(function () {
		var type = $('.type option:selected').val();
		var informType = $('.keys option:selected').val();
		var solveType = $('.flag option:selected').val();
		// 点击时pages变成1
		pages = 1;
		obj.pageNum = 1;
		obj.type = type;
		obj.informType = informType;
		obj.solveType = solveType
		// 清空上一次的渲染的内容
		$('.report-info').html('')
		$('#load').show();
		getData(obj);
	});

	// 页面一加载就渲染分页插件
	var p = new Paging();
	p.init({
		target: '#pageTool', pagesize: 10, count: 10, toolbar: true, changePagesize: function (page, num) {
			pages = 1;
			obj.pageNum = 1;
			obj.pageSize = page
			getData(obj)
		},
		callback: function (page, size, count) {
			pages = page
			// 获取数据进行渲染
			obj.pageNum = page;
			obj.pageSize = size;
			getData(obj)
		}
	})

	// 这里是获取的评论的参数
	var commentData = {
		dynamicId: '',
		pageNum: '',
		pageSize: 10
	}
	// 给详情按钮注册点击事件
	$('.report-info').on('click', '.btn-details', function () {
		commentData.pageNum = 1;
		// 清除上一次的渲染的数据
		$('#report-details .modal-body').html('');
		// 获取自定义的属性值 type为代表动态 type为2等于用户
		var dynamicId = $(this).attr('data-dynamicid');
		commentData.dynamicId = +dynamicId;
		var userId = $(this).attr('data-userid');
		var type = $(this).attr('data-type');
		// 根据type判断书举报的使用用户还是动态
		if (type == 1 || type == 3) {
			getDetailsData('/ly-manage/api/dynamic/dynamicDetails', { dynamicId: dynamicId }, type);

		} else if (type == 2) {
			getDetailsData('/ly-manage/api/admin/userDetails', { userId: userId }, type)
		}
	})

	function getDetailsData(url, data, type) {
		$.ajax({
			type: "get",
			cache: false,
			url: adders + url,
			data: data,
			dataType: "json",
			xhrFields: { withCredentials: true },
			success: function (response) {
				if (response.succeed) {
					recentTime();
					if (type == 1 || type == 3) {
						$('#report-details').modal('show');
						var html = template('tmp-personal', response);
						$('#report-details .modal-body').html(html);
						$('#report-details .btn-more').attr('data-pagenum', '1');
						getCommentData(commentData);
					} else if (type == 2) {
						// 渲染用户详情
						$('#Personal-particulars').modal('show');
						var html = template('report-user', response);
						$("#Personal-particulars .modal-body").html(html);
					}
				} else {
					if (response.errCode == 403) {
						localStorage.removeItem('recentTime');
						document.location.href = '../../login.html?timeout'
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
	// 获取动态评论
	function getCommentData(commentData) {
		$.ajax({
			type: "get",
			cache: false,
			url: adders + "/ly-manage/api/dynamic/dynamicCommentList",
			data: commentData,
			dataType: "json",
			xhrFields: { withCredentials: true },
			success: function (response) {
				if (response.succeed) {
					recentTime()
					var page = + $('.btn-more').attr('data-pagenum');
					// 先获取pagenum的值 并加上一
					$('.btn-more').attr('data-pagenum', page + 1)
					// 判断评论数的长度的是不是小于10
					if (page == response.data.pages || response.data.data.length < 10) {
						$('.btn-more').html('没有更多评论了');
						$('.btn-nothing').removeClass('btn-more')
						// 将pageNum的值变成初始状态的
						commentData.pageNum = 1;
					}
					var html = template('temp-comment1', response)
					$('#report-details .comment').append(html);
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
	/// 给reply-more注册点击事件
	$('#report-details').on('click', '.reply-more', function () {
		var pageNum = + $(this).attr('data-pagenum');
		var commentId = $(this).attr('data-id');
		commentData.pageNum = pageNum;
		commentData.commentId = +commentId;
		var that = this
		// 发送ajax请求
		$.ajax({
			type: "get",
			cache: false,
			url: adders + "/ly-manage/api/dynamic/dynamicCommentDetails",
			data: commentData,
			dataType: "json",
			xhrFields: { withCredentials: true },
			success: function (response) {
				if (response.succeed) {
					recentTime()
					if (response.data.total == response.data.data.length || response.data.data.length < 10) {
						$(that).text('没有更多回复了');
						$(that).removeClass('reply-more');
					}
					//  上传前面的两条数据
					if (pageNum == 1) {
						response.data.data.splice(0, 2);
					}
					// 改变pagenum
					pageNum++;
					$(that).attr('data-pagenum', pageNum);

					var userid = isWho();
					if (userid == 1 || userid == 2) {
						var html = template('tmp-reply-two', response);
						$(that).siblings('.replys').append(html);
					} else if (userid == 3) {
						var html = template('temp-comment1-two', response);
						$(that).siblings('.replys').append(html);
					}
				} else {
					if (response.errCode == 403) {
						localStorage.removeItem('recentTime');
						document.location.href = '../../login.html?timeout'
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
	$('#report-details').on('click', '.btn-more', function () {
		var pageNum = +$(this).attr('data-pagenum');
		commentData.pageNum = pageNum;
		if (commentData.commentId != '') {
			delete commentData.commentId;
		}
		getCommentData(commentData)
	});
	// 判断是谁登录
	function isWho() {
		// 判断登录的用户是超级管理员还是普通管理员
		var userId = localStorage.getItem('info');
		userId = JSON.parse(userId);
		userId = userId.data.roleType;
		return userId
	}

	$(document).on('click', '.imgs', function () {
		var elParent = $(this).parent().parent();
		var rel = elParent.attr('data-index');
		//修改a标签的rel属性
		elParent.find('a').attr({
			'rel': 'group' + rel,
			'data-fancybox-group': 'gallery' + rel,
			'data-fancybox': 'group' + rel
		})
	})

	// 给del-comment注册的类名注册点击事件
	$(document).on('click', '.del-comment', function () {

		// 获取评论id和动态id
		var commentId = $(this).attr('data-id');
		var dynamicId = $(this).attr('data-dynamicid');
		var that = this
		// 发送ajax请求
		$.ajax({
			type: "post",
			url: adders + "/ly-manage/api/dynamic/delComment",
			data: {
				dynamicId: +dynamicId,
				commentId: +commentId
			},
			dataType: "json",
			xhrFields: { withCredentials: true },
			success: function (response) {
				if (response.succeed) {
					if (response.errCode == 0) {
						recentTime();
						var index = $(that).attr('data-index');
						if (index == 1) {
							// 让类名为.media的标签进行隐藏
							$(that).parent().parent().parent().hide().removeClass('media');
							$.message('删除成功')
						} else if (index == 2) {
							$(that).parent().parent().hide().removeClass('reply-info');
							$.message('删除成功')
						}
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
	})

	// 删除动态的
	var reportData = {};
	$(document).on('click', '.del-dynamic', function () {
		var dynamicId = $(this).attr('data-dynamicid');
		var commentId = $(this).attr('data-commentid');
		var type = $(this).attr('data-type')
		reportData.dynamicId = +dynamicId;
		reportData.commentId = +commentId;
		if (type == 1) {
			$('#del-dynamic .modal-body p').text('是否删除动态')
		} else if (type == 3) {
			$('#del-dynamic .modal-body p').text('是否删除动态评论')
		}
		$('#del-dynamic').modal('show');
	})

	$('.del-dynamic-yes').click(function () {
		if (Boolean(reportData.commentId)) {
			delDynamic(reportData, '/ly-manage/api/dynamic/delComment')
		} else {
			delete reportData.commentId;
			delDynamic(reportData, '/ly-manage/api/dynamic/delDynamic');
		}
	})

	// 删除的的函数
	function delDynamic(data, link) {
		$.ajax({
			type: "post",
			url: adders + link,
			data: data,
			dataType: "json",
			xhrFields: { withCredentials: true },
			success: function (response) {
				recentTime();
				if (response.succeed) {
					$.message('删除成功');
					$('#del-dynamic').modal('hide');
				}else {
					if  (response.errCode == 403) {
						localStorage.removeItem('recentTime')
						document.location.href = '../../login.html?timeout';
					} else {
						$.message({
							type: 'error',
							message: response.errMsg
						})
					}
				}
				// if (response.errCode == 0) {
					
				// } else if (response.errCode == 410) {
					
				// 	$('#del-dynamic').modal('hide');
				// }
			}
		});
	}

	// 给icon注册点击事件
	$(document).on('click', '.icon-hover', function () {
		var id = $(this).attr('data-id');
		// 将id放到模态框框中
		$('.handle-yes').attr('data-id', id)
		$('#handle').modal('show')
	})

	$('.handle-yes').click(function () {
		var id = $(this).attr('data-id');
		$.ajax({
			type: "post",
			url: adders + "/ly-manage/api/inform/markInform",
			data: {
				id: id
			},
			dataType: "json",
			xhrFields: { withCredentials: true },
			success: function (response) {
				if (response.succeed) {
					recentTime();
					$.message('操作成功');
					$('#handle').modal('hide')
					getData(obj)
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
	})
})