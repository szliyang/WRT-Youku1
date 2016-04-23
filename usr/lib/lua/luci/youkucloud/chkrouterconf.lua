module ("luci.youkucloud.chkrouterconf", package.seeall)

checklist1_item1 = {["itemname"] = "sn", ["itemtitle"] = "路由宝 SN", ["havecheckbox"] = "no"}
checklist1_item2 = {["itemname"] = "version", ["itemtitle"] = "路由宝系统版本", ["havecheckbox"] = "no"}
checklist1_item3 = {["itemname"] = "wanstate", ["itemtitle"] = "WAN口连接状况", ["havecheckbox"] = "no"}
checklist1_item4 = {["itemname"] = "constate", ["itemtitle"] = "网络连通性", ["havecheckbox"] = "no", ["jumpto"] = "wanset"}

checklist2_item1 = {["itemname"] = "channal", ["itemtitle"] = "Wi-Fi信道情况", ["havecheckbox"] = "yes", ["setitem"] = "changechannal"}
checklist2_item1_2g = {["itemname"] = "channal_2G", ["itemtitle"] = "2.4G Wi-Fi信道情况", ["havecheckbox"] = "yes", ["setitem"] = "changechannal"}
checklist2_item1_5g = {["itemname"] = "channal_5G", ["itemtitle"] = "5G Wi-Fi信道情况", ["havecheckbox"] = "yes", ["setitem"] = "changechannal5g"}
checklist2_item2 = {["itemname"] = "bandwidth", ["itemtitle"] = "上行带宽设置", ["havecheckbox"] = "yes", ["setitem"] = "setbandwidth"}
checklist2_item3 = {["itemname"] = "txpower", ["itemtitle"] = "当前Wi-Fi强度模式", ["havecheckbox"] = "yes", ["setitem"] = "settxpower"}
checklist2_item4 = {["itemname"] = "rssi", ["itemtitle"] = "两天线间RSSI差值", ["havecheckbox"] = "no", ["jumpto"] = "adjustment"}
checklist2_item5 = {["itemname"] = "runtime", ["itemtitle"] = "运行时长", ["havecheckbox"] = "yes", ["setitem"] = "routerrestart"}

checklist3_item1 = {["itemname"] = "bandwidth", ["itemtitle"] = "上行带宽设置", ["havecheckbox"] = "yes", ["setitem"] = "setbandwidth"}
checklist3_item2 = {["itemname"] = "accmode", ["itemtitle"] = "赚钱模式", ["havecheckbox"] = "yes", ["setitem"] = "setaccmode"}
checklist3_item3 = {["itemname"] = "tfstate", ["itemtitle"] = "TF卡读写状态", ["havecheckbox"] = "yes", ["setitem"] = "routerrestart"}
checklist3_item4 = {["itemname"] = "onlinetime", ["itemtitle"] = "累积在线时长", ["havecheckbox"] = "no"}
checklist3_item5 = {["itemname"] = "servercon", ["itemtitle"] = "与优酷服务器连接状态", ["havecheckbox"] = "no"}
checklist3_item6 = {["itemname"] = "routerlevel", ["itemtitle"] = "路由宝是否为二级路由", ["havecheckbox"] = "no"}

WANSTATE_REF = {["success"] = "已连接",["failed"] = "未连接",["failedref"] = "WAN口未连接或网线已损坏"}
CONSTATE_REF = {["success"] = "正常",["failed"] = "异常",["failedref1"] = "请检查连网方式是否正确。如仍不能上网，请尝试重启或恢复出厂设置",["failedref2"] = "请检查DNS设置"}
CHANNAL_REF = {["nowifi"] = "关闭",["trificsuccess"] = "良好",["trificfailed"] = "拥堵",["failed"] = "信号强度差",["failedref"] = "建议切换到最优信道"}
BANDWIDTH_REF = {["success1"] = "正常",["success2"] = "未手动设置",["failed"] = "设置值与检测值偏差大",["failed2"] = "无法获取",["failedref"] = "请根据实际带宽合理设置上行带宽值",["failedref2"] = "请检查网络连接"}
TXPOWER_REF = {["nowifi"] = "关闭",["success"] = "穿墙",["failed1"] = "标准",["failed2"] = "绿色",["failedref"] = "建议切换至穿墙模式"}
RSSI_REF = {["nowifi"] = "关闭",["success"] = "良好",["failed"] = "大",["failedref"] = "请将天线直立平行摆放，减少周边遮挡"}
RUNTIME_REF = {["day"] = "天",["hour"] = "小时",["munite"] = "分钟",["failedref"] = "运行时间较长，建议重启"}
ACCMODE_REF = {["success1"] = "激进",["success2"] = "固定收益",["failed1"] = "平衡",["failed2"] = "保守",["failed3"] = "暂停",["failed4"] = "无法获取",["failedref"] = "建议调整赚钱模式为激进",["failedref2"] = "请检查网络连接"}
TFSTATE_REF = {["success"] = "正常",["failed"] = "异常",["failedref"] = "建议重启"}
ONLINETIME_REF = {["success"] = "正常",["failed"] = "低于48小时",["failed2"] = "无法获取",["failedref"] = "路由宝需要几天缓存内容，之后就能正常为您赚金币啦",["failedref2"] = "请检查网络连接"}
SERVERCON_REF = {["success"] = "正常",["failed"] = "异常",["failedref"] = "由于您的宽带运营商限制，导致与优酷服务器连接异常，优金币收益可能受到影响，建议联系运营商"}
ROUTERLEVEL_REF = {["success"] = "否",["failed"] = "是",["failedref"] = "路由宝作为二级路由，赚钱能力有可能会受到较大影响，建议将路由宝作为主路由"}
