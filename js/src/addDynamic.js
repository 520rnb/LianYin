$(function () {
	var icon = document.querySelector('.icon');
	var icon2 = document.querySelector('.icon2');
	var icon3 = document.querySelector('.icon3');
	var icon4 = document.querySelector('.icon4');
	// 用户的昵称
	var nickName = '';
	var videoElement = ''; // 用户上传的视频
	// 视频的宽高
	var videoHeight = '';
	var videoWidth = '';
	// 经纬度
	var lon = '';
	var lat = '';
	// 上传的图片
	var uploadImgs = [];
	// 上传的视频
	var thumbnailImg = '';
	// 动态类型
	var dynamicType = '';
	// 初始化client所需要的数据
	var clientData = '';
	// 发布动态需要的参数
	var ajaxdata = {};
	// 经纬度的字符串
	var location = '';
	var add = '';
	// 拖拽上传
	$('#upload').on('drop', function (e) {
		e.preventDefault();
		// 判断用户拿没拿到用户昵称
		if (nickName == '') {
			$.message({
				type: 'error',
				message: '请先输入用户的id'
			});
			return;
		}
		// 拿到上传的数据
		var files = e.originalEvent.dataTransfer.files;
		// 判断用户的上传的图片是不是超过9张
		if (files.length > 9) {
			$.message({
				type: 'error',
				message: '最多上传9张图片或者一个视频'
			});

			return;
		}
		if (uploadImgs.length + files > 9) {
			$.message({
				type: 'error',
				message: '上传的图片不能超过9张,请重新选择'
			});
			return;
		}
		// 遍历flies
		for (let index = 0; index < files.length; index++) {
			var element = files[index];
			// 获取图片的方向并压缩图片
			EXIF.getData(element, function () {
				var direction = EXIF.getTag(this, 'Orientation');
				PictureCompression(element, index, direction);
			})
		}
	})

	$('#upload').on('dragover', function (e) {
		e.preventDefault();
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

	// 图片压缩的函数
	function PictureCompression(file, index, direction) {
		if (nickName == '') {
			$.message({
				type: 'error',
				message: '请输入用户id'
			});
			return;
		}
		// 获取文件的字节数
		var fileSize = file.size;
		var fileName = file.name;
		var fileMime = file.name.split('.')[1];
		// 当用户上传的数图片这对图片进行压缩
		if (file.type.indexOf('image') == 0) {
			var filename = file.name;
			var fileType = file.type;
			// 创建一个canvas对象
			var canvas = document.createElement('canvas');
			var context = canvas.getContext('2d');
			// 压缩图需要借助其他的对象
			var render = new FileReader();
			var img = new Image();
			// 选择文件对象
			var fileObj = null;
			img.onload = function () {
				// 图片原始尺寸
				var originWidth = this.width;
				var originHeight = this.height;
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
						break;
					case undefined:
						canvas.width = targetWidth;
						canvas.height = targetHeight;
						break;
					case 1:
						canvas.width = targetWidth;
						canvas.height = targetHeight;
						break;
				}
				context.clearRect(0, 0, targetWidth, targetHeight);
				// 判断用户的方向
				switch (direction) {
					case 6:
						var flag = targetHeight;
						targetHeight = targetWidth;
						targetWidth = flag;
						context.rotate(Math.PI / 2);
						context.drawImage(img, 0, -targetWidth, targetHeight, targetWidth);
						context.drawImage(icon3, targetHeight - 17, -targetWidth + 57, 17, 17);
						context.fillStyle = '#fff';
						context.shadowColor = 'rgba(0, 0, 0, 0.8)';
						context.shadowOffsetX = 0;
						context.shadowOffsetY = 0.3;
						context.shadowBlur = 1;
						context.font = '14px';
						context.rotate(3 * Math.PI / 2)
						// context.fillText('@' + nickName, -100, 100);
						break;
					case 1:
						context.drawImage(img, 0, 0, targetWidth, targetHeight);
						context.fillStyle = '#fff';
						context.shadowColor = 'rgba(0, 0, 0, 0.8)';
						context.shadowOffsetX = 0;
						context.shadowOffsetY = 0.3;
						context.shadowBlur = 1;
						context.drawImage(icon, targetWidth - 77, targetHeight - 17, 17, 17);
						break;
					case undefined:
						context.drawImage(img, 0, 0, targetWidth, targetHeight);
						context.drawImage(icon, targetWidth - 77, targetHeight - 17, 17, 17);
						break;
				}
				// 图片压缩
				// 将用户的名绘制上去的
				context.fillStyle = '#fff';
				context.shadowColor = 'rgba(0, 0, 0, 0.8)';
				context.shadowOffsetX = 0;
				context.shadowOffsetY = 0.3;
				context.shadowBlur = 1;
				context.font = '14px';
				// context.fillText('@' + nickName, targetWidth - 55, targetHeight - 3);
				// if (fileSize < 200 * 1024 && targetHeight < 400 && targetWidth < 400) {
				// 	var element = canvas.toDataURL(fileType, 0.96);
				// } else {
				// 	var element = canvas.toDataURL(fileType);
				// }
				var element = canvas.toDataURL('image/jpeg');
				var dynamicImg = new Image();
				dynamicImg.src = element;
				$(dynamicImg).attr('index-img', index)
				// 将压缩的后的图片渲染到页面中
				$('.selectImg').append(dynamicImg)
				var uploadImg = dataURLtoFile(element, filename);
				// 将上传的图片存放到数组中
				// if (fileName != element.name && fileSize > 200 * 1024) {
				uploadImgs.push(uploadImg)
				// }
			};
			// 将数据转化为base64位;
			render.readAsDataURL(file);
			// 将图片转化为base64位来获取图片的原始的宽高
			render.onload = function (e) {
				img.src = e.target.result;
			}
			// 需要给图片进行压缩 和添加水印
		} else if (file.type.indexOf('video') == 0) {
			// 在这获取的视频的缩略图
			// 在这里获取视频的缩略图
			videoElement = file;
			var render = new FileReader();
			// 转化为base64位
			render.readAsDataURL(file);
			// 将视频进行上传
			render.onload = function (e) {
				// 将视频渲染到页面中
				var video = document.createElement('video');
				video.src = e.currentTarget.result
				// 让视频自动播放来来获取宽高和缩略图
				video.autoplay = true;
				video.muted = true;
				$('.video').append(video);
				// 当video加载完成时获取的
				$('video')[0].onloadedmetadata = function () {
					videoHeight = $(this).height();
					videoWidth = $(this).width();
				}
				$('video')[0].oncanplay = function () {
					var canvas = document.createElement('canvas');
					canvas.width = videoWidth;
					canvas.height = videoHeight;
					var context = canvas.getContext('2d');
					context.fillStyle = '#000';
					context.drawImage(this, 0, 0, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);
					// $('#test-img').html(canvas)
					var src = canvas.toDataURL('image/jpeg');
					// 将视频的缩略图渲染到页面中
					var dynamicImg = new Image();
					dynamicImg.src = src;
					$(dynamicImg).attr('index-video', '1');
					// 将压缩的后的图片渲染到页面中
					$('.selectImg').append(dynamicImg)
					thumbnailImg = dataURLtoFile(src, 'thumbnailImg.jpeg');
				}
			}
		}
	}

	// 获取的公钥的加密的函数
	function PublicKeys() {
		var data = localStorage.getItem('info');
		data = JSON.parse(data);
		return data.data
	}
	var clientData = {};
	// 获取用户的昵称
	var keys = PublicKeys().publicKey;
	// 获得用户名并加密
	var jsencrypt = new JSEncrypt();
	jsencrypt.setPublicKey(keys);
	var data = jsencrypt.encrypt(PublicKeys().userName);
	//  获取私钥的接口
	$.ajax({
		type: "post",
		url: adders + "/ly-manage/api/oss/getSecretKey",
		data: {
			encryptKey: data
		},
		dataType: "json",
		xhrFields: { withCredentials: true },
		success: function (response) {
			if (response.succeed == true) {
				recentTime();
				// 进行初始化
				clientData.region = 'oss-cn-shanghai';
				clientData.accessKeyId = response.data.ak;
				clientData.accessKeySecret = response.data.sk;
				clientData.bucket = response.data.bn;
			} else {
				if (response.errCode == 403) {
					localStorage.removeItem('recentTime');
					location.href = '../../login.html?timeout';
				} else {
					$.message({
						type: 'error',
						message: response.errMsg
					})
				}
			}
		}
	});

	// 当userId表单输入失去焦点获取的用户的昵称
	$('#userid').blur(function () {
		var userId = $(this).val();
		if (userId == '') {
			// 
			$.message({
				type: 'error',
				message: '请输入用户id'
			})
			return
		}
		$.ajax({
			type: "get",
			cache: false,
			url: adders + "/ly-manage/api/admin/queryNickName",
			data: { userId: userId },
			dataType: "json",
			xhrFields: { withCredentials: true },
			success: function (response) {
				if (response.succeed == true) {
					recentTime();
					nickName = response.data;
				} else {
					if (response.errCode == 410) {
						$.message({
							type: 'error',
							message: response.errMsg
						})
						// 清空之前输入的数据
						$('#userid').val('');
						return;
					} else {
						$.message({
							type: 'error',
							message: response.errMsg
						})
					}
				}
			}
		});
	});
	// 给select注册change事件来获取经纬度
	$('.last').change(function () {
		var province = $('.province').val();
		var city = $('.city').val();
		var district = $(this).val();
		add = province + city + district;
		$('.publishAdd').val(province + city + district);
		// 选择不同的城市的就去获取对应的经纬度
		getItude(province + city + district);
	})

	$('.publishAdd').blur(function () {
		if (add == '') {
			$.message({
				type: 'error',
				message: '请先选择省市区'
			})
			return;
		}
		var adderss = $(this).val();
		ajaxdata.localAddress = adderss.split(add)[1];
		if (adderss == '') {
			$.message({
				type: 'error',
				message: '请输入发布动态的地址'
			})
			return
		}
		getItude(adderss)
	});
	// 获取经纬度的函数
	function getItude(adderss) {
		$.ajax({
			type: "get",
			url: "http://restapi.amap.com/v3/geocode/geo",
			data: {
				key: 'd4532258ae4662e18c74b6de4d5cf99e',
				s: 'rsv3',
				address: adderss
			},
			dataType: "json",
			success: function (response) {
				// 获取经纬
				var arr = response.geocodes[0].location.split(',');
				lon = arr[0];
				lat = arr[1];
				location = lon + "," + lat;
				Realaddress(location)
			}
		});
	}

	// 在用户输入点赞数的时候 来根据经纬度 获取的真实的地址
	// $('#likedCount').blur(function () {
	// 	// 判断用是否选择了地址 
	// 	if (!add) {
	// 		$.message({
	// 			type: 'error',
	// 			message: '请选择省市区'
	// 		})
	// 		$(this).val('');
	// 		// 触发表单的change事件
	// 		return;
	// 	}
	// })

	// 获取真实地址的函数
	function Realaddress(loaction) {
		$.ajax({
			type: "get",
			url: "https://restapi.amap.com/v3/geocode/regeo?parameters",
			data: {
				key: '15b669f55b47d07c9c6d479807793c92',
				location: loaction
			},
			success: function (response) {
				ajaxdata.realAddress = response.regeocode.formatted_address;
			}
		});
	}
	// 判断用户的输入的内容长度的是超过了500
	$('#message').blur(function () {
		if (this.value.length >= 500) {
			$.message({
				type: 'error',
				message: '内容不能超过的500字,'
			})
			return;
		}
	})

	$('#upload').click(function () {
		$('#file-upload').click();
	})

	// 压缩之前的对象
	$('#file-upload').change(function (e) {
		var files = e.target.files;
		if (files.length > 9) {
			$.message({
				type: 'error',
				message: '最多上传9张图片或者一个视频'
			});
			return;
		} else {
			if (uploadImgs.length + files.length > 9) {
				$.message({
					type: 'error',
					message: '上传的图片不能超过9张'
				});
				return;
			} else {
				for (let index = 0; index < files.length; index++) {
					const element = files[index];
					// 在这里获取图片的方向
					EXIF.getData(element, function () {
						var direction = EXIF.getTag(this, 'Orientation');
						PictureCompression(element, index, direction);
					})
				}
			}
		}
	})
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
	// 给发布注册点击事件
	$('.dynamicPublish').click(function () {
		// 定义一个校验器
		$('#addDynamic').bootstrapValidator({
			fields: {
				userid: {
					message: '请输入用户的id',
					validators: {
						notEmpty: {
							message: '请输入用户的id'
						},
						stringLength: {
							min: 9,
							message: '用户id的长度最少为9位'
						}
					}
				},
				status: {
					message: '请选择权限',
					validators: {
						notEmpty: {
							message: '请选择权限'
						}
					}
				},
				likedCount: {
					message: "请输入点赞数",
					validators: {
						notEmpty: {
							message: '请输入点赞数'
						},
						regexp: {
							regexp: /^[0-9]\d{0,8}$/,
							message: '1-99999999之间的正整数'
						}
					}
				},
				readCount: {
					message: '请输入阅读数',
					validators: {
						notEmpty: {
							message: '请输入阅读数'
						},
						regexp: {
							regexp: /^[0-9]\d{0,8}$/,
							message: '1-99999999之间的正整数'
						}
					}
				},
				shareCount: {
					message: '请输入分享数',
					validators: {
						notEmpty: {
							message: '请输入分享数'
						},
						regexp: {
							regexp: /^[0-9]\d{0,8}$/,
							message: '1-99999999之间的正整数'
						}
					}
				}
			}
		});
		// 给动态渲染的的元素添加校验规则
		$('#addDynamic').data('bootstrapValidator').addField('proveince', {
			validators: {
				message: '请选择省份或者直辖市',
				notEmpty: {
					message: '请选择省份或者是直辖市'
				}
			}
		});
		$('#addDynamic').data('bootstrapValidator').addField('city', {
			validators: {
				message: '请选择所在的市区',
				notEmpty: {
					message: '请选择所在的市区'
				}
			}
		});
		$('#addDynamic').data('bootstrapValidator').addField('area', {
			validators: {
				message: '请选择所在的区',
				notEmpty: {
					message: '请选择所在的区'
				}
			}
		})

		var bv = $('#addDynamic').data('bootstrapValidator');

		bv.validate();
		if (!bv.isValid()) {
			return;
		}
		// 获取用户上传的数据
		userId = $('#userid').val();
		if (userId == '') {
			$.message({
				type: 'error',
				message: '请输入用户的id'
			});
			return;
		}
		ajaxdata.userId = userId;
		message = $('#message').val();
		ajaxdata.message = message;
		ajaxdata.type = +$('input[name = "status"]:checked').val();
		// 动态的状态默认审核通过
		ajaxdata.status = 1;
		if (lon == '' && lat == '') {
			$.message({
				type: 'error',
				message: '请选择地址'
			})
			return;
		}
		var city = $('.city').val();
		if (city == '') {
			// 提示用户的输入的
			$.message({
				type: 'error',
				message: '请选择城市'
			})
			return;
		}
		ajaxdata.city = city;
		ajaxdata.lon = lon;
		ajaxdata.lat = lat;
		// 发布时间
		ajaxdata.publishTime = new Date().getTime();
		// ajaxdata.localAddress = $('#publishAdd').val();
		// 获取点赞,阅读,分享数
		var likedCount = $('#likedCount').val();
		if (likedCount != '') {
			likedCount = + likedCount
			if (likedCount > 0 || likedCount < 99999999) {
				ajaxdata.likedCount = likedCount;
			} else {
				$.message({
					type: 'error',
					message: '请输入有效值'
				});
				$('#likedCount').val('');
				return;
			}
		} else {
			$.message({
				type: 'error',
				message: '请输入点赞数'
			})
			return;
		}
		var readCount = $('#readCount').val();
		if (readCount != '') {
			readCount = + readCount;
			if (readCount > 0 || readCount < 999999999) {
				ajaxdata.readCount = readCount;
			} else {
				$.message({
					type: 'error',
					message: '请输入有效值',
				})
				$('#readCount').val('');
				return;
			}
		} else {
			$.message({
				type: 'error',
				message: '请输入阅读数'
			})
			return
		}
		var shareCount = $('#shareCount').val();
		if (shareCount != '') {
			shareCount = + shareCount;
			if (shareCount > 0 || shareCount < 999999999) {
				ajaxdata.shareCount = shareCount;
			} else {
				$.message({
					type: 'error',
					message: '请输入有效值'
				});
				$('#shareCount').val('');
				return;
			}
		} else {
			$.message({
				type: 'error',
				message: '请输入分享数'
			})
			return;
		}
		// 判断用户的发布地址是否为undefined 是的 则删除
		if (!ajaxdata.localAddress) {
			delete ajaxdata.localAddress
		}
		$('#loading').show();
		$(this).attr('disabled', 'disabled');
		// 视频的宽高的
		if (videoElement != '') {
			// 表示上传的是视频
			ajaxdata.dynamicType = 3;
			ajaxdata.videoWidth = videoWidth;
			ajaxdata.videoHeight = videoHeight;
			// 将视频和缩略图发在一个数
			var videosArr = [];
			videosArr.push(videoElement);
			videosArr.push(thumbnailImg);
			// 上传视频和视频缩略图
			videosArr.forEach(function (item) {
				var client = new OSS.Wrapper(clientData);
				// 判断用户上传的是缩略图还是视频
				var mime = item.name.split('.')[1];
				if (item.type.split('/')[0] == 'video') {
					var storeName = `videos/${new Date().getFullYear()}/${addZero(new Date().getMonth() + 1)}/${addZero(new Date().getDate())}/${new Date().getFullYear()
						+ addZero(new Date().getMonth() + 1) + addZero(new Date().getDate()) + addZero(new Date().getHours()) + addZero(new Date().getMinutes()) + addZero(new Date().getSeconds()) +
						addMinZroe(new Date().getMilliseconds()) + String(Math.random()).substr(2, 8)}.${mime}`;
				} else {
					var storeName = `images/${new Date().getFullYear()}/${addZero(new Date().getMonth() + 1)}/${addZero(new Date().getDate())}/${new Date().getFullYear()
						+ addZero(new Date().getMonth() + 1) + addZero(new Date().getDate()) + addZero(new Date().getHours()) + addZero(new Date().getMinutes()) + addZero(new Date().getSeconds()) +
						addMinZroe(new Date().getMilliseconds()) + String(Math.random()).substr(2, 8)}.${mime}`;
				}
				// 进行上传
				client.multipartUpload(storeName, item, {}).then(function (result) {
					if (result.res.requestUrls[0].indexOf('?') == -1) {
						// 这里是视频缩略图的链接
						ajaxdata.thumbnailImg = result.res.requestUrls[0]
					}
					ajaxdata.photo1 = result.res.requestUrls[0];
					// 在这这里发送ajax请求
				}).catch(function () {
					$.message({
						type: 'error',
						message: '上传出错了,请刷新页面重新上传'
					});
					return;
				})
			});
			$.message('正在发布动态')
			setTimeout(function () {
				Releasedynamics(ajaxdata);
			}, 5000);
		} else if (uploadImgs.length > 0) {
			ajaxdata.dynamicType = 2;
			if (uploadImgs.length > 9) {
				$.message({
					type: 'error',
					message: '最多上传9张图片,请重新选择图片'
				});
				return;
			}
			uploadImgs.forEach(function (item, index) {
				var lastItem = uploadImgs.length - 1;
				if (item != '') {
					UploadPicturesForAli(item, index, ajaxdata, uploadImgs.length);
				}
			})
		} else {
			ajaxdata.dynamicType = 1;
			Releasedynamics(ajaxdata)
		}
	})

	function Releasedynamics(data) {
		$.ajax({
			type: "post",
			url: adders + "/ly-manage/api/dynamic/publishDynamic",
			data: data,
			dataType: "json",
			xhrFields: { withCredentials: true },
			success: function (response) {
				if (response.succeed) {
					recentTime()
					$.message('动态发布成功');
					// 清除上次的 
					$('#addDynamic')[0].reset();
					ajaxdata = {};
					uploadImgs = [];
					videoElement = '';
					thumbnailImg = '';
					videoHeight = '';
					videoWidth = '';
					$('.dynamicPublish').removeAttr('disabled');
					$('.selectImg').empty();
					$('#loading').hide();
					// 更新校验规则
					$('#addDynamic')[0].reset();
					$("#addDynamic").data('bootstrapValidator').destroy();
					$("#addDynamic").data('bootstrapValidator', null);
				} else {
					if (response.errCode == 403) {
						localStorage.removeItem('recentTime');
						location.href = '../../login.html?timeout';
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

	// 删除对应的图片给点击删除
	$(document).on('click', '.selectImg img', function () {
		// 先获取
		Imgitem = $(this).parent().children();

		for (let index = 0; index < Imgitem.length; index++) {
			const element = Imgitem[index];
			$(element).attr('index-img', index)
		}
		var index = $(this).attr('index-img');
		if (index == undefined) {
			// 表示上传的的视频 删除视频对象 和视频缩略图对象
			videoElement = '';
			thumbnailImg = '';
			$.message('删除视频成功,若上传视频请重新选择');
		} else {
			uploadImgs.splice(index, 1);
			$(this).remove();
			$.message('删除成功');
		}
	});

	// 上传的函数
	async function UploadPicturesForAli(file, key, parmas, lengeth) {
		var client = new OSS.Wrapper(clientData)
		// 图片存放在阿里云中路径
		var storeName = `images/${new Date().getFullYear() + 1}/${addZero(new Date().getMonth() + 1)}/${addZero(new Date().getDate())}/${new Date().getFullYear()
			+ addZero(new Date().getMonth() + 1) + addZero(new Date().getDate()) + addZero(new Date().getHours()) + addZero(new Date().getMinutes()) + addZero(new Date().getSeconds()) +
			addMinZroe(new Date().getMilliseconds()) + String(Math.random()).substr(2, 8)}.${file.type.split('/')[1]}`;
		// 上传图片
		let result = await client.multipartUpload(storeName, file);
		// 上传的图片是头像还是背景图还是照片墙中的
		let links = await result.res.requestUrls[0].split('?')[0];
		var keys = `photo${key + 1}`
		parmas[keys] = await links
		if (length == key) {
			Releasedynamics(ajaxdata)
		}
	}
})