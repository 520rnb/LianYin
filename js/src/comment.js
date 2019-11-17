var adders = 'http://test.manage.faceying.com';
// var adders = 'http://manage.faceying.com';


var minDate = ''
if (adders.indexOf('test')) {
	console.log('测试服')
	minDate = '2018-03-01'
} else {
	console.log('正式服')
	minDate = '2018-07-31'
}

$(function () {
	// 发送请求时会有出现进度条
	$(document).ajaxStart(function () {
		NProgress.start();
	})
	$(document).ajaxStop(function (info) {
		NProgress.done();
	})
	// 侧边栏的的点击函数
	// 给侧边栏目注册点击事件
	$(document).on('click', '.drop-title', function(e){
			// 获取对应的相邻的.drop-list的元素
			var list = $(this).siblings('.drop-list')
			// 判断用户是否含有active的类名
			if (list.hasClass('active')) {
				// 元素含有active的类名 就移除active的类名
				list.show(200);
				list.removeClass('active')
				$(this).find('i').removeClass('fa-caret-down').addClass('fa-caret-up');
			} else {
				// 否则就添加上active的类名
				list.hide(200)
				list.addClass('active');
				$(this).find('i').removeClass('fa-caret-up').addClass('fa-caret-down');
			}
			// 阻止默认事件
			// e.preventDefault();
	})
	// 获取登录时存储的数据
	function gainLogin() {
		// 获取登录时存储的数据
		var str = localStorage.getItem('info')
		var obj = JSON.parse(str)
		// 将数据渲染到页面中
		var html = template('tmp-user', obj)
		$('.right').html(html)
		// 判断用户的是不是超级管理员 
	}
	// 执行判断用户是否已经退出的函数
	gainLogin()

	// 给类名为.logout注册点击事件 需要on来注册事件
	$('.right').on('click', '.logout', function () {
		// 发送ajax请求
		$.ajax({
			type: "post",
			url: adders + '/ly-manage/api/admin/logout',
			dataType: "json",
			xhrFields: { withCredentials: true },
			success: function (response) {
				// 跳转到的登录页面
				if (response.errCode == 0 | response.errCode == 403) {
					// 当用户调用退出接口是 需要清除的 recentTime 
					localStorage.removeItem('recentTime');
					document.location.href = '../../login.html?timeout';
				} else if (response.errCode == 410) {
					$.message({
						type: 'error',
						message: response.errMsg
					})
				}

			}
		});
	})

	// 当隐藏修改密码的模态框的重置输入的内容
	$('#ModifyThePassword').on('hidden.bs.modal', function (e) {
		$('.ModifyFrom')[0].reset();
		$(".ModifyFrom").data('bootstrapValidator').destroy();
		$(".ModifyFrom").data('bootstrapValidator', null);
	})
	// 用户的修改自己密码
	function ModifyThePassword() {
		// 给类名为ModifyThePassword注册点击事件 让模态框进行显示
		$('.right').on('click', '.ModifyThePassword', function () {
			$('#ModifyThePassword').modal('show');
		})
		// 给确认修改密码按钮注册点击事件
		$('.affirm').click(function () {
			// 这里进行表单校验功能
			$('.ModifyFrom').bootstrapValidator({
				// 验证规则
				fields: {
					oldpassword: {
						message: '请输入您的旧密码',
						validators: {
							notEmpty: {
								message: '请输入的您的旧密码'
							},
							stringLength: {
								min: 4,
								message: '密码的长度至少4位'
							},
						}
					},
					newpassword: {
						message: '请输入您的新密码',
						validators: {
							notEmpty: {
								message: '请输入的您的新密码'
							},
							stringLength: {
								min: 4,
								message: '密码的长度至少4位'
							},
						}
					},
					confirmationcode: {
						message: '请确认您的新密码',
						validators: {
							notEmpty: {
								message: '请确认您的新密码'
							},
							stringLength: {
								min: 4,
								message: '密码的长度至少4位'
							},
						}
					}
				}
			});
			// 定义一个校验器
			var bv = $(".ModifyFrom").data('bootstrapValidator');
			// 执行校验规则
			bv.validate();
			// 判断 规则是否完成
			if (bv.isValid()) {
				// 获取的用户输入的密码
				var oldPassword = md5($("input[name='oldpassword']").val());
				var newPassword = md5($("input[name='newpassword']").val());
				var affirmPassword = md5($("input[name='confirmationcode']").val());

				// 判断用户两次输入的密码是否一致
				if (newPassword != affirmPassword) {
					$.message({
						type: 'error',
						message: '两次输入的密码不一致,请重新输入'
					})
					return;
				}
				// 发送ajax请求的 来修改密码
				$.ajax({
					type: "post",
					url: adders + "/ly-manage/api/admin/alterPassword",
					data: {
						oldPassword: oldPassword,
						newPassword: newPassword,
						affirmPassword: affirmPassword
					},
					dataType: "json",
					//跨域访问
					xhrFields: { withCredentials: true },
					success: function (response) {
						if (response.errCode == 0) {
							// 隐藏模态框
							$('#ModifyThePassword').modal('hide');
							// 清空上一次输入的值
							$("input[name='oldpassword']").val('');
							$("input[name='newpassword']").val('');
							$("input[name='confirmationcode']").val('');
							$('.ModifyFrom').data("bootstrapValidator").resetForm();
							// 提示用户
							$.message('密码修改成功,下次登录生效');
						} else if (response.errCode == 403) {
							localStorage.removeItem('recentTime')
							// 用户登录过期的
							document.location.href = '../../login.html?timeout';
						} else if (response.errCode == 410) {
							$.message({
								type: 'error',
								message: response.errMsg
							})
						}
					}
				});
			}
		})
	}
	ModifyThePassword();

	// 错误日志的的json格式化
	$('.main').on('click', '.modal-json', function () {
		// 获取需要转化的数据
		var str = eval('(' + $(this).text() + ')');
		// 显示modal-json
		$('#modal-json').modal('show');
		// json格式化
		$('#text-pre').jsonViewer(str);

	})

	$(document).on('input', '.c-datepicker-data-input', function () {
		this.value = '';
		var sbigling = $(this).siblings('input');
		if (sbigling) {
			$(this).siblings('input').val('');
		}
		$.message({
			type: 'error',
			message: '不要手动输入日期'
		});
	})
})

