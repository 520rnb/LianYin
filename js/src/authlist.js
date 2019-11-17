$(function(){
	// 侧边栏
	var sidePage = {
		icon: "icon-shouye",
		menuName: "首页",
		path: "../overview/index.html",
		children: ''
	}
	// 侧边栏
	var sidebar = getSideBar(sidePage)
	var all = permissions(sidebar.data, 10102)

	var defData =  {
		pageNum: 1,
		pageSize: 10
	}
	getList(defData)
	// 获取列表
	function getList (data) {
		data.source = 1
		$.ajax({
			type: "GET",
			url: adders+"/ly-manage/api/role/list",
			data: data,
			dataType: "json",
			xhrFields: { withCredentials: true },
			success: function (response) {
				if (response.succeed){
					recentTime()
					response.data.gobalLevel = 	gobalLevel.data.level
					all.forEach(function(item){
						response.data[item.menuId] = true
					})
					if (response.data.total) {
						var html = template('tmp-authlist', response)
						$('.authlist .content').html(html)
						pg.render({ count: response.data.total, pagesize: data.pageSize, toolbar: true, current: data.pageNum })
						$('#pageTool').show()
					} else {
						var html = template('no-data', response)
						$('.authlist .content').html(html)
						$('#pageTool').hide()
					}
				} else {
					if (response.errCode == 403) {
						localStorage.removeItem('recentTime')
						location.href = '../../login.html'
					}else{
						$.message({
							type: 'error',
							message: response.errMsg
						})
					}
				}
			}
		});
	}

	// 查看按钮
	$('.checkapp').click(function(){
		var roleName = $(this).siblings().find('input').val()
		defData.pageNum = 1;
		if (roleName){
			defData.roleName = roleName
			getList(defData)
		} else {
			delete defData.roleName
			getList(defData)
		}
	})
	// 重置的按钮
	$('.rest').click(function(){
		// 清空的表单在那个输入的内容
		$(this).siblings().find('input').val('')
	})
	// 初始化分页插件
	var pg = new Paging();
	pg.init({
		target: '#pageTool', pagesize: 100, count: 10, toolbar: true,
		changePagesize: function (page, num) {
			defData.pageNum = 1
			defData.pageSize = page
			getList (defData)
		},
		callback: function (page, size, count) {
			defData.pageNum = page
			defData.pageSize = size
			getList (defData)
		}
	})

	$(document).on('click', '.addRole', function(){
		$.ajax({
			type: "get",
			url:adders+ "/ly-manage/api/menu/menuTree",
			dataType: "json",
			xhrFields: { withCredentials: true },
			success: function (response) {
				recentTime()
				changeNode(response.data)
				if (response.succeed) {
					var setting = {
						view: {
							selectedMulti: true, //设置是否能够同时选中多个节点
							showIcon: true,      //设置是否显示节点图标
							showLine: true,      //设置是否显示节点与节点之间的连线
							showTitle: true,     //设置是否显示节点的title提示信息
						},
						check:{
							enable: true,         //设置是否显示checkbox复选框
							autoCheckTrigger: true,
							chkDisabledInherit: true
						},
						callback: {
							onCheck: function(){
								var treeObj = $.fn.zTree.getZTreeObj('tree')
								var list = treeObj.getCheckedNodes(true)
								if (list.length == 0) {
									$('#tree').addClass('tree-error')
									$('.tree-help').show();
								}else{
									$('#tree').removeClass('tree-error')
									$('.tree-help').hide();
								}
							}
						}
					}
					zTree = $.fn.zTree.init($("#tree"), setting, response.data);
					$('#addRole').modal('show')
				} else {
					if (response.errCode == 403){
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
	})

	// 新增角色的取消按钮的事件
	$('.btn-cancel').click(function(){
		// 重置上一次的输入的内容
		$('#tree').removeClass('tree-error')
		$('.tree-help').hide();
		$('#addRole .addRoleUser')[0].reset()
		$("#addRole .addRoleUser").data('bootstrapValidator').destroy();
		$('#addRole .addRoleUser').data('bootstrapValidator',null);
	})
	$('.news').click(function(){
		var treeObj = $.fn.zTree.getZTreeObj('tree')
		var list = treeObj.getCheckedNodes(true)
		var menuIds = ''
		list.forEach(function(item,index){
			if (index==0){
				menuIds += item.menuId
			}else {
				menuIds += ','+ item.menuId
			}
		})
		$('.addRoleUser').bootstrapValidator({
			fields: {
				roleName: {
					message: '请输入角色名',
					validators: {
						notEmpty: {
							message: '请输入角色名'
						}
					}
				}
			}
		})
		var bv = $(".addRoleUser").data('bootstrapValidator');
		bv.validate();
		if (!menuIds) {
			$('#tree').addClass('tree-error')
			$('.tree-help').show();
			return;
		} else {
			$('#tree').removeClass('tree-error')
			$('.tree-help').hide();
		}
		if (!bv.isValid()) {
			return
		}
		var roleName = $("#addRole .roleName").val();
		var remark = $(".remark").val()
		$.ajax({
			type: "post",
			url: adders+"/ly-manage/api/role/add",
			data: {
				roleName: roleName,
				remark: remark,
				menuIds: menuIds
			},
			dataType: "json",
			xhrFields: { withCredentials: true },
			success: function (response) {
				recentTime()
				if (response.succeed){
					$('#addRole').modal('hide')
					var defData = {
						pageNum: 1,
						pageSize: 10
					}
					$('#addRole .addRoleUser')[0].reset()
					$("#addRole .addRoleUser").data('bootstrapValidator').destroy();
					$('#addRole .addRoleUser').data('bootstrapValidator',null);
					getList(defData)
				}else {
					if (response.errCode == 403){
						localStorage.removeItem('recentTime')
						location.href = '../../login.html'
					}else{
						$.message({
							type: 'error',
							message: response.errMsg
						})
					}
				}
			}
		});
	})
	// 删除的事件 
	$(document).on('click', '.btn-del', function(){
		var roleId = $(this).attr('data-roleId')
		$('#del-tips .btn-yes').attr('data-roleId', roleId)
		$('#del-tips').modal('show')
	})

	$('#del-tips .btn-yes').click(function() {
		var roleId = $(this).attr('data-roleId')
			$.ajax({
			type: "post",
			url: adders+"/ly-manage/api/role/remove",
			data: {
				roleId: roleId
			},
			dataType: "json",
			xhrFields: { withCredentials: true },
			success: function (response) {
				if (response.succeed){
					$.message('删除角色成功')
					$('#del-tips').modal('hide')
					getList(defData)
				}else{
					if (response.errCode == 403){
						localStorage.removeItem('recentTime')
						location.href = '../../login.html'
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
	// 修改角色的事件
	$(document).on('click', '.btn-change', function() {
		var roleId = $(this).attr('data-roleId')
		var roleName = $(this).attr("data-rolename")
		var remark = $(this).attr("data-remark")
		var level = $(this).attr('data-level')
		$(".edit").attr('data-id', roleId)
		$(".changeRoleName").val(roleName)
		$(".changeRemark").val(remark)
		$.ajax({
			type: "get",
			url: adders+"/ly-manage/api/menu/selectedMenuTree",
			data: {
				roleId: roleId
			},
			dataType: "json",
			xhrFields: { withCredentials: true },
			success: function (response) {
				if (response.succeed) {
					changeNode(response.data)
					recentTime()
					var setting = {}
					// 判断修改的是不是level的为1的权限
					if ( level == 1 ) {
						setting = {
							view: {
								selectedMulti: true, //设置是否能够同时选中多个节点
								showIcon: true,      //设置是否显示节点图标
								showLine: true,      //设置是否显示节点与节点之间的连线
								showTitle: true,     //设置是否显示节点的title提示信息
							},
							check:{
								enable: true,         //设置是否显示checkbox复选框
								autoCheckTrigger: true,
								chkDisabledInherit: true
							},
							callback: {
								onCheck: function(event, treeId, treeNode){
									var treeObj = $.fn.zTree.getZTreeObj('changeTree')
									var list = treeObj.getCheckedNodes(true)
									if (treeNode.menuType == 3) {
										if (treeNode.menuPid == 10102) {
											treeObj.checkNode(treeNode, true, true);
											return;
										}
									}
									if (treeNode.menuType == 2) {
										if (treeNode.menuId == 10102){
											treeObj.checkNode(treeNode, true, true);
											return;
										}
									}
								}
							}
						}
					} else {
						setting = {
							view: {
								selectedMulti: true, //设置是否能够同时选中多个节点
								showIcon: true,      //设置是否显示节点图标
								showLine: true,      //设置是否显示节点与节点之间的连线
								showTitle: true,     //设置是否显示节点的title提示信息
							},
							check:{
								enable: true,         //设置是否显示checkbox复选框
								autoCheckTrigger: true,
								chkDisabledInherit: true
							}
						}
					}
					zTreeObj = $.fn.zTree.init($("#changeTree"), setting, response.data);
					$('#changeRole').modal('show')
				} else {
					if (response.errCode == 403) {
						localStorage.removeItem('recentTime')
						location.href = "../../login.html"
					}
				}
			}
		});
	})

	// 确认修改的按钮
	$(".edit").click(function(){
		var roleName = $(".changeRoleName").val();
		var remark = $(".changeRemark").val();
		var roleId = $(this).attr("data-id")
		if (!roleName){
			$.message({
				type: 'error',
				message: '请输入角色名'
			})
			return
		}
		var treeObj = $.fn.zTree.getZTreeObj('changeTree')
		var list = treeObj.getCheckedNodes(true)
		// return
		var menuIds = '' 
		list.forEach(function(item,index){
			if (index==0){
				menuIds += item.menuId
			}else {
				menuIds += ','+ item.menuId
			}
		})
		if (!menuIds){
			$.message({
				type: "error",
				message: '请选择权限'
			})
			return
		}
		$.ajax({
			type: "POST",
			url: adders + "/ly-manage/api/role/edit",
			data: {
				roleId: roleId,
				menuIds: menuIds,
				roleName: roleName,
				remark: remark
			},
			dataType: "json",
			xhrFields: { withCredentials: true },
			success: function (response) {
				if (response.succeed){
					recentTime()
					$("#changeRole").modal('hide')
					getList (defData)
					$.message('角色修改成功')
				} else {
					if (response.errCode == 403) {
						localStorage.removeItem('recentTime')
						location.href = '../../login.html'
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

	// 遍历节点
	function changeNode(arr) {
		if (arr.length != 0) {
			arr.forEach(function(item) {
				item.name = item.menuName
				item.id = item.menuId
				delete item.menuName
				item.nodes = item.children
				item.state = {}
				if (item.selected){
					// item.state.selected = item.selected
					item.open = item.selected
					item.checked = item.selected
				}
				if (item.children.length != 0) {
					changeNode(item.nodes)
				}else{
						delete item.nodes
						delete item.children
				}
			})
		}
	}
})

