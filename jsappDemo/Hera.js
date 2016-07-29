
/*************** 交互协议 ***************
 
 1、web端通过Hera对象发起的所有请求，APP端返回JSON，结构如下：
     {
         status : 0,         //状态，0失败，1成功
         result : "",        //结果
         reason : "未登录"    //原因
     }
 
 ***************************************/

function setupWebViewJavascriptBridgeForIOS(callback) {
    if (window.WebViewJavascriptBridge) { return callback(WebViewJavascriptBridge); }
    if (window.WVJBCallbacks) { return window.WVJBCallbacks.push(callback); }
    window.WVJBCallbacks = [callback];
    var WVJBIframe = document.createElement('iframe');
    WVJBIframe.style.display = 'none';
    WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__';
    document.documentElement.appendChild(WVJBIframe);
    setTimeout(function() { document.documentElement.removeChild(WVJBIframe) }, 0)
}

function setupWebViewJavascriptBridgeForAndroid(callback) {
    if (window.WebViewJavascriptBridge) {
        callback(WebViewJavascriptBridge)
    } else {
        document.addEventListener(
            'WebViewJavascriptBridgeReady'
            , function() {
                callback(WebViewJavascriptBridge)
            },
            false
        );
    }

}

var webViewBridge

var isIOS = true
if(isIOS){
    setupWebViewJavascriptBridgeForIOS(function(bridge) {
        webViewBridge = bridge;

        //     web端为APP提供的服务，在此注册，示例如下：
        //     webViewBridge.registerHandler('getPageName', function(data, responseCallback) {
        //                                   var responseData = '积分商城'
        //                                   responseCallback(responseData)
        //                                   })
        })
    }else{
        setupWebViewJavascriptBridgeForAndroid(function(bridge) {

            bridge.init(function(message, responseCallback) {
            console.log('JS got a message', message);
            var data = {
            'Javascript Responds': '测试中文!'
            };
            console.log('JS responding with', data);
            responseCallback(data);
            });

            webViewBridge = bridge;

    })
}

function Hera()
{
    /**
        功能：获取APP信息，比如：accessKey、bundleVersion等
        参数：appInfoCallBack --回调函数，接收一个参数（APP信息）
     */
    function getAPPInfo(appInfoCallBack)
    {
        webViewBridge.callHandler('getAPPInfo','', function(response) {
        //alert("收到")
                                  appInfoCallBack(response)
                                  })
    }
    this.getAPPInfo = getAPPInfo
    
    
    
    /**
        功能：获取用户登录信息
        参数：userInfoCallBack --回调函数，接收一个参数（用户信息）
     */
    function getUserInfo(userInfoCallBack)
    {
        webViewBridge.callHandler('getUserInfo','', function(response) {
                                  userInfoCallBack(response)
                                  })
    }
    this.getUserInfo = getUserInfo
    
    
    
    
    
    /**
     功能：调起登录页
     参数：loginCallBack --回调函数，接收一个参数（用户信息）
     */
    function callUpLoginPage(loginCallBack)
    {
        webViewBridge.callHandler('login','', function(response) {
                                  loginCallBack(response)
                                  })
    }
    this.callUpLoginPage = callUpLoginPage
    
    
    
    
    /**
        功能：分享到第三方平台
        参数：title          --分享标题
             message        --分享内容
             imageURL       --图片链接
             pageURL        --页面链接
     */
    function share(title, message, imageURL, pageURL) {
        var shareDic = {'title' : title,
                        'message' : message,
                        'imageURL' : imageURL,
                        'pageURL' : pageURL}
        webViewBridge.callHandler('share',shareDic)
    }
    this.share = share
    
    
    
    
    /**
         功能：设置右上角的更多菜单选项
         参数：title          --分享标题
              message        --分享内容
              imageURL       --图片链接
              pageURL        --页面链接
     */
    function setupTopRightMenuItems(menuItems) {
        webViewBridge.callHandler('setupTopRightMenuItems',menuItems)
    }
    this.setupTopRightMenuItems = setupTopRightMenuItems
    
    
    /**
     功能：生成右上角的更多菜单选项
     参数：title          --菜单标题
          callBackCode   --选中后APP端回调代码，用于通知web端用户选中了哪一项，比如："onUserClickedMenuIndex(2)"
     */
    function topRightMenuItem(title,callBackCode)
    {
        var item = {'title'         : title,
                    'callBackCode'  : callBackCode}
        return item;
    }
    this.topRightMenuItem = topRightMenuItem
    
    
    
    
//    function registerHandler(handlerName, handlerCallBack){
//        webViewBridge.registerHandler(handlerName, handlerCallBack)
//    }
//    this.registerHandler = registerHandler;
}



