$(function () {
	$('.show-city-modal').click(function () {
		$('#city-modal').modal('show')
	})
	// 给省注册点击事件
	$('#city-modal .province  p ').click(function () {
		var index = $(this).attr('data-index');
		var name = $(this).text();
		var num = $(this).attr('data-num')
		$('#city-modal .city-title').append(`<p >${name}</p>`);
		$(this).parent().hide();
		$(this).parent().siblings('.citys').show()
		var element = ''
		cityData[index].child.forEach(function (item, index) {
			element += `<button data-parent="${item.parent}" data-index="${item.number}" data-name="${item.city}" flag='true' class="btn btn-default" data-i="${index}">${item.city}</button>`
		});
		$('.citys').html(element)
		$('.city-alls').removeClass('active');
		$('.city-alls').siblings().addClass('active')
		// 遍历之前的选中的
		var selectCity = $('.modal-seleted > div p')
		for (var i = 0; i < selectCity.length; i++) {
			var element = selectCity[i];
			var nums = $(element).attr('data-index')
			if (num == nums) {
				$('#city-modal div.city-all div.citys button:nth-child(1)').siblings().attr('disabled', 'disabled');
				$('#city-modal div.city-all div.citys button:nth-child(1)').attr('flag', 'false');
			}
		}
	})

	// 选择平台的函数
	$('.target .item').click(function () {
		$(this).parent().css({ 'border': 'none' });
		var select = $(this).attr('select')
		if (select == 1) {
			$(this).attr('select', '2')
			$(this).addClass('selected')
			// $(this).siblings('item').removeClass('selected')
			$('.tips').hide()
		} else if (select == 2) {
			// debugger
			$(this).attr('select', '1')
			$(this).removeClass('selected')
		} else {
		}
		var len = $(this).parent().children().hasClass('selected');
		if (!len) {
			$(this).parent().css({'border': '1px solid rgb(169, 68, 66)'})
			$('.tips').show();
		}
	})

	$('.city-alls').click(function () {
		$(this).siblings().remove();
		$(this).addClass('active')
		$('.province').show();
		$('.citys').hide();
	})

	//  被选中的city
	//市的点击事件
	$('#city-modal').on('click', '.citys button', function () {
		var number = $(this).attr("data-index");
		var index = $(this).attr('data-i');
		var parent = $(this).attr('data-parent')
		var name = $(this).text();
		var sele = $('.modal-seleted div p');
		if (sele.length >= 20) {
			$.message({
				type: 'error',
				message: '最多只能选择20个'
			});
			return;
		}
		var flag = $(this).attr('flag');
		if (index == 0) {
			if (flag == 'true') {
				$(this).siblings().attr('disabled', 'disabled').addClass('disabled');
				$(this).attr('flag', 'false');
				for (let j = 0; j < sele.length; j++) {
					var p = $(sele[j]).attr('data-parent');
					if (p == number) {
						$(sele[j]).remove()
					}
				}
			} else if (flag == 'false') {
				$(this).siblings().removeAttr('disabled').removeClass('disabled');
				$(this).attr('flag', 'true')
			}
		}
		for (var i = 0; i < sele.length; i++) {
			var cityNumber = $(sele[i]).attr('data-index');
			if (cityNumber == number) {
				$(sele[i]).remove();
				return;
			}
		}
		$('.modal-seleted > div').append(`<p data-parent="${parent}" data-index="${number}">${name}<i class="iconfont icon-guanbishixin sele-remove"></i></p>`)
	})

	// 删除icon的事件
	$('#city-modal').on('click', '.sele-remove', function () {
		$(this).parent().remove()
	});

	$('.select-user input').change(function (e) {
		var value = this.value;
		if (value == 2) {
			$('.select-city').show()
		} else {
			$('.select-city').hide()
		}
		if (value == 4) {
			$('.deviceCId').show()
		} else {
			$('.deviceCId').hide()
		}
	});

	// 设备id$
	$(document).on('input', '.deviceCId input', function () {
		if (this.value.length == 32) {
			$(this).removeClass('urlColor')
		} else {
			$(this).addClass('urlColor')
		}
	})


	$('.send-btn').click(function () {
		// 定义一个校验
		$('#form-content').bootstrapValidator({
			fields: {
				title: {
					message: '请输入标题',
					validators: {
						notEmpty: {
							message: '请输入标题'
						},
						stringLength: {
							min: 1,
							max: 30,
							message: '长度最大为30个字'
						},
					}
				},
				content: {
					message: '请输入内容',
					validators: {
						notEmpty: {
							message: '请输入内容'
						},
						stringLength: {
							min: 1,
							max: 50,
							message: '长度最大为50个字'
						}
					}
				}
			}
		});

		var pushData = {}
		var flag = true
		pushData.title = $('#message-title').val();
		pushData.content = $('#message-content').val();
		// 校验用户的选择平台了吗
		var len = $('.target .selected').length;
		if (len == 2) {
			pushData.platform = 1
		} else if (len == 1) {
			var name = $('.target .selected').find('p').text()
			if (name == 'Android') {
				pushData.platform = 2
			} else if (name == "IOS") {
				pushData.platform = 3
			}
		} else if (len == 0) {
			$('.tips').show()
			$('.target .items').css({ 'border': '1px solid #a94442' })
			flag = false;
		}
		// 获取的推送的类型的
		// var 
		// 获取推送的类型
		var type = $('input:radio[name="openJumpType"]:checked').val();
		if (!type) {
			pushData.openJumpType = 2
		} else {
			pushData.openJumpType = +type
		}
		// 判断推送的是不是活动类型的 如果是获取类型的一定要输入链接和图片
		if (pushData.openJumpType == 2) {
			var reg = /^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)(([A-Za-z0-9-~]+).)+([A-Za-z0-9-~\/])+$/
			var activeUrl = $('.links').val()
			// 判断用户是否数据的了正确的链接
			if (!reg.test(activeUrl)) {
				// 给活动链接添加的error的样式
				$('.links').addClass('urlColor')
				$('.link-tips').show();
			}
			if (media == '') {
				$('.upload').addClass('urlColor')
				$('.media-tips').show();
			}
		}

		// 判断目标的选择
		var val = $('input:radio[name="users"]:checked').val();
		if (val == 1) {
			pushData.targetType = 1
		} else if (val == 2) {
			pushData.targetType = 2
			var str = ''
			var selectCity = $('.modal-seleted > div p')
			for (var i = 0; i < selectCity.length; i++) {
				var element = selectCity[i];
				if (i == 0) {
					str += $(element).attr('data-index')
				} else {
					str += ',' + $(element).attr('data-index')
				}
			}
			if (str) {
				pushData.contentObj = str
				$(".select-city .item").removeClass('urlColor');
			} else {
				$(".select-city .item").addClass('urlColor');
			}
		} else if (val == 4) {
			var deviceCid = $('.deviceCId input').val()
				if (deviceCid) {
					if (deviceCid.length == 32) {
						pushData.deviceCid = deviceCid
						pushData.targetType = 4
					} else {
						// $.message({
						// 	type: 'error',
						// 	message: '请输入正确的设备id'
						// })
						$('.deviceCId input').addClass('urlColor')
						return;
					}
				} else {
				// $.message({
				// 	type: 'error',
				// 	message: '请输入设备id'
				// })
				$('.deviceCId input').addClass('urlColor')
			}
		}

		var bv = $('#form-content').data('bootstrapValidator')
		bv.validate();
		if (bv.isValid()) {
			var val = $('input:radio[name="users"]:checked').val();
			if (val == 1) {
				pushData.targetType = 1
			} else if (val == 2) {
				// var flage 
				pushData.targetType = 2
				var str = ''
				var selectCity = $('.modal-seleted > div p')
				for (var i = 0; i < selectCity.length; i++) {
					var element = selectCity[i];
					if (i == 0) {
						str += $(element).attr('data-index')
					} else {
						str += ',' + $(element).attr('data-index')
					}
				}
				// if (!flage) {
				// 	return;
				// }
				if (str) {
					pushData.contentObj = str
					$(".select-city .item").removeClass('urlColor');
				} else {
					$(".select-city .item").addClass('urlColor');
					return;
				}
			} else if (val == 4) {
				//  获取deviceCId
				var deviceCid = $('.deviceCId input').val()
				if (deviceCid) {
					if (deviceCid.length == 32) {
						pushData.deviceCid = deviceCid
						pushData.targetType = 4
					} else {
						// $.message({
						// 	type: 'error',
						// 	message: '请输入正确的设备id'
						// })
						$('.deviceCId input').addClass('urlColor')
						return;
					}
				} else {
					// $.message({
					// 	type: 'error',
					// 	message: '请输入设备id'
					// })
					$('.deviceCId input').addClass('urlColor')
					return;
				}
			} else {
				pushData.targetType = 3
			}
			// 获取推送的类型
			var type = $('input:radio[name="openJumpType"]:checked').val();
			if (!type) {
				pushData.openJumpType = 2
			} else {
				pushData.openJumpType = +type
			}
			// 活动链接
			var active = $('.links').hasClass('urlColor')
			if (!active) {
				var activeUrl = $('.links').val()
				if (activeUrl) {
					pushData.activeUrl = activeUrl
				}
			}

			// 判断推送的是不是活动类型的 如果是获取类型的一定要输入链接和图片
			if (pushData.openJumpType == 2) {
				var reg = /^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)(([A-Za-z0-9-~]+).)+([A-Za-z0-9-~\/])+$/
				if (!reg.test(activeUrl) || media == '') {
					if (media == '') {
						$('.media-tips').show()
					}else {
						$('.link-tips').show()
					}
					return;
				} else {
					$('.links').removeClass('urlColor')
					$('.upload').removeClass('urlColor')
					$('.link-tips').hide()
					$('.media-tips').hide()
				}
			}
			// 判断用户是否选择了平台
			var len = $('.target .selected').length;
			if (len == 2) {
				pushData.platform = 1
			} else if (len == 1) {
				var name = $('.target .selected').find('p').text()
				if (name == 'Android') {
					pushData.platform = 2
				} else if (name == "IOS") {
					pushData.platform = 3
				}
			} else if (len == 0) {
				$('.tips').show()
				$('.target .items').css({ 'border': '1px solid #a94442' })
				flag = false;
				return;
			}
			// 判断是否又的media对象
			if (media) {
				if (media.type.indexOf('image') >= 0) {
					pushData.msgType = 2
				} else if (media.type.indexOf('video') >= 0) {
					pushData.msgType = 3
				}
				// 有media对象对象先进行上传图片 然后发送请求
				getSTS(Upload, media, pushData)
			} else {
				pushData.msgType = 1
				// 没有media 对象直接进行请求
				return;
				// lyPush(pushData)
			}
		}
	})


	// 消息推送请求
	function lyPush(data) {
		$.ajax({
			type: "post",
			url: adders + "/ly-manage/api/push/lyPush",
			data: data,
			dataType: "json",
			xhrFields: { withCredentials: true },
			success: function (response) {
				if (response.succeed) {
					$.message('推送发送成功')
					// 清除上一次的校验
					$("#form-content").data('bootstrapValidator').destroy();
					$('#form-content').data('bootstrapValidator',null);
					//  将上传的图标显示出来
					$('.upload').append('<i class="iconfont icon-shangchuan1"></i>')
					$('.target .item').removeClass('selected');
					// 清除上次选择的平台
					$('.target .item').attr('select', '1')
					$('#message-title').val('')
					$('#message-content').val('')
					$('.modal-seleted> div').html('')
					$('.links').val('')
					$('.upload-img').remove();
					if (data.activeUrl) {
						$('.show-phone img').attr('src', '../img/logo.png');
						$(".show-phone .bg").attr('src', '');
					}
					$('.phone-title').text('通知标题')
					$('.android .phone-content').text('您当前选择的是Android默认样式')
					$('.iphone .phone-content').text('您当前选择的是Iphone默认样式')
					$('.deviceCId input').removeClass('urlColor')
					$('.deviceCId input').val('')
					$('.selected-citys').html('')
					
					// 如果有media
					if (data.imgUrl) {
						// 清空上一次的对象
						media = ''
					}
				} else {
					if (response.errCode == 403) {
						localStorage.removeItem('info')
						localStorage.removeItem('recentTime')
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
	}
	// input事件
	$(document).on('input', '#message-title', function () {
		var android = $('.target .android').hasClass('selected')
		var ios = $('.target .ios').hasClass('selected')
		$('.android .phone-title').text(this.value)
		$('.iphone .phone-title').text(this.value)
	})
	$(document).on('input', '#message-content', function () {
		var android = $('.target .android').hasClass('selected')
		var ios = $('.target .ios').hasClass('selected')
		$('.android .phone-content').text(this.value)
		$('.iphone .phone-content').text(this.value)
	})

	// 上传推送的图片
	$('.upload').click(function () {
		$(this).find('input')[0].click()
	})

	// 推送的媒体文件对象
	var media = ''
	$('.file-upload').change(function (e) {
		// 移除先前面的校验
		$('.upload').removeClass('urlColor')
		$('.media-tips').hide()
		var file = e.target.files[0];
		var fileSize = file.size
		var type = file.type
		if (type.indexOf('image') >= 0){
		}else{
			$.message({
				type: 'error',
				message: '你选择的不是图片'
			})
			return;
		}
		getOrientation(file, function (direction) {
			var direction = direction
			PictureCompression(file, 0, direction);
		})
		var render = new FileReader();
		render.readAsDataURL(file)
		render.onload = function (val) {
			// 判断用户选择的是ios,还是安卓平台
			var android = $('.target .android').hasClass('selected')
			var ios = $('.target .ios').hasClass('selected')
		}
		// media = file
		// 防止用户第二次选择的和之前是一样的
		this.value = ''
	})
	// 删除之前选择的图片
	$(document).on('click', '.del-img', function () {
		$(this).parent().remove();
		$('.media-tips').show()
		$(".upload").append('<i class="iconfont icon-shangchuan1"></i>');
		$('.show-phone img').attr('src', '../img/logo.png');
		$('.show-phone .bg').attr('src', '');
		$('.upload').addClass('urlColor')
		// 删除上一次选择的file对象
		media = ''
		return false;
	})

	function getSTS(callback, file, pushData) {
		var stStr = JSON.parse(localStorage.getItem('sts'))
		var now = new Date().getTime()
		if (stStr) {
			if (now - stStr.timeout > 55 * 60 * 1000) {
				$.ajax({
					type: "post",
					url: adders + "/ly-manage/api/oss/getSTSCredentials",
					dataType: "json",
					xhrFields: { withCredentials: true },
					success: function (response) {
						if (response.succeed) {
							var now = new Date().getTime()
							response.timeout = now
							localStorage.setItem('sts', JSON.stringify(response))
							var obj = stStr.data
							callback(file, response.data, pushData)
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
			} else {
				var obj = stStr.data
				callback(file, obj, pushData)
			}
		} else {
			$.ajax({
				type: "post",
				url: adders + "/ly-manage/api/oss/getSTSCredentials",
				dataType: "json",
				xhrFields: { withCredentials: true },
				success: function (response) {
					if (response.succeed) {
						var now = new Date().getTime()
						response.timeout = now
						localStorage.setItem('sts', JSON.stringify(response))
						callback(file, response.data, pushData)
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
	}

	// 上传媒体文件到阿里函数
	function Upload(file, obj, pushData) {
		obj.stsToken = obj.securityToken;
		delete obj.securityToken;
		obj.bucket = obj.bucketName
		delete obj.bucketName
		delete obj.expiration
		obj.region = 'oss-cn-shanghai'
		// 初始化
		var client = new OSS.Wrapper(obj)
		var mime = file.type.split('/')[1]
		var storeName = `faceying-activity/${new Date().getFullYear()}/${addZero(new Date().getMonth() + 1)}/${addZero(new Date().getDate())}/${new Date().getFullYear()
			+ addZero(new Date().getMonth() + 1) + addZero(new Date().getDate()) + addZero(new Date().getHours()) + addZero(new Date().getMinutes()) + addZero(new Date().getSeconds()) +
			addMinZroe(new Date().getMilliseconds()) + String(Math.random()).substr(2, 8)}.jpg`;
		// 进行上传
		client.multipartUpload(storeName, file).then(function (response) {
			pushData.imgUrl = response.res.requestUrls[0].split('?')[0] + '?x-oss-process=image/quality,q_60';
			// 发送请求
			lyPush(pushData)
		}).catch(function (err) {
			$.message({
				type: 'error',
				message: '上传图片失败'
			})
		})
	}
	// 判断用户输入的是不是链接
	$(document).on('input', '.links', function () {
		var reg = /^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)(([A-Za-z0-9-~]+).)+([A-Za-z0-9-~\/])+$/;
		if (reg.test(this.value)) {
			$(this).removeClass('urlColor')
			$('.link-tips').hide();
		} else {
			$(this).addClass('urlColor')
			$('.link-tips').show();
		}
	})

	// 城市选择的确认按钮的s事件
	$('.city-confirm').click(function () {
		var len = $('.modal-seleted div p').length
		if (len) {
			$('.show-city-modal').text('已选择')
			var html = $('.modal-seleted > div').html()
			$('.selected-citys').html(html)
			$('.select-city .item').removeClass('urlColor')
		} else {
			$('.show-city-modal').text('请选择')
			$('.select-city .item').addClass('urlColor')
			$('.selected-citys').html('')
			// 
		}
		$('#city-modal').modal('hide')
	})
	// 城市选择的取消按钮的s事件
	$('.city-cancel').click(function () {
		// $('.modal-seleted div').html('')
		$('#city-modal').modal('hide')
	})

	// 图片压缩函数
	// 图片压缩的函数
	function PictureCompression(file, index, direction) {
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
					var flag = true;
				} else if (fileSize >= 1024 * 1024 && fileSize <= 10 * 1024 * 1024) {
					var flag = false;
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
					var flag = false;
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
					case 3:
						canvas.width = targetWidth;
						canvas.height = targetHeight;
				}
				context.clearRect(0, 0, targetWidth, targetHeight);
				// 判断用户的方向
				switch (direction) {
					case 6:
						var flag = targetHeight;
						targetHeight = targetWidth;
						targetWidth = flag;
						context.fillStyle = '#fff';
						context.shadowColor = 'rgba(0, 0, 0, 0.8)';
						context.shadowOffsetX = 0;
						context.shadowOffsetY = 0.3;
						context.shadowBlur = 1;
						context.font = '34px PingFangSC';
						var x = 26 / 375 * targetWidth;
						context.rotate(Math.PI / 2);
						context.drawImage(img, 0, -targetWidth, targetHeight, targetWidth);
						// 绘制用户的昵称
						break;
					case 1:
						context.fillStyle = '#fff';
						context.shadowColor = 'rgba(0, 0, 0, 0.8)';
						context.shadowOffsetX = 0;
						context.shadowOffsetY = 0.3;
						context.shadowBlur = 1;
						context.drawImage(img, 0, 0, targetWidth, targetHeight);
						context.scale(2, 2);
						break;
					case undefined:
						context.fillStyle = '#fff';
						context.shadowColor = 'rgba(0, 0, 0, 0.8)';
						context.shadowOffsetX = 0;
						context.shadowOffsetY = 0.3;
						context.shadowBlur = 1;
						context.drawImage(img, 0, 0, targetWidth, targetHeight);
						break;
					case 3:
						context.fillStyle = '#fff';
						context.shadowColor = 'rgba(0, 0, 0, 0.8)';
						context.shadowOffsetX = 0;
						context.shadowOffsetY = 0.3;
						context.shadowBlur = 1;
						context.drawImage(img, 0, 0, -targetWidth, -targetHeight);
						break
				}
				// 图片压缩
				// if (fileSize < 200 * 1024 && targetHeight < 400 && targetWidth < 400) {
				// 	var element = canvas.toDataURL('image/jpeg', 0.96);
				// } else {
				// 	var element = canvas.toDataURL('image/jpeg');
				// }
				var element = canvas.toDataURL('image/jpeg');
				var dynamicImg = new Image();
				dynamicImg.src = element;
				$('.upload-img img').attr('src', element)
				$('.show-phone img').attr('src', element)
				$('.upload i').remove();
				$('.upload img').remove();
				var ele = `<div class="upload-img">
							<i class="iconfont icon-guanbishixin del-img"></i>
							<img src="${element}" />
							</div>`
				$('.upload').before(ele)
				media =  dataURLtoFile(element, 'img')
				// 修改文件的类型
				media.type = 'image/jpg'
			};
			// 将数据转化为base64位;
			render.readAsDataURL(file);
			// 将图片转化为base64位来获取图片的原始的宽高
			render.onload = function (e) {
				img.src = e.target.result;
			}
			// 需要给图片进行压缩 和添加水印
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
	// 获取图片方向的函数
	getOrientation = function (file, callback) {
		var reader = new window.FileReader();
		reader.onload = function (e) {
			var view = new window.DataView(e.target.result);
			if (view.getUint16(0, false) != 0xFFD8) {
				return callback(1);
			}
			var length = view.byteLength, offset = 2;
			while (offset < length) {
				var marker = view.getUint16(offset, false);
				offset += 2;
				if (marker == 0xFFE1) {
					if (view.getUint32(offset += 2, false) != 0x45786966) {
						return callback(1);
					}
					var little = view.getUint16(offset += 6, false) == 0x4949;
					offset += view.getUint32(offset + 4, little);
					var tags = view.getUint16(offset, little);
					offset += 2;
					for (var i = 0; i < tags; i++) {
						if (view.getUint16(offset + (i * 12), little) == 0x0112) {
							return callback(view.getUint16(offset + (i * 12) + 8, little));
						}
					}
				} else if ((marker & 0xFF00) != 0xFF00) {
					break;
				} else {
					offset += view.getUint16(offset, false);
				}
			}
			return callback(1);
		};
		reader.readAsArrayBuffer(file);
	}
	// 将base64 转化为的file对象
	function dataURLtoFile(dataurl, filename) {
		var arr = dataurl.split(',');
		var mime = arr[0].match(/:(.*?);/)[1];
		var bstr = atob(arr[1]);
		var n = bstr.length; 
		var u8arr = new Uint8Array(n);
		while(n--){
				u8arr[n] = bstr.charCodeAt(n);
		}
		//转换成file对象
		return new File([u8arr], filename, {type:mime});
		//转换成成blob对象
		//return new Blob([u8arr],{type:mime});
	}
})

