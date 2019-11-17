var all = permissions(sidebar.data, 80101)
// 判断用户是否含有某个权限
var BannedClick = null
//  当没有发布公告的的权限判断的依据
var flage = false
all.forEach(function(item) {
	if (item.menuId == '8010102') {
		BannedClick =  BannedBtn
	}
	if (item.menuId == '8010101'){
		$('.announcement').show()
	}
})
//  当没有发布公告的权限的时候的
var display  = $('.announcement').css('display')
if (display == 'none') {
	// 改变的聊天区域的高度
	$('.chatroom .content').css({'height': '600px' })
		$('.chatlist .content').css({'height': '600px'})
}
// gobal 变量
var gobalToken = {}; // 存储用户获取的token

// 判断localStorage中的 是否有token token是否过期了
function isToken() {
	var now = new Date().getTime()
	// 获取上一次存储的token
	var oldToken = JSON.parse(localStorage.getItem('token'));
	// 判断之前获取的token
	if (oldToken) {
		var tokenTime = oldToken.time
		// 判断时间是否过期了
		if (now - tokenTime > 29 * 24 * 60 * 60 * 1000) {
			getIMToken()
		} else {
			gobalToken = JSON.parse(localStorage.getItem('token'));
			linkToRong(gobalToken.data)
			return
		}
	}
	getIMToken()
}
isToken()
// 获取融云token
function getIMToken() {
	$.ajax({
		type: "POST",
		url: adders + "/ly-manage/api/rc/getIMToken",
		dataType: "json",
		xhrFields: { withCredentials: true },
		success: function (response) {
			if (response.succeed) {
				recentTime()
				var time = new Date().getTime()
				response.time = time
				// 将token保存下来
				gobalToken = response
				var tokenStr = JSON.stringify(response)
				localStorage.setItem('token', tokenStr)
				// 初始化融云
				linkToRong(response.data)
			} else {
				if (response.errCode == 403) {
					localStorage.removeItem('info')
					localStorage.removeItem('recentTime')
					location.href = '../../login.html';
					// 跳转到登录页
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

// 链接融云的函数
function linkToRong(token) {
	// 初始化融云
	RongIMClient.init('k51hidwqkclyb') // 正式服和测试服的key是不一样的

	//  初始化emoji 解决emoji无法显示的问题
	RongIMLib.RongIMEmoji.init();

	// 通过配置初始化
	// 表情信息可参考 http://unicode.org/emoji/charts/full-emoji-list.html
	var config = {
		size: 24, // 大小, 默认 24, 建议15 - 55
		url: '//f2e.cn.ronghub.com/sdk/emoji-48.png', // 所有 emoji 的背景图片
		lang: 'zh', // 选择的语言, 默认 zh
		// 扩展表情
		extension: {
			dataSource: {

			},
			// 新增 emoji 的背景图 url
			url: 'https://emojipedia-us.s3.amazonaws.com/thumbs/160/apple/96/thinking-face_1f914.png'
		}
	};
	var list = RongIMLib.RongIMEmoji.list;
	RongIMLib.RongIMEmoji.init(config);
	// 设置融云的链接监听器
	RongIMClient.setConnectionStatusListener({
		onChanged: function (status) {
			switch (status) {
				case RongIMLib.ConnectionStatus.CONNECTED:
					$.message('加入聊天室成功')
					break;
				case RongIMLib.ConnectionStatus.CONNECTING:
					// $.message('正在链接中')
					break;
				case RongIMLib.ConnectionStatus.DISCONNECTED:
					$.message({
						type: 'error',
						message: '已断开链接,正在进行重连,请耐心等待'
					})
					RongIMClient.reconnect(callback, config);
					break;
				case RongIMLib.ConnectionStatus.KICKED_OFFLINE_BY_OTHER_CLIENT:
					$.message({
						type: 'error',
						message: '其他设备登录'
					});
					break;
				case RongIMLib.ConnectionStatus.DOMAIN_INCORRECT:
					break;
				case RongIMLib.ConnectionStatus.NETWORK_UNAVAILABLE:
					$.message({
						type: 'error',
						message: '网络不可用,请检查网络'
					})
					RongIMClient.reconnect(callback, config);
					break;
			}
		}
	})
	// 聊天室内用户的数组
	var chatRoomArr = []
	// 设置融云消息的监听器
	RongIMClient.setOnReceiveMessageListener({
		onReceived: function (message) {
			// 将消息渲染到页面中
			// 判断消息的类型
			if (message.content.messageName == "TextMessage") {
				message.content.content = RongIMLib.RongIMEmoji.symbolToEmoji(message.content.content);
				message.content.user.name = RongIMLib.RongIMEmoji.symbolToEmoji(message.content.user.name);
				var Html = template('tmp-chat-details', message)
				$('#chatRoom .chatroom .content').append(Html)
				var obj = message.content.user;
				// 聊天室中的用户的 有重复的
				chatRoomArr.push(obj)
			} else if (message.content.messageName == "InformationNotificationMessage") {
				var Html = template('tmp-cement', message)
				$('#chatRoom .chatroom .content').append(Html)
				// tmp-cement
			}
			// 滚动条始终是在最下方的
			$('#chatRoom .chatroom .content')[0].scrollTop = $('#chatRoom .chatroom .content')[0].scrollHeight;
			// 获取聊天室的信息
			var chatRoomId = '62786522'; // 聊天室 Id
			var count = 20; // 获取聊天室人数 （范围 0-20 ）
			var order = RongIMLib.GetChatRoomType.REVERSE; // 排序方式
			RongIMClient.getInstance().getChatRoomInfo(chatRoomId, count, order, {
				onSuccess: function (chatRoom) {
					var user = uniq(chatRoomArr)
					var html = template('tmp-cat-list', { 'data': user })
					// 遍历user
					var ele = $("#chatRoom .chatroom .content .user-item");
					for (let index = 0; index < ele.length; index++) {
						var id = $(ele[index]).attr('data-id');
						user.forEach(function (item) {
							if (id == item.id) {
								$(ele[index]).find('img').attr('src', item.portrait)
								$(ele[index]).find('.nickname .span-name').text(item.name)
							}
						})
					}
					$('#chatRoom .chatlist .content').html(html)
					// chatRoom => 聊天室信
					// 只有用户的id,和加入的时间
					$('#chatRoom .chatlist .title').html(`聊天室成员列表(${chatRoom.userTotalNums})`)
				},
				onError: function (error) {
					// 获取聊天室信息失败
					$.message({
						type: 'error',
						message: '出错了'
					})
				}
			});
		}
	})

	// 链接融云
	RongIMClient.connect(token, {
		onSuccess: function (userid) {
			var chatRoomId = '62786522'; // 聊天室 Id
			var count = 50; // 拉取最近聊天最多 50 条
			RongIMClient.getInstance().joinChatRoom(chatRoomId, count, {
				onSuccess: function (chatRoom) {
					// 加入聊天室成功
					// 获取聊天室人数
					var chatRoomId = '62786522'; // 聊天室 Id
					var count = 20; // 获取聊天室人数 （范围 0-20 ）
					var order = RongIMLib.GetChatRoomType.REVERSE; // 排序方式
					RongIMClient.getInstance().getChatRoomInfo(chatRoomId, count, order, {
						onSuccess: function (chatRoom) {
							// chatRoom => 聊天室信息
							// chatRoom.userInfos => 返回聊天室成员
							// chatRoom.userTotalNums => 当前聊天室总人数
						},
						onError: function (error) {
							// 获取聊天室信息失败
						}
					});
				},
				onError: function (error) {
					// 加入聊天室失败
					$.message({
						type: 'error',
						message: '加入聊天室失败, 请刷新页面'
					})
				}
			});
		},
		onTokenIncorrect: function () {
			$.message({
				type: 'error',
				message: 'token是无效的'
			})
		},
		onError: function (errCode) {
			var info = '';
			switch (errorCode) {
				case RongIMLib.ErrorCode.TIMEOUT:
					info = '超时';
					$.message({
						type: 'error',
						message: '链接超时,正在进行重新链接,请耐心等候'
					})
					RongIMClient.reconnect(callback, config);
					break;
				case RongIMLib.ConnectionState.UNACCEPTABLE_PAROTOCOL_VERSION:
					info = '不可接受的协议版本';
					break;
				case RongIMLib.ConnectionState.IDENTIFIER_REJECTED:
					info = 'appkey不正确';
					break;
				case RongIMLib.ConnectionState.SERVER_UNAVAILABLE:
					info = '服务器不可用';
					$.message({
						type: 'error',
						message: '服务器不可用,请刷新页面'
					})
					break;
			}
			$.message({
				type: 'error',
				message: info
			})
		}
	})
	// 重新链接
	var callback = {
		onSuccess: function (userId) {
			$.message('链接成功了')
		},
		onTokenIncorrect: function () {
		},
		onError: function (errorCode) {
		}
	};
	var config = {
		// 默认 false, true 启用自动重连，启用则为必选参数
		auto: true,
		// 网络嗅探地址 [http(s)://]cdn.ronghub.com/RongIMLib-2.2.6.min.js 可选
		url: 'cdn.ronghub.com/RongIMLib-2.2.6.min.js',
		// 重试频率 [100, 1000, 3000, 6000, 10000, 18000] 单位为毫秒，可选
		rate: [100, 1000, 3000, 6000, 10000]
	};
	// RongIMClient.reconnect(callback, config);
}
// 数组去重(元素是对象 按照id进行筛选)
function uniq(oldArr) {
	var newArr = []
	for (var i = 0; i < oldArr.length; i++) {
		var flag = true;
		for (var j = 0; j < newArr.length; j++) {
			if (oldArr[i].id == newArr[j].id) {
				// 如果相同id 将传入的name赋值给newArr[j] 以防用户在聊天的时候修改昵称 和头像
				newArr[j].portrait = oldArr[i].portrait
				newArr[j].name = oldArr[i].name
				flag = false;
			};
		};
		if (flag) {
			newArr.push(oldArr[i]);
		};
	};
	return newArr
}

// 发布公告
$('.send-announcement').click(function () {
	var content = $(this).siblings().val();
	var len = content.length;
	if (len > 50) {
		$.message({
			type: 'error',
			message: '内容最多的为50个字'
		})
		return;
	}
	if (content) {
		$.ajax({
			type: "post",
			url: adders + "/ly-manage/api/chatroom/publishBulletin",
			data: {
				content: content
			},
			dataType: "json",
			xhrFields: { withCredentials: true },
			success: function (response) {
				if (response.succeed) {
					recentTime()
					$.message('公告发布成功')
					$('textarea').val('')
					var obj = {
						'message': content
					}
					var html = template('tmp-cement', { 'content': obj })
					$('#chatRoom .chatroom .content').append(html)
					// 滚动条始终是在最下方的
					$('#chatRoom .chatroom .content')[0].scrollTop = $('#chatRoom .chatroom .content')[0].scrollHeight;
				} else {
					if (response.errCode == 403) {
						localStorage.removeItem('info')
						localStorage.removeItem('recentTime')
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
	} else {
		$.message({
			type: 'error',
			message: '请输入内容'
		})
	}
})


$('body').click(function (e) {
	$('.suspension').hide()
})
// 给用户列表添加禁言

function BannedBtn (e) {
	var id = $(this).parent().parent().attr('data-id')
	var x = e.clientX
	var y = e.clientY
	$('.suspension').css({
		'top': y,
		'left': x
	})
	$('.suspension').show()
	$('.Banned').attr('data-id', id)
	return false;
}

// 给用户添加禁言
$(document).on('contextmenu', '#chatRoom .chatroom .user-item img', BannedClick)

$(document).on('contextmenu', '#chatRoom .chatlist img', BannedClick)

$('.Banned').click(function () {
	var id = $('.Banned').attr('data-id')
	$('#modal-userid ').val(id)
	$('#modal-Banned').modal('show')
	$(this).parent().hide();
})


$('.btn-addGag').click(function () {
	var data = {};
	data.userId = $('#modal-Banned .userId').val()
	data.minute = $('#modal-Banned .minute').val()
	data.reason = $('#modal-Banned .reason').val()

	description = $('#modal-Banned .description').val()
	if (description) {
		data.description = description
	} else {
		delete data.description
	}
	addGag(data)
})

function addGag(data) {
	$.ajax({
		type: "post",
		url: adders + "/ly-manage/api/chatroom/addGag",
		data: data,
		dataType: "json",
		xhrFields: { withCredentials: true },
		success: function (response) {
			if (response.succeed) {
				$.message('禁言成功')
				recentTime()
				$('#modal-Banned').modal('hide')
			} else {
				if (response.errCode == 403) {
					localStorage.removeItem('info')
					localStorage.removeItem('recentTime')
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