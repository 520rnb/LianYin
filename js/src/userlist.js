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
	var all = permissions(sidebar.data, 20101)
// 默认的请求参数
var data = {
	pageNum: 1,
	pageSize: 10
}
// 获取的真实用户的数据的函数
function getUserList(obj) {
	$.ajax({
		type: "get",
		url: adders + "/ly-manage/api/admin/userList",
		data: obj,
		dataType: "json",
		xhrFields: { withCredentials: true },
		success: function (response) {
			if (response.succeed) {
				recentTime();
				all.forEach(function(item){
					response.data[item.menuId] = true
				})
				// 重新初始化分页插件
				if (response.data.total) {
					$("#pageTool").show();
					var html = template('tmp-userlist', response)
					$('.userList').html(html)
					p.render({ count: response.data.total, pagesize: obj.pageSize, toolbar: true, current: data.pageNum })
				} else {
					$("#pageTool").hide();
					var html = template('no-data', response.data)
					$('.userList').html(html)
				}
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

getUserList(data)

	// 初始化时间选择控件
	$('.selectTime1').datePicker({
		max: moment(new Date()).format('YYYY-MM-DD'),
		isRange: true, // 是否开启时间选择 默认是false 选择
		format: 'YYYY-MM-DD',
		min: '2018-07-31'
	});
	// 初始化分页插件
	var p = new Paging
	//  当前的页数
	p.init({
		target: '#pageTool',
		pagesize: 10,
		count: 10,
		toolbar: true,
		changePagesize: function (page, num) {
			data.pageSize = page
			data.pageNum = 1
			getUserList(data)
		},
		callback: function (page, size, count) {
			data.pageNum = page;
			data.pageSize = size;
			getUserList(data)
		}
	})

	// 查看按钮的事件函数
	$('.checkapp').click(function () {
		var beginDate = $('.beginDate').val()
		var endDate = $('.endDate').val()
		var keyWord = $('.keyworld').val()
		if (beginDate && endDate) {
			data.beginDate = beginDate + ' 00:00:00'
			data.endDate = endDate + ' 23:59:59';
		} else {
			delete data.beginDate
			delete data.endDate
		}
		if (keyWord) {
			data.keyWord = keyWord
		} else {
			delete data.keyWord
		}
		data.pageNum  = 1
		getUserList(data)
	})

	// 通讯录icon点击事件
	$(document).on('click', '.addressbook', function () {
		var str = $(this).attr('data-arr')
		var arr = str.split('"')
		var newArr = []
		arr.forEach(element => {
			if (+element) {
				newArr.push(element)
			}
		});
		var html = template('adderssBooks', { book: newArr });
		$('#addressBook .modal-body').html(html)
		$('#addressBook').modal('show')
	})

	// 重置按钮的事件函数
	$('.rest').click(function () {
		$(".keyworld").val('')
		$(".beginDate").val('')
		$(".endDate").val('')
	})

	// 详情按钮的点击事件
	$(document).on('click', '.details-user', function () {
		var userid = $(this).attr('data-userId')
		getUserDetails(userid, function(response){
			var html = template('tmp-appdeatils', response)
			$('#details-user .modal-body').html(html)
			$('#details-user').modal('show')
		})
	})

	// 获取用户用户详情的
	function getUserDetails(userId,callback) {
		$.ajax({
			type: "GET",
			url: adders + "/ly-manage/api/admin/userDetails",
			data: {
				userId: userId
			},
			dataType: "json",
			xhrFields: { withCredentials: true },
			success: function (response) {
				if (response.succeed) {
					recentTime();
					callback(response)
				} else {
					if (response.errCode == 403) {
						localStorage.removeItem('info')
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

// 冻结用户的按钮
$(document).on('click', '.freeze-user', function () {
	var userNmae = $(this).attr('data-userId')
	$('#del-tips .btn-yes').attr('data-userId', userNmae)
	$('#del-tips').modal('show')
})

$('#del-tips .btn-yes').click(function () {
	var userName = $(this).attr('data-userId')

	$.ajax({
		type: "post",
		url: adders+"/ly-manage/api/admin/freezeUser",
		data: {
			userName: userName,
			type: 2,
			status: 2
		},
		dataType: "json",
		xhrFields: { withCredentials: true },
		success: function (response) {
			if (response.succeed) {
				$.message('冻结用户成功')
				$('#del-tips').modal('hide')
				getUserList(data)
			}else {
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
})

	// 解封用户
	$(document).on('click', '.unlock-user', function () {
		var userName = $(this).attr('data-userId')
		$.ajax({
			type: "post",
			url: adders+"/ly-manage/api/admin/freezeUser",
			data: {
				userName: userName,
				type: 2,
				status: 1
			},
			dataType: "json",
			xhrFields: { withCredentials: true },
			success: function (response) {
				if (response.succeed) {
					$.message('用户解封成功')
					getUserList(data)
				}else {
					if (response.errCode == 403) {
						localStorage.removeItem('recentTime')
						document.location.href = '../../login.html?timeout';
					}else {
						$.message({
							type: 'error',
							message: response.errMsg
						})
					}
				}
			}
		});
	})

	// 修改用户信息
	// $(document).on('click', '.change-user', function(){
	// 	console.log('修改用户')
	// 	var userId = $(this).attr('data-userid')
	// 	getUserDetails(userId,function(response){
	// 		var html = template('tmp-info-details', response)
	// 		$('#change-info-modal .modal-body').html(html)
	// 		$('#change-info-modal').modal('show');
	// 	})
	// })
	// iconfont icon-guanbishixin del-img
	$('#change-info-modal').on('click', '.del-info-img', function(){
		console.log('dianji')
		$(this).siblings('img').attr('src', '../img/logo1.png');
		$(this).siblings('input').attr('data-v', '../img/logo1.png')
	})

	var UpdateForAli = {};
	// 获取阿里云上传凭证
	function proveForAli(id) {
		var info = JSON.parse(localStorage.getItem('info'));
		var sts = JSON.parse(localStorage.getItem('sts'));
		if (info.data.roleType != 3) {
			if (sts) {
				var now = new Date().getTime();
				if (now - sts.timeout > 50 * 60 * 1000) {
					$.ajax({
						type: "post",
						url: adders + "/ly-manage/api/oss/getSTSCredentials",
						dataType: "json",
						xhrFields: { withCredentials: true },
						success: function (response) {
							if (response.succeed) {
								recentTime()
								response.timeout = new Date().getTime();
								var sts = JSON.stringify(response);
								localStorage.setItem('sts', sts);
								UpdateForAli.accessKeyId = response.data.accessKeyId
								UpdateForAli.region = 'oss-cn-shanghai';
								UpdateForAli.bucket = response.data.bucketName;
								UpdateForAli.stsToken = response.data.securityToken;
								UpdateForAli.accessKeySecret = response.data.accessKeySecret;
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
				} else {
					var obj = JSON.parse(localStorage.getItem('sts')).data;
					UpdateForAli.accessKeyId = obj.accessKeyId
					UpdateForAli.region = 'oss-cn-shanghai';
					UpdateForAli.bucket = obj.bucketName;
					UpdateForAli.stsToken = obj.securityToken;
					UpdateForAli.accessKeySecret = obj.accessKeySecret;
				}
			} else {
				$.ajax({
					type: "post",
					url: adders + "/ly-manage/api/oss/getSTSCredentials",
					dataType: "json",
					xhrFields: { withCredentials: true },
					success: function (response) {
						if (response.succeed) {
							recentTime()
							response.timeout = new Date().getTime();
							UpdateForAli.accessKeyId = response.data.accessKeyId
							UpdateForAli.region = 'oss-cn-shanghai';
							UpdateForAli.bucket = response.data.bucketName;
							UpdateForAli.stsToken = response.data.securityToken;
							UpdateForAli.accessKeySecret = response.data.accessKeySecret;
							var str = JSON.stringify(response)
							localStorage.setItem('sts', str)
						} else {
							if (response.errCode == 403) {
								localStorage.removeItem('recentTime')
								document.location.href = '../../login.html';
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
		}
	}
	//给修改按钮注册点击事件
	// 用户修改信息之前的数据
	var oldUserInfo = '';
	$(document).on('click', '.change-user', function () {
		// 获取对应userid
		var userid = $(this).attr('data-userid');
		proveForAli(userid)	
		$.ajax({
			type: "get",
			cache: false,
			url: adders + "/ly-manage/api/admin/userDetails",
			data: {
				userId: userid
			},
			dataType: "json",
			xhrFields: { withCredentials: true },
			success: function (response) {
				if (response.succeed) {
					recentTime();
					oldUserInfo = response.data
					// 设置图片墙的长度为大的
					if (response.data.photos){
						response.data.photos.length = 6;
					}
					// 将数据显示在模态框中
					var html = template('tmp-info-details', response);
					$('#change-info-modal .modal-body').html(html)
					$('#change-info-modal').modal('show');
				} else {
					if (response.errCode == 403) {
						localStorage.removeItem('recentTime')
						document.location.href = '../../login.html';
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
	// 修改用户的信息的数据
	var changeInfoData = {};

	// 用户的修改了头像的对象
	var headerFile = '';
	// 头像注册点击事件
	$(document).on('click', '.change-headImg', function () {
		$(this).siblings().click();
	});

	$('#change-info-modal').on('change', '.change-headImg-input', function (e) {
		var files = e.target.files[0];
		if (files.type.indexOf('image') != -1) {
			EXIF.getData(files, function () {
				var direction = EXIF.getTag(this, 'Orientation')
				PictureCompressions(files, direction, function (element, name) {
					$('.change-headImg').attr('src', element)
					headerFile = dataURLtoFile(element, name);
				})
			})

		} else {
			$.message({
				type: 'error',
				message: '请选择图片'
			})
			$(this).val('')
		}
	});
	// 定义一个背景图片的对象的变量
	var bgImgFile = '';
	// 修改用户背景的事件函数
	$('#change-info-modal').on('click', '.change-bgImg', function () {
		$(this).siblings().click();
	})

	$('#change-info-modal').on('change', '.change-bgImg-input', function (e) {
		var files = e.target.files[0];
		var type = files.type
		if (type.indexOf('video') == -1) {
			if (files) {
				EXIF.getData(files, function () {
					var direction = EXIF.getTag(this, 'Orientation')
					PictureCompressions(files, direction, function (element, name) {
						var elementName = $('.change-bgImg').attr('data-name');
						if (elementName == 'div') {
							var str = `<img src="${element}" style="width:100%;height:250px;overflow:hidden;"/>`;
							$('.change-bgImg').html(str);
						} else {
							$('.change-bgImg').attr('src', element);
						}
						bgImgFile = dataURLtoFile(element, name);
					})
				})

			}
		} else {
			$.message({
				type: 'error',
				message: '不能选择视频'
			})
		}
	})
	// 照片墙的对象
	var photoWallObj = {}
	// 修改精选图片的函数
	$(document).on('click', '.user_info_item img', function () {
		console.log('触发了')
		$(this).siblings('input').click();
	})

	$(document).on('change', '.user_info_item input', function (e) {
		var file = e.target.files[0];
		var type = file.type;
		console.log(file)
		if (type.indexOf('video') >= 0) {
			$.message({
				type: 'error',
				message: '不能选择视频'
			});
			return;
		}
		if (!file) {
			return;
		}
		var value = $(this).attr('data-v');
		var index = $(this).attr('data-index');
		var that = this;
		// 判断用户之前有没有图片
		if (value) {
			EXIF.getData(file, function () {
				var direction = EXIF.getTag(this, 'Orientation')
				PictureCompression(file, direction, function (element, name) {
					var item = dataURLtoFile(element, name);
					$(that).siblings().attr('src', element);
					$(that).attr('data-v', element)
					var key = 'photo' + index;
					photoWallObj[key] = item;
				})
			})
		} else {
			var item = $('.user_info_item input');
			// 遍历item 获取没有图片的情况
			for (let index = 0; index < item.length; index++) {
				var val = $(item[index]).attr('data-v');
				if (!val) {
					EXIF.getData(file, function () {
						var direction = EXIF.getTag(this, 'Orientation')
						PictureCompressions(file, direction, function (element, name) {
							$(item[index]).attr('data-v', element);
							$(item[index]).siblings().attr('src', element)
							var key = 'photo' + (index + 1);
							photoWallObj[key] = dataURLtoFile(element, name);
						})
					})
					break;
				} else {
				}
			}
		}
	});

	// 给修改按钮注册点击事件
	$('.change-info-yes').click(function () {
		// 定义的一个校验
		$('#changeinfo-form').bootstrapValidator({
			fields: {
				nickName: {
					message: '请输入用户昵称',
					validators: {
						notEmpty: {
							message: '昵称不能为空'
						},
						stringLength: {
							min: 1,
							max: 10,
							message: '昵称的长度是1到10'
						}
					}
				},
				individualResume: {
					message: '请输入用户的昵称',
					validators: {
						stringLength: {
							min: 0,
							max: 24,
							message: '个性签名的长度是1到24'
						}
					}
				},
				changeprofession: {
					message: '用户的职业',
					validators: {
						stringLength: {
							min: 0,
							max: 12,
							message: '职业的长度最大为12'
						}
					}
				},
				birthdate: {
					message: '请选择出生日期',
					validators: {
						notEmpty: {
							message: '请选择出生日期'
						},
						date: {
							format: 'YYYY-MM-DD',
							message: '请选择正确的时间'
						}
					}
				},
				userLabels: {
					message: '用户标签',
					validators: {
						choice: {
							min: 0,
							max: 10,
							message: '最多为10个'
						}
					}
				}
			}
		});
		$('#changeinfo-form').data('bootstrapValidator').addField('livecity', {
			validators: {
				message: '请选择用户的居住地',
				notEmpty: {
					message: '请选择用户的居住地'
				}
			}
		})
		$('#changeinfo-form').data('bootstrapValidator').addField('birthcity', {
			validators: {
				message: '请选择用户的居住地',
				notEmpty: {
					message: '请选择用户的居住地'
				}
			}
		})
		var bv = $('#changeinfo-form').data('bootstrapValidator');
		bv.validate();
		if (!bv.isValid()) {
			return;
		}
		console.log('1231231')
		var reviseData = {};
		var nickName = $('#nickName').val();
		// 判断用户的昵称修改了没有
		if (nickName != oldUserInfo.nickName) {
			reviseData.nickName = nickName;
		}
		// 获取用户的选择的标签
		var label = $('.userLabels label input[type="checkbox"]:checked');
		var labelStr = '';
		var newLableStr = ''
		for (let index = 0; index < label.length; index++) {
			const element = label[index];
			labelStr += ',' + element.value;
			newLableStr += ',' + element.value;
		}
		if (newLableStr.substring(1) != oldUserInfo.userLabel) {
			reviseData.userLabel = labelStr.substring(1)
		}
		var userId = $('#userId').val();
		reviseData.userId = userId
		// 用户的修改了照片墙的照片了吗  获取对像的长度 并判断用户是否修改了图片
		var photoFlag = '';
		var len = Object.keys(photoWallObj)
		if (len.length != 0) {
			photoFlag = 1;
		} else {
			photoFlag = 0;
		}
		reviseData.photoFlag = photoFlag;
		// 判断用户是否修改了头像了
		if (headerFile) {
			photoWallObj['headerFile'] = headerFile;
		}
		// 性别
		// 背景图
		if (bgImgFile) {
			photoWallObj['bgImgFile'] = bgImgFile;
		} else {
			// 获取开始的背景图的链接
			var oldBgUrl = $('.change_bgImage img').attr('src')
			// console.log(oldBgUrl)
			if (oldBgUrl) {
				reviseData.bgImg = oldBgUrl.split('?')[0];
			} else {
				reviseData.bgImg = '';
			}
		}
		// 个性签名
		var individualResume = $('#individualResume').val();
		if (individualResume != oldUserInfo.individualResume) {
			reviseData.individualResume = individualResume;
		}
		// 职业
		var profession = $('#profession').val();
		if (profession != oldUserInfo.profession) {
			reviseData.profession = profession;
		}
		console.log(reviseData)
		var objLen = Object.keys(photoWallObj);
		if (objLen.length == 0) {
			console.log(objLen)
			var reviseDataLen = Object.keys(reviseData);
			// if (reviseDataLen.length === 2) {
			// 	// $.message('暂无改动');
			// 	// // 当用户只中执行了的删除图片的操作
			// 	// $('#change-info-modal').modal('hide')
			// 	// return;
			// } else {
				// console.log(1)
				console.log(oldUserInfo)
				// 显示菊花
				$('#loading').show();
				var item = $('.user_info_item div input');
				for (let index = 0; index < item.length; index++) {
					const element = item[index];
					console.log(item)
					var str = $(element).attr('data-v').substr(0, 4);
					console.log(str)
					if (str == 'http') {
						reviseData[`photo${index + 1}`] = $(element).attr('data-v');
						// parmas[`photo${index + 1}`] = $(element).attr('data-v');
					}
				}
				reviseData.photoFlag = 1
				console.log(reviseData)
				// return
				// 判断用户是否修改了值 没有修改的时候不发送请求 并提示用户
				$.ajax({
					type: 'post',
					url: adders + "/ly-manage/api/admin/updateUserInfo",
					data: reviseData,
					dataType: "json",
					xhrFields: { withCredentials: true },
					success: function (response) {
						$('#loading').hide();
						if (response.succeed) {
							recentTime();
							$('#change-info-modal').modal('hide');
							$.message('修改用户信息成功')
							// console.log(robotData)
							getUserList(data)
							bgImgFile = '';
							headerFile = '';
							reviseData = {};
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
			// }
		} else {
			$('#loading').show();
			changImgs(reviseData, photoWallObj)
			//
		}
	})

	async function changImgs(parmas, data) {
		// 遍历对象
		for (const key in data) {
			if (data.hasOwnProperty(key)) {
				const element = data[key];
				await UploadPicturesForAli(element, key, parmas)
			}
		}

		// 遍历 user_info_item 
		if (parmas.photoFlag == 1) {
			var item = $('.user_info_item div input');
			for (let index = 0; index < item.length; index++) {
				const element = item[index];
				console.log(item)
				var str = $(element).attr('data-v').substr(0, 4);
				if (str == 'http') {
					parmas[`photo${index + 1}`] = $(element).attr('data-v');
				}
			}
		}
		// 发送ajax请求
		$.ajax({
			type: "POST",
			url: adders + "/ly-manage/api/admin/updateUserInfo",
			xhrFields: { withCredentials: true },
			data: parmas,
			dataType: "json",
			success: function (response) {
				$('#loading').hide();
				recentTime();
				if (response.succeed) {
					$('#change-info-modal').modal('hide');
					reviseData = {};
					photoWallObj = {};
					bgImgFile = '';
					headerFile = '';
					reviseData = {};
					getUserList(data)
				} else {
					if (response.errCode == 403) {
						localStorage.removeItem('recentTime')
						document.location.href = '../../login.html';
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


	// 上传函数
	async function UploadPicturesForAli(file, key, parmas) {
		var client = new OSS.Wrapper(UpdateForAli)
		// 图片存放在阿里云中路径
		var storeName = `images/${new Date().getFullYear()}/${addZero(new Date().getMonth() + 1)}/${addZero(new Date().getDate())}/${new Date().getFullYear()
			+ addZero(new Date().getMonth() + 1) + addZero(new Date().getDate()) + addZero(new Date().getHours()) + addZero(new Date().getMinutes()) + addZero(new Date().getSeconds()) +
			addMinZroe(new Date().getMilliseconds()) + String(Math.random()).substr(2, 8)}.jpg`;
		// 上传图片
		let result = await client.multipartUpload(storeName, file, {
			mime: 'image/jpeg'
		});
		// 上传的图片是头像还是背景图还是照片墙中的
		let links = await result.res.requestUrls[0].split('?')[0];
		if (key == 'headerFile') {
			parmas.headImg = await links
		} else if (key == 'bgImgFile') {
			parmas.bgImg = await links
		} else {
			parmas[key] = await links
		}
	}

	// 将dataURL转化为file对象的函数
	function dataURLtoFile(dataurl, filename) {
		var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
			bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
		while (n--) {
			u8arr[n] = bstr.charCodeAt(n);
		}
		return new File([u8arr], filename, { type: mime });
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

	function PictureCompressions(files, direction, callback) {
		var fileType = files.type;
		var render = new FileReader();
		var filename = files.name;
		var fileSize = files.size;
		var canvas = document.createElement('canvas');
		var context = canvas.getContext('2d');

		var img = new Image();
		var fileObj = null;

		img.onload = function () {
			var originWidth = this.width;
			var originHeight = this.height;
			// 最大尺寸限制
			// var maxWidth = 800, maxHeight = 800;
			// 目标尺寸
			var targetWidth = originWidth, targetHeight = originHeight;
			if (fileSize < 1024 * 1024) {
				var targetWidth = this.width, targetHeight = this.height;
			} else if (fileSize >= 1024 * 1024 && fileSize <= 10 * 1024 * 1024) {
				var maxWidth = 1600, maxHeight = 1600;
				var targetWidth = originWidth, targetHeight = originHeight;
				// 图片尺寸超过的限制
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
			} else if (fileSize > 10 * 1024 * 1024 && fileSize <= 20 * 1024 * 1024) {
				var maxWidth = 1400, maxHeight = 1400;
				var targetWidth = originWidth, targetHeight = originHeight;
				// 图片尺寸超过的限制
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
			} else if (fileSize > 20 * 1024 * 1024) {
				$.message({
					type: 'error',
					message: '文件过大'
				});
				return;
			}
			switch (direction) {
				case 6:
					canvas.width = targetHeight;
					canvas.height = targetWidth;
					var flag = targetHeight;
					targetHeight = targetWidth;
					targetWidth = flag;
					context.rotate(Math.PI / 2);
					context.drawImage(img, 0, -targetWidth, targetHeight, targetWidth);
					break;
				case undefined:
					canvas.width = targetWidth;
					canvas.height = targetHeight;
					context.drawImage(img, 0, 0, targetWidth, targetHeight);
					break;
				case 1:
					canvas.width = targetWidth;
					canvas.height = targetHeight;
					context.drawImage(img, 0, 0, targetWidth, targetHeight);
			}
			var element = canvas.toDataURL('image/jpeg');
			callback(element, filename)
		}
		// 将数据转化为base64位;
		render.readAsDataURL(files);
		// 将图片转化为base64位来获取图片的原始的宽高
		render.onload = function (e) {
			img.src = e.target.result;
		}
	}
		// 照片墙的对象
		var photoWallObj = {}
		$(document).on('change', '.user_info_item input', function (e) {
			var file = e.target.files[0];
			var type = file.type;
			if (type.indexOf('video') >= 0) {
				$.message({
					type: 'error',
					message: '不能选择视频'
				});
				return;
			}
			if (!file) {
				return;
			}
			var value = $(this).attr('data-v');
			var index = $(this).attr('data-index');
			var that = this;
			// 判断用户之前有没有图片
			if (value) {
				EXIF.getData(file, function () {
					var direction = EXIF.getTag(this, 'Orientation')
					PictureCompressions(file, direction, function (element, name) {
						var item = dataURLtoFile(element, name);
						$(that).siblings().attr('src', element);
						$(that).attr('data-v', element)
						var key = 'photo' + index;
						photoWallObj[key] = item;
					})
				})
			} else {
				var item = $('.user_info_item input');
				// 遍历item 获取没有图片的情况
				for (let index = 0; index < item.length; index++) {
					var val = $(item[index]).attr('data-v');
					if (!val) {
						EXIF.getData(file, function () {
							var direction = EXIF.getTag(this, 'Orientation')
							PictureCompressions(file, direction, function (element, name) {
								$(item[index]).attr('data-v', element);
								$(item[index]).siblings().attr('src', element)
								var key = 'photo' + (index + 1);
								photoWallObj[key] = dataURLtoFile(element, name);
							})
						})
						break;
					} else {
					}
				}
			}
		});

		// 图片压缩函数 新增用户 修改用户
	function PictureCompressions(files, direction, callback) {
		var fileType = files.type;
		var render = new FileReader();
		var filename = files.name;
		var fileSize = files.size;
		var canvas = document.createElement('canvas');
		var context = canvas.getContext('2d');

		var img = new Image();
		var fileObj = null;

		img.onload = function () {
			var originWidth = this.width;
			var originHeight = this.height;
			// 最大尺寸限制
			// var maxWidth = 800, maxHeight = 800;
			// 目标尺寸
			var targetWidth = originWidth, targetHeight = originHeight;
			if (fileSize < 1024 * 1024) {
				var targetWidth = this.width, targetHeight = this.height;
			} else if (fileSize >= 1024 * 1024 && fileSize <= 10 * 1024 * 1024) {
				var maxWidth = 1600, maxHeight = 1600;
				var targetWidth = originWidth, targetHeight = originHeight;
				// 图片尺寸超过的限制
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
			} else if (fileSize > 10 * 1024 * 1024 && fileSize <= 20 * 1024 * 1024) {
				var maxWidth = 1400, maxHeight = 1400;
				var targetWidth = originWidth, targetHeight = originHeight;
				// 图片尺寸超过的限制
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
			} else if (fileSize > 20 * 1024 * 1024) {
				$.message({
					type: 'error',
					message: '文件过大'
				});
				return;
			}
			switch (direction) {
				case 6:
					canvas.width = targetHeight;
					canvas.height = targetWidth;
					var flag = targetHeight;
					targetHeight = targetWidth;
					targetWidth = flag;
					context.rotate(Math.PI / 2);
					context.drawImage(img, 0, -targetWidth, targetHeight, targetWidth);
					break;
				case undefined:
					canvas.width = targetWidth;
					canvas.height = targetHeight;
					context.drawImage(img, 0, 0, targetWidth, targetHeight);
					break;
				case 1:
					canvas.width = targetWidth;
					canvas.height = targetHeight;
					context.drawImage(img, 0, 0, targetWidth, targetHeight);
			}
			var element = canvas.toDataURL('image/jpeg');
			callback(element, filename)
		}
		// 将数据转化为base64位;
		render.readAsDataURL(files);
		// 将图片转化为base64位来获取图片的原始的宽高
		render.onload = function (e) {
			img.src = e.target.result;
		}
	}

	// 删除违规的背景图片
	$(document).on('click', '.change_bgImage .iconfont', function(){
		console.log(this)
		var html = `<div class="bgImg change-bgImg" style="width:100%;height:250px;text-align:center;overflow:hidden;border: 1px solid #ccc;" data-name="div">
		<div style="margin-top:100px;">
			<i class="iconfont icon-ziyuan" style="font-size:30px;text-align:center;position: static;margin-top:40px;"></i>
			<p>选择您需要上传的图片</p>
		</div>
</div>`
		$(this).siblings('img').remove();
		$(this).before(html);
		$(this).remove();
	})
})