$(function () {
	var sidePage = {
		icon: "icon-shouye",
		menuName: "首页",
		path: "../overview/index.html",
		children: ''
	}
	// 侧边栏
	let sidebar = getSideBar(sidePage)
	// 获取权限
	var all = permissions(sidebar.data, 10101)
	// 获取用户列表的信息
	var data = {
		pageSize: 10,
		pageNum: 1
	}
	var pages = 1;
	function gainInfo(data) {
		// 发送ajax请求
		$.ajax({
			type: "get",
			cache: false,
			url: adders + '/ly-manage/api/admin/memberList',
			dataType: "json",
			data: data,
			xhrFields: { withCredentials: true },
			success: function (response) {
				if (response.succeed) {
					recentTime()
					$('#pageTool').show();
					all.forEach(function(item){
						response.data[item.menuId] = item.menuName
					})
					//  设置新增用户的权限
					if (response.data[1010101]) {
						$('.addVersion').show()
					}else{
						$('.addVersion').parent().remove()
					}
					var info = localStorage.getItem('info');
					var obj = JSON.parse(info);
					//  当前登录用户登录的level
					var gobalLevel = obj.data.level
					response.data.level = gobalLevel
					if (response.data.total) {
						var html = template('tmp-hader', response)
						$('.tables').html(html)
						p.render({
							count: response.data.total,
							pagesize: data.pageSize,
							toolbar: true,
							current: data.pageNum
						})
						$('#pageTool').show()
					} else {
						var html = template('no-data', response)
						$('.tables').html(html)
						$('#pageTool').hide()
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

	gainInfo(data)
	// 冻结用户需要的参数
	var freezeUserData = {};
	var elementBtn = '';
	// 当冻结用户的用户是出现提示框
	$('.userinfo').on('click', '.freezeUser', function () {
		var userName = $(this).parent().attr('data-username');
		var status = $(this).attr('data-status');
		var type = $(this).attr('data-type');
		freezeUserData = {
			userName: userName,
			status: +status,
			type: +type
		};
		elementBtn = this;
		$('#delusers').modal('show');
	})
	// 冻结用户
	$('#delusers .yes').click(function () {
		$.ajax({
			type: "post",
			url: adders + "/ly-manage/api/admin/freezeUser",
			data: freezeUserData,
			dataType: "json",
			xhrFields: { withCredentials: true },
			success: function (response) {
				if (response.succeed) {
					recentTime()
					gainInfo(data)
					$('#delusers').modal('hide');
					$.message('冻结用户成功');
				} else {
					if (response.errCode == 403) {
						localStorage.removeItem('recentTime');
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
	})
	// 解封用户
	$('.userinfo').on('click', '.delidUser', function () {
		// 获取发送请的数据
		var userName = $(this).parent().attr('data-username');
		var status = $(this).attr('data-status');
		var type = $(this).attr('data-type');
		var that = this;
		$.ajax({
			type: "post",
			url: adders + "/ly-manage/api/admin/freezeUser",
			data: {
				userName: userName,
				status: +status,
				type: +type
			},
			dataType: "json",
			xhrFields: { withCredentials: true },
			success: function (response) {
				if (response.succeed) {
					recentTime()
					gainInfo(data)
					$.message('解封用户成功');
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
	// 初始化时间选择
	// 
	var now = moment().format('YYYY-MM-DD')
	$('#selectTime').datePicker({
		format: 'YYYY-MM-DD',
		isRange: true,
		max: now,
		min: minDate
	});

	// 查看的按钮
	$('.checkapp').click(function(){
		var userName = $('.username').val()
		var phone = $('.select-phone').val()
		var beginDate = $('.select-beginDate').val()
		var endDate = $('.select-endDate').val()
		var department = $('.select-dev').val()
		var userStatus = $('.select-userStatus').val()
		if (department) {
			data.department = department
		} else {
			delete data.department
		}
		// 判断手机号码是否正确
		if (phone) {
			var reg =  /^1[34578]\d{9}$/;
			if (!reg.test(phone)) {
				$.message({
					type: 'error',
					message: '请输入正确的手机号'
				})
				return;
			} else {
				data.phone = phone
			}
		} else {
			delete data.phone
		}
		if (userName) {
			data.userName = userName
		} else {
			delete data.userName
		}

		if (beginDate || endDate) {
			data.beginDate = beginDate + ' 00:00:00'
			data.endDate = endDate + ' 23:59:59'
		} else {
			delete data.beginDate
			delete data.endDate
		}

		if (userStatus) {
			data.userStatus = userStatus
		} else {
			delete data.userStatus
		}
		data.pageNum  = 1
		gainInfo(data)
	 })
	//  重置按钮的事件
	$('.rest').click(function(){
		$('.username').val('')
		$('.select-phone').val('')
		$('.select-beginDate').val('')
		$('.select-endDate').val('')
		$('.select-dev').val('')
		$('.select-userStatus').val('')
	})
	// 这里是修改用的权限
	$('.userinfo').on('click', '.btn-change', function () {
		// 显示motaikuang
		// 获取 修改的用户名
		var userName = $(this).parent().attr('data-username')
		var roleType = $(this).parent().attr('data-role');
		$('.checkbox').attr('data-roleType', roleType)
		if (roleType == 2) {
			$('.mange').prop('checked', true);
		} else if (roleType == 3) {
			$('.user').prop('checked', true)
		}
		$('.role_name').val(userName)
		$.ajax({
			type: "GET",
			url: adders + "/ly-manage/api/role/list",
			data: {
				pageNum: 1,
				pageSize: 50,
				source: 3,
				userName: userName
			},
			dataType: "json",
			xhrFields: { withCredentials: true },
			success: function (response) {
				if (response.succeed){
					var html = template('tmp-roleList', response)
					$('.roleList').html(html)
				} else {
					if (response.errCode == 403) {
						localStorage.removeItem('recentTime')
						location.href = '../../login.html'
					} else {
						$.message({
							type: 'error',
							message: response.errMsg
						})
					}
				}
			}
		});
		$('#modal-change').modal('show');
	})

	// 给确认按钮注册点击事件
	$('.change-yes').click(function () {
		// 获取用户名
		var userName = $('#modal-change .role_name').val();
		// 获取单选框值
		var roleItem = $("#modal-change input[name='pitch']:checked")
		var roleIds = ''
		for (var index = 0; index < roleItem.length; index++) {
			const element = roleItem[index];
			if (index == 0){
				roleIds += $(element).val()
			}else{
				roleIds += ','+ $(element).val()
			}
		}
		$.ajax({
			type: "post",
			url: adders + "/ly-manage/api/admin/editRole",
			data: {
				userName: userName,
				roleIds: roleIds
			},
			dataType: "json",
			xhrFields: { withCredentials: true },
			success: function (response) {
				if (response.succeed) {
					recentTime()
					$.message('权限修改成功');
					gainInfo(data)
					$('#modal-change').modal('hide');
				} else {
					if (response.errCode == 403) {
						localStorage.removeItem('recentTime');
						document.location.href = '../../login.html?timeout';
					} else {
						$.message({
							message: response.errMsg,
							type: 'error'
						});
					}
				}
			}
		});
	})
	// 密码重置的事件
	$(document).on('click', '.btn-reset', function () {
		$('#reset-name').val($(this).parent().attr('data-username'))
		$('#reset-modal').modal('show');
	})
	// 确认重置密码的事件
	$('.reset-yes').click(function () {
		var userName = $('#reset-name').val();
		var passWord = $('#reset-pass').val();
		$('#reset-form').bootstrapValidator({
			// 验证规则
			fields: {
				resetpass: {
					message: '请输入添加用户名称',
					validators: {
						notEmpty: {
							message: '请输入重置的密码'
						},
						stringLength: {
							min: 4,
							message: '密码的长度不能小于4位'
						}
					}
				}
			}
		});
		var bv = $("#reset-form").data('bootstrapValidator');
		// 执行校验规则
		bv.validate();
		// 判断用户的两次输入的密码是否一致
		if (bv.isValid()) {
			passWord = md5(passWord);
			$.ajax({
				type: "post",
				url: adders + "/ly-manage/api/admin/resetPwd",
				data: {
					userName: userName,
					passWord: passWord
				},
				dataType: "json",
				xhrFields: { withCredentials: true },
				success: function (response) {
					if (response.succeed) {
						$('#reset-modal').modal('hide');
						$.message('密码重置成功');
						$('#reset-pass').val('');
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
	})

	$('#reset-modal').on('hidden.bs.modal', function (e) {
		$('#reset-form')[0].reset();
		$("#reset-form").data('bootstrapValidator').destroy();
		$("#reset-form").data('bootstrapValidator', null);
	})

	// 超级管理员的添加用户的
	function addUser() {
		$('.adduser').click(function () {
			$.ajax({
				type: "get",
				url: adders + "/ly-manage/api/role/list",
				data: {
					pageNum: 1,
					pageSize: 50,
					source: 2
				},
				dataType: "json",
				xhrFields: { withCredentials: true },
				success: function (response) {
					if (response.succeed) {
						var html = template('tmp-permissions', response)
						$("#adduser .permissions").html(html)
						$('#adduser').modal('show')
					}else {
						if (response.errCode ==  403) {
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
		// 发送ajax请求
		$('.addUserSave').click(function () {
			// 对添加用户的表单进行表单验证
			$('.adduser-form').bootstrapValidator({
				// 验证规则
				fields: {
					addusername: {
						message: '请输入添加用户名称',
						validators: {
							notEmpty: {
								message: '请输入添加用户名称'
							},
							stringLength: {
								max: 20,
								message: '长度最多为20'
							}
						}
					},
					adduserpassword: {
						message: '请输入您的新密码',
						validators: {
							notEmpty: {
								message: '请输入的添加用户的密码'
							},
							stringLength: {
								min: 4,
								message: '密码的长度至少4位'
							},
						}
					},
					phone: {
						message: '请输入您的手机号',
						validators: {
							notEmpty: {
								message: '手机号码不能为空'
							},
							regexp: {
								regexp: /^1[34578]\d{9}$/,
								message: '请输入正确的手机号'
							}
						}
					},
					email: {
						message: '请输入邮箱',
						validators: {
							notEmpty: {
								message: '请输入邮箱'
							},
							regexp: {
								regexp: /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/,
								message: '请输入正确的邮箱'
							}
						}
					},
					realName: {
						message: "真实姓名",
						validators: {
							notEmpty: {
								message: '请输入真姓名'
							}
						}
					},
					pitch: {
						message: '请确认您的新密码',
						validators: {
							notEmpty: {
								message: '请选择权限'
							}
						}
					},
					department: {
						message: '请选择部门',
						validators: {
							notEmpty: {
								message: '请选择部门'
							}
						}
					},
					status: {
						message: "请选择状态",
						validators: {
							notEmpty: {
								message: '请选择状态'
							}
						}
					}
				}
			});
			var bv = $(".adduser-form").data('bootstrapValidator');
			// 执行校验规则
			bv.validate();
			if (bv.isValid()) {
				// 获取的用户名密码和权限
				var userName = $('.addusername').val();
				var passWord = md5($('.adduserpassword').val());
				var userStatus = $("input[name='status']:checked").val()
				var department = $("input[name='department']:checked").val();
				var phone = $(".phone").val()
				var email =  $(".email").val()
				var realName = $(".realName").val()
				var roleIds = ''
				var permissions = $('.permissions input:checked')
				for (let index = 0; index < permissions.length; index++) {
					const element = permissions[index];
					if (index==0){
						roleIds = $(element).val()
					} else {
						roleIds += ',' + $(element).val()
					}
				}
				// 发送ajax请求
				$.ajax({
					type: "post",
					url: adders + "/ly-manage/api/admin/addUser",
					data: {
						userName: userName,
						passWord: passWord,
						userStatus: userStatus,
						department: department,
						phone: phone,
						email: email,
						realName: realName,
						roleIds: roleIds
					},
					dataType: "json",
					xhrFields: { withCredentials: true },
					success: function (response) {
						if (response.succeed) {
							recentTime()
							$('#adduser').modal('hide');
							$.message('添加用户成功');
							// 清空用户的输入的值
							$('.addusername').val('');
							$('.adduserpassword').val('');
							// 更新的数据的
							gainInfo(data)
							// 重置表单的验证规则
							$('.adduser-form').data("bootstrapValidator").resetForm();
							// ("input[type='radio']").removeAttr('checked');
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
		})
	}
	addUser();

	$('#adduser').on('hidden.bs.modal', function (e) {
		$('.adduser-form')[0].reset();
		$(".adduser-form").data('bootstrapValidator').destroy();
		$(".adduser-form").data('bootstrapValidator', null);
	})
	// 初始化分页插件
	var p = new Paging();
	p.init({
		target: '#pageTool', pagesize: 10, count: 100,
		toolbar: true,
		changePagesize: function (pagesize, num) {
			data.pageSize = pagesize;
			data.pageNum = num;
			pages = num
			gainInfo(data)
		},
		callback: function (page, size, count) {
			pages = page;
			data.pageSize = size;
			data.pageNum = page;
			gainInfo(data)
		}
	});

	//  初始化时间选择插件
	$('.J-datepicker-range').datePicker({
		format: 'YYYY-MM-DD',
		isRange: true,
		hasShortcut: true,
		shortcutOptions: [{
			name: '最近一周',
			day: '-7,0'
		}, {
			name: '最近一个月',
			day: '-30,0'
		}],
		max: moment(new Date()).format('YYYY-MM-DD'),
		min: minDate,
		hide: function (val) {
			// 获取开始时间和结束时间
			var beginDate = $('#modal-log .beginDate').val() + ' 00:00:00';
			var endDate = $('#modal-log .endDate').val() + ' 23:59:59';
			logData.beginDate = beginDate;
			logData.endDate = endDate;
			getMonitorLog(logData)
		}
	});
	// 请求日志的数据的参数
	var logData = {}
	// 日志分页的当前的页数
	var current = 1;
	// 日志按钮的点击事件
	$(document).on('click', '.btn-log', function () {
		var userName = $(this).attr('data-username')
		var beginDate = $('.beginDate').val();
		var endDate = $('.endDate').val();
		// 重置上一次的当前分页
		current = 1
		logData.pageNum = 1;
		logData.pageSize = 10
		// 判断用户是否选择了时间范围
		var now = moment().format('YYYY-MM-DD')
		beginDate = now + ' 00:00:00';
		endDate = now + ' 23:59:59';
		// 给模态框中的时间选择设置值
		$('#modal-log .beginDate').val(now)
		$('#modal-log .endDate').val(now)
		logData.userName = userName
		logData.beginDate = beginDate
		logData.endDate = endDate
		getMonitorLog(logData)
		$('#modal-log').modal('show')
	})

	// 获取日志
	function getMonitorLog(data) {
		$.ajax({
			type: "get",
			url: adders + "/ly-manage/api/admin/monitorLog",
			data: data,
			dataType: "json",
			xhrFields: { withCredentials: true },
			success: function (response) {
				if (response.succeed) {
					recentTime()
					var html = template('tmp-count', response)
					$('#modal-log .modal-body .count').html(html);
					$("#modal-log .count .item").eq(0).addClass('active');
					var type = $('#modal-log').find('.active').attr('data-type')
					if (type) {
						var datas = Object.assign(data)
						datas.type = type
						datas.pageNum = 1
						$('#pageTools').css('display', 'block')
						monitorLogDetails(datas)
					} else {
						// 当用户没有数据是执行的操作
						$('#modal-log .modal-body-contents .data').text('暂无数据')
						$('#pageTools').css('display', 'none')
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

	// 获取日志详情
	function monitorLogDetails(data) {
		$.ajax({
			type: "get",
			url: adders + "/ly-manage/api/admin/monitorLogDetails",
			data: data,
			dataType: "json",
			xhrFields: { withCredentials: true },
			success: function (response) {
				if (response.succeed) {
					recentTime()
					if (response.data.total) {
						if (data.type == '1' || data.type == '6') {
							var html = template('modal-log-details-no-content', response)
						} else {
							var html = template('modal-log-details', response)
						}
						$('#pageTools').show()
					} else {
						var html = template('modal-log-details-null', response)
						$('#pageTools').hide()
					}
					$('.modal-body-contents .data').html(html)
					// 重新渲染额分页插件
					paging.render({
						count: response.data.total,
						pagesize: data.pageSize,
						toolbar: true,
						current: data.pageNum
					})
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
	// 选项卡的切换函数
	$(document).on('click', '#modal-log .count .item', function () {
		var type = $(this).attr('data-type')
		logData.type = type
		logData.pageNum = 1;
		logData.pageSize = 10;
		current = 1
		monitorLogDetails(logData)
		$(this).addClass('active').siblings().removeClass('active')
	})

	// 初始化模态框中的分页
	var paging = new Paging();
	paging.init({
		target: '#pageTools', pagesize: 10, count: 100,
		toolbar: true,
		changePagesize: function (pagesize, num) {
			logData.pageSize = +pagesize;
			logData.pageNum = num;
			current = num
			monitorLogDetails(logData)
		},
		callback: function (page, size, count) {
			current = page;
			logData.pageSize = +size;
			logData.pageNum = page;
			monitorLogDetails(logData)
		}
	});
})