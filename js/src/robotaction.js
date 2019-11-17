$(function () {

	// 防止用户的多次的点击
	var flag =  true
	// 机器人用户打招呼的事件
	$(document).on('click', '.SayHi', function(){
		flag = true
		// 清除上一次选中的
		$('.modal .select-user > div').html("")
		$('.modal .rights .content').html("")
		$('.modal .sayhi-contents').html('')
		$('#pagetool-sayhi').hide();
		$('#modal-sayhi .selecttimes')[0].reset();
		SimpleData = {}
		var selectEle = $('.checked-item input[type=checkbox]:checked')
		var len  = selectEle.length;
		if (len) {
			for (let index = 0; index < selectEle.length; index++) {
				var nickName = $(selectEle[index]).attr('data-name')
				var url = $(selectEle[index]).attr('data-url')
				var id = $(selectEle[index]).attr('data-userid')
				var html = `	<div class="item" data-id="${id}">
						<img
							src="${url}" style="width:50px;height:50px;"
							alt="">
						<span>${nickName}</span>
						<i class="glyphicon glyphicon-remove"></i>
					</div>`;
				$('#modal-sayhi .select-user > div').append(html);
			}
			$('#modal-sayhi .select-user p').text(`已选择(${len})`)
			$('#modal-sayhi').modal('show')
		} else {
			$.message({
				type: 'error',
				message: '请选中用户'
			})
		}
	})

	// 机器人关注用户的事件
	$(document).on('click', '.FocusOn',  function(){
		flag = true
		// 清除上一次选中的
		$('.modal .select-user > div').html("")
		$('.modal .rights .content').html("")
		$('.modal .focus-contents').html('')
		$('.page-focus').hide()
		$('#focus-user .selecttimes')[0].reset();
		SimpleData = {}
		var selectEle = $('.checked-item input[type=checkbox]:checked')
		var len  = selectEle.length;
		if (len) {
			for (let index = 0; index < selectEle.length; index++) {
				var nickName = $(selectEle[index]).attr('data-name')
				var url = $(selectEle[index]).attr('data-url')
				var id = $(selectEle[index]).attr('data-userid')
				var html = `	<div class="item" data-id="${id}">
						<img
							src="${url}" style="width:50px;height:50px;"
							alt="">
						<span>${nickName}</span>
						<i class="glyphicon glyphicon-remove"></i>
					</div>`;
				$('#focus-user .select-user > div').append(html);
			}
			$('#focus-user .select-user p').text(`已选择(${len})`)
			$('#focus-user').modal('show')
		} else {
			$.message({
				type: 'error',
				message: '请选中用户'
			})
		}
	})

	// 机器人点赞的事件
	$(document).on('click', '.giveLike', function(){
		flag = true
		$('.modal .select-user > div').html("")
		$('.modal .rights .content').html("")
		$('.modal .box').html('')
		$('.pageTool-giveLike').hide()
		$('#modal-giveLike .selecttimes')[0].reset();
		SimpleData = {}
		var selectEle = $('.checked-item input[type=checkbox]:checked')
		var len  = selectEle.length;
		if (len) {
			for (let index = 0; index < selectEle.length; index++) {
				var nickName = $(selectEle[index]).attr('data-name')
				var url = $(selectEle[index]).attr('data-url')
				var id = $(selectEle[index]).attr('data-userid')
				var html = `	<div class="item" data-id="${id}">
						<img
							src="${url}" style="width:50px;height:50px;"
							alt="">
						<span>${nickName}</span>
						<i class="glyphicon glyphicon-remove"></i>
					</div>`;
				$('#modal-giveLike .select-user > div').append(html);
			}
			$('#modal-giveLike .select-user p').text(`已选择(${len})`)
			$('#modal-giveLike').modal('show')
		} else {
			$.message({
				type: 'error',
				message: '请选中用户'
			})
		}
	})

	// 机器人评论的事件
	$(document).on('click', '.comments', function(){
		flag = true
		$('.modal .select-user > div').html("")
		$('.modal .rights .content').html("")
		// 
		$('.modal .box').html('')
		$('.pageTool-comments').hide()
		$('#modal-comments .selecttimes')[0].reset();
		SimpleData = {}
		var selectEle = $('.checked-item input[type=checkbox]:checked')
		var len  = selectEle.length;
		if (len) {
			for (let index = 0; index < selectEle.length; index++) {
				var nickName = $(selectEle[index]).attr('data-name')
				var url = $(selectEle[index]).attr('data-url')
				var id = $(selectEle[index]).attr('data-userid')
				var html = `	<div class="item" data-id="${id}">
						<img
							src="${url}" style="width:50px;height:50px;"
							alt="">
						<span>${nickName}</span>
						<i class="glyphicon glyphicon-remove"></i>
					</div>`;
				$('#modal-comments .select-user > div').append(html);
			}
			$('#modal-comments .select-user p').text(`已选择(${len})`)
			$('#modal-comments').modal('show')
		} else {
			$.message({
				type: 'error',
				message: '请选中用户'
			})
		}
	})

	//  删除选中的用户的事件
	$(document).on('click', '.select-user .item i', function () {
		var len = $(this).parent().siblings().length
		$(this).parent().parent().siblings('p').text(`已选择(${len})`)
		$(this).parent().remove()
	})


	// 给模态框中的查看按钮注册点击事件
	var SimpleData = {
		pageNum: 1,
		pageSize: 10
	}
	$('.checkapp-log').click(function () {
		var focus_beginDate = $(this).siblings().find('.beginDate').val();
		var focus_endDate = $(this).siblings().find('.endDate').val();
		var keyWord = $(this).siblings().find('.keyworld').val();
		var attr = $(this).attr('data-attr')
		if (focus_beginDate && focus_endDate) {
			focus_beginDate = focus_beginDate + ' 00:00:00';
			focus_endDate = focus_endDate + ' 23:59:59';
			SimpleData.beginDate = focus_beginDate
			SimpleData.endDate = focus_endDate
		} else {
			delete SimpleData.beginDate;
			delete SimpleData.endDate;
		}
		if (keyWord) {
			SimpleData.keyWord = keyWord
		} else {
			delete SimpleData.keyWord
		}
		// 用户必须选择查询条件
		if (!SimpleData.keyWord && !SimpleData.beginDate) {
			$.message({
				type: 'error',
				message: '请选择查询条件'
			})
			return
		}
		SimpleData.pageNum = 1
		if (attr == 'sayhi' || attr == 'user') {
			searchSimpleUser(SimpleData, attr)
		} else if (attr == 'comments' || attr == 'giveLike') {
			searchSimpleDynamic(SimpleData, attr)
		}
	})


	function searchSimpleUser(datas, attr) {
		$.ajax({
			type: "get",
			url: adders + "/ly-manage/api/admin/searchSimpleUser",
			data: datas,
			dataType: "json",
			xhrFields: { withCredentials: true },
			success: function (response) {
				if (response.succeed) {
					if (response.data.total) {
						var html = template('tmp-focus', response)
						// 将数据渲染到页面中
						if (attr == 'sayhi') {
							$('#modal-sayhi .sayhi-contents').html(html)
							p.render({ count: response.data.total, pagesize: datas.pageSize, toolbar: true, current: datas.pageNum })
							$("#pagetool-sayhi").show()
						} else if (attr == 'user') {
							$('#focus-user .focus-contents').html(html)
							focusUser.render({ count: response.data.total, pagesize: datas.pageSize, toolbar: true, current: datas.pageNum })
							$(".page-focus").show()
						}
					} else {
						$.message({
							type: 'error',
							message: '没有查询到,请更换关键字'
						})
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


	// 监听模态框是是否隐藏了
	$('.users').on('hidden.bs.modal', function (e) {
		$('.btn-action').val('0')
		// 隐藏分页
		$('#pagetools').hide('');
		// 清除上一次的查找渲染的数据
		$('#focus-user .focus-contents').html('')
		$('#focus-user .rights > div').html('')
		$('#focus-user .rights > p').html('已选择(0)')
		$(".sendcontent").val('')
		// 重置上一次的请求数据
		SimpleData.pageNum = 1;
		SimpleData.pageSize = 10;

		delete SimpleData.beginDate;
		delete SimpleData.endDate;
		delete SimpleData.keyWord;
		$('.users .rights > div').html('')
		$('.users .rights > p').html('已选择(0)')
	})

	// 给模态框中的选择按钮注册点击事件
	$(document).on('click', '.users .move', function () {
		var ele = $('.users .rights .items')
		if (ele.length < 20) {
			var nickName = $(this).attr('data-nickname')
			var userid = $(this).attr('data-userid')
			var heade = $(this).attr('data-src')
			// 判断数据是否重复了
			var falg = true
			for (let index = 0; index < ele.length; index++) {
				const element = ele[index];
				var id = $(element).attr('data-id')
				if (id == userid) {
					falg = false;
				}
			}
			if (!falg) {
				$.message({
					type: 'error',
					message: '不能重复选择'
				})
				return;
			}
			var leftEle = $('#focus-user .select-user .item');	
			for (let i = 0; i < leftEle.length; i++) {
				const element = leftEle[i];
				var userIds = $(element).attr('data-id')
				if(userid == userIds){
					$.message({
						type: 'error',
						message: '不能选择自己'
					})
					return;
				}
			}
			
			var sender = $("#modal-sayhi .select-user .item")
			for (let i = 0; i < sender.length; i++) {
				const element = sender[i];
				var userIds = $(element).attr('data-id')
				if(userid == userIds){
					$.message({
						type: 'error',
						message: '不能选择自己'
					})
					return;
				}
			}
			
			var html = `<div class="items" data-id="${userid}">
			<img src="${heade}" style="width:40px;height:40px;">
			<span>${nickName}</span>
			<i class="glyphicon glyphicon-remove"></i>
		</div>`;
			$(this).parent().parent().parent().parent().parent().siblings('.rights').children('div').append(html)
			// 删除本身
			var leng = $('.users .rights .items').length
			$('.users .rights > p').html('已选择(' + leng + ')')
		} else {
			$.message({
				type: 'error',
				message: '最多只能选择20个'
			})
		}
	})

	// 给模态框中右侧的的icon注册点击事件
	$(document).on('click', '.modal .rights  i', function () {
		var len = $(this).parent().parent().find('.items').length - 1;
		$(this).parent().parent().siblings('p').text(`已选择(${len})`)
		$(this).parent().remove()
	})

	// 给关注用户按钮注册点击事件
	$('#focus-user .btn-focus').click(function () {
		// 获取关注着的用户的id
		var leftEle = $('#focus-user .select-user .item');
		var rightEle = $('#focus-user .rights .items')
		if (leftEle.length == 0 || rightEle.length == 0) {
			$.message({
				type: 'error',
				message: '请选择被关注者'
			})
			return;
		}
		var total = leftEle.length * rightEle.length
		// 显示loading动画
		if (leftEle.length <= 0 || rightEle.length <= 0) {
			$.message({
				type: 'error',
				message: '请选择用户'
			})
			return;
		}
		if (!flag) {
			return 
		}
		$('.loading').show();
		setTimeout(function(){
			for (let i = 0; i < leftEle.length; i++) {
				const element = leftEle[i];
				var userIds = $(element).attr('data-id')
				for (let j = 0; j < rightEle.length; j++) {
					const element = rightEle[j];
					var toUserIds = $(element).attr('data-id')
					addAttention(userIds, toUserIds, total, i + 1, j + 1)
				}
			}
		}, 500)
	})


	// 关注函数
	function addAttention(userId, toUserId, total, i, j) {
		$.ajax({
			type: "post",
			url: adders + "/ly-manage/api/interaction/addAttention",
			async: false,
			data: {
				userId: userId,
				toUserId: toUserId
			},
			dataType: "json",
			xhrFields: { withCredentials: true },
			success: function (response) {
				if (i * j == total) {
					flag = false
					// 隐藏loading动画
					$('.loading').hide();
					$('#focus-user').modal('hide')
				}
			}
		});
	}

	// 查询简单动态的的
	function searchSimpleDynamic(data, attr) {
		$.ajax({
			type: "get",
			url: adders + "/ly-manage/api/dynamic/searchSimpleDynamic",
			data: data,
			dataType: "json",
			xhrFields: { withCredentials: true },
			success: function (response) {
				if (response.succeed) {
					// 渲染页面
					response.current = data.pageNum
					response.size = data.pageSize
					var html = template('tmp-dynamic-action', response)
					//  giveLike comments 
					if (attr == 'comments') {
						$('#modal-comments div.modal-body  div.select-content > div:nth-child(2)').html(html)
						commentsPage.render({
							count: response.data.total,
							pagesize: data.pageSize,
							toolbar: true,
							current: data.pageNum
						})
						$(".pageTool-comments").show();
					} else if (attr == 'giveLike') {
						$('#modal-giveLike div.modal-body  div.select-content > div:nth-child(2)').html(html)
						giveLikePage.render({
							count: response.data.total,
							pagesize: data.pageSize,
							toolbar: true,
							current: data.pageNum
						})
						$(".pageTool-giveLike").show()
					}
					$('[data-toggle="tooltip"]').tooltip()
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
	};

	// 打招呼的分页
	var p = new Paging()
	p.init({
		target: '#pagetool-sayhi', pagesize: 10, count: 10, toolbar: true, changePagesize: function (page, num) {
			SimpleData.pageNum = 1;
			SimpleData.pageSize = page;
			searchSimpleUser(SimpleData, 'sayhi')
		},
		callback: function (page, size, count) {
			pages = page;
			SimpleData.pageNum = page;
			SimpleData.pageSize = size;
			searchSimpleUser(SimpleData,'sayhi')
		}
	});

	// 点赞的分页
	var giveLikePage = new Paging()
	giveLikePage.init({
		target: '.pageTool-giveLike', pagesize: 10, count: 10, toolbar: true, changePagesize: function (page, num) {
			SimpleData.pageNum = 1;
			SimpleData.pageSize = page;
			searchSimpleDynamic(SimpleData, 'giveLike')
		},
		callback: function (page, size, count) {
			SimpleData.pageNum = page;
			SimpleData.pageSize = size;
			searchSimpleDynamic(SimpleData, 'giveLike')
		}
	});

	// 评论的分页
	var commentsPage = new Paging()
	commentsPage.init({
		target: '.pageTool-comments', pagesize: 10, count: 10, toolbar: true, changePagesize: function (page, num) {
			SimpleData.pageNum = 1;
			SimpleData.pageSize = page;
			searchSimpleDynamic(SimpleData, 'comments')
		},
		callback: function (page, size, count) {
			SimpleData.pageNum = page;
			SimpleData.pageSize = size;
			searchSimpleDynamic(SimpleData, 'comments')
		}
	});

	// 关注的分页
	var focusUser = new Paging()
	focusUser.init({
		target: '.page-focus', pagesize: 10, count: 10, toolbar: true, changePagesize: function (page, num) {
			SimpleData.pageNum = 1;
			SimpleData.pageSize = page;
			searchSimpleUser(SimpleData, 'user')
		},
		callback: function (page, size, count) {
			pages = page;
			SimpleData.pageNum = page;
			SimpleData.pageSize = size;
			searchSimpleUser(SimpleData,'user')
		}
	});

	// 模态框隐藏的是时候取消选择的动态
	$('.dy').on('hidden.bs.modal', function (e) {
		// do something...
		$('.dy .rights .content > div').html('')
		$('.dy .rights > p').html('已选择(0)')
	})
	// 给动态的模态框中的+号 icon添加点击事件
	$(document).on('click', '.dy .move', function () {
		var ele = $('.dy .rights > div p')
		if (ele.length >= 20) {
			$.message({
				type: 'error',
				message: '最多只能选择20个'
			})
			return
		}
		var id = $(this).attr('data-id');
		var falg = true;
		for (let i = 0; i < ele.length; i++) {
			const element = ele[i];
			var ids = $(element).attr('ids');
			if (ids == id) {
				falg = false;
				break
			}
		}
		if (!falg) {
			$.message({
				type: 'error',
				message: '不能重复选择'
			})
			return
		}
		var userId = $(this).attr('data-userid');
		var type = $(this).attr('data-type')
		var message = $(this).attr('data-message')
		if (type == 1) {
			var text = '文字'
		var html = `<p class="items" ids="${id}">${message}<i class="glyphicon glyphicon-remove"></i></p>`;
		} else if (type == 2) {
			var text = '图片'
			var imgSrc = $(this).parent().siblings().find('img').attr('src');
			var html = `<p class="items" ids="${id}"><img src="${imgSrc}" /><i class="glyphicon glyphicon-remove"></i></p>`;
		} else if (type == 3) {
			var text = '视频';
			var imgSrc = $(this).parent().siblings().find('img').attr('src');
			var html = `<p  class="items" ids="${id}"><img src="${imgSrc}" /><i class="glyphicon glyphicon-remove"></i></p>`;
		}
		var  eles = $(this).parent().parent().parent().parent().parent().siblings('.rights').find('.content')
		eles.append(html)
		// 获取的额选中的个数的
		var len = $('.dy .rights .content  p').length;
		$('.dy .rights > p').text(`已选择(${len})`)
	})

	// 给点赞按钮注册点击事件
	$('.btn-likes').click(function () {
		var leftEle = $('#modal-giveLike .select-user .item');
		var userIdArr = [];
		var rightEle = $('#modal-giveLike .rights > div > p');
		var dynamicIdArr = []
		if (leftEle.length <= 0 || rightEle.length <= 0) {
			$.message({
				type: 'error',
				message: '请选择点赞用户'
			})
			return;
		}
		if (!flag) {
			return 
		}
		$('.loading').show()
		for (let i = 0; i < leftEle.length; i++) {
			const element = leftEle[i];
			var userid = $(element).attr('data-id')
			userIdArr.push(userid)
		}
		for (let j = 0; j < rightEle.length; j++) {
			const element = rightEle[j];
			var dynamicId = $(element).attr('ids')
			dynamicIdArr.push(dynamicId)
		}

		var total = dynamicIdArr.length * userIdArr.length
		setTimeout(function(){
			userIdArr.forEach(function (item, i) {
				var likeData = {}
				likeData.userId = item
				dynamicIdArr.forEach(function (item, j) {
					likeData.dynamicId = item
					likeData.type = 2
					giveLike(likeData, i + 1, j + 1, total)
				})
			})
		}, 500)
	})

	

	// 调用点赞接口
	function giveLike(data, i, j, total) {
		$.ajax({
			type: "POST",
			url: adders + "/ly-manage/api/interaction/dynamicOperation",
			data: data,
			async: false,
			dataType: "json",
			xhrFields: { withCredentials: true },
			success: function (response) {
				if (response.succeed) {
					recentTime()
					if (i * j == total) {
						flag = false
						$('.loading').hide()
						$('#modal-giveLike').modal('hide')
					}
				} else {
					if (i * j == total) {
						$.message({
							type: 'error',
							message: response.errMSg
						})
						$('.loading').hide()
					}
				}
			},
			error: function () {
			}
		});
	}

	// 评论的按钮啊
	var comment = [
		"﻿拍的真好看","666","哪里人","呵呵","私聊我","有人啊","有的","找个人一起啊","来了老弟!","什么鬼","挺嗨的啊","在哪里","来","有联系方式不","在干嘛呢","来一起玩吗","什么情况?","真好看","哈哈","嘿嘿","滴,滴滴","滴滴滴","真的吗","还有这事?","那是什么意思","放开让我来","有创意","报个名","卡哇伊呢","你是哪里的","离的不算远","哪里了","赞一个","一起去旅游吗","真好","出来一起玩吗","好尴尬啊!!!!!","哈哈哈哈哈哈","自由飞翔","嗨起来","相逢何必曾相识","看见这图就有食欲","优秀","。。。","......","好嗨哦","意外意外","我滴个乖乖","are you sure?","世界上最帅的人给我点赞了","我们好像在哪见过","越来越好了","BIU的否","哎哟，不错哟","嗯可以的","你现在在哪里","人才啊","没上班吗","路过","发个位置，我去找你","很近","开心就好","陈独秀","你好啊","约不约","愿你成为自己喜欢的样子，不抱怨，不将就，有野心，有光芒！","一次认真你就输了，一直认真你就赢了。","在哪里上班啊","萌萌的","来来来","私聊啊","你在哪里","出来吃饭了","电话给我","祝你好运","何欲何求","怎么说？","美女哪里的？","感性还是性感","来","起风了！","66的","独孤求败 哈哈","66666666","6666666666666666666","6666666666666666666666666666666666","666666","没忍住笑了。。","真好","去哪里","放几天假啊?","同感","在家睡觉","吃吃睡睡","余生有你相伴","怎么啦?","怎么了","咋啦","咋了","小哥哥来嘛","小姐姐来嘛","这是要这么了","祝愿你","来喝酒","当然了","偷走你的心","同感同感","厉害","出来吃饭一起","然后呢","给我一毛八","你在干什么啊？","各有千秋","哎呀，这香","必须的嘛","天天玩，时间真多。","秒赞","上班","老司机啊","牛人","一起","路过","一起打王者","今天天气真好","一起去玩","舒服啊","嘿嘿","傻傻的","在","好吧","摸摸头","一切都会好起来的。","来抱抱","可以的","嘿","你在哪里","咦","有啊","是嘛","来黑皮","美哒哒","出来玩","宝宝","来睡啊","我陪你","说走就走的旅行来吗？","想聊聊吗，陪你","怎么了","我勒个去","哪里哪里哪里","既来之则安之","聊聊","静等你招呼","来了来了","开心就好","要帮忙吗","来吧！等你","玩什么呢","你好祝你快乐","在此","玩的开心","赞","咋没名字呢","哦哟不错！","好人","出来玩","一起看电影啊","要小哥哥吗","追着你的声音跑","从不评论的我, 还是忍不住出来赞美你","专业的","小脑虎为你加油","听君一席话, 白读十年书","怀念啊","对不起, 我是刚下脸影的, 不懂规矩, 请问是直接笑吗? 还是要走上面仪式?","我也来凑个热闹哈哈哈哈哈哈","就喜欢这种感觉","拉倒吧, 朕的江山都亡了!","没人? 不科学","不知道啊","这个必须有!","赞一下","请说出你的故事","掌声在哪里","世界那么大, 我想去看看","O(∩_∩)O哈哈~","^_^","(*╹▽╹*)","我刚刚好像看见你了","你怎么回事小老弟","一脸懵逼","how are you?","卧槽","好阔怕","鬼火一出, 爹妈白养!","约吗","真漂亮","帅气","大芳","小姐姐哪里的啊","小哥哥哪里的","皮得很","皮","秀",".","...","......","在做什么啊","第一?","第二?","第三?","沙发让我来","地板","沙发","厉害了","厉害","666","不错","嗯","嗯嗯","很好","赞","看看","不错啊，确实不错","还行!","路过","多发几条动态看看啊","美美哒","说的好","霸气","霸气侧漏","v牛","关注一下","66","6","6666","666","666666","棒棒的","你好","忙吗","安排","安排吗?","盘他","盘她","在干嘛","位置发来","私聊","好牛啊","哦","嗯","好吧","good","正在输入中..."
	];
	$('#modal-comments .btn-comment').click(function () {
		var leftEle = $('#modal-comments .select-user .item');
		var userIdArr = [];

		for (let i = 0; i < leftEle.length; i++) {
			const element = leftEle[i];
			var userid = $(element).attr('data-id')
			userIdArr.push(userid)
		}
		var rightEle = $('#modal-comments .rights .items');
		var dynamicIdArr = []
		for (let j = 0; j < rightEle.length; j++) {
			const element = rightEle[j];
			var dynamicId = $(element).attr('ids')
			dynamicIdArr.push(dynamicId)
		}
		var total = dynamicIdArr.length * userIdArr.length
		if (userIdArr.length <= 0 || dynamicIdArr.length <= 0) {
			$.message({
				type: 'error',
				message: '请选择用户或动态'
			})
			return;
		}
		userIdArr.forEach(function (item, i) {
			var commentData = {}
			commentData.userId = item
			var random = Math.random();
			var content = $('#comment-content').val()
			if (!content) {
				$.message({
					type: 'error',
					message: '请输入评论的内容'
				})
				return
			}
			if (!flag) {
				return 
			}
			$('.loading').show()
			//执行请求
			setTimeout(function(){
				dynamicIdArr.forEach(function (item, j) {
					commentData.dynamicId = item
					commentData.type = 1
					if (i == 0) {
						commentData.content = content
					} else {
						var two = j * Math.random().toString().substr(3, 1)
						commentData.content = comment[+random.toString().substr(2, 2) + (+two)]
					}
					comments(commentData, i + 1, j + 1, total)
				})
			}, 500)
		})
	})

	// comments
	function comments(data, i, j, total) {
		$.ajax({
			type: "post",
			url: adders + "/ly-manage/api/interaction/dynamicOperation",
			data: data,
			async: false,
			dataType: "json",
			xhrFields: { withCredentials: true },
			success: function (response) {
				if (response.succeed) {
					if (i * j == total) {
						recentTime()
						flag = false
						$('.loading').hide()
						$('#comment-content').val('')
						$('#modal-comments').modal('hide');
					}
				} else {
					if (response.errCode == 403) {
						localStorage.removeItem('info');
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
	// 给打招呼按钮注册点击事件
	$('#modal-sayhi .btn-hello').click(function () {
		var helloData = {}
		//发送者id
		var senderArr = []
		var sender = $("#modal-sayhi .select-user .item")
		for (let i = 0; i < sender.length; i++) {
			const element = sender[i];
			var id = $(element).attr('data-id')
			if (id) {
				senderArr.push(id)
			}
		}
		var receiver = $('#modal-sayhi .rights div .items')
		var receiverArr = []

		for (let j = 0; j < receiver.length; j++) {
			const element = receiver[j];
			var ids = $(element).attr("data-id")
			if (ids) {
				receiverArr.push(ids)
			}
		}
		// 获取发送的内容
		var content = $('#modal-sayhi .sendcontent').val();
		if (!content) {
			$.message({
				type: 'error',
				message: '请输入发送的内容'
			})
			return;
		}
		// 判断发送者和接收者是不是为空
		if (senderArr.length <= 0 || receiverArr.length <= 0) {
			$.message({
				type: 'error',
				message: '请选择发送者或接收者'
			})
			return;
		}
		if (!flag) {
			return
		}
		$('.loading').show()
		setTimeout(function(){
			senderArr.forEach(function(i){
				receiverArr.forEach(function(j){
					helloData.userId = i;
					helloData.toUserId = j;
					helloData.content = content;
					greet(helloData)
				})
			})
		}, 500)
	})


	// 打招呼函数
	function greet(data) {
		$.ajax({
			type: "post",
			url: adders + "/ly-manage/api/interaction/greet",
			data: data,
			async: false,
			dataType: "json",
			xhrFields: { withCredentials: true },
			success: function (response) {
				if (response.succeed) {
					$("#modal-sayhi").modal('hide')
					flag = false
					recentTime()
					$('.sendcontent').val()
					$('.loading').hide()
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

	// modal中重置按钮事件
	$('.modal-reset').click(function () {
		$(this).siblings().find('input').val('')
		delete SimpleData.beginDate
		delete SimpleData.endDate
		delete SimpleData.keyWord
	})

})