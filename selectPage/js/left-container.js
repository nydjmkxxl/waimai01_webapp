;(function ($) {
   "use strict";
        
    // 创建 点菜 —— 左侧 每一项 类目 字符串
    var leftCategoryHtml = `<div class="category-item">
                                    <div class="category-item-name">$getClassificationName</div>
                                  </div>`;
    //  创建 父级 Zepto 对象
    var $leftCategory = $('.left-category');
    var $rightShopping = $('.right-shopping');

    // 创建 左侧 分类 html 函数
    function createLeftClassificationHtml(foodList, originData ) {

        // 遍历 给 左侧 每一项 名字 替换 
        foodList.forEach(( item )=>{

            var categoryItemStr = leftCategoryHtml.replace('$getClassificationName', getClassificationName( item ));

            // 将 字符串 包装 成 Zepto 对象
            var $categoryItem = $(categoryItemStr);
            
            // 给 左侧 每一项 挂载  属于自己的数据
            $categoryItem.data('categoryItemData', item);
            // 追加 html 
            $leftCategory.append( $categoryItem );
            
        });

        // 先创建 容纳内容的 shopping-container 结构 然后 等待 对号入座
        var $leftCategoryItems = $('.category-item');
        var $leftCategoryItemsLength = $leftCategoryItems.length;
        var html = '';

        // 根据获取得到的 类数组长度 来判断要循环多少个容器
        for(var i=0; i<$leftCategoryItemsLength; i++) {
            html += `<div class="shopping-container"></div>`;
        }
        // 循环完毕 将html结构追加上去 
        $rightShopping.append(html);
        // 初始状态 显示第一屏
        $leftCategoryItems.eq(0).trigger('click');
    }

    // 请求分类数据
    function requestLeftcategoryData() {

        $.get('selectPage/json/food.json', function ( data ) {

            var foodList = data.data.food_spu_tags || [];

            //  调用 创建 左侧 分类 html
            createLeftClassificationHtml( foodList, data );

        });
    }

    // 创建 分类 每一项 的名字
    function getClassificationName( data ) {

        if( data.icon ) {   
            return `<img class="item-pic" src=${data.icon} />${data.name}`;
        }else{
            return data.name;
        }
    }
   
    function init() {
        requestLeftcategoryData();
    }
    init();

}(Zepto));