// recent time 用户的最后一次调用接口的时间
function recentTime() {
	var date = new Date().getTime();
	localStorage.setItem('recentTime', date);
}
// 加零函数
function addZero(num) {
	if (num < 10) {
		return '0' + num;
	} else {
		return String(num);
	}
}
function addMinZroe(num) {
	if (num < 100 && num >= 10) {
		return '0' + num
	} else if (num < 10) {
		return '00' + num
	} else {
		return num
	}
}

// 从localStorage获取的数据 
function getSideBar (page) {
	var sidebar = JSON.parse(localStorage.getItem('sidebar'))
	sidebar.data.unshift(page)
	var html = template('tmp-sidebar', sidebar)
	$('.slide-bar').html(html)
	return sidebar
}

var gobalLevel = JSON.parse(localStorage.getItem('info'))
function permissions(arr,id) {
	let array = []
	arr.forEach(element => {
		if (element.children){
			element.children.forEach(function(item){
				if (item.menuId == id) {
					array = item.children
					return item.children;
				}
			})
		}
	});
	return array
}

// arttemplate过滤器
template.defaults.imports.timeFormat1 = function (value) {
	if (value) {
		return moment(value).format('YYYY-MM-DD');
	}
};
template.defaults.imports.timeFormat = function (value) {
	if (value) {
		return moment(value).format('YYYY-MM-DD HH:mm:ss');
	}
};