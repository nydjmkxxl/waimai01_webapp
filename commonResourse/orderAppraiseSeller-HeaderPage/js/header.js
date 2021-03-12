;(function ($) {
    "use strict";
    
    // 创建 文档顶部 共用 的 html 结构
    var headerHtml = `<a class="$key tab-item" href="$key.html">
                    $text
                    </a>`;
    var $header = $('.header-tab-bar');

    function init() {
        var itemData = [
            {
                key : 'select',
                name : '点菜'
            },{
                key : 'comment',
                name : '评价'
            },{
                key : 'seller',
                name : '商家'
            }
        ];

        var html = '';

        itemData.forEach((item)=>{
            html += headerHtml.replace(/\$key/g, item.key)
                            .replace('$text', item.name);
        });
        $header.append( html );

        var siteAdressArr = window.location.pathname.split('/');
        var pageName = siteAdressArr[siteAdressArr.length-1].replace('.html', '');

        $('a.'+pageName).addClass('active');
    }
    init();
 }(Zepto));