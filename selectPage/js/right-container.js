;(function ($) {
    "use strict";
        
    // 创建 右侧 每一项 商品 字符串
    var rightShoppingItemHtml = `<div class="shopping-item">
                                    <img class="shopping-item-pic" src=$picture />
                                    <div class="shopping-item-info">
                                        <p class="shopping-item-title">$name</p>
                                        <p class="shopping-item-desc">$description</p>
                                        <p class="shopping-item-zan">$praise_content</p>
                                        <p class="shopping-item-price">￥$min_price
                                            <span class="shopping-item-price-unit">$unit</span>
                                        </p>
                                    </div>
                                    <div class="shopping-item-select">
                                        <div class="shopping-item-minus"></div>
                                        <div class="shopping-item-count">$chooseCount</div>
                                        <div class="shopping-item-plus"></div>
                                    </div>
                                </div>`;
    // 获取需要的 Zepto 对象                            
    var $rightShopping = $('.right-shopping');
    var $leftCategory = $('.left-category');
    var $rightTitle = $('.right-title');
    var $elem = $('.right-container')
    // 初始状态 当前索引为 空
    var curIndex = null;
    // 计数器
    var count = 0;

    // 左侧 类目 点击事件
    $leftCategory.on('click', '.category-item', function () {

        // 获取类目集合
        var $categoryItems = $('.category-item');
        // 获取当前点击的索引
        var index = $categoryItems.index(this);
        // 获取之前挂载到类目上  属于自己的数据
        var categoryItemData = $categoryItems.eq(index).data('categoryItemData');
        // 获取要 对号入座 的父级集合
        var $shoppingContainerItems = $('.shopping-container');
        // 获取左侧类目集合长度
        var $categoryItemsLength = $categoryItems.length;
        // 初始状态左侧每一项的 isLoaded 都为 undefined
        var isLoaded = $($categoryItems[index]).data('isLoaded');

        // 如果 左侧类目被重复点击 则不再执行以下代码
        if(curIndex == index) return;
        // 同步当前索引
        curIndex = index;
        
        // 当左侧类目中的 isLoaded 的值不存在时，
        // 说明左侧的类目 对应的 右侧商品集合html结构并没有被创建，所以 触发 创建右侧每一项商品的 html 函数
        if( !isLoaded ) {
            //                                            点击的当前类目索引, 当前类目中的数据, 分类元素集合, 右侧容纳属于自己商品集合的容器集合
            $rightShopping.trigger('createRightShoppingItemHtml', [index, categoryItemData, $categoryItems, $shoppingContainerItems]);
            // 创建完成每一个商品html结构后，将 计数器 + 1
            count++;
            // 当计数器的值 与 左侧类目集合的长度 相同时，就说明 根据左侧类目创建自己的右侧所有商品html结构 全部完成，以后不用在 触发 创建右侧商品html结构了
            if($categoryItemsLength === count) {
                // 触发加载完毕事件，然后 解绑 创建右侧商品html结构事件
                $rightShopping.off('.loaded');
            }
        }
        // 更新 右侧顶部标题
        $rightTitle.html(categoryItemData.name);
        // 点击左侧类目 对应的 右侧容器显示， 其他容器都隐藏
        $shoppingContainerItems.eq(index).show().siblings().hide();
        // 点击左侧类目 添加 actie 类，其他移除 active 类
        $categoryItems.eq(index).addClass('active').siblings().removeClass('active');
        // 点击左侧类目 将右侧的 scrollTop 设置为 0 ，也就是顶部位置
        $elem.scrollTop(0);

        // 点击 加减按钮 共用的函数
        function plusAndMinusEvent(e, callback) {
            // 根据当前元素找到父级同类元素集合
            var shoppingItemCollection = $(e.target).parents('.shopping-container').find('.shopping-item');
            // 在获得的集合中判断 索引值
            var index = shoppingItemCollection.index($(e.target).parents('.shopping-item'));
            // 获得选择的商品数量
            var $count = $(e.target).parent().find('.shopping-item-count');
            // 根据索引值获得自己的数据
            var data = $(e.target).parents('.shopping-container').data('rightShoppingItemData')[index];
            
            // 调用回调 然后将需要的返回值 保存起来
            var numObj = callback && callback( $count );
            // 如果 得到的数字 为负数，那就不在执行以下代码
            if(numObj.num < 0) return;

            // 将操作后的数值，更新 选中商品的数量
            $count.text( numObj.num );
            // 然后把 数据中的 chooseCount 的属性值也更新
            $(e.target).parents('.shopping-container').data('rightShoppingItemData')[index].chooseCount = numObj.num;

            // 触发 在购物车添加商品 事件，并将所需要使用的一些数据传入
            $('.shop-cart').trigger('addShopItem', [numObj, data]);

            // 获取在 【 右侧商品对象 】挂载的【 对应的购物车里的商品对象 】
            var $elem = $(e.target).parents('.shopping-item').data('self');
            // 获取商品 单价    
            var price = parseFloat($(e.target).parent().prev().find('.shopping-item-price').text().replace('￥',''));
            // 如果 【 对应的购物车里的商品对象 】存在时
            if($elem) {
                // 找到【 对应的购物车里的商品对象 】下的显示 共计金额的元素 更新金额
                $elem.find('.selected-total-price').text(numObj.num * price); 
            }
            // 执行 挂载在 window 上的 【 更新购物车所有商品的总共金额 】
            window.BottoemTotalPrice._writeContentTotalPrice();

        }
    
        // 点击 加减按钮 事件
        $('.right-shopping').off('click')
        .on('click', '.shopping-item-plus', function (e) {
            // 将当前的 商品元素 保存起来
            var self = $(e.currentTarget).parents('.shopping-item');
            
            // 调用 加减事件
            plusAndMinusEvent(e, function ($count) {
                // 将 数据返回
                return {
                    num : (parseInt($count.text()) || 0) + 1,
                    self : self
                };
            });
        })
        .on('click', '.shopping-item-minus', function (e) {
            // 将当前的 商品元素 保存起来
            var self = $(e.currentTarget).parents('.shopping-item');
            // 调用 加减事件
            plusAndMinusEvent(e, function ($count) {
                // 将 数据返回
                // 如果 数量为 0, 那就不能再减了
                if( !parseInt($count.text()) ) {
                    return {
                        num : 0,
                        self : self
                    };
                }else{
                    return {
                        num : (parseInt($count.text()) - 1),
                        self : self
                    };
                }
            });
        });

    });

    // ------------------------------------------------------------------------------------------------------------

    //创建右侧每一项商品的 html 函数                         点击的当前类目索引, 当前类目中的数据, 分类元素集合, 右侧容纳属于自己商品集合的容器集合
    $rightShopping.on('createRightShoppingItemHtml.loaded', function (_, index, categoryItemData, $categoryItems, $shoppingContainerItems) {

        // 此时 将左侧 被点击的 那个类目 的 isLoaded 设置 为true，那么以后就不用再创建 html 结构了 
       $($categoryItems[index]).data('isLoaded', true) 

        // 对应类目 每一个商品集合 存起来
        var spusArr = categoryItemData.spus;
        var html = '';
        
        // 遍历集合中每一个商品 来 创建 对应的 html结构
        spusArr.forEach((item)=>{
            // 查看有没有选取商品的数量，没有则设置为0
            if(!item.chooseCount) {
                item.chooseCount = 0;
            }
            html += rightShoppingItemHtml
                    .replace('$picture', item.picture)
                    .replace('$name', item.name)
                    .replace('$description', item.description)
                    .replace('$praise_content', item.praise_content)
                    .replace('$min_price', item.min_price)
                    .replace('$unit', item.unit)
                    .replace('$chooseCount', item.chooseCount);
        });

        html += '<p class="bottomLine">我是有底线的</p>'
        // 将创建好的商品集合的 html 结构 追加到 对号的容器 入座
        $shoppingContainerItems.eq(index).append(html)
        // 在容纳 商品集合 的父级 挂载属于 自己的 商品集合数据
        $($shoppingContainerItems[index]).data('rightShoppingItemData', spusArr);
        // 在容纳 商品集合 的父级 挂载属于 左侧对应的 类目数据
        $($shoppingContainerItems[index]).data('categoryItemData', categoryItemData); 
    }); 

}(Zepto));
