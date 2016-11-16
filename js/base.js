
var isShowAd = false; // 是否显示广告 总开关
var isShowIndexAd = false; // 是否显示首页上的广告
var isShowTopicAd = false; // 是否显示topic文章广告
var isShowCommandAd = false; // 是否显示命令广告

$.getUrlParam = function (name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
};



/**
 * 判断是否是移动浏览器
 */
function isMobileBrowser(){
		var sUserAgent = navigator.userAgent.toLowerCase();
    var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
    var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
    var bIsMidp = sUserAgent.match(/midp/i) == "midp";
    var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
    var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
    var bIsAndroid = sUserAgent.match(/android/i) == "android";
    var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
    var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
    if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
        return true;
    }
    return false;
}

function click_bbs_post_href(){
		if($("#bbs_post_href").length){
			window.open($("#bbs_post_href").attr('href'));
		}
}
	