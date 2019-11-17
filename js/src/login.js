$(function () {
	// 
	var adders = 'http://test.manage.faceying.com';
	// var adders  = 'http://manage.faceying.com'
	// 给登录按钮注册点击事件
	$('.login-btn').click(function (e) {

		login();

	});
	// 刷新图片获取验证码 给img注册点击事件
	$('.verifyImg').click(function () {
		// 随机数
		var num = Math.round(Math.random() * 1000)
		// 
		this.src = 'http://test.manage.faceying.com/ly-manage/api/admin/getCaptcha?' + num;
	});

	// 将数据的参数存到localStorage
	function loginStorage(info) {
		var str = JSON.stringify(info);
		localStorage.setItem('info', str);
	}


	$('form').keypress(function (e) {
		if (e.keyCode == 13) {

			login();
			return false;
		}
	});

	// 登录
	function login() {
		// 使用bootstrap-validator 来判断用户输入的是否为空
		$('.form-horizontal').bootstrapValidator({
			// 图标
			feedbackIcons: {

			},
			// 验证规则
			fields: {
				username: {
					message: '用户名验证失败',
					validators: {
						notEmpty: {
							message: '用户名不能为空'
						}
					}
				},
				password: {
					message: '密码验证失败',
					validators: {
						notEmpty: {
							message: '密码不能为空'
						},
						stringLength: {
							min: 4,
							message: '密码的长度最少是4位'
						}
					}
				},
				verifyImg: {
					message: '验证码验证失败',
					validators: {
						notEmpty: {
							message: '验证码不能为空'
						}
					}
				}
			}
		})
		// 定义一个校验器
		var bv = $(".form-horizontal").data('bootstrapValidator');
		// 执行校验规则
		bv.validate();
		// 判断是否完成
		if (bv.isValid()) {
			// 当校验完成 获取用户输入的用户名 密码 验证码
			var username = $('.username').val()
			var password = $('.password').val()
			var verifyImg = $('.verifyImg').val()
			// 给用户输入的密码进行md5加密
			var enPassword = md5(password)

			// 发送ajax请求
			$.ajax({
				type: "post",
				url: adders + '/ly-manage/api/admin/login',
				data: {
					userName: username,
					passWord: enPassword,
					captcha: verifyImg
				},
				xhrFields: { withCredentials: true },
				dataType: "json",
				success: function (info) {
					if (info.errCode == 0) {
						localStorage.setItem('recentTime', new Date().getTime())
						// 执行loginStorage函数
						loginStorage(info)
						// 登录时清除退出时保存的数据
						localStorage.removeItem('dropOut')
						// 跳转到后台用户页面
						// 获取用的侧边栏
						$.ajax({
							type: "GET",
							url: adders + "/ly-manage/api/menu/getUserRoloMenu",
							xhrFields: { withCredentials: true },
							dataType: "json",
							success: function (response) {
								// sidebar
								var sidebar = JSON.stringify(response)
								localStorage.setItem('sidebar', sidebar)
								document.location.href = '../../overview/index.html';
							}
						});
					} else {
						$.message({
							type: 'error',
							message: info.errMsg
						});
						var num = Math.round(Math.random() * 1000);
						$('.verifyImg').attr('src', 'http://test.manage.faceying.com/ly-manage/api/admin/getCaptcha?' + num)
					}
				},
			});
		}
		return false;
	}
})