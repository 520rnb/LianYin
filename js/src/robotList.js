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
	var all = permissions(sidebar.data, 20102)
	// 签名
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

	proveForAli()
	// 默认的请求参数
	var robotData = {
		pageNum: 1,
		pageSize: 10
	};
	// 当前页
	var pages = 1;
	robotListData(robotData)
	// 获取机器人列表
	function robotListData(data) {
		$.ajax({
			type: "get",
			cache: false,
			url: adders + "/ly-manage/api/admin/robotList",
			data: data,
			xhrFields: { withCredentials: true },
			dataType: "json",
			success: function (response) {
				recentTime();
				all.forEach(function(item){
					response.data[item.menuId] = item.menuName
				});
				$('#load').hide();
				if (response.succeed) {
					if (response.data.total) {
						p.render({ count: response.data.total, pagesize: robotData.pageSize, toolbar: true, current: data.pageNum })
						var html = template('tmp-one-level', response);
						$('#pageTool').show()
						$('.robotList').html(html)
					} else {
						var html = template('no-data', response)
						$('.robotList').html(html)
						$('#pageTool').hide()
					}
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
	// 初始化分页列表
	var p = new Paging();
	p.init({
		target: '#pageTool', pagesize: 10, count: 10, toolbar: true, changePagesize: function (page, num) {
			robotData.pageNum = 1;
			robotData.pageSize = page;
			pages = 1
			robotListData(robotData)
		},
		callback: function (page, size, count) {
			pages = page;
			robotData.pageNum = page;
			robotData.pageSize = size;
			robotListData(robotData)
		}
	});

	// 初始化时间选择控件
	$('.selectTime1').datePicker({
		max: moment(new Date()).format('YYYY-MM-DD'),
		isRange: true,
		format: 'YYYY-MM-DD',
		min: minDate
	});

	// 查看按钮的事件
	$('.checkapp').click(function () {
		// 获取开始的时间 和结束的时间
		var beginDate = $('.beginDate').val();
		var endDate = $('.endDate').val();
		var userId = $('.userid').val();
		if (beginDate) {
			robotData.beginDate = beginDate + ' 00:00:00';
		} else {
			delete robotData.beginDate;
		};
		if (endDate) {
			robotData.endDate = endDate + ' 23:59:59';
		} else {
			delete robotData.endDate
		};
		if (userId) {
			var reg = /^\d{9,10}$/;
			if (!reg.test(userId)) {
				$.message({
					type: 'error',
					message: '请输入正确的脸影号'
				})
				return;
			} else {
				robotData.userId = userId;
			}
		} else {
			delete robotData.userId;
		};
		$('#load').show();
		robotData.pageNum = 1;
		robotListData(robotData);
	})

	// 全选事件
	$(document).on('click', '.checked-all input', function () {
		var flag = $(this).prop('checked');
		if (flag) {
			// 选中的时候
			$(this).parent().parent().parent().siblings().find('input').prop('checked', true);
		} else {
			$(this).parent().parent().parent().siblings().find('input').prop('checked', false);
		}
	})

	// 多选框选中
	$(document).on('click', 'table tbody tr', function () {
		var self = $(this).find('input').prop('checked')
		if (self) {
			$(this).find('input').prop('checked', false)
		} else {
			$(this).find('input').prop('checked', true)
		}
		var flag;

		var ele = $('tbody').find('.item')
		for (let i = 0; i < ele.length; i++) {
			const element = ele[i];
			flag = $(element).prop('checked')
			if (!flag) {
				break;
			}
		}
		if (flag) {
			$('.checked-all input').prop('checked', true)
		} else {
			$('.checked-all input').prop('checked', false)
		}
	})

	var userIDArr = [];
	// 显示模态框
	$(document).on('click', '.change-position', function () {
		// 清空上次有的选中的用户的id
		userIdStr = '';
		var item = $('.checked-item input:checked');
		if (item.length == 0) {
			$.message({
				type: 'error',
				message: '请选择被修改的用户'
			});
			return;
		}
		var arr = []
		for (let index = 0; index < item.length; index++) {
			var userid = $(item[index]).attr('data-userid');
			arr.push(userid)
		}
		userIDArr = arr
		// 获取的选中的用户的id放到数组中
		$('#change-position-modal').modal('show');
	});

	// 修改经纬度需要的数据 
	var changePositionData = {};
	var changeLocation = '';
	function mapInit (container, clickCallback){
		var map = new AMap.Map(container,{
			zoom:10,
			center:[121.470181,31.241289]
		});
		
		map.setDefaultCursor('pointer');
		
		var marker = new AMap.Marker({
			icon:'https://a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png',
			position:[116,39]
		})
		
		map.on('click', function(e){
			map.remove([marker])
			marker = new AMap.Marker({
				icon:'https://a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png',
				position:[e.lnglat.getLng(),e.lnglat.getLat()],
				offset:new AMap.Pixel(-10,-20)
			});
			map.add([marker]);
			clickCallback && clickCallback(e);
		})
		return map;
	}
	var changePositionMap = mapInit('container', function(e) {
		changeLocation = e.lnglat.getLng() +","+e.lnglat.getLat();
	});

	console.log(changePositionMap);
	

	// 确认修改的事件函数
	$('.change-position-yes').click(function () {
			if (!changeLocation) {
				$.message({
					type: 'error',
					message: '请稍后点击'
				})
				return;
			}
			$('.loading').show();
			var lon = changeLocation.split(',')[0];
			var lat = changeLocation.split(',')[1];
			// 小数点之前的
			var lonStart = lon.split('.')[0]
			//var lonEnd = lon.split('.')[1].substr(0, 1)
			var latStart = lat.split('.')[0]
			//var latEnd = lat.split('.')[1].substr(0, 1)
			// 随机随机经纬度
			var province = $('.province-position option:selected').val()
			var city = $('.city-position option:selected').val();
			var area = $('.distinguish-change option:selected').val();

			for (let i = 0; i < userIDArr.length; i++) {
				if (province == '台湾省') {
					$.ajax({
						type: "post",
						url: adders + "/ly-manage/api/admin/updateLocation",
						data: {
							userId: userIDArr[i],
							province: province,
							city: city,
							area: area,
							adderss: province + city + area,
							lon: lon,
							lat: lat
						},
						// async: false,
						dataType: "json",
						xhrFields: { withCredentials: true },
						success: function (response) {
							if (response.succeed) {
								if (i == userIDArr.length - 1) {
									$.message('位置修改成功');
									$('.loading').hide();
									robotListData(robotData)
									$('#change-position-modal').modal('hide');
								}
							} else {
								// recentTime();
								$.message({
									type: 'error',
									message: response.errMsg
								})
							}
						}
					});
				} else {
					var data = {};
					var lonRandom = Math.random().toString().substr(2, 6);
					var latRandom = Math.random().toString().substr(2, 6);
					lon = `${lonStart}.${lonRandom}`
					lat = `${latStart}.${latRandom}`
					// location = lai
					data.lon = lon;
					data.lat = lat;
					data.userId = userIDArr[i]
					var location = lon + ',' + lat
					SpecificPosition(location, data, i)
				}
				//  判断用户选的是不是台湾省
			}
		// }
	})

	var counts = 0
	function SpecificPosition(location, data, index) {
		$.ajax({
			type: "get",
			url: "https://restapi.amap.com/v3/geocode/regeo?parameters",
			// async: false,
			data: {
				key: '15b669f55b47d07c9c6d479807793c92',
				location: location
			},
			success: function (response) {
				var province = response.regeocode.addressComponent.province;
				var city = response.regeocode.addressComponent.city;
				var area = response.regeocode.addressComponent.district;
				var address = response.regeocode.formatted_address;

				if (province.length == 0) {
					var lon = changeLocation.split(',')[0];
					var lat = changeLocation.split(',')[1]
					// 小数点之前的
					var lonStart = lon.split('.')[0]
					var lonEnd = lon.split('.')[1].substr(0, 1)
					var latStart = lat.split('.')[0]
					var latEnd = lat.split('.')[1].substr(0, 1)
					var lonRandom = Math.random().toString().substr(2, 5);
					var latRandom = Math.random().toString().substr(2, 5);
					lon = `${lonStart}.${lonEnd}${lonRandom}`
					lat = `${latStart}.${latEnd}${latRandom}`
					var datas = {}
					datas.lon = lon;
					datas.lat = lat;
					datas.userId = userIDArr[index]
					var location = lon + ',' + lat;
					SpecificPosition(location, datas, index)
					return
				} else {
					if (city.length == 0) {
						data.city = province
					} else {
						data.city = city
					}
					data.province = province;
					data.area = area;
					data.address = address
					$.ajax({
						type: "post",
						url: adders + "/ly-manage/api/admin/updateLocation",
						data: data,
						// async: false,
						dataType: "json",
						xhrFields: { withCredentials: true },
						success: function (response) {
							if (response.succeed) {
								recentTime()
								if (index == userIDArr.length - 1) {
									$.message('位置修改成功');
									$('.loading').hide();
									robotListData(robotData)
									$('#change-position-modal').modal('hide');
								}
							} else {
								$.message({
									type: 'error',
									message: response.errMsg
								})
							}
						}
					});
				}
			}
		});
	}

	// 重置按钮的事件函数
	$('.rest').click(function () {
		$('.beginDate').val('');
		$('.endDate').val('');
		$('.userid').val('');
		// 删除上一次的用户选择的数据
		delete robotData.beginDate;
		delete robotData.endDate;
		delete robotData.userId;
	})

	//给修改按钮注册点击事件
	// 用户修改信息之前的数据
	var oldUserInfo = '';
	$(document).on('click', '.change-info', function () {
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
					// 设置图片墙的长度为大的\
					if (response.data.photos){
						response.data.photos.length = 6;
					}
					if (response.data.liveplace == '') {
						response.data.liveplace = '----选择省---- ----选择市----';
					}

					if (response.data.birthplace == '') {
						response.data.birthplace = '----选择省---- ----选择市----';
					}
					// 将数据显示在模态框中
					var html = template('tmp-details', response);
					$('#change-info-modal .modal-body').html(html)
					//初始初始化城市选择插件
					$('#birthplace').distpicker({
						autoSelect: false,
						province: 'birthProvince',
						city: 'birthCity',
					});
					// 初始化居住地的
					$('#liveplace').distpicker({
						autoSelect: false,
						province: 'liveProvince',
						city: 'liveCity',
					});
					// 初始化时间
					$('.selectTime3').datePicker({
						format: 'YYYY-MM-DD',
						min: '1900-01-01',
						max: moment(yesterdayTime).format('YYYY-MM-DD'),
						format: 'YYYY-MM-DD',
						hide: function (value) {
							var value = $('.change-birthdate').val();
							var now = new Date(moment().format('YYYY-MM-DD')).getTime();
							var select = new Date(value).getTime();
							if (select == now) {
								var date = moment(now - 24 * 60 * 60 * 1000).format('YYYY-MM-DD');
								$('.change-birthdate').val(date)
								$('#changeinfo-form').data('bootstrapValidator')
									.updateStatus('birthdate', 'VALID', null)
									.validateField('birthdate'); // 已经验证校验规则的时候
							} else if (value) {
								$('#changeinfo-form').data('bootstrapValidator')
									.updateStatus('birthdate', 'VALID', null)
									.validateField('birthdate'); // 已经验证校验规则的时候
							}
							// 更新校验的规则
						}
					});
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
		$(this).siblings().click();
	})

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
				console.log(1)
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

	// 给修改按钮注册点击事件
	$('.change-info-yes').click(function () {
		// 定义的一个校验
		$('#changeinfo-form').bootstrapValidator({
			fields: {
				nickName: {
					message: '请输入用户昵称',
					validators: {
						notEmpty: {
							message: '不能为空'
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
		// debugger;
		var reviseData = {};
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
		// 获取用户的昵称
		var nickName = $('#nickName').val();
		// 判断用户的昵称修改了没有
		if (nickName != oldUserInfo.nickName) {
			reviseData.nickName = nickName;
		}
		// 判断用户是否修改了头像了
		if (headerFile) {
			photoWallObj['headerFile'] = headerFile;
		}
		// 性别
		var sex = $('input[name="sexs"]:checked').val();
		if (sex != oldUserInfo.sex) {
			reviseData.sex = sex;
		}
		// 背景图
		if (bgImgFile) {
			photoWallObj['bgImgFile'] = bgImgFile;
		}
		// 居住地
		var liveplace = $('.change-liveplace').val() + ' ' + $('.change-city').val();
		if (liveplace != oldUserInfo.liveplace) {
			reviseData.liveplace = liveplace;
		}
		// 出生日期
		var birthdate = $('.change-birthdate').val();
		if (birthdate != moment(oldUserInfo.birthdate).format('YYYY-MM-DD')) {
			reviseData.birthdate = birthdate;
		}
		// 个性签名
		var individualResume = $('#individualResume').val();
		if (individualResume != oldUserInfo.individualResume) {
			reviseData.individualResume = individualResume;
		}
		// 感情状态
		var emotion = $('#emotions').attr('emotion');
		if (emotion != oldUserInfo.emotion) {
			reviseData.emotion = emotion
		}
		//  出生地
		var birthplace = $('.birthplace-province').val() + ' ' + $('.birthplace-city').val();
		if (birthplace != oldUserInfo.birthplace) {
			reviseData.birthplace = birthplace;
		}
		// 职业
		var profession = $('#profession').val();
		if (profession != oldUserInfo.profession) {
			reviseData.profession = profession;
		}

		var objLen = Object.keys(photoWallObj);
		if (objLen.length == 0) {
			var reviseDataLen = Object.keys(reviseData);
			console.log(reviseData)
			if (reviseDataLen.length === 2) {
				$.message('暂无改动');
				$('#change-info-modal').modal('hide')
				return;
			} else {
				// 显示菊花
				$('#loading').show();
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
							robotListData(robotData);
							bgImgFile = '';
							headerFile = '';
							reviseData = {};
							// robotListData(robotData)
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
		} else {
			// debugger;
			$('#loading').show();
			console.log('daozheli')
			changImgs(reviseData, photoWallObj)
			//
		}
	})


	async function changImgs(parmas, data) {
		// 遍历对象
		console.log(parmas, data)
		for (const key in data) {
			if (data.hasOwnProperty(key)) {
				const element = data[key];
				await UploadPicturesForAlis(element, key, parmas)
			}
		}
		// 遍历 user_info_item 
		if (parmas.photoFlag == 1) {
			var item = $('.user_info_item div input');
			for (let index = 0; index < item.length; index++) {
				const element = item[index];
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
					robotListData(robotData)
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
	async function UploadPicturesForAlis(file, key, parmas) {
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


	// 	// 将dataURL转化为file对象的函数
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


	// 显示创建用户的模态框
	$(document).on('click', '.createUser', function () {
		// 默认的参数
		proveForAli(552280987)
		$('.password').val(generateMixed(6))
		$('.phone').val('1' + RandomNumber());
		// 删除上一次预览的头像
		$('.photo_user_img').attr('src', '../img/user_photo.jpg')
		var nickNameLength = radomNickName.length;
		// 随机的昵称
		var nickNameRadom = Math.round(Math.random() * nickNameLength);
		$('.nickname').val(radomNickName[nickNameRadom]);
		// 随机的个性签名
		var signRadomLength = radomSign.length;
		var signRadom = Math.round(Math.random() * signRadomLength);
		$('.individualResume').val(radomSign[signRadom])
		$('#createUser-modal').modal('show');
		//  随机添加用户的标签
		var value = $('.userLabel label input');
		// 随机选中几个
		// var numberOfTime = Math.ceil(Math.random() * 3);
		// for (let index = 0; index < numberOfTime; index++) {
		// 	var indexs = Math.ceil(Math.random() * value.length - 1);
		// 	$(value[indexs]).prop('checked', true);
		// }

		var str = `<div style="margin-top:100px;">
										<i class="iconfont icon-ziyuan" style="font-size:30px;text-align:center;position: static;margin-top:40px;"></i>
										<p>选择您需要上传的背景图片</p>
									</div>`;
		$('#createUser-modal .bgImg').html(str);
		$('#createUser-modal .birthdate').val('');

		$('.J-datepicker-day1').datePicker({
			format: 'YYYY-MM-DD',
			// hasShortcut: true,
			min: '1900-01-01',
			max: moment(yesterdayTime).format('YYYY-MM-DD'),
			hide: function (value) {
				var val = $('.J-datepicker-day1 .c-datepicker-data-input').val();
				var date = moment().format('YYYY-MM-DD');
				if (value == 'clickBody') {
					$('.c-datepicker-popper').hide()
				} else if (value == 'confirm' && date == val) {
					var date = moment(yesterdayTime).format('YYYY-MM-DD')
					$('.J-datepicker-day1 .c-datepicker-data-input').val(date);
				}
				var bootstrapValidator = $("#createuser-form").data('bootstrapValidator');
				bootstrapValidator.updateStatus('birthdate', 'NOT_VALIDATED').validateField('birthdate');
				bootstrapValidator.updateStatus('monthLimit', 'NOT_VALIDATED').validateField('monthLimit');
			}
		});

		$('#createUser-modal .distpicker select').val('')
	})
	// 随机的6位密码
	var chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
		'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
		'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'
	];

	function generateMixed(n) {
		var res = "";
		for (var i = 0; i < n; i++) {
			var id = Math.ceil(Math.random() * 47);
			res += chars[id];
		}
		return res;
	}
	// 随机生成的11位数
	function RandomNumber() {
		var num = Math.random();
		var phone = String(num).substr(3, 9);
		var start = Math.ceil(Math.random() * 2);
		return (start + phone)
	};

	// 创建新用户的页面
	// 初始化时间		
	var nowTime = new Date().getTime();
	var yesterdayTime = nowTime - 24 * 60 * 60 * 1000;
	$('.J-datepicker-day1').datePicker({
		format: 'YYYY-MM-DD',
		// hasShortcut: true,
		min: '1900-01-01',
		max: moment(yesterdayTime).format('YYYY-MM-DD'),
		hide: function (value) {
			var val = $('.J-datepicker-day1 .c-datepicker-data-input').val();
			var date = moment().format('YYYY-MM-DD');
			if (value == 'clickBody') {
				$('.c-datepicker-popper').hide()
			} else if (value == 'confirm' && date == val) {
				var date = moment(yesterdayTime).format('YYYY-MM-DD')
				$('.J-datepicker-day1 .c-datepicker-data-input').val(date);
			}
			var bootstrapValidator = $("#createuser-form").data('bootstrapValidator');
			bootstrapValidator.updateStatus('birthdate', 'NOT_VALIDATED').validateField('birthdate');
			bootstrapValidator.updateStatus('monthLimit', 'NOT_VALIDATED').validateField('monthLimit');
		}
	});

	var createUserData = {}
	// 对表单进行校验 当点击创建按钮的时候进行表单校验
	$('.btn-set-up').click(function () {
		// var signData = getSignName()
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
				userLabel: {
					message: '用户的标签',
					validators: {
						choice: {
							min: 0,
							max: 10,
							message: '最多为10个'
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
				profession: {
					message: '用户职业',
					validators: {
						stringLength: {
							min: 0,
							max: 12,
							message: '职业的长度最大为12'
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
							max: 10,
							message: '用户昵称的长度是1到10'
						}
					}
				},
				birthdate: {
					message: '出生日期',
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
				// headImg1: {
				// 	message: '请选择用户的头像',
				// 	validators: {
				// 		notEmpty: {
				// 			message: '请选择用户的头像'
				// 		}
				// 	}
				// },
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
						stringLength: {
							min: 0,
							max: 25,
							message: '个性签名的长度为的1-25'
						}
					}
				},
				// emotion: {
				// 	message: '请选择情感状态',
				// 	validators: {
				// 		notEmpty: {
				// 			message: '请选择用户情感状态'
				// 		}
				// 	}
				// },
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

		// $('#createuser-form').data('bootstrapValidator').addField('liveplace-city', {
		// 	validators: {
		// 		message: "请选择用户居住地",
		// 		notEmpty: {
		// 			message: '请选择用户居住地'
		// 		}
		// 	}
		// });

		// $('#createuser-form').data('bootstrapValidator').addField('birth_city', {
		// 	validators: {
		// 		message: "请选择用的出生地",
		// 		notEmpty: {
		// 			message: '请选择用的出生地'
		// 		}
		// 	}
		// })

		var bv = $('#createuser-form').data('bootstrapValidator');

		bv.validate();

		if (bv.isValid()) {
			//  获取用户选中的标签
			var userLabel = $('.userLabel label input[type=checkbox]:checked');
			if (userLabel.length > 10) {
				$.message({
					type: 'error',
					message: '最多选择10个标签'
				});
				return;
			} else {
				var str = '';
				// 遍历
				for (let index = 0; index < userLabel.length; index++) {
					const element = userLabel[index];
					str += ',' + element.value;
				}
				createUserData.userLabel = str.substring(1, str.length)
			}
			$('#loading').show();
			// 获取上传用的数据
			createUserData.phone = $('.phone').val();
			createUserData.password = md5($('.password').val());
			createUserData.nickName = $('.nickname').val();
			createUserData.birthdate = $('.birthdate').val();
			createUserData.sex = +$('input[name = "sex"]:checked').val();
			createUserData.lat = lat;
			createUserData.lon = lon;
			createUserData.individualResume = $('.individualResume').val();
			createUserData.emotion = $('#emotion option:selected').val();
			// createUserData.liveplace = $('.liveplace-province').val() + ' ' + $('.liveplace-city').val();
			createUserData.registerChannel = $('input[name="registerChannel"]:checked').val();
			// createUserData.birthplace = $('.birth-province').val() + ' ' + $('.birth-city').val();
			// 用户的职业
			var profession = $('.profession').val();
			if (profession) {
				createUserData.profession = profession;
			} else {
				delete createUserData.profession;
			}

			var birProvince = $('.birth-province').val();
			var birCity = $('.birth-city').val();
			if (birProvince && birCity) {
				console.log('必须同时选中的')
				createUserData.birthplace = birProvince + ' ' + birCity
			}
			var liveProvince = $('.liveplace-province').val();
			var liveCity = $('.liveplace-city').val();

			if (liveProvince && liveCity) {
				createUserData.liveplace = liveProvince + ' ' + liveCity
			}
			if (!createUserData.userLabel) {
				delete createUserData.userLabel
			}
			// 判断用户是否选择头像了
			if (!headerImgFile) {
				console.log('没有上传选择头像');
				console.log(createUserData)
				if (createUserData.sex == 1) {
					createUserData.headImg = 'http://ly-prod.oss-cn-shanghai.aliyuncs.com/e7760ef4c51c428e90a0214daf109000.jpg';
				} else if (createUserData.sex == 2) {
					createUserData.headImg = 'http://ly-prod.oss-cn-shanghai.aliyuncs.com/e7760ef4c51c428e90a0214daf109001.jpg';
				}
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
				// 定义一个数住
				var flag = [];
				for (let index = 0; index < fileArr.length; index++) {
					var client = new OSS.Wrapper(UpdateForAli);
					// 上头像存储的路径
					var storeName = `images/${new Date().getFullYear()}/${addZero(new Date().getMonth() + 1)}/${addZero(new Date().getDate())}/${new Date().getFullYear()
						+ addZero(new Date().getMonth() + 1) + addZero(new Date().getDate()) + addZero(new Date().getHours()) + addZero(new Date().getMinutes()) + addZero(new Date().getSeconds()) +
						addMinZroe(new Date().getMilliseconds()) + String(Math.random()).substr(2, 8)}.jpg`;
					client.multipartUpload(storeName, fileArr[index], {
						mime: 'image/jpeg'
					}).then(function (res) {
						flag.push(res)
						if (index == 0) {
							// 这是上传的的是用户的头像
							var headeLink = res.res.requestUrls[0].split('?')[0];
							createUserData.headImg = headeLink;
						} else if (index == 1) {
							// 表示用户上传的背景图片
							var bgLink = res.res.requestUrls[0].split('?')[0];
							createUserData.bgImg = bgLink;
						}
						if (flag.length == 2) {
							createUsers(createUserData);
						}
					})
				}
			} else {
				// 表示用户没有上传背景图片
				if (fileArr[0]) {
					var client = new OSS.Wrapper(UpdateForAli);
					var storeName = `images/${new Date().getFullYear()}/${addZero(new Date().getMonth() + 1)}/${addZero(new Date().getDate())}/${new Date().getFullYear()
						+ addZero(new Date().getMonth() + 1) + addZero(new Date().getDate()) + addZero(new Date().getHours()) + addZero(new Date().getMinutes()) + addZero(new Date().getSeconds()) +
						addMinZroe(new Date().getMilliseconds()) + String(Math.random()).substr(2, 8)}.jpg`;
	
					client.multipartUpload(storeName, fileArr[0], {
						mime: 'image/jpeg'
					}).then(function (res) {
						var headeLink = res.res.requestUrls[0].split('?')[0];
						createUserData.headImg = headeLink;
						createUsers(createUserData)
					})
				}else {
					// 表示用户没有选择头像使用的默认的头像根据选择性别来判断
					createUsers(createUserData)
				}
			}
		}
	})

	// 创建用户的函数
	function createUsers(data) {
		console.log(data);
		// return;
		$.ajax({
			type: "post",
			url: adders + "/ly-manage/api/admin/registerAppUser",
			data: data,
			dataType: "json",
			xhrFields: { withCredentials: true },
			success: function (response) {
				recentTime();
				$('#loading').hide();
				if (response.succeed) {
					$.message('创建用户成功');
					$('#createUser-modal').modal('hide');
					// 重置输入的内容
					$('#createuser-form')[0].reset();
					$("#createuser-form").data('bootstrapValidator').destroy();
					$("#createuser-form").data('bootstrapValidator', null);
					$('.photo_user_img').attr('src', '../img/user_photo.jpg');

					robotListData(robotData);
					if (bgFile) {
						bgFile = '';
					}
				} else {
					$.message({
						type: 'error',
						message: response.errMsg
					})
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
		if (files.type.indexOf('image') != -1) {
			EXIF.getData(files, function () {
				var direction = EXIF.getTag(this, 'Orientation');
				PictureCompressions(files, direction, function (ele, filename) {
					$('#headImg-form img').attr('src', ele)
					headerImgFile = dataURLtoFile(ele, filename);
				})
			})
		} else {
			$.message({
				type: 'error',
				message: '不能选择视频'
			});
			bootstrapValidator.updateStatus('headImg1', 'INVALID', null).validateField('headImg1');
		}
	});


	var lon = '';
	var lat = '';

	$('.distinguish-now').change(function () {
		var province = $('.province').val();
		var city = $('.city').val();
		var distinguish = $('.distinguish').val();
		var adders = province + city + distinguish
		if (distinguish) {
			if (province == '台湾省') {
				$.ajax({
					type: "get",
					url: "http://restapi.amap.com/v3/geocode/geo",
					data: {
						key: 'd4532258ae4662e18c74b6de4d5cf99e',
						s: 'rsv3',
						address: adders
					},
					success: function (response) {
						var lonStart = response.geocodes[0].location.split(',')[0].split('.')[0]
						var latStart = response.geocodes[0].location.split(',')[1].split('.')[0]
						var lonEnd = response.geocodes[0].location.split(',')[0].split('.')[1]
						var latEnd = response.geocodes[0].location.split(',')[1].split('.')[1]
						var lonRandom = Math.random().toString().substr(2, 4);
						var latRandom = Math.random().toString().substr(2, 4);
						lon = lonStart + '.' + lonEnd.substr(0, 2) + lonRandom;
						lat = latStart + '.' + latEnd.substr(0, 2) + latRandom;
						createUserData.province = province;
						createUserData.city = city;
						createUserData.area = distinguish;
						createUserData.address = province + city + distinguish;
						createUserData.lon = lon;
						createUserData.lat = lat;
					}
				});
				return
			}
			$.ajax({
				type: "get",
				url: "http://restapi.amap.com/v3/geocode/geo",
				data: {
					key: 'd4532258ae4662e18c74b6de4d5cf99e',
					s: 'rsv3',
					address: adders
				},
				success: function (response) {
					var location = response.geocodes[0].location
					$('.distinguish-now').attr('location', location)
					var arr = response.geocodes[0].location.split(',');
					var lonStart = response.geocodes[0].location.split(',')[0].split('.')[0]
					var latStart = response.geocodes[0].location.split(',')[1].split('.')[0]
					// var lonEnd = response.geocodes[0].location.split(',')[0].split('.')[1]
					// var latEnd = response.geocodes[0].location.split(',')[1].split('.')[1]
					var lonRandom = Math.random().toString().substr(2, 6);
					var latRandom = Math.random().toString().substr(2, 6);
					lon = lonStart + '.' + lonRandom;
					lat = latStart + '.' + latRandom;
					location = lon + ',' + lat;
					createLonAndLat(location)
				}
			});

		}
	})

	// 创建用户是获取经纬度的函数
	function createLonAndLat(location) {
		$.ajax({
			type: "get",
			url: "https://restapi.amap.com/v3/geocode/regeo?parameters",
			// async: false,
			data: {
				key: '15b669f55b47d07c9c6d479807793c92',
				location: location
			},
			success: function (response) {
				var province = response.regeocode.addressComponent.province
				var city = response.regeocode.addressComponent.city
				var district = response.regeocode.addressComponent.district
				var address = response.regeocode.formatted_address
				if (province.length == 0) {
					var location1 = $('.distinguish-now').attr('location')
					var lon = location1.split(',')[0];
					var lat = location1.split(',')[1]
					var lonStart = lon.split('.')[0]
					var lonEnd = lon.split('.')[1].substr(0, 1)
					var latStart = lat.split('.')[0]
					var latEnd = lat.split('.')[1].substr(0, 1)
					var lonRandom = Math.random().toString().substr(2, 5);
					var latRandom = Math.random().toString().substr(2, 5);
					lon = `${lonStart}.${lonEnd}${lonRandom}`
					lat = `${latStart}.${latEnd}${latRandom}`
					location1 = lon + ',' + lat;
					createLonAndLat(location1)
					return
				} else {
					createUserData.province = province;
					if (city.length == 0) {
						city = province
					}
					createUserData.city = city;
					createUserData.area = district;
					createUserData.address = address;
					createUserData.lon = location.split(',')[0];
					createUserData.lat = location.split(',')[1];
					createUserData.address = address;
				}
			}
		});
	}
	var bgFile = '';
	$('.user-bg').click(function () {
		$('.bg-file').click();

	})

	$('.bg-file').change(function (e) {
		var file = e.target.files[0];
		// 在这这里对用户背景图片进行压缩
		if (file.type.indexOf('image') != -1) {
			EXIF.getData(file, function () {
				var direction = EXIF.getTag(this, 'Orientation');
				PictureCompressions(file, direction, function (ele, filename) {
					var str = `<img src='${ele}' style="width:100%;height:250px;"/>`
					$('.user-bg').html(str)
					bgFile = dataURLtoFile(ele, filename);
				})
			})

		} else {
			$.message({
				type: 'error',
				message: '请选择图片'
			})
		}
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
		// 隐藏发布动态的模态框
		// $('#createDynamicMadal').modal('hide');
		// 重置上一次的选择的
		$(' #createuser-form .adders').distpicker('reset', true);
		$(' #createuser-form .liveAdd').distpicker('reset', true);
		$(' #createuser-form .birthAdd').distpicker('reset', true);
		// 删除上一次预览的图片
		// 更新校验规则
		$('#createuser-form')[0].reset();
		$("#createuser-form").data('bootstrapValidator').destroy();
		$("#createuser-form").data('bootstrapValidator', null);
	});

	$(document).on('change', '#emotion', function () {
		var val = this.value;
		$('#emotions').attr('emotion', val)
	})

	// 新增动态的功能
	// 给新增动态点击事件
	$(document).on('click', '.createDynamic', function(){
		var selectEle = $('.checked-item input[type=checkbox]:checked')
		var len  = selectEle.length;
		if (len > 1) {
			$.message({
				type: 'error',
				message: '最多只能选一位用户'
			});
			return;
		} else if (len == 1) {
			console.log('选中了一个')
			console.log(selectEle[0])
			var id = $(selectEle[0]).attr('data-userid')
			console.log(id)
			$('#userid').val(id)
			$('#userid').attr('disabled', 'true')
			// 获取STS
			getSts(id);
			$.ajax({
				type: "get",
				cache: false,
				url: adders + "/ly-manage/api/admin/queryNickName",
				data: { userId: id },
				dataType: "json",
				xhrFields: { withCredentials: true },
				success: function (response) {
					if (response.succeed == true) {
						recentTime();
						nickName = response.data;
						queryNiackName = true
					} else {
						if (response.errCode == 410) {
							$.message({
								type: 'error',
								message: response.errMsg
							})
							return;
						} else if (response.errCode == 403) {
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
			$('#userid').removeAttr('disabled', 'false')
			console.log('meiyoxuan')
		}
		$('#createDynamicMadal').modal('show')
	})

	// 新增动态
	var icon = document.querySelector('.icon');
	var icon2 = document.querySelector('.icon2');
	var icon3 = document.querySelector('.icon3');
	var icon4 = document.querySelector('.icon4');
	console.log(icon)
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
	// 视频时长
	var duration = '';
	// 动态类型
	var dynamicType = '';
	// 初始化client所需要的数据
	var clientData = {};
	// 发布动态需要的参数
	var ajaxdata = {};
	// 经纬度的字符串
	var location = '';
	var add = '';
	var videos = [];

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
			console.log(1)
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
						// var nickNames = ' @' + nickName + ' ';
						// textWidth = context.measureText(nickNames);
						// var x = 26 / 375 * targetWidth;
						context.rotate(Math.PI / 2);
						context.drawImage(img, 0, -targetWidth, targetHeight, targetWidth);
						context.scale(2, 2); // 将canvas放大两倍
						// context.drawImage(icon3, (targetHeight - 37) / 2, (-targetWidth + textWidth.width) / 2, 17, x / 2);
						// // 绘制用户的昵称
						// context.scale(0.5, 0.5); // 缩小到原来的大小
						// context.rotate(3 * Math.PI / 2);
						// context.fillText(nickNames, targetWidth - textWidth.width, targetHeight - 10);
						break;
					case 1:
						context.fillStyle = '#fff';
						context.shadowColor = 'rgba(0, 0, 0, 0.8)';
						context.shadowOffsetX = 0;
						context.shadowOffsetY = 0.3;
						context.shadowBlur = 1;
						var fontsize = Math.floor(17 / 375 * targetWidth);
						context.font = `${fontsize}px PingFangSC`;
						// var nickNames = ' @' + nickName + ' ';
						// // 获取文字的长度
						// var textWidth = context.measureText(nickNames);
						context.drawImage(img, 0, 0, targetWidth, targetHeight);
						context.scale(2, 2);
						// var x = 26 / 375 * targetWidth;
						// var y = Math.floor(17 / 375 * targetWidth);

						// context.drawImage(icon, (targetWidth - x - textWidth.width) / 2, (targetHeight - 6 - y) / 2, x / 2, y / 2);
						// context.scale(0.5, 0.5);
						// context.fillText(nickNames, targetWidth - textWidth.width, targetHeight - 4 - y / 4);
						break;
					case undefined:
						context.fillStyle = '#fff';
						context.shadowColor = 'rgba(0, 0, 0, 0.8)';
						context.shadowOffsetX = 0;
						context.shadowOffsetY = 0.3;
						context.shadowBlur = 1;
						var fontsize = Math.floor(17 / 375 * targetWidth);
						context.font = `${fontsize}px PingFangSC`;
						// var nickNames = ' @' + nickName + ' ';
						// // 获取文字的长度
						// var textWidth = context.measureText(nickNames);
						context.drawImage(img, 0, 0, targetWidth, targetHeight);
						context.scale(2, 2);
						// if (flag) {
							// var x = 26 / 375 * targetWidth;
							// var y = 17 / 375 * targetWidth;
							// context.drawImage(icon, (targetWidth - x - textWidth.width) / 2, (targetHeight - y - 4) / 2, x / 2, y / 2);
						// } else {
							// var x = (26 / 375) * targetWidth;
							// var y = (17 / 375) * targetWidth;
							// context.drawImage(icon, (targetWidth - x - textWidth.width) / 2, (targetHeight - 6 - y) / 2, x / 2, y / 2);
						// }
						// context.scale(0.5, 0.5);
						// context.fillText(nickNames, targetWidth - textWidth.width, targetHeight - y / 4);
						// context.getImageData
						break;
					case 3:
						context.fillStyle = '#fff';
						context.shadowColor = 'rgba(0, 0, 0, 0.8)';
						context.shadowOffsetX = 0;
						context.shadowOffsetY = 0.3;
						context.shadowBlur = 1;
						var fontsize = Math.floor(17 / 375 * targetWidth);
						context.font = `${fontsize}px PingFangSC`;
						// var nickNames = ' @' + nickName + ' ';
						// // 获取文字的长度
						// var textWidth = context.measureText(nickNames);
						context.rotate(Math.PI);
						context.drawImage(img, 0, 0, -targetWidth, -targetHeight);
						context.scale(2, 2);
						// var x = 26 / 375 * targetWidth;
						// var y = 17 / 375 * targetWidth;
						// context.rotate(Math.PI);
						// context.drawImage(icon, (targetWidth - x - textWidth.width) / 2, (targetHeight - y - 6) / 2, x / 2, y / 2);
						// context.scale(0.5, 0.5);
						// context.fillText(nickNames, targetWidth - textWidth.width, targetHeight - y / 4);
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
				$(dynamicImg).attr('index-img', index)
				// 将压缩的后的图片渲染到页面中
				// $('.selectImg').append(dynamicImg)
				$('.upload-btn').before(`<div class="upload-item" style="display:inline-block;margin-right:5px;">
							<img src="${element}" index-video='1'>
						</div>`)
				var uploadImg = dataURLtoFile(element, filename);
				// 将上传的图片存放到数组中
				uploadImgs.push(uploadImg);
				$('#file-upload').val('');
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
			videos.push(file)
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
				$('#createDynamicMadal .video').html('');
				$('#createDynamicMadal .video').append(video);
				// 当video加载完成时获取的
				$('#createDynamicMadal .video video')[0].onloadedmetadata = function () {
					videoHeight = $(this).height();
					videoWidth = $(this).width();
				}
				$('#createDynamicMadal .video video')[0].play();
				var index = 0;
				$('#createDynamicMadal .video video')[0].ontimeupdate = function () {
					if (index == 2) {
						var time = Math.floor(this.duration);
						if (time > 10) {
							$.message({
								type: 'error',
								message: '视频时间最多为10s'
							});
							// 清除上一次选择的文件 使用第二次选择的文件跟第一次选择的是一样的 使file表单可以触发change事件
							$('#file-upload').val('');
							videos = [];
							videoElement = '';
							dynamicType = 1;
							index++;
							this.ontimeupdate = null;
							return;
						} else {
							var canvas = document.createElement('canvas');
							canvas.width = videoWidth;
							canvas.height = videoHeight;
							var context = canvas.getContext('2d');
							context.fillStyle = '#000';
							context.drawImage(this, 0, 0, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);
							var src = canvas.toDataURL('image/jpeg');
							// 将视频的缩略图渲染到页面中
							if (src != 'data:,') {
								var dynamicImg = new Image();
								dynamicImg.src = src;
								$(dynamicImg).attr('index-video', '1');
								// 将压缩的后的图片渲染到页面中
								$('.upload-btn').before(`<div class="upload-item upload-items" style="display:inline-block;margin-right:5px;">
							<img src="${src}" index-video='2'>
						</div>`)
								thumbnailImg = dataURLtoFile(src, 'thumbnailImg.jpeg');
								duration = time;
								this.ontimeupdate = null;
								$('#file-upload').val('');
							}
						}
					}
					index++;
				}
			}
		}
	}

	// 获取sts
	function getSts(id) {
		var str = localStorage.getItem('sts');
		var STS = JSON.parse(str);
		var now = new Date().getTime();
		if (str) {
			if (now - STS.timeout > 55 * 60 * 1000) {
				$.ajax({
					type: "post",
					url: adders + "/ly-manage/api/oss/getSTSCredentials",
					dataType: "json",
					xhrFields: { withCredentials: true },
					success: function (response) {
						// 设置一个过期的时间
						if (response.succeed) {
							recentTime()
							response.timeout = new Date().getTime();
							// 将数据保存在下来
							var dataStr = JSON.stringify(response);
							localStorage.setItem('sts', dataStr);
							clientData.accessKeyId = response.data.accessKeyId;
							clientData.region = 'oss-cn-shanghai';
							clientData.bucket = response.data.bucketName;
							clientData.stsToken = response.data.securityToken;
							clientData.accessKeySecret = response.data.accessKeySecret;
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
				clientData.accessKeyId = STS.data.accessKeyId;
				clientData.region = 'oss-cn-shanghai';
				clientData.bucket = STS.data.bucketName;
				clientData.stsToken = STS.data.securityToken;
				clientData.accessKeySecret = STS.data.accessKeySecret;
			}
		} else {
			$.ajax({
				type: "post",
				url: adders + "/ly-manage/api/oss/getSTSCredentials",
				dataType: "json",
				xhrFields: { withCredentials: true },
				success: function (response) {
					// 设置一个过期的时间
					if (response.succeed) {
						recentTime()
						response.timeout = new Date().getTime();
						// 将数据保存在下来
						var dataStr = JSON.stringify(response);
						localStorage.setItem('sts', dataStr);
						clientData.accessKeyId = response.data.accessKeyId;
						clientData.region = 'oss-cn-shanghai';
						clientData.bucket = response.data.bucketName;
						clientData.stsToken = response.data.securityToken;
						clientData.accessKeySecret = response.data.accessKeySecret;
					} else {
						if (response.errCode == 403) {
							localStorage.removeItem('recentTime');
							document.location.href = '../../login.html?timeout';
						} else {
							$.message({
								type: 'error',
								message: response.errMsg
							})
							return;
						}
					}
				}
			});
		}
	}

	var queryNiackName = false
	$('#userid').change(function () {
		queryNiackName = false
		var userId = $(this).val();
		if (userId == '') {
			// 
			$.message({
				type: 'error',
				message: '请输入用户id'
			})
			return;
		} else {
			// 获取sts;
			getSts(userId);
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
						queryNiackName = true
					} else {
						if (response.errCode == 410) {
							$.message({
								type: 'error',
								message: response.errMsg
							})
							// 清空之前输入的数据
							$('#userid').val('');
							// 重置之前校验
							$("#addDynamic").data('bootstrapValidator').destroy();
							$('#addDynamic').data('bootstrapValidator',null);
							// queryNiackName = false
							return;
						} else if (response.errCode == 403) {
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

	// 给发布注册点击事件
	$('.dynamicPublish').click(function () {
		// 定义一个校验器
		$('#addDynamic').bootstrapValidator({
			fields: {
				userid: {
					message: '请输入脸影号',
					validators: {
						notEmpty: {
							message: '请输入脸影号'
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
							regexp: /^[0-9]\d{0,7}$/,
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
							regexp: /^[0-9]\d{0,7}$/,
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
							regexp: /^[0-9]\d{0,7}$/,
							message: '1-99999999之间的正整数'
						}
					}
				}
			}
		});

		$('#addDynamic').data('bootstrapValidator').addField('area', {
			validators: {
				message: '请选择你的发布地址',
				notEmpty: {
					message: '请选择你的发布地址'
				}
			}
		})

		var bv = $('#addDynamic').data('bootstrapValidator');

		bv.validate();
		if (!bv.isValid()) {
			return;
		}
		if (!queryNiackName) {
			return
		}
		$('#loading .loading-item p').text('正在发布');
		$('#loading').show();
		// 获取用户上传的数据
		userId = $('#userid').val();
		if (userId == '') {
			$.message({
				type: 'error',
				message: '请输入脸影号'
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
		var city = $('#createDynamicMadal .city').val();
		if (city == '') {
			// 提示用户的输入的
			$.message({
				type: 'error',
				message: '请选择城市'
			})
			return;
		}
		// 发布时间
		ajaxdata.publishTime = new Date().getTime();
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
		// 视频的宽高的
		if (videoElement != '') {
			// 表示上传的是视频
			ajaxdata.dynamicType = 3;
			ajaxdata.videoWidth = videoWidth;
			ajaxdata.videoHeight = videoHeight;
			ajaxdata.duration = duration;
			// 将视频和缩略图发在一个数
			videosArr = [];
			if (thumbnailImg) {
				videosArr.push(thumbnailImg);
			}
			if (videoElement) {
				videosArr.push(videoElement);
			}
			// 上传视频和视频缩略图
			videosArr.forEach(async function (item) {
				var client = new OSS.Wrapper(clientData);
				// 判断用户上传的是缩略图还是视频
				var mime = item.name.split('.')[1];
				if (item.type.split('/')[0] == 'video') {
					var storeName = `videos/${new Date().getFullYear()}/${addZero(new Date().getMonth() + 1)}/${addZero(new Date().getDate())}/${new Date().getFullYear()
						+ addZero(new Date().getMonth() + 1) + addZero(new Date().getDate()) + addZero(new Date().getHours()) + addZero(new Date().getMinutes()) + addZero(new Date().getSeconds()) +
						addMinZroe(new Date().getMilliseconds()) + String(Math.random()).substr(2, 8)}.${mime}`;
					var contentType = 'video/mp4';
				} else {
					var storeName = `images/${new Date().getFullYear()}/${addZero(new Date().getMonth() + 1)}/${addZero(new Date().getDate())}/${new Date().getFullYear()
						+ addZero(new Date().getMonth() + 1) + addZero(new Date().getDate()) + addZero(new Date().getHours()) + addZero(new Date().getMinutes()) + addZero(new Date().getSeconds()) +
						addMinZroe(new Date().getMilliseconds()) + String(Math.random()).substr(2, 8)}.jpg`;
					var contentType = 'image/jpeg';
				}
				// 进行上传
				let link = await client.multipartUpload(storeName, item, {
					mime: contentType
				})
				let links = link.res.requestUrls[0].split('?')[0];
				if (mime == 'jpeg') {
					ajaxdata.thumbnailImg = links
				} else {
					ajaxdata.photo1 = links;
					Releasedynamics(ajaxdata);
				}
			});
			$.message('正在发布动态');
		} else if (uploadImgs.length > 0) {
			ajaxdata.dynamicType = 2;
			if (uploadImgs.length > 9) {
				$.message({
					type: 'error',
					message: '最多上传9张图片,请重新选择图片'
				});
				return;
			}
			var loadingArr = [];
			uploadImgs.forEach(async function (item, index) {
				var lastItem = uploadImgs.length;
				if (item != '') {
					UploadPicturesForAli(item, index, ajaxdata, loadingArr);
					var keys = `photo${index + 1}`;
				}
			})

		} else {
			ajaxdata.dynamicType = 1;
			if (ajaxdata.message == '') {
				$.message({
					type: 'error',
					message: '请输入动态内容'
				});
				$('#loading').hide();
				return;
			} else {
				Releasedynamics(ajaxdata)
			}
		}
	})

	// 给select注册change事件来获取经纬度
	$('.last').change(function () {
		var province = $('.province-select ').val();
		var city = $('.city-select').val();
		var district = $(this).val();
		add = province + city + district;
		$('.publishAdd').val(province + city + district);
		// 选择不同的城市的就去获取对应的经纬度
		if (district) {
			getItude(province + city + district);
		}
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
				// 判断用选择的是不是的台湾省
				if (adderss.indexOf('台湾省') != -1){
					// 进行三位的随机数
					var arr = response.geocodes[0].location.split(',');
					lon = arr[0];
					lat = arr[1];
					var lonStart = lon.split('.')[0]
					var lonEnd = lon.split('.')[1].substr(0, 1)
					var lonRandom = Math.random().toString().substr(3, 3)
					var latStart = lat.split('.')[0]
					var latEnd = lat.split('.')[1].substr(0, 2)
					var latRandom = Math.random().toString().substr(3, 3);
					location = lon + "," + lat;
					locations = `${lonStart}.${lonEnd}${lonRandom},${latStart}.${latEnd}${latRandom}`;
					Realaddress(locations, location)
					return;
				}
				// 获取经纬
				var arr = response.geocodes[0].location.split(',');
				lon = arr[0];
				lat = arr[1];
				// 随机五位
				var lonStart = lon.split('.')[0]
				var lonEnd = lon.split('.')[1].substr(0, 1)
				var lonRandom = Math.random().toString().substr(3, 5)
				var latStart = lat.split('.')[0]
				var latEnd = lat.split('.')[1].substr(0, 2)
				var latRandom = Math.random().toString().substr(3, 5);
				// 随机之前的经纬度
				location = lon + "," + lat;
				// 随机后的经纬度
				locations = `${lonStart}.${lonEnd}${lonRandom},${latStart}.${latEnd}${latRandom}`;
				Realaddress(locations, location)
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
	function Realaddress(loactions, location) {
		$.ajax({
			type: "get",
			url: "https://restapi.amap.com/v3/geocode/regeo?parameters",
			data: {
				key: '15b669f55b47d07c9c6d479807793c92',
				location: loactions
			},
			success: function (response) {
				// 判断是不是台湾省
				if (response.regeocode.addressComponent.province =='台湾省') {
					ajaxdata.realAddress = response.regeocode.formatted_address;
					ajaxdata.lon = loactions.split(',')[0]
					ajaxdata.lat = loactions.split(',')[1]
					ajaxdata.city = $('.city-select').val();
					return;
				}
				var province = response.regeocode.addressComponent.province;
				if (province.length == 0) {
					// 进行 随机四位数
					var lonStart = location.split(',')[0].split('.')[0]
					var lonEnd = location.split(',')[0].split('.')[1].substr(0, 2)
					var lonRandom = Math.random().toString().substr(3, 4);
					var latStart = location.split(',')[1].split('.')[0]
					var latEnd = location.split(',')[1].split('.')[1].substr(0, 2)
					var latRandom = Math.random().toString().substr(3, 4)
					var newLocation = `${lonStart}.${lonEnd}${lonRandom},${latStart}.${latEnd}${latRandom}`;
					Realaddress(newLocation, location)
					return
				}
				ajaxdata.realAddress = response.regeocode.formatted_address;
				ajaxdata.lon = loactions.split(',')[0]
				ajaxdata.lat = loactions.split(',')[1]
				ajaxdata.city = response.regeocode.addressComponent.city;
				// 香港 澳门
				if (response.regeocode.addressComponent.city.length == 0) {
					ajaxdata.city = response.regeocode.addressComponent.province;
				}
				// 判断是不是香港和澳门
			}
		});
	}

	$('#message').blur(function () {
		if (this.value.length >= 500) {
			$.message({
				type: 'error',
				message: '内容不能超过的500字,'
			})
			return;
		}
	})

	$('#upload .upload-btn').click(function () {
		$('#file-upload').click();
	})
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
	// 压缩之前的对象
	$('#file-upload').change(function (e) {
		if (videos.length >= 1) {
			$.message({
				type: 'error',
				message: '最多只能上传一个视频'
			});
			this.value = '';
			return;
		}
		if (nickName != '') {
			var files = e.target.files;
			// 先遍历一遍
			var flags = true;
			for (let index = 0; index < files.length; index++) {
				let element = files[index]
				if (flags) {
					if (element.type == 'video/mp4') {
						flags = false
					}
				} else {
					$.message({
						type: 'error',
						message: '只能选择1个视频'
					})
					$('#file-upload').val('');
					return;
				}
			}
			if (files.length > 9) {
				$.message({
					type: 'error',
					message: '最多上传9张图片或者一个视频'
				});
				$('#file-upload').val('');
				return;
			} else {
				if (uploadImgs.length + files.length > 9) {
					$.message({
						type: 'error',
						message: '上传的图片不能超过9张'
					});
					$('#file-upload').val('');
					return;
				} else {
					var arrFlag = [];
					for (let index = 0; index < files.length; index++) {
						const element = files[index];
						var type = element.type;
						if (type == 'video/mp4') {
							arrFlag[0] = 'video';
						} else if (type.indexOf('image') == 0) {
							arrFlag[1] = 'image';
						}
						//  这里是处理的先选择图片(视频)后选择视频(图片)
						if (type.indexOf('video') != -1 && uploadImgs.length != 0) {
							$.message({
								type: 'error',
								message: '不能同时选择视频和图片'
							})
							$('#file-upload').val('');
							return;
						}
					}
					// 处理同时选择图片,视频的
					for (let index = 0; index < files.length; index++) {
						const element = files[index];
						if (arrFlag[0] == 'video' && arrFlag[1] == 'image') {
							$.message({
								type: 'error',
								message: '不能同时选择视频和图片'
							});
							$('#file-upload').val('');
							return;
						} else {
							// 在这里获取图片的方向
							getOrientation(element, function (direction) {
								var direction = direction
								PictureCompression(element, index, direction);
							})
						}
					}
				}
			}
		} else {
			$.message({
				type: 'error',
				message: '请输入用户id'
			})
			console.log(2)
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
					$('#loading').hide();
					$.message('动态发布成功');
					// 清除上次的 
					ajaxdata = {};
					uploadImgs = [];
					videoElement = '';
					thumbnailImg = '';
					duration = '';
					loadingArr = [];
					videoHeight = '';
					videoWidth = '';
					nickName = '';
					// 隐藏发布动态的模态框
					$('#createDynamicMadal').modal('hide');
					// 更新校验规则
					$('#addDynamic')[0].reset();
					$("#addDynamic").data('bootstrapValidator').destroy();
					$("#addDynamic").data('bootstrapValidator', null);
					// 删除上一次预览的图片
					$('.upload-item').remove();
					// 刷新动态列表
					// getData(obj)
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


	// 删除对应的图片给点击删除
	$(document).on('click', '.upload-item img', function () {
		// 先获取
		Imgitem = $(this).parent().children();
		for (let index = 0; index < Imgitem.length; index++) {
			const element = Imgitem[index];
			$(element).attr('index-img', index)
		}
		// // 获取图片在数组中的索引
		var index = $(this).attr('index-img');
		var index_v = $(this).attr('index-video');
		if (index_v == '2') {
			// 表示上传的的视频 删除视频对象 和视频缩略图对象
			videoElement = '';
			thumbnailImg = '';
			duration = '';
			videos = [];
			$.message('删除视频成功,若上传视频请重新选择');
			$(this).parent().remove();
		} else {
			uploadImgs.splice(index, 1);
			$(this).parent().remove();
			$.message('删除成功');
		}
	});

	// 上传的函数
	async function UploadPicturesForAli(file, key, parmas, loadingArr) {
		var client = new OSS.Wrapper(clientData)
		// 图片存放在阿里云中路径
		var storeName = `images/${new Date().getFullYear()}/${addZero(new Date().getMonth() + 1)}/${addZero(new Date().getDate())}/${new Date().getFullYear()
			+ addZero(new Date().getMonth() + 1) + addZero(new Date().getDate()) + addZero(new Date().getHours()) + addZero(new Date().getMinutes()) + addZero(new Date().getSeconds()) +
			addMinZroe(new Date().getMilliseconds()) + String(Math.random()).substr(2, 8)}.jpg`;
		var contentType = 'image/jpeg';
		var keys = `photo${key + 1}`
		let result = await client.multipartUpload(storeName, file, {
			mime: contentType
		});
		// 上传的图片是头像还是背景图还是照片墙中的
		let links = await result.res.requestUrls[0].split('?')[0];
		loadingArr.push(links);

		var keys = `photo${key + 1}`
		parmas[keys] = await links;

		if (uploadImgs.length == loadingArr.length) {
			Releasedynamics(ajaxdata);
		}
	}

	// 发布动态隐藏
	$('#createDynamicMadal').on('hidden.bs.modal', function (e) {
		ajaxdata = {};
		uploadImgs = [];
		videoElement = '';
		thumbnailImg = '';
		duration = '';
		loadingArr = [];
		videoHeight = '';
		videoWidth = '';
		videos = [];
		$('#loading').hide();
		// 隐藏发布动态的模态框
		$('#createDynamicMadal').modal('hide');
		// 删除上一次预览的图片
		$('.upload-item').remove();
		$(' #createDynamicMadal .distpicker').distpicker('reset');
		// 更新校验规则
		$('#addDynamic')[0].reset();
		$("#addDynamic").data('bootstrapValidator').destroy();
		$("#addDynamic").data('bootstrapValidator', null);
	})
})