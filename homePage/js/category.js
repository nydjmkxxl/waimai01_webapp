
;(function ($) {
    "use strict";
    // 创建左侧类目的每一项字符串
    var categoryHtml = `<div class="category-item">
                            <img class="item-pic" src=$url />
                            <p class="item-text">$name</p>
                        </div>`; 
    // 获取父级的 Zepto 对象
    var $category = $('.category');

    // 创建左侧类目的每一项函数
    function createCategoryItemHtml() {

        // 获取分类的 json 数据
        $.get('homePage/json/head.json', function ( data ) {
            
            // 仅提取前 8个 数据
            var list = data.data.primary_filter.splice(0, 8);
            var html = '';

            // 遍历 将 图片和名字 添加到 html结构中
            list.forEach((item) => {

                html += categoryHtml
                        .replace('$url', item.url)
                        .replace('$name', item.name);
            });
            // 追加 html
            $category.append(html);
        });
    }                    
    createCategoryItemHtml();

}(Zepto));
        
