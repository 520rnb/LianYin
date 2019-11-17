// 侧边栏
var sidePage = {
	icon: "icon-shouye",
	menuName: "首页",
	path: "../overview/index.html",
	children: ''
}
// 侧边栏
var sidebar = getSideBar(sidePage)
function login() {
	$.ajax({
		type: "get",
		cache: false,
		url: adders + "/ly-manage/api/admin/isLogin",
		dataType: "json",
		xhrFields: { withCredentials: true },
		success: function (response) {
			if (response.succeed == false) {
				localStorage.recentTime = ''
				document.location.href = '../../login.html?timeout';
			} else {
				if (response.data == 0) {
					localStorage.setItem('isLogin', false)
					localStorage.removeItem('recentTime');
					document.location.href = '../../login.html?timeout';
				}
			}
			recentTime();
		}
	});
}
login();
