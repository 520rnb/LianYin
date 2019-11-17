$(function () {
	var all = permissions(sidebar.data, 70101)
	// 查询按钮的事件
	$('.btn-search').click(function (e) {
		var keyWorld = $('.keyWorld').val()
		if (keyWorld) {
			getData(keyWorld)
		} else {
			$.message({
				type: 'error',
				message: '请输入邀请码'
			})
		}
		
		e.preventDefault();
	});
	// 邀请码查询接口  
	function getData(key) {
		$.ajax({
			type: "get",
			url: adders + "/ly-manage/api/invitation-code/query",
			data: {
				keyWord: key
			},
			dataType: "json",
			xhrFields: { withCredentials: true },
			success: function (response) {
				if (response.succeed) {
					recentTime()
					var str = JSON.stringify(response.data)
					all.forEach(function(item){
							response.data[item.menuId] = true
					})
					if (str != '{}') {
						var html = template('Invitation-query', response)
						// 隐藏上一次查询到额结果
						$('.useList').html(' ')
						$('#pageTool1').css('display', 'none')
						// 渲染这一次查询的结果
						$('.userinfo').html(html)
					} else {
						var html = template('no-data-table', response)
						// 隐藏上一次查询到额结果
						$('.useList').html(' ')
						$('#pageTool1').css('display', 'none')
						// 渲染这一次查询的结果
						$('.userinfo').html(html)
					}
				} else {
					if (response.errCode == 403) {
						localStorage.removeItem('info')
						localStorage.removeItem('recentTime')
						location.href = '../../login.html'
					}
				}
			}
		});
	}

	// Pack-up 事件处理函数
	$(document).on('click', '.Pack-up', function () {
		var flag = $(this).attr('flag')
		if (flag == 1) {
			$(this).parent().siblings('.content').hide('slow')
			$(this).attr('flag', 2)
			$(this).removeClass('glyphicon-arrow-up').addClass('glyphicon-arrow-down')
		} else if (flag == 2) {
			$(this).parent().siblings('.content').show('slow')
			$(this).attr('flag', 1)
			$(this).addClass('glyphicon-arrow-up').removeClass('glyphicon-arrow-down')
		}
	})

	//  给查看按钮注册点击事件
	var datas = {
		pageNum: 1,
		pageSize: 10
	};

	var current;
	$(document).on('click', '.check', function () {
		datas.invitationCode = $(this).attr('data-invitationCode')
		getUseData(datas)
	})
	// 邀请码使用详情 001907369 ecfxha
	function getUseData(datas) {
		$.ajax({
			type: "get",
			url: adders + "/ly-manage/api/invitation-code/usageDetails",
			data: datas,
			dataType: "json",
			xhrFields: { withCredentials: true },
			success: function (response) {
				if (response.succeed) {
					recentTime()
					if (response.data.total) {
						var html = template('Invitation-details', response)
						$('.useList').html(html)
						p.render({
							count: response.data.total,
							pagesize: datas.pageSize,
							toolbar: true,
							current: current
						})
						$('.useList .contents').show('slow');
						$("#pageTool1").css('display', 'block')
					} else {
						var html = template('no-data', response)
						$('.useList').html(html)
					}
				} else {
					if (response.errCode == 403) {
						localStorage.removeItem('info')
						localStorage.removeItem('recentTime')
						location.href = '../../login.html?timeout'
					}
				}
			}
		});
	}

	//  初始化分页
	var p = new Paging;

	p.init({
		target: '#pageTool1',
		pagesize: 10,
		count: 10,
		toolbar: true,
		changePagesize: function (page, num) {
			datas.pageSize = page
			datas.pageNum = 1
			current = 1
			getUseData(datas)
		},
		callback: function (page, size, count) {
			datas.pageNum = page;
			datas.pageSize = size;
			current = page
			getUseData(datas)
		}
	})
})