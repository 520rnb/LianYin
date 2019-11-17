var cityData = [
	{
		'province': '北京市',
		'child': [
			{
				'city': '北京市',
				'number': '11000000',
				'parent': '0'
			}
		]
	},
	{
		'province': '天津市',
		'child': [
			{
				'city': '天津市',
				'number': '12000000',
				'parent': '0'
			}
		]
	},
	{
		'province': '河北',
		'child': [
			{
				'city': '河北',
				'number': '13000000',
				'parent': '0'
			},
			{
				'city': '石家庄市',
				'number': '13010000',
				'parent': '13000000'
			},
			{
				'city': '唐山市',
				'number': '13020000',
				'parent': '13000000'
			},
			{
				'city': '秦皇岛市',
				'number': '13030000',
				'parent': '13000000'
			},
			{
				'city': '邯郸市',
				'number': '13040000',
				'parent': '13000000'
			},
			{
				'city': '邢台市',
				'number': '13050000',
				'parent': '13000000'
			},
			{
				'city': '保定市',
				'number': '13060000',
				'parent': '13000000'
			},
			{
				'city': '张家口市',
				'number': '13070000',
				'parent': '12000000'
			},
			{
				'city': '承德市',
				'number': '13080000',
				'parent': '13000000'
			},
			{
				'city': '沧州市',
				'number': '13090000',
				'parent': '13000000'
			},
			{
				'city': '廊坊市',
				'number': '13100000',
				'parent': '13000000'
			},
			{
				'city': '衡水市',
				'number': '13110000',
				'parent': '13000000'
			},
		]
	},
	{
		'province': '山西',
		'child': [
			{
				'city': '山西',
				'number': '14010000',
				'parent': '0'
			},
			{
				'city': '太原市',
				'number': '14000000', 'parent': '14000000'
			},
			{
				'city': '大同市',
				'number': '14020000', 'parent': '14000000'
			},
			{
				'city': '阳泉市',
				'number': '14030000', 'parent': '14000000'
			},
			{
				'city': '长治市',
				'number': '14040000', 'parent': '14000000'
			},
			{
				'city': '晋城市',
				'number': '14050000', 'parent': '14000000'
			},
			{
				'city': '朔州市',
				'number': '14060000', 'parent': '14000000'
			},
			{
				'city': '晋中市',
				'number': '14070000', 'parent': '14000000'
			},
			{
				'city': '太原市',
				'number': '14010000', 'parent': '14000000'
			},
			{
				'city': '运城市',
				'number': '14080000', 'parent': '14000000'
			},
			{
				'city': '忻州市',
				'number': '14090000', 'parent': '14000000'
			},
			{
				'city': '临汾市',
				'number': '14100000', 'parent': '14000000'
			},
			{
				'city': '吕梁市',
				'number': '14110000', 'parent': '14000000'
			}
		]
	},
	{
		'province': '内蒙古',
		'child': [
			{
				'city': '内蒙古',
				'number': '15000000', 'parent': '0'
			},
			{
				'city': '呼和浩特市',
				'number': '15010000', 'parent': '15000000'
			},
			{
				'city': '包头市',
				'number': '15020000', 'parent': '15000000'
			},
			{
				'city': '乌海市',
				'number': '15030000', 'parent': '15000000'
			},
			{
				'city': '赤峰市',
				'number': '15040000', 'parent': '15000000'
			},
			{
				'city': '通辽市',
				'number': '15050000', 'parent': '15000000'
			},
			{
				'city': '鄂尔多斯市',
				'number': '15060000', 'parent': '15000000'
			},
			{
				'city': '呼伦贝尔市',
				'number': '15070000', 'parent': '15000000'
			},
			{
				'city': '巴彦淖尔市',
				'number': '15080000', 'parent': '15000000'
			},
			{
				'city': '乌兰察布市',
				'number': '15090000', 'parent': '15000000'
			},
			{
				'city': '兴安盟',
				'number': '15220000', 'parent': '15000000'
			},
			{
				'city': '锡林郭勒盟',
				'number': '15250000', 'parent': '15000000'
			},
			{
				'city': '阿拉善盟',
				'number': '15290000', 'parent': '15000000'
			},
		]
	},
	{
		'province': '辽宁',
		'child': [
			{
				'city': '辽宁',
				'number': '21000000', 'parent': '0'
			},
			{
				'city': '沈阳市',
				'number': '21010000', 'parent': '21000000'
			},
			{
				'city': '大连市',
				'number': '21020000', 'parent': '21000000'
			},
			{
				'city': '鞍山市',
				'number': '21030000', 'parent': '21000000'
			},
			{
				'city': '抚顺市',
				'number': '21040000', 'parent': '21000000'
			},
			{
				'city': '本溪市',
				'number': '21050000', 'parent': '21000000'
			},
			{
				'city': '丹东市',
				'number': '21060000', 'parent': '21000000'
			},
			{
				'city': '锦州市',
				'number': '21070000', 'parent': '21000000'
			},
			{
				'city': '营口市',
				'number': '21080000', 'parent': '21000000'
			},
			{
				'city': '阜新市',
				'number': '21090000', 'parent': '21000000'
			},
			{
				'city': '辽阳市',
				'number': '21100000', 'parent': '21000000'
			},
			{
				'city': '盘锦市',
				'number': '21110000', 'parent': '21000000'
			},
			{
				'city': '铁岭市',
				'number': '21120000', 'parent': '21000000'
			},
			{
				'city': '朝阳市',
				'number': '21130000', 'parent': '21000000'
			},
			{
				'city': '葫芦岛市',
				'number': '21140000', 'parent': '21000000'
			}
		]
	},
	{
		'province': '吉林',
		'child': [
			{
				'city': '吉林',
				'number': '22010000', 'parent': '0'
			},
			{
				'city': '长春市',
				'number': '22000000', 'parent': '22010000'
			},
			{
				'city': '吉林市',
				'number': '22020000', 'parent': '22010000'
			},
			{

				'city': '四平市',
				'number': '22030000', 'parent': '22010000'
			},
			{
				'city': '辽源市',
				'number': '22040000', 'parent': '22010000'
			},
			{

				'city': '通化市',
				'number': '22050000', 'parent': '22010000'
			},
			{
				'city': '白山市',
				'number': '22060000', 'parent': '22010000'
			},
			{
				'city': '松原市',
				'number': '22070000', 'parent': '22010000'
			},
			{
				'city': '白城市',
				'number': '22080000', 'parent': '22010000'
			},
			{
				'city': '延边州',
				'number': '22240000', 'parent': '22010000'
			}
		]
	},
	{
		'province': '黑龙江',
		'child': [
			{
				'city': '黑龙江',
				'number': '23000000', 'parent': '0'
			},
			{
				'city': '哈尔滨市',
				'number': '23010000', 'parent': '23000000'
			},
			{

				'city': '齐齐哈尔市',
				'number': '23020000', 'parent': '23000000'
			},
			{
				'city': '鸡西市',
				'number': '23030000', 'parent': '23000000'
			},
			{
				'city': '鹤岗市',
				'number': '23040000', 'parent': '23000000'
			},
			{

				'city': '双鸭山市',
				'number': '23050000', 'parent': '23000000'
			},
			{
				'city': '大庆市',
				'number': '23060000', 'parent': '23000000'
			},
			{
				'city': '伊春市',
				'number': '23070000', 'parent': '23000000'
			},
			{
				'city': '佳木斯市',
				'number': '23080000', 'parent': '23000000'
			},
			{
				'city': '七台河市',
				'number': '23090000', 'parent': '23000000'
			},
			{
				'city': '牡丹江市',
				'number': '23100000', 'parent': '23000000'
			},
			{
				'city': '黑河市',
				'number': '23110000', 'parent': '23000000'
			},
			{
				'city': '绥化市',
				'number': '23120000', 'parent': '23000000'
			},
			{
				'city': '大兴安岭地区',
				'number': '23270000', 'parent': '23000000'
			}
		]
	},
	{
		'province': '上海市',
		'child': [
			{
				'city': '上海市',
				'number': '31000000', 'parent': '0'
			}
		]
	},
	{
		'province': '江苏',
		'child': [
			{
				'city': '江苏',
				'number': '32000000', 'parent': '0'
			},
			{
				'city': '南京市',
				'number': '32010000', 'parent': '32000000'
			},
			{
				'city': '无锡市',
				'number': '32020000', 'parent': '32000000'
			},
			{
				'city': '徐州市',
				'number': '32030000', 'parent': '32000000'
			},
			{
				'city': '常州市',
				'number': '32040000', 'parent': '32000000'
			},
			{
				'city': '苏州市',
				'number': '32050000', 'parent': '32000000'
			},
			{
				'city': '南通市',
				'number': '32060000', 'parent': '32000000'
			},
			{

				'city': '连云港市',
				'number': '32070000', 'parent': '32000000'
			},
			{
				'city': '淮安市',
				'number': '32080000', 'parent': '32000000'
			},
			{
				'city': '盐城市',
				'number': '32090000', 'parent': '32000000'
			},
			{
				'city': '扬州市',
				'number': '32100000', 'parent': '32000000'
			},
			{
				'city': '镇江市',
				'number': '32110000', 'parent': '32000000'
			},
			{

				'city': '泰州市',
				'number': '32120000', 'parent': '32000000'
			},
			{
				'city': '宿迁市',
				'number': '32130000', 'parent': '32000000'
			}
		]
	},
	{
		'province': '浙江',
		'child': [
			{
				'city': '浙江',
				'number': '33000000', 'parent': '0'
			},
			{
				'city': '杭州市',
				'number': '33010000', 'parent': '33000000'
			},
			{

				'city': '宁波市',
				'number': '33020000', 'parent': '33000000'
			},
			{

				'city': '温州市',
				'number': '33030000', 'parent': '33000000'
			},
			{

				'city': '嘉兴市',
				'number': '33040000', 'parent': '33000000'
			},
			{

				'city': '湖州市',
				'number': '33050000', 'parent': '33000000'
			},
			{
				'city': '绍兴市',
				'number': '33060000', 'parent': '33000000'
			},
			{
				'city': '金华市',
				'number': '33070000', 'parent': '33000000'
			},
			{
				'city': '衢州市',
				'number': '33080000', 'parent': '33000000'
			},
			{
				'city': '舟山市',
				'number': '33090000', 'parent': '33000000'
			},
			{
				'city': '台州市',
				'number': '33100000', 'parent': '33000000'
			},
			{

				'city': '丽水市',
				'number': '33110000', 'parent': '33000000'
			},
		]
	},
	{
		'province': '安徽',
		'child': [
			{
				'city': '安徽',
				'number': '34000000', 'parent': '0'
			},
			{
				'city': '合肥市',
				'number': '34010000', 'parent': '34000000'
			},
			{
				'city': '芜湖市',
				'number': '34020000', 'parent': '34000000'
			},
			{
				'city': '蚌埠市',
				'number': '34030000', 'parent': '34000000'
			},
			{
				'city': '淮南市',
				'number': '34040000', 'parent': '34000000'
			},
			{
				'city': '马鞍山市',
				'number': '34050000', 'parent': '34000000'
			},
			{
				'city': '淮北市',
				'number': '34060000', 'parent': '34000000'
			},
			{
				'city': '铜陵市',
				'number': '34070000', 'parent': '34000000'
			},
			{
				'city': '安庆市',
				'number': '34080000', 'parent': '34000000'
			},
			{
				'city': '黄山市',
				'number': '34100000', 'parent': '34000000'
			},
			{
				'city': '滁州市',
				'number': '34110000', 'parent': '34000000'
			},
			{
				'city': '阜阳市',
				'number': '34120000', 'parent': '34000000'
			},
			{
				'city': '宿州市',
				'number': '34130000', 'parent': '34000000'
			},
			{
				'city': '巢湖市',
				'number': '34140000', 'parent': '34000000'
			},
			{
				'city': '六安市',
				'number': '34150000', 'parent': '34000000'
			},
			{
				'city': '亳州市',
				'number': '34160000', 'parent': '34000000'
			},
			{
				'city': '池州市',
				'number': '34170000', 'parent': '34000000'
			},
			{
				'city': '宣城市',
				'number': '34180000', 'parent': '34000000'
			}
		]
	},
	{
		'province': '福建',
		'child': [
			{
				'city': '福建',
				'number': '35000000', 'parent': '0'
			},
			{
				'city': '福州市',
				'number': '35010000', 'parent': '35000000'
			},
			{
				'city': '厦门市',
				'number': '35020000', 'parent': '35000000'
			},
			{
				'city': '莆田市',
				'number': '35030000', 'parent': '35000000'
			},
			{
				'city': '三明市',
				'number': '35040000', 'parent': '35000000'
			},
			{
				'city': '泉州市',
				'number': '35050000', 'parent': '35000000'
			},
			{
				'city': '漳州市',
				'number': '35060000', 'parent': '35000000'
			},
			{
				'city': '南平市',
				'number': '35070000', 'parent': '35000000'
			},
			{
				'city': '龙岩市',
				'number': '35080000', 'parent': '35000000'
			},
			{
				'city': '宁德市',
				'number': '35090000', 'parent': '35000000'
			}

		]
	},
	{
		'province': '江西',
		'child': [
			{
				'city': '江西',
				'number': '36000000', 'parent': '0'
			},
			{
				'city': '南昌市',
				'number': '36010000', 'parent': '36000000'
			},
			{
				'city': '景德镇市',
				'number': '36020000', 'parent': '36000000'
			},
			{
				'city': '萍乡市',
				'number': '36030000', 'parent': '36000000'
			},
			{
				'city': '九江市',
				'number': '36040000', 'parent': '36000000'
			},
			{
				'city': '新余市',
				'number': '36050000', 'parent': '36000000'
			},
			{
				'city': '鹰潭市',
				'number': '36060000', 'parent': '36000000'
			},
			{
				'city': '赣州市',
				'number': '36070000', 'parent': '36000000'
			},
			{
				'city': '吉安市',
				'number': '36080000', 'parent': '36000000'
			},
			{
				'city': '宜春市',
				'number': '36090000', 'parent': '36000000'
			},
			{
				'city': '抚州市',
				'number': '36100000', 'parent': '36000000'
			},
			{
				'city': '上饶市',
				'number': '36110000', 'parent': '36000000'
			}
		]
	},
	{
		'province': '山东',
		'child': [
			{
				'city': '山东',
				'number': '37000000', 'parent': '0'
			},
			{
				'city': '济南市',
				'number': '37010000', 'parent': '37000000'
			},
			{
				'city': '青岛市',
				'number': '37020000', 'parent': '37000000'
			},
			{
				'city': '淄博市',
				'number': '37030000', 'parent': '37000000'
			},
			{
				'city': '枣庄市',
				'number': '37040000', 'parent': '37000000'
			},
			{
				'city': '东营市',
				'number': '37050000', 'parent': '37000000'
			},
			{
				'city': '烟台市',
				'number': '37060000', 'parent': '37000000'
			},
			{
				'city': '潍坊市',
				'number': '37070000', 'parent': '37000000'
			},
			{
				'city': '济宁市',
				'number': '37080000', 'parent': '37000000'
			},
			{
				'city': '泰安市',
				'number': '37090000', 'parent': '37000000'
			},
			{
				'city': '威海市',
				'number': '37100000', 'parent': '37000000'
			},
			{
				'city': '日照市',
				'number': '37110000', 'parent': '37000000'
			},
			{
				'city': '莱芜市',
				'number': '37120000', 'parent': '37000000'
			},
			{
				'city': '临沂市',
				'number': '37130000', 'parent': '37000000'
			},
			{
				'city': '德州市',
				'number': '37140000', 'parent': '37000000'
			},
			{
				'city': '聊城市',
				'number': '37150000', 'parent': '37000000'
			},
			{
				'city': '滨州市',
				'number': '37160000', 'parent': '37000000'
			},
			{
				'city': '菏泽市',
				'number': '37170000', 'parent': '37000000'
			}
		]
	},
	{
		'province': '河南',
		'child': [
			{
				'city': '河南',
				'number': '41000000', 'parent': '0'
			},
			{
				'city': '郑州市',
				'number': '41010000', 'parent': '41000000'
			},
			{
				'city': '开封市',
				'number': '41020000', 'parent': '41000000'
			},
			{
				'city': '洛阳市',
				'number': '41030000', 'parent': '41000000'
			},
			{
				'city': '平顶山市',
				'number': '41040000', 'parent': '41000000'
			},
			{
				'city': '安阳市',
				'number': '41050000', 'parent': '41000000'
			},
			{
				'city': '鹤壁市',
				'number': '41060000', 'parent': '41000000'
			},
			{
				'city': '新乡市',
				'number': '41070000', 'parent': '41000000'
			},
			{
				'city': '焦作市',
				'number': '41080000', 'parent': '41000000'
			},
			{
				'city': '濮阳市',
				'number': '41090000', 'parent': '41000000'
			},
			{
				'city': '许昌市',
				'number': '41100000', 'parent': '41000000'
			},
			{
				'city': '漯河市',
				'number': '41110000', 'parent': '41000000'
			},
			{
				'city': '三门峡市',
				'number': '41120000', 'parent': '41000000'
			},
			{
				'city': '南阳市',
				'number': '41130000', 'parent': '41000000'
			},
			{
				'city': '商丘市',
				'number': '41140000', 'parent': '41000000'
			},
			{
				'city': '信阳市',
				'number': '41150000', 'parent': '41000000'
			},
			{
				'city': '周口市',
				'number': '41160000', 'parent': '41000000'
			},
			{
				'city': '驻马店市',
				'number': '41170000', 'parent': '41000000'
			}
		]
	},
	{
		'province': '湖北',
		'child': [
			{
				'city': '湖北',
				'number': '42000000', 'parent': '0'
			},
			{
				'city': '武汉市',
				'number': '42010000', 'parent': '42000000'
			},
			{
				'city': '黄石市',
				'number': '42020000', 'parent': '42000000'
			},
			{
				'city': '十堰市',
				'number': '42030000', 'parent': '42000000'
			},
			{
				'city': '宜昌市',
				'number': '42050000', 'parent': '42000000'
			},
			{
				'city': '襄樊市',
				'number': '42060000', 'parent': '42000000'
			},
			{
				'city': '鄂州市',
				'number': '42070000', 'parent': '42000000'
			},
			{
				'city': '荆门市',
				'number': '42080000', 'parent': '42000000'
			},
			{
				'city': '孝感市',
				'number': '42090000', 'parent': '42000000'
			},
			{
				'city': '荆州市',
				'number': '42100000', 'parent': '42000000'
			},
			{
				'city': '黄冈市',
				'number': '42110000', 'parent': '42000000'
			},
			{
				'city': '咸宁市',
				'number': '42120000', 'parent': '42000000'
			},
			{
				'city': '随州市',
				'number': '42130000', 'parent': '42000000'
			},
			{
				'city': '恩施州',
				'number': '42280000', 'parent': '42000000'
			}
		]
	},
	{
		'province': '湖南',
		'child': [
			{
				'city': '湖南',
				'number': '43000000', 'parent': '0'
			},
			{
				'city': '长沙市',
				'number': '43010000', 'parent': '43000000'
			},
			{
				'city': '株洲市',
				'number': '43020000', 'parent': '43000000'
			},
			{
				'city': '湘潭市',
				'number': '43030000', 'parent': '43000000'
			},
			{
				'city': '衡阳市',
				'number': '43040000', 'parent': '43000000'
			},
			{
				'city': '邵阳市',
				'number': '43050000', 'parent': '43000000'
			},
			{
				'city': '岳阳市',
				'number': '43060000', 'parent': '43000000'
			},
			{
				'city': '常德市',
				'number': '43070000', 'parent': '43000000'
			},
			{
				'city': '张家界市',
				'number': '43080000', 'parent': '43000000'
			},
			{
				'city': '益阳市',
				'number': '43090000', 'parent': '43000000'
			},
			{
				'city': '郴州市',
				'number': '43100000', 'parent': '43000000'
			},
			{
				'city': '永州市',
				'number': '43110000', 'parent': '43000000'
			},
			{
				'city': '怀化市',
				'number': '43120000', 'parent': '43000000'
			},
			{
				'city': '娄底市',
				'number': '43130000', 'parent': '43000000'
			},
			{
				'city': '湘西州',
				'number': '43310000', 'parent': '43000000'
			},
		]
	},
	{
		'province': '广东',
		'child': [
			{
				'city': '广东',
				'number': '44000000', 'parent': '0'
			},
			{
				'city': '广州市',
				'number': '44010000', 'parent': '44000000'
			},
			{
				'city': '韶关市',
				'number': '44020000', 'parent': '44000000'
			},
			{
				'city': '深圳市',
				'number': '44030000', 'parent': '44000000'
			},
			{
				'city': '珠海市',
				'number': '44040000', 'parent': '44000000'
			},
			{
				'city': '汕头市',
				'number': '44050000', 'parent': '44000000'
			},
			{
				'city': '佛山市',
				'number': '44060000', 'parent': '44000000'
			},
			{
				'city': '江门市',
				'number': '44070000', 'parent': '44000000'
			},
			{
				'city': '湛江市',
				'number': '44080000', 'parent': '44000000'
			},
			{
				'city': '茂名市',
				'number': '44090000', 'parent': '44000000'
			},
			{
				'city': '肇庆市',
				'number': '44120000', 'parent': '44000000'
			},
			{
				'city': '惠州市',
				'number': '44130000', 'parent': '44000000'
			},
			{
				'city': '梅州市',
				'number': '44140000', 'parent': '44000000'
			},
			{
				'city': '汕尾市',
				'number': '44150000', 'parent': '44000000'
			},
			{
				'city': '河源市',
				'number': '44160000', 'parent': '44000000'
			},
			{
				'city': '阳江市',
				'number': '44170000', 'parent': '44000000'
			},
			{
				'city': '清远市',
				'number': '44180000', 'parent': '44000000'
			},

			{
				'city': '东莞市',
				'number': '44190000', 'parent': '44000000'
			},
			{
				'city': '中山市',
				'number': '44200000', 'parent': '44000000'
			},
			{
				'city': '潮州市',
				'number': '44510000', 'parent': '44000000'
			},
			{
				'city': '揭阳市',
				'number': '44520000', 'parent': '44000000'
			},
			{
				'city': '云浮市',
				'number': '44530000', 'parent': '44000000'
			}
		]
	},
	{
		'province': '广西',
		'child': [
			{
				'city': '广西',
				'number': '45000000', 'parent': '0'
			},
			{
				'city': '南宁市',
				'number': '45010000', 'parent': '45000000'
			},
			{
				'city': '柳州市',
				'number': '45020000', 'parent': '45000000'
			},
			{
				'city': '桂林市',
				'number': '45030000', 'parent': '45000000'
			},
			{
				'city': '梧州市',
				'number': '45040000', 'parent': '45000000'
			},
			{
				'city': '北海市',
				'number': '45050000', 'parent': '45000000'
			},
			{
				'city': '防城港市',
				'number': '45060000', 'parent': '45000000'
			},
			{
				'city': '钦州市',
				'number': '45070000', 'parent': '45000000'
			},
			{
				'city': '贵港市',
				'number': '45080000', 'parent': '45000000'
			},
			{
				'city': '玉林市',
				'number': '45090000', 'parent': '45000000'
			},
			{
				'city': '百色市',
				'number': '45100000', 'parent': '45000000'
			},
			{
				'city': '贺州市',
				'number': '45110000', 'parent': '45000000'
			},
			{
				'city': '河池市',
				'number': '45120000', 'parent': '45000000'
			},
			{
				'city': '来宾市',
				'number': '45130000', 'parent': '45000000'
			},
			{
				'city': '崇左市',
				'number': '45140000', 'parent': '45000000'
			},
		]
	},
	{
		'province': '海南',
		'child': [
			{
				'city': '海南',
				'number': '46000000', 'parent': '0'
			},
			{
				'city': '海口市',
				'number': '46010000', 'parent': '46000000'
			},
			{
				'city': '三亚市',
				'number': '46020000', 'parent': '46000000'
			},
		]
	},
	{
		'province': '重庆市',
		'child': [
			{

				'city': '重庆市',
				'number': '50000000', 'parent': '0'
			}
		]
	},
	{
		'province': '四川',
		'child': [
			{
				'city': '四川',
				'number': '51000000', 'parent': '0'
			},
			{
				'city': '成都市',
				'number': '51010000', 'parent': '51000000'
			},
			{
				'city': '自贡市',
				'number': '51030000', 'parent': '51000000'
			},
			{
				'city': '攀枝花市',
				'number': '51040000', 'parent': '51000000'
			},
			{
				'city': '泸州市',
				'number': '51050000', 'parent': '51000000'
			},
			{
				'city': '德阳市',
				'number': '51060000', 'parent': '51000000'
			},
			{
				'city': '绵阳市',
				'number': '51070000', 'parent': '51000000'
			},
			{
				'city': '广元市',
				'number': '51080000', 'parent': '51000000'
			},
			{
				'city': '遂宁市',
				'number': '51090000', 'parent': '51000000'
			},
			{
				'city': '内江市',
				'number': '51100000', 'parent': '51000000'
			},
			{
				'city': '乐山市',
				'number': '51110000', 'parent': '51000000'
			},
			{
				'city': '南充市',
				'number': '51130000', 'parent': '51000000'
			},
			{
				'city': '眉山市',
				'number': '51140000', 'parent': '51000000'
			},
			{
				'city': '宜宾市',
				'number': '51150000', 'parent': '51000000'
			},
			{
				'city': '广安市',
				'number': '51160000', 'parent': '51000000'
			},
			{
				'city': '达州市',
				'number': '51170000', 'parent': '51000000'
			},
			{
				'city': '雅安市',
				'number': '51180000', 'parent': '51000000'
			},
			{
				'city': '巴中市',
				'number': '51190000', 'parent': '51000000'
			},
			{
				'city': '资阳市',
				'number': '51200000', 'parent': '51000000'
			},
			{
				'city': '阿坝州',
				'number': '51320000', 'parent': '51000000'
			},
			{
				'city': '甘孜州',
				'number': '51330000', 'parent': '51000000'
			},
			{
				'city': '凉山州',
				'number': '51340000', 'parent': '51000000'
			}
		]
	},
	{
		'province': '贵州',
		'child': [
			{
				'city': '贵州',
				'number': '52000000', 'parent': '0'
			},
			{
				'city': '贵阳市',
				'number': '52010000', 'parent': '52000000'
			},
			{
				'city': '六盘水市',
				'number': '52020000', 'parent': '52000000'
			},
			{
				'city': '遵义市',
				'number': '52030000', 'parent': '52000000'
			},
			{
				'city': '安顺市',
				'number': '52040000', 'parent': '52000000'
			},
			{
				'city': '铜仁地区',
				'number': '52220000', 'parent': '52000000'
			},
			{
				'city': '黔西南州',
				'number': '52230000', 'parent': '52000000'
			},
			{
				'city': '毕节市',
				'number': '52240000', 'parent': '52000000'
			},
			{
				'city': '黔东南州',
				'number': '52260000', 'parent': '52000000'
			},
			{
				'city': '黔南州',
				'number': '52270000', 'parent': '52000000'
			},
		]
	},
	{
		'province': '云南',
		'child': [
			{
				'city': '云南',
				'number': '53000000', 'parent': '0'
			},
			{
				'city': '昆明市',
				'number': '53010000', 'parent': '53000000'
			},
			{
				'city': '曲靖市',
				'number': '53030000', 'parent': '53000000'
			},
			{
				'city': '玉溪市',
				'number': '53040000', 'parent': '53000000'
			},
			{
				'city': '保山市',
				'number': '53050000', 'parent': '53000000'
			},
			{
				'city': '昭通市',
				'number': '53060000', 'parent': '53000000'
			},
			{
				'city': '丽江市',
				'number': '53070000', 'parent': '53000000'
			},
			{
				'city': '普洱市',
				'number': '53080000', 'parent': '53000000'
			},
			{
				'city': '临沧市',
				'number': '53090000', 'parent': '53000000'
			},
			{
				'city': '楚雄州',
				'number': '53230000', 'parent': '53000000'
			},
			{
				'city': '红河州',
				'number': '53250000', 'parent': '53000000'
			},
			{
				'city': '文山州',
				'number': '53260000', 'parent': '53000000'
			},
			{
				'city': '西双版纳州',
				'number': '53280000', 'parent': '53000000'
			},
			{
				'city': '大理州',
				'number': '53290000', 'parent': '53000000'
			},
			{
				'city': '德宏州',
				'number': '53310000', 'parent': '53000000'
			},
			{
				'city': '怒江州',
				'number': '53330000', 'parent': '53000000'
			},
			{
				'city': '迪庆州',
				'number': '53340000', 'parent': '53000000'
			}
		]
	},
	{
		'province': '西藏',
		'child': [
			{
				'city': '西藏',
				'number': '54000000', 'parent': '0'
			},
			{
				'city': '拉萨市',
				'number': '54010000', 'parent': '54000000'
			},
			{
				'city': '昌都地区',
				'number': '54210000', 'parent': '54000000'
			},
			{
				'city': '山南地区',
				'number': '54220000', 'parent': '54000000'
			},
			{
				'city': '日喀则地区',
				'number': '54230000', 'parent': '54000000'
			},
			{
				'city': '那曲地区',
				'number': '54240000', 'parent': '54000000'
			},
			{
				'city': '阿里地区',
				'number': '54250000', 'parent': '54000000'
			},
			{
				'city': '林芝地区',
				'number': '54260000', 'parent': '54000000'
			}
		]
	},
	{
		'province': '陕西',
		'child': [
			{
				'city': '陕西',
				'number': '61000000', 'parent': '0'
			},
			{
				'city': '西安市',
				'number': '61010000', 'parent': '61000000'
			},
			{
				'city': '铜川市',
				'number': '61020000', 'parent': '61000000'
			},
			{
				'city': '宝鸡市',
				'number': '61030000', 'parent': '61000000'
			},
			{
				'city': '咸阳市',
				'number': '61040000', 'parent': '61000000'
			},
			{
				'city': '渭南市',
				'number': '61050000', 'parent': '61000000'
			},
			{
				'city': '延安市',
				'number': '61060000', 'parent': '61000000'
			},
			{
				'city': '汉中市',
				'number': '61070000', 'parent': '61000000'
			},
			{
				'city': '榆林市',
				'number': '61080000', 'parent': '61000000'
			},
			{
				'city': '安康市',
				'number': '61090000', 'parent': '61000000'
			},
			{
				'city': '商洛市',
				'number': '61100000', 'parent': '61000000'
			}
		]
	},
	{
		'province': '甘肃',
		'child': [
			{
				'city': '甘肃',
				'number': '62000000', 'parent': '0'
			},
			{
				'city': '兰州市',
				'number': '62010000', 'parent': '62000000'
			},
			{
				'city': '嘉峪关市',
				'number': '62020000', 'parent': '62000000'
			},
			{
				'city': '金昌市',
				'number': '62030000', 'parent': '62000000'
			},
			{
				'city': '白银市',
				'number': '62040000', 'parent': '62000000'
			},
			{
				'city': '天水市',
				'number': '62050000', 'parent': '62000000'
			},
			{
				'city': '武威市',
				'number': '11000000', 'parent': '62000000'
			},
			{
				'city': '张掖市',
				'number': '62070000', 'parent': '62000000'
			},
			{
				'city': '平凉市',
				'number': '62080000', 'parent': '62000000'
			},
			{
				'city': '酒泉市',
				'number': '62090000', 'parent': '62000000'
			},
			{
				'city': '庆阳市',
				'number': '62100000', 'parent': '62000000'
			},
			{
				'city': '定西市',
				'number': '62110000', 'parent': '62000000'
			},
			{
				'city': '陇南市',
				'number': '62120000', 'parent': '62000000'
			},
			{
				'city': '临夏州',
				'number': '62290000', 'parent': '62000000'
			},
			{
				'city': '甘南州',
				'number': '62300000', 'parent': '62000000'
			},
		]
	},
	{
		'province': '青海',
		'child': [
			{
				'city': '青海',
				'number': '63000000', 'parent': '0'
			}, {
				'city': '西宁市',
				'number': '63010000', 'parent': '63000000'
			},
			{
				'city': '海东地区',
				'number': '63210000', 'parent': '63000000'
			},
			{
				'city': '海北州',
				'number': '63220000', 'parent': '63000000'
			},
			{
				'city': '黄南州',
				'number': '63230000', 'parent': '63000000'
			},
			{
				'city': '海南州',
				'number': '63250000', 'parent': '63000000'
			},
			{
				'city': '果洛州',
				'number': '63260000', 'parent': '63000000'
			},
			{
				'city': '玉树州',
				'number': '63270000', 'parent': '63000000'
			},
			{
				'city': '海西州',
				'number': '63280000', 'parent': '63000000'
			},
		]
	},
	{
		'province': '宁夏',
		'child': [
			{
				'city': '宁夏',
				'number': '64000000', 'parent': '0'
			},
			{
				'city': '银川市',
				'number': '64010000', 'parent': '64000000'
			},
			{
				'city': '石嘴山市',
				'number': '64020000', 'parent': '64000000'
			},
			{
				'city': '吴忠市',
				'number': '64030000', 'parent': '64000000'
			},
			{
				'city': '固原市',
				'number': '64040000', 'parent': '64000000'
			},
			{
				'city': '中卫市',
				'number': '64050000', 'parent': '64000000'
			}
		]
	},
	{
		'province': '新疆',
		'child': [
			{
				'city': '新疆',
				'number': '65000000', 'parent': '0'
			},
			{
				'city': '乌鲁木齐市',
				'number': '65010000', 'parent': '64000000'
			},
			{
				'city': '克拉玛依市',
				'number': '65020000', 'parent': '64000000'
			},
			{
				'city': '吐鲁番地区',
				'number': '65210000', 'parent': '64000000'
			},
			{
				'city': '哈密地区',
				'number': '65220000', 'parent': '64000000'
			},
			{
				'city': '昌吉回族自治州',
				'number': '65230000', 'parent': '64000000'
			},
			{
				'city': '博尔塔拉蒙古自治州',
				'number': '65270000', 'parent': '64000000'
			},
			{
				'city': '巴音郭楞蒙古自治州',
				'number': '65280000', 'parent': '64000000'
			},
			{
				'city': '阿克苏地区',
				'number': '65290000'
			},
			{
				'city': '克孜勒苏柯尔克孜自治州',
				'number': '65300000', 'parent': '64000000'
			},
			{
				'city': '喀什地区',
				'number': '65310000', 'parent': '64000000'
			},
			{
				'city': '和田地区',
				'number': '65320000', 'parent': '64000000'
			},
			{
				'city': '伊犁哈萨克自治州',
				'number': '65400000', 'parent': '64000000'
			},
			{
				'city': '塔城地区',
				'number': '65420000', 'parent': '64000000'
			},
			{
				'city': '阿勒泰地区',
				'number': '65430000', 'parent': '64000000'
			}
		]
	},
	{
		'province': '台湾',
		'child': [
			{

				'city': '台湾',
				'number': '71000000', 'parent': '0'
			}
		]
	},
	{
		'province': '香港',
		'child': [
			{

				'city': '香港',
				'number': '81000000', 'parent': '0'
			}
		]
	},
	{
		'province': '澳门',
		'child': [
			{

				'city': '澳门',
				'number': '82000000', 'parent': '0'
			}
		]
	}

]