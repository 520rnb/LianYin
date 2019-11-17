
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
	var all = permissions(sidebar.data, 30102)
	//  这里是机器人动态列表
	// 开始的时间和结束的时间
	var beginDate = '';
	var endDate = '';
	var obj = {
		pageNum: 1,
		pageSize: 10,
		type: 2 // 默认值 获取机器人动态
	}
	// 默认一页10条数据
	// 发送ajax请求获取数据
	getData(obj)
	function getData(obj) {
		//  默认是不传递时间和用的id的  调用了301动态列表接口
		$.ajax({
			type: "get",
			cache: false,
			url: adders + "/ly-manage/api/dynamic/dynamicList",
			data: obj,
			dataType: "json",
			xhrFields: { withCredentials: true },
			success: function (response) {
				$('#load').hide();
				recentTime();
				if (response.succeed) {
					all.forEach(function(item) {
						response.data[item.menuId] = item.menuName
					})
					if (response.data.total) {
						var html = template('tmp-super', response);
						$('.appuser').html(html);
						$('[data-toggle="tooltip"]').tooltip()
						p.render({ count: response.data.total, pagesize: obj.pageSize, toolbar: true, current: obj.pageNum })
						$('#pageTool').show();
					} else {
						var html = template('no-data', response);
						$('.appuser').html(html);
						$('#pageTool').hide();
					}
				} else {
					if (response.errCode === 403) {
						localStorage.removeItem('recentTime');
						// 当用户身份登录过期是 自动跳转到登录页面
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

	//  初始化时间控件
	$('.J-datepicker-day').datePicker({
		max: moment(new Date()).format('YYYY-MM-DD'),
		isRange: true, // 是否开启时间选择 默认是false 选择
		format: 'YYYY-MM-DD',
		min: minDate
	});


	// 给查看按钮注册点击事件 来获取用户的时间 用户id 和动态id
	$('.checkapp').click(function () {
		// 获取用户的选择的开始和结束的时间
		var beginDate = $('.beginDate').val();
		var endDate = $('.endDate').val();
		var userId = $('.userid').val();
		var dynamicid = $('.dynamicid').val();
		//  当用户的没有选用的对应的参数是 就不要将参数传递过去
		if (beginDate != '') {
			obj.beginDate = beginDate + ' 00:00:00';
		} else {
			// 清空结束框的值
			$('.endDate').val('');
			delete obj.beginDate;
			delete obj.endDate;
		}
		if (endDate != '') {
			obj.endDate = endDate + ' 23:59:59';
		} else {
			$('.beginDate').val('');
			delete obj.beginDate;
			delete obj.endDate;
		}
		if (userId != '') {
			var reg = /^\d{9,10}$/;
			if (!reg.test(userId)) {
				$.message({
					type: 'error',
					message: '请输入正确的脸影号'
				})
				return
			}
			obj.userId = userId;
		} else {
			delete obj.userId;
		}

		if (dynamicid) {
			if (Number.parseInt(dynamicid) > 0) {
				obj.dynamicId = dynamicid;
			} else {
				$.message({
					type: 'error',
					message: '请输入正确的动态id'
				})
				return
			}
		} else {
			delete obj.dynamicId
		}
		obj.pageNum = 1;
		$('#load').show()
		getData(obj)
	})
	// 重置按钮的事件
	$('.rest').click(function () {
		$('.beginDate').val('');
		$('.endDate').val('');
		$('.userid').val('');
		$('.dynamicid').val('');
		$('.dynamicType').find('.item').prop('selected', true);
		//  删除用户选择的城市
		$('.cityTypes select')[0].options[0].selected = true;
		$('.cityTypes select')[1].options[0].selected = true;
		//  删除的对象的 某些属性的
		delete obj.dynamicType;
		delete obj.city;
		delete obj.beginDate;
		delete obj.endDate;
		delete obj.dynamicId;
		delete obj.userId;
		obj.pageNum = 1;
		// pages = 1;
	})

	// 获取的评论数据的参数
	var commentData = {
		dynamicId: '',
		pageNum: '',
		pageSize: 10
	}
	// 这是删除用户动态的id
	var delDynamicId = '';
	//给app用户动态的数据 中的 删除按钮注册点击事件
	$(document).on('click', '.delete-dynamic', function () {
		// 获取选中的表单
		var inputItem = $('#table tbody input:checked');
		var str = '';
		for (let index = 0; index < inputItem.length; index++) {
			const element = inputItem[index];
			if (index == 0) {
				str += $(element).attr('data-dynamicid')
			} else {
				str += ',' + $(element).attr('data-dynamicid')
			}
		}
		// 判断用户是否选择了
		if (inputItem.length == 0) {
			$.message({
				type: 'error',
				message: '请选择被删除的动态'
			});
			return;
		} else {
			delDynamicId = str;
		}
		$('#del-tips').modal('show');
		flages = true
		$('#tips .modal-body').html('是否删除这条动态');
	})

	// 全选事件的按钮
	$(document).on('click', '.checked-all', function () {
		var flag = $(this).prop('checked')
		if (flag) {
			$('.check-item').prop('checked', true)
		} else {
			$('.check-item').prop('checked', false)
		}

	})

	// tbody 下面的tr注册点击事件
	$(document).on('click', 'table tbody tr', function () {
		var self = $(this).find('input').prop("checked")
		if (self) {
			$(this).find('input').prop("checked", false)
		} else {
			$(this).find('input').prop("checked", true)
		}
		var flag
		var ele = $('tbody').find('.check-item')
		for (let index = 0; index < ele.length; index++) {
			const element = ele[index];
			flag = $(element).prop('checked')
			if (!flag) {
				break;
			}
		}
		if (flag) {
			$('.checked-all').prop('checked', true)
		} else {
			$('.checked-all').prop('checked', false)
		}
	})
	var flages = true
	// 删除动态
	$('#del-tips .yes').click(function () {
		if (flages == false) {
			return
		}
		$('.loading .loading-item p').text('正在删除');
		$('.loading').show()
		var idArr = delDynamicId.split(',')
		flages = false
		// return
		setTimeout(function(){
			for (let index = 0; index < idArr.length; index++) {
				const element = idArr[index];
				$.ajax({
					type: "post",
					url: adders + "/ly-manage/api/dynamic/delDynamic",
					data: {
						dynamicId: element
					},
					async: false,
					dataType: "json",
					xhrFields: { withCredentials: true },
					success: function (response) {
						$('#del-tips').modal('hide');
						if (response.succeed) {
							if (idArr.length - 1 == index) {
								recentTime();
								$('.loading').hide()
								$.message('动态删除成功');
								obj.pageNum = 1;
								getData(obj)
							}
						} else {
							if (idArr.length - 1 == index) {
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
					}
				});
			}
		}, 500)
	})
	// 查看动态详情的
	$(document).on('click', '.check-dynamic', function () {
		var inputItem = $('#table tbody input:checked');
		if (inputItem.length == 0) {
			$.message({
				type: 'error',
				message: '请选择被查看的动态'
			});
			return;
		} else if (inputItem.length > 1) {
			$.message({
				type: 'error',
				message: '最多只能选择一个'
			});
			return;
		}
		// 获取动态的id
		var dynamicId = inputItem.attr('data-id');
		$('#commentDetails').modal('show');
		commentData.pageNum = $(this).attr('data-pagenum')
		commentData.dynamicId = +dynamicId;
		$.ajax({
			type: "get",
			cache: false,
			url: adders + "/ly-manage/api/dynamic/dynamicDetails",
			data: {
				dynamicId: dynamicId,
			},
			dataType: "json",
			xhrFields: { withCredentials: true },
			success: function (response) {
				if (response.succeed) {
					recentTime();
					var html = template('tmp-personal', response);
					$('#commentDetails .modal-body').html(html);
					$('#commentDetails .modal-body .btn-more').attr('data-pagenum', '1')
					getCommentData(commentData)
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

	// 初始化分页
	var p = new Paging();
	p.init({
		target: '#pageTool', pagesize: 10, count: 10, toolbar: true, changePagesize: function (page, num) {
			// pages = 1;
			obj.pageNum = 1;
			// current = 1;
			obj.pageSize = page
			getData(obj)
		},
		callback: function (page, size, count) {
			// pages = page
			// 获取数据进行渲染
			obj.pageNum = page;
			obj.pageSize = size;
			getData(obj)
		}
	})


	// 给btn-more注册点击时间
	$('#commentDetails').on('click', '.btn-more', function () {
		var pageNum = +$(this).attr('data-pageNum');
		commentData.pageNum = pageNum;
		// 判断用户之前是否查看了更多的二级评论
		if (commentData.commentId != '') {
			delete commentData.commentId
		}
		getCommentData(commentData);
	});
	// 判断是谁登录
	function isWho() {
		// 判断登录的用户是超级管理员还是普通管理员
		var userId = localStorage.getItem('info');
		userId = JSON.parse(userId);
		userId = userId.data.roleType;
		return userId
	}

	// 获取评论的数据
	function getCommentData(commentData) {
		$.ajax({
			type: "get",
			cache: false,
			url: adders + "/ly-manage/api/dynamic/dynamicCommentList",
			data: commentData,
			dataType: "json",
			xhrFields: { withCredentials: true },
			success: function (response) {
				if (response.succeed) {
					recentTime();
					// 先获取的btn-more上的data-pageNum的值
					var pagenum = + $('.btn-more').attr('data-pagenum');
					// 获取的值加上一
					$('.btn-more').attr('data-pagenum', pagenum + 1);
					// if (response.data.total == el) {
					if (pagenum == response.data.pages || response.data.data.length < 10) {
						$('.btn-more').text('没有更多评论了');
						$('.btn-nothing').removeClass('btn-more')
						// 将pageNum的值变成初始状态的
						commentData.pageNum = 1;
					}
					// var userid = isWho();
					// if (userid == 1 || userid == 2) {
						var html = template('temp-comment', response)
						$('#commentDetails .comment').append(html);
					// } else if (userid == 3) {
						// 管理员
					// 	var html = template('temp-comment1', response)
					// 	$('#commentDetails .comment').append(html);
					// }
					// 将数据渲染到页面中
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

	/// 给reply-more注册点击事件
	$('#commentDetails').on('click', '.reply-more', function () {
		var pageNum = + $(this).attr('data-pagenum');
		var commentId = $(this).attr('data-id');
		commentData.pageNum = pageNum;
		commentData.commentId = +commentId;
		var that = this
		// 发送ajax请求
		$.ajax({
			type: "get",
			cache: false,
			url: adders + "/ly-manage/api/dynamic/dynamicCommentDetails",
			data: commentData,
			dataType: "json",
			xhrFields: { withCredentials: true },
			success: function (response) {
				if (response.succeed) {
					recentTime();
					if (response.data.total == response.data.data.length || response.data.data.length < 10) {
						$(that).text('没有更多回复了');
						$(that).removeClass('reply-more');
					}
					//  上传前面的两条数据
					if (pageNum == 1) {
						response.data.data.splice(0, 2);
					}
					// 将数据渲染到页面中
					// var userid = isWho();
					// if (userid == 1 || userid == 2) {
						var html = template('tmp-reply-two', response);
						$(that).siblings('.replys').append(html);
						pageNum++;
						$(that).attr('data-pagenum', pageNum);
					// } else if (userid == 3) {
					// 	var html = template('temp-comment1-two', response);
					// 	$(that).siblings('.replys').append(html);
					// 	pageNum++;
					// 	$(that).attr('data-pagenum', pageNum);
					// }
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
		// 改变pagenum
	})

	// 给del-comment注册的类名注册点击事件
	$('#commentDetails').on('click', '.del-comment', function () {
		// 获取评论id和动态id
		var commentId = $(this).attr('data-id');
		var dynamicId = $(this).attr('data-dynamicid');
		var that = this
		// 发送ajax请求
		$.ajax({
			type: "post",
			url: adders + "/ly-manage/api/dynamic/delComment",
			data: {
				dynamicId: +dynamicId,
				commentId: +commentId
			},
			dataType: "json",
			xhrFields: { withCredentials: true },
			success: function (response) {
				if (response.succeed) {
					recentTime();
					var index = $(that).attr('data-index');
					if (index == 1) {
						// 让类名为.media的标签进行隐藏
						$(that).parent().parent().parent().hide().removeClass('media');
						$.message('删除成功')
					} else if (index == 2) {
						$(that).parent().parent().hide().removeClass('reply-info');
						$.message('删除成功')
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
	})

	// 点击实现复制功能
	// 给selectId的类名注册点击事件
	$(document).on('click', '.selectId', function () {
		// 获取页面中的内容
		var userid = $(this).text();
		// 选择对象
		$(this).select();
		// 执行复制命令
		document.execCommand('copy');
	})

	// 给修改按钮注册点击事件 让对应的数据渲染到页面中
	$('.content-body').on('click', '.change-count', function () {
		// 将数据填充到表单中
		var inputItem = $('#table input:checked');
		if (inputItem.length == 0) {
			$.message({
				type: 'error',
				message: '请选择被修改的动态'
			});
			return;
		} else if (inputItem.length > 1) {
			$.message({
				type: 'error',
				message: '最多只能选择一个'
			});
			return;
		} else {
			$('.update-dynamicId').val(inputItem.attr('data-dynamicId'));
			$('.update-likedCount').val(inputItem.attr('data-liked'));
			$('.update-readCount').val(inputItem.attr('data-read'));
			$('.update-shareCount').val(inputItem.attr('data-share'));
			$('.update-yes').attr('likedCount', inputItem.attr('data-liked'));
			$('.update-yes').attr('likedCount', inputItem.attr('data-liked'));
			$('.update-yes').attr('readCount', inputItem.attr('data-read'));
			$('.update-yes').attr('shareCount', inputItem.attr('data-share'));
			$('#update-modal').modal('show');
		}
	})
	// 确认修改的事件函数
	$('.update-yes').click(function () {
		// 获取用户修改之前的数据
		var oldlikedCount = $(this).attr('likedCount');
		var oldreadCount = $(this).attr('readCount');
		var oldshareCount = $(this).attr('shareCount');
		// 获取用户的修改的数据
		var dynamicId = +$('.update-dynamicId').val();
		var likedCount = +$('.update-likedCount').val();
		var readCount = +$('.update-readCount').val();
		var shareCount = +$('.update-shareCount').val();
		// 判断用户是否修改了数据
		if (oldlikedCount == likedCount && oldreadCount == readCount && shareCount == oldshareCount) {
			$.message({
				type: 'error',
				message: '还没有修改数据'
			})
			return
		} else {
			// 定义一个校验器
			$('#change-count-form').bootstrapValidator({
				// 验证规则
				fields: {
					likedCount: {
						message: '请输入正确的点赞数',
						validators: {
							notEmpty: {
								message: '请输入的点赞数'
							},
							regexp: {
								regexp: /^[0-9]\d{0,7}$/,
								message: '1-99999999之间的正整数'
							}
						}
					},
					readCount: {
						message: '请输入正确的阅读数',
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
						message: '请输入正确的分享数',
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

			var bv = $('#change-count-form').data('bootstrapValidator');
			bv.validate();
			if (bv.isValid()) {
				// 发送ajax请求的修改数据
				$.ajax({
					type: "POST",
					dataType: "json",
					url: adders + "/ly-manage/api/dynamic/alterDynamic",
					data: {
						dynamicId: dynamicId,
						likedCount: likedCount,
						readCount: readCount,
						shareCount: shareCount
					},
					xhrFields: { withCredentials: true },
					success: function (response) {
						if (response.succeed) {
							$.message('成功');
							$('#update-modal').modal('hide');
							getData(obj)
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
			}
		}
	});


	// 给发布动态注册的事件
	$(document).on('click', '.createDynamic', function () {
		$('#createDynamicMadal').modal('show');
	})

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
	// 视频时长
	var duration = '';
	// 动态类型
	var dynamicType = '';
	// 初始化client所需要的数据
	var clientData = '';
	// 发布动态需要的参数
	var ajaxdata = {};
	// 经纬度的字符串
	var location = '';
	var add = '';

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
						var x = 26 / 375 * targetWidth;
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
				// if (fileSize < 1024 * 1024) {
				// 	var element = canvas.toDataURL('image/jpeg', 0.9);
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

	var clientData = {};
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
							$("#addDynamic").data('bootstrapValidator').destroy();
							$('#addDynamic').data('bootstrapValidator',null);
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

	$('#upload .upload-btn').click(function () {
		$('#file-upload').click();
	})

	var videos = [];

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
			// 为了解决的第一次校验通过的用户修改的脸影 查询nickname接口没有回来的问题
			return;
		}
		$('#loading .loading-item p').text('正在发布')
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
		// do something...
		ajaxdata = {};
		uploadImgs = [];
		videoElement = '';
		thumbnailImg = '';
		duration = '';
		loadingArr = [];
		videoHeight = '';
		videoWidth = '';
		videos = [];
		// $('.selectImg').empty();
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


	// 动态类型的选择
	$('.dynamicType').change(function () {
		var dynamicType = + this.value
		if (dynamicType) {
			obj.dynamicType = dynamicType
		} else {
			delete obj.dynamicType
		}
	})

	//  获取用户选择的城市
	$('.cityType').change(function () {
		var city = $('.cityType').val()
		if (city) {
			obj.city = city
		} else {
			delete obj.city
		}
	})
	//  推荐的动态的事件函数
	$(document).on('click', '.recommend-btn', function () {
		var ids = $(this).attr('ids')
		$('#recommended-tips .btn-recommended').attr('dynamicId', ids)
		$('#recommended-tips').modal('show')
	})
	$('#recommended-tips .btn-recommended').click(function () {
		var dynamicId = $(this).attr('dynamicId')
		$.ajax({
			type: "post",
			url: adders + "/ly-manage/api/dynamic/recommendDynamic",
			data: {
				dynamicId: dynamicId
			},
			dataType: "json",
			xhrFields: { withCredentials: true },
			success: function (response) {
				if (response.succeed) {
					$.message('动态推荐成功')
					getData(obj)
					$('#recommended-tips').modal('hide')
				} else {
					if (response.errCode == 403) {
						localStorage.removeItem('recentTime');
						// 当用户身份登录过期是 自动跳转到登录页面
						document.location.href = '../../login.html?timeout';
					}
				}
			}
		});
	})

})