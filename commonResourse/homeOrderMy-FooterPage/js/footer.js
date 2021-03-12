;(function ($) {
   "use strict";
    
    // 创建 文档底部 共用 的 html 结构
    var footerHtml = `<a class="$key btn-item" href="$key.html">
                        <div class="btn-icon"></div>
                        <div class="btn-name">$name</div>
                      </a>`;
    var $footer = $('.footer');

    function init() {
        var itemData = [
            {
                key : 'home',
                name : '首页'
            },{
                key : 'order',
                name : '订单'
            },{
                key : 'my',
                name : '我的'
            }
        ];

        var html = '';

        itemData.forEach((item, index)=>{
            html += footerHtml.replace(/\$key/g, item.key)
                              .replace('$name', item.name);
        });
        $footer.append( html );

        var siteAdressArr = window.location.pathname.split('/');
        // var pageName = siteAdressArr.slice(siteAdressArr.length-1).toString().replace('.html', '');
        var pageName = siteAdressArr[siteAdressArr.length-1].replace('.html', '');

        $('a.'+pageName).addClass('active');
    }
    init();
}(Zepto));