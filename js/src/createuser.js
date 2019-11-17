$(function () {

	// 创建新用户的页面
	var nowTime = new Date().getTime();
	var yesterdayTime = nowTime - 24 * 60 * 60 * 1000;
	$('.J-datepicker-day1').datePicker({
		format: 'YYYY-MM-DD',
		// hasShortcut: true,
		min: '1900-01-01',
		max: moment(yesterdayTime).format('YYYY-MM-DD'),
		hide: function (value) {
			// 更新校验的规则
			// $('#createuser-form').data('bootstrapValidator').removeField('birthdate');
			$('#createuser-form').data('bootstrapValidator')
				.updateStatus('birthdate', 'NOT_VALIDATED', null)
				.validateField('birthdate');
		}
	});

	// 对表单进行校验 当点击创建按钮的时候进行表单校验
	$('.btn-set-up').click(function () {
		// 定义一个校验器
		$('#createuser-form').bootstrapValidator({
			fields: {
				phone: {
					message: '请输入手机号',
					validators: {
						notEmpty: {
							message: '请输入手机号码'
						},
						regexp: {
							regexp: /^1\d{10}$/,
							message: '请输入正确的手机号码'
						}
					}
				},
				password: {
					message: '请输入密码',
					validators: {
						notEmpty: {
							message: '用户密码不能为空'
						},
						stringLength: {
							min: 6,
							max: 16,
							message: '密码的长度至少是6位最多16位'
						}
					}
				},
				nickname: {
					message: '用户的昵称',
					validators: {
						notEmpty: {
							message: '用户昵称不能空'
						},
						stringLength: {
							min: 1,
							max: 20,
							message: '用户昵称的长度是1到20'
						}
					}
				},
				birthdate: {
					validators: {
						callback: {
							message: '请选择用户的出生日期',
							callback: function (value, validate) {
								var value = $('.birthdate').val();
								var reg = /^((?!0000)[0-9]{4}-((0[1-9]|1[0-2])-(0[1-9]|1[0-9]|2[0-8])|(0[13-9]|1[0-2])-(29|30)|(0[13578]|1[02])-31)|([0-9]{2}(0[48]|[2468][048]|[13579][26])|(0[48]|[2468][048]|[13579][26])00)-02-29)$/;
								if (reg.test(value)) {
									return true
								} else {
									return false
								}
							}
						}
					}
				},
				sex: {
					message: '请选择用户的性别',
					validators: {
						notEmpty: {
							message: '请选择用户的性别'
						}
					}
				},
				headImg1: {
					message: '请选择用户的头像',
					validators: {
						notEmpty: {
							message: '请选择用户的头像'
						}
					}
				},
				registerChannel: {
					message: '请选择用户的注册渠道',
					validators: {
						notEmpty: {
							message: '请选择用户的注册渠道'
						}
					}
				},
				individualResume: {
					message: '请输入用户的个性签名',
					validators: {
						notEmpty: {
							message: '用户的个性签名不能空'
						},
						stringLength: {
							min: 1,
							max: 200,
							message: '个性签名的长度为的1-20'
						}
					}
				},
				emotion: {
					message: '请选择情感状态',
					validators: {
						notEmpty: {
							message: '请选择用户情感状态'
						}
					}
				},
			}
		})
		$('#createuser-form').data('bootstrapValidator').addField('distinguish', {
			validators: {
				message: "请选择用户当前所在的位置",
				notEmpty: {
					message: '请选择用户当前所在的位置'
				}
			}
		})

		$('#createuser-form').data('bootstrapValidator').addField('liveplace-city', {
			validators: {
				message: "请选择用户居住地",
				notEmpty: {
					message: '请选择用户居住地'
				}
			}
		});

		$('#createuser-form').data('bootstrapValidator').addField('birth_city', {
			validators: {
				message: "请选择用的出生地",
				notEmpty: {
					message: '请选择用的出生地'
				}
			}
		})

		var bv = $('#createuser-form').data('bootstrapValidator');

		bv.validate();

		if (bv.isValid()) {
			// 当用户校验成功后
			// 获取上传用的数据
			var createUserData = {};
			createUserData.phone = $('.phone').val();
			createUserData.password = md5($('.password').val());
			createUserData.nickName = $('.nickname').val();
			createUserData.birthdate = $('.birthdate').val();
			// createUserData.headImg = headeLink;
			createUserData.sex = +$('input[name = "sex"]:checked').val();
			createUserData.lat = lat;
			createUserData.lon = lon;
			createUserData.individualResume = $('.individualResume').val();
			createUserData.emotion = $('#emotion option:selected').val();
			createUserData.liveplace = $('.liveplace-province').val() + ' ' + $('.liveplace-city').val();
			createUserData.registerChannel = $('input[name="registerChannel"]:checked').val();
			createUserData.birthplace = $('.birth-province').val() + ' ' + $('.birth-city').val();
			// 用户的职业
			var profession = $('.profession').val();
			if (profession) {
				createUserData.profession = profession;
			} else {
				delete createUserData.profession;
			}
			// 定义的一个存放File对象的数组
			var fileArr = [];
			// 将头的头像图片的对象存放在数组的第一项
			fileArr[0] = headerImgFile;
			// 判断的用户使用上传了背景图片
			if (bgFile) {
				// 表示用户上传了 将背景图片存到fileArr的第二项中
				fileArr[1] = bgFile;
				// 当用的上传了背景图的时候 对数组进行遍历
				for (let index = 0; index < fileArr.length; index++) {
					// 对图片进行上传
					var client = new OSS.Wrapper(uploadImg);
					// 上头像存储的路径
					var storeName = `images/${new Date().getFullYear() + 1}/${addZero(new Date().getMonth() + 1)}/${addZero(new Date().getDate())}/${new Date().getFullYear()
						+ addZero(new Date().getMonth() + 1) + addZero(new Date().getDate()) + addZero(new Date().getHours()) + addZero(new Date().getMinutes()) + addZero(new Date().getSeconds()) +
						addMinZroe(new Date().getMilliseconds()) + String(Math.random()).substr(2, 8)}.${fileArr[index].type.split('/')[1]}`;
					client.multipartUpload(storeName, fileArr[index], {}).then(function (res) {
						if (index == 0) {
							// 这是上传的的是用户的头像
							var headeLink = res.res.requestUrls[0].split('?')[0];
							createUserData.headImg = headeLink;
						} else if (index == 1) {
							// 表示用户上传的背景图片
							var bgLink = res.res.requestUrls[0].split('?')[0];
							createUserData.bgImg = bgLink;
							createUsers(createUserData);
						}
					})
				}
			} else {
				// 表示用户没有上传背景图片
				var client = new OSS.Wrapper(uploadImg);
				var storeName = `images/${new Date().getFullYear() + 1}/${addZero(new Date().getMonth() + 1)}/${addZero(new Date().getDate())}/${new Date().getFullYear()
					+ addZero(new Date().getMonth() + 1) + addZero(new Date().getDate()) + addZero(new Date().getHours()) + addZero(new Date().getMinutes()) + addZero(new Date().getSeconds()) +
					addMinZroe(new Date().getMilliseconds()) + String(Math.random()).substr(2, 8)}.${fileArr[0].type.split('/')[1]}`;

				client.multipartUpload(storeName, fileArr[0], {}).then(function (res) {
					var headeLink = res.res.requestUrls[0].split('?')[0];
					createUserData.headImg = headeLink;
					createUsers(createUserData)
				})
			}
		}
	})

	// 用户的标签

	// 创建用户的函数
	function createUsers(data) {

		var userLabel = ['萌萌哒', '女友永远是对的', '长发及腰', '吃货', '文艺', '善解人意', '强迫症', '拖延症', '宅', '马甲线', '大叔控', '小清新', '逗比', '优雅', '铲屎官', '佛系'];
		// 随机用户标签的个数
		var number = Math.round(Math.random() * 4) + 1;
		var str = '';
		for (let index = 0; index < number; index++) {

			var i = Math.round(Math.random() * userLabel.length + 1);
			str += ',' + userLabel[i];

		}
		data.userLabel = str.substring(1, str.length)
		$.ajax({
			type: "post",
			url: adders + "/ly-manage/api/admin/registerAppUser",
			data: data,
			dataType: "json",
			xhrFields: { withCredentials: true },
			success: function (response) {
				recentTime();
				if (response.succeed) {
					$.message('创建用成功');
					$('#createUser-modal').modal('hide');
					// 重置输入的内容
					$('#createuser-form')[0].reset();
					$("#createuser-form").data('bootstrapValidator').destroy();
					$("#createuser-form").data('bootstrapValidator', null);
					$('.photo_user_img').attr('src', '../img/user_photo.jpg');
					if (bgFile) {
						bgFile = '';
					}
				} else {
					if (response.errCode == 410) {
						$.message({
							type: 'error',
							message: '改手机号已注册,请只修改手机号'
						})
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
	// 上传图片到阿里云的oss中凭证
	var uploadImg = {};
	// 获取上传的图标的秘钥
	// 获取当前登录到用户的用户
	var loginUser = JSON.parse(localStorage.getItem('info')).data;
	var keys = loginUser.publicKey;
	var jsencrypt = new JSEncrypt();
	jsencrypt.setPublicKey(keys);
	var createData = jsencrypt.encrypt(loginUser.userName)
	if (loginUser.roleType != 3) {
		$.ajax({
			type: "post",
			url: adders + "/ly-manage/api/oss/getSecretKey",
			data: {
				encryptKey: createData
			},
			dataType: "json",
			xhrFields: { withCredentials: true },
			success: function (response) {
				if (response.succeed) {
					uploadImg.region = 'oss-cn-shanghai';
					uploadImg.accessKeyId = response.data.ak;
					uploadImg.accessKeySecret = response.data.sk;
					uploadImg.bucket = response.data.bn
				} else {
					if (response.errCode == 403) {
						localStorage.removeItem('recentTime')
						location.href = '../../login.html';
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

	$('#headImg-form img').click(function () {
		$('#headImg').click();
	})


	// 用户头像的
	var headerImgFile = '';
	// 头像的上传表单的注册事件
	$('#headImg').change(function (e) {
		var files = e.target.files[0];
		PictureCompression(files, function (ele, filename) {
			$('#headImg-form img').attr('src', ele)
			headerImgFile = dataURLtoFile(ele, filename);
		})
	});


	var lon = '';
	var lat = '';

	$('.distinguish-now').change(function () {
		var province = $('.province').val();
		var city = $('.city').val();
		var distinguish = $('.distinguish').val();
		var adders = province + city + distinguish
		$.ajax({
			type: "get",
			url: "http://restapi.amap.com/v3/geocode/geo",
			data: {
				key: 'd4532258ae4662e18c74b6de4d5cf99e',
				s: 'rsv3',
				address: adders
			},
			success: function (response) {
				var arr = response.geocodes[0].location.split(',');
				lon = arr[0];
				lat = arr[1];
			}
		});
	})


	var bgFile = '';
	$('.user-bg').click(function () {
		$('.bg-file').click();

	})

	$('.bg-file').change(function (e) {
		var file = e.target.files[0];
		// 在这这里对用户背景图片进行压缩
		PictureCompression(file, function (ele, filename) {
			$('.user-bg').attr('src', ele)
			bgFile = dataURLtoFile(ele, filename);
		})
	})

	// 将dataURL转化为file对象的函数
	function dataURLtoFile(dataurl, filename) {
		var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
			bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
		while (n--) {
			u8arr[n] = bstr.charCodeAt(n);
		}
		return new File([u8arr], filename, { type: mime });
	}

	// 图片压缩函数
	function PictureCompression(files, callback) {
		var fileType = files.type.split('/')[1];
		var render = new FileReader();
		var filename = files.name;

		var canvas = document.createElement('canvas');
		var context = canvas.getContext('2d');

		var img = new Image();
		var fileObj = null;

		img.onload = function () {
			var originWidth = this.width;
			var originHeight = this.height;
			// 最大尺寸限制
			var maxWidth = 800, maxHeight = 800;
			// 目标尺寸
			var targetWidth = originWidth, targetHeight = originHeight;
			// 图片尺寸超过400x400的限制
			if (originWidth > maxWidth || originHeight > maxHeight) {
				if (originWidth / originHeight > maxWidth / maxHeight) {
					// 更宽，按照宽度限定尺寸
					targetWidth = maxWidth;
					targetHeight = Math.round(maxWidth * (originHeight / originWidth));
				} else {
					targetHeight = maxHeight;
					targetWidth = Math.round(maxHeight * (originWidth / originHeight));
				}
			}
			// canvas对图片进行缩放
			canvas.width = targetWidth;
			canvas.height = targetHeight;
			// 清除画布
			context.clearRect(0, 0, targetWidth, targetHeight);
			// 图片压缩
			context.drawImage(img, 0, 0, targetWidth, targetHeight);
			var element = canvas.toDataURL(fileType);
			callback(element, filename)
		}

		// 将数据转化为base64位;
		render.readAsDataURL(files);
		// 将图片转化为base64位来获取图片的原始的宽高
		render.onload = function (e) {
			img.src = e.target.result;
		}
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

	$('#createUser-modal').on('hidden.bs.modal', function (e) {
		// do something...
		// 隐藏发布动态的模态框
		$('#createDynamicMadal').modal('hide');
		// 删除上一次预览的图片
		// 更新校验规则
		$('#createuser-form')[0].reset();
		$("#createuser-form").data('bootstrapValidator').destroy();
		$("#createuser-form").data('bootstrapValidator', null);

	})

})