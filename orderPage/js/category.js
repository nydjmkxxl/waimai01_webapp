
;(function ($) {
    "use strict";

    var categoryHtml = `<div class="category-item">
                            <img class="item-pic" src=$url />
                            <p class="item-text">$name</p>
                        </div>`; 
    var $category = $('.category');

    function createCategoryItemHtml() {
        // 获取 category 的数据

        $.get('../json/head.json', function ( data ) {
            
            var list = data.data.primary_filter.splice(0, 8);
            var html = '';

            list.forEach((item, index) => {

                html += categoryHtml
                .replace('$url', item.url)
                .replace('$name', item.name);
            });

            $category.append(html);
        });
    }                    

    function addClick() {
        $category.on('click', '.category-item', function () {
            
        });
    }

    function init() {
        createCategoryItemHtml();
        addClick()
    }
    init();

}(jQuery));
        
