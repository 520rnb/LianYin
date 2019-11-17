$(function () {

	var sidePage = {
		icon: "icon-shouye",
		menuName: "首页",
		path: "../overview/index.html",
		children: ''
	}
	// 侧边栏
	var sidebar = getSideBar(sidePage)
	var all = permissions(sidebar.data, 20107)
	var obj = {
		pageSize: 10,
		pageNum: 1
	}
	// 存储的分页
	var pages = 1;
	function getData(data) {
		$.ajax({
			type: "GET",
			cache: false,
			dataType: "json",
			url: adders + "/ly-manage/api/version/getVersionList",
			data: data,
			xhrFields: { withCredentials: true },
			success: function (response) {
				$('#load').hide();
				if (response.succeed) {
					recentTime();
					// 渲染数据
					all.forEach(function(item){
						response.data[item.menuId] = item.menuName
					})
					if (response.data.data.length != 0) {
						var html = template('tmp-versions', response);
						p.render({
							count: response.data.total,
							pagesize: obj.pageSize,
							toolbar: true,
							current: pages
						})
						$('#pageTool').show()
						$('.version-list').html(html);
						recentTime();
						$('[data-toggle="tooltip"]').tooltip()
					} else {
						var html = template('no-data', response);
						$('#pageTool').hide()
						$('.version-list').html(html);
					}
					
					
					
					// 重新渲染分页插件
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
	getData(obj)
	var p = new Paging();
	p.init({
		target: '#pageTool', pagesize: 10, count: 100, toolbar: true,
		changePagesize: function (page, num) {
			obj.pageSize = page;
			obj.pageNum = num;
			pages = 1
			getData(obj)
		},
		callback: function (page, size, count) {
			obj.pageNum = page;
			obj.pageSize = size;
			pages = page
			getData(obj)
		}
	});
	// 添加新版本
	$(document).on('click', '.addVersion', function(){
		$('#addVersion-modal').modal('show');
	})
	// 提交的表单
	$('.addVersion-yes').click(function () {
		$('.addVersion-form').bootstrapValidator({
			// 验证规则
			fields: {
				appName: {
					message: '用户名验证失败',
					validators: {
						notEmpty: {
							message: '请输入APP名称'
						}
					}
				},
				appVersio: {
					message: '密码验证失败',
					validators: {
						notEmpty: {
							message: '请输入APP版本'
						},
						regexp: {
							regexp: /^[1-9][0-9]{0,8}$/,
							message: '大于0'
						}
					}
				},
				appVersion: {
					message: '验证码验证失败',
					validators: {
						notEmpty: {
							message: '请选择平台'
						}
					}
				},
				appAutoUpdate: {
					message: '是否更新',
					validators: {
						notEmpty: {
							message: '请选择是否自动更新'
						}
					}
				},
				appDesc: {
					message: '没有输入更新描述',
					validators: {
						notEmpty: {
							message: '请输入更新描述'
						}
					}
				},
				downloadAddr: {
					validators: {
						// 自定义校验规则
						callback: {//用于select的校验
							message: '请输入下载地址',
							callback: function (value, validator) {//这里可以自定义value的判断规则
								var val = $('input[name="appVersion"]:checked').val();
								if (val == 1) {
									return true;
								} else if (val == 2 && value != '') {
									return true;
								} else {
									return false;
								}
							}
						}
					}
				}
			}
		})

		var bv = $(".addVersion-form").data('bootstrapValidator');
		bv.validate();
		if (bv.isValid()) {
			var appName = $('.appName').val();
			var appVersion = +$('.appVersion').val();
			var appPlatform = +$('input[name ="appVersion"]:checked').val();
			var appAutoUpdate = +$('input[name="appAutoUpdate"]:checked').val();
			var appDesc = $('.appDesc').val();
			var downloadAddr = $('.downloadAddr').val();
			var data = {}
			if (appPlatform == 1) {
				data.appName = appName;
				data.appVersion = appVersion;
				data.appPlatform = appPlatform;
				data.appAutoUpdate = appAutoUpdate;
				data.appDesc = appDesc;
			} else {
				data.appName = appName;
				data.appVersion = appVersion;
				data.appPlatform = appPlatform;
				data.appAutoUpdate = appAutoUpdate;
				data.appDesc = appDesc;
				data.downloadAddr = downloadAddr;
			}
			$.ajax({
				type: "post",
				url: adders + "/ly-manage/api/version/addNewVersion",
				data: data,
				dataType: "json",
				xhrFields: { withCredentials: true },
				success: function (response) {
					if (response.succeed) {
						recentTime();
						$.message('操作成功')
						$('#addVersion-modal').modal('hide');
						// 清空的输入的数据的
						$('.addVersion-form')[0].reset();
						// 销毁之前的数据
						$(".addVersion-form").data('bootstrapValidator').destroy();
						$(".addVersion-form").data('bootstrapValidator', null);
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
		}
	});
	// 给 ios的选项注册事件
	$('#ios').click(function(){
		// 隐藏下载地址的输入框
		$('.version-adders').hide()
		// 取消的下载地址的校验
		$('.addVersion-form').data('bootstrapValidator').validateField('downloadAddr');
	})
	$('#Android').click(function(){
		// 隐藏下载地址的输入框
		$('.version-adders').show()
	})

	// 删除的某一个版本
	$(document).on('click', '.del-version', function () {
		$('#del-version').modal('show');
		$('.del-version-yes').attr('id', $(this).attr('data-id'));
	})

	// modal隐藏的是重置上一次的输入的按钮
	$('#addVersion-modal').on('hidden.bs.modal', function (e) {
		$('.addVersion-form')[0].reset();
		$(".addVersion-form").data('bootstrapValidator').destroy();
		$(".addVersion-form").data('bootstrapValidator', null);
	})

	$('.del-version-yes').click(function () {
		var versionId = + $(this).attr('id');
		$.ajax({
			type: "post",
			url: adders + "/ly-manage/api/version/delVersion",
			data: {
				versionId: versionId
			},
			dataType: "json",
			xhrFields: { withCredentials: true },
			success: function (response) {
				if (response.succeed) {
					recentTime();
					$('#del-version').modal('hide');
					$.message('操作成功');
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

	$('.btn-search').click(function () {
		var platform = $('.type option:selected').val();
		if (platform == '') {
			delete obj.platform;
		} else {
			obj.platform = platform;
		}
		$('#load').show();
		getData(obj)
	})
})