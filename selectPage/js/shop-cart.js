;(function ($) {
    "use strict";
    
    // 购物车顶部内容
    var shopCartTopHtml = `<div class="choose-content hide">
                                <div class="content-top">
                                    <div class="clear-cart">清空购物车</div>
                                </div>
                                <div class="selected-shop-item"></div>
                            </div>`;
    // 购物车底部内容 
    var shopCartBottomHtml = `<div class="bottom-content">
                                <div class="shop-pic">
                                <div class="dot-num hide"></div>
                                </div>
                                <div class="price-content">
                                    <p class="total-price">￥<span class="total-price-span">0</span></p>
                                    <p class="other-price">另需配送&nbsp;￥<span class="shop-fee">0</span></p>
                                </div>
                                <div class="submit-btn">去结算</div>
                           </div>`;
    // 获取父级 Zepto 对象
    var $shopCart = $('.shop-cart');
    // 追加 html 结构
    function createShopCartTopHtml() {

        $shopCart.append( shopCartTopHtml );
        $shopCart.append( shopCartBottomHtml);
    }
    // -----------------------------------------------------------------------------------------------

    // 给购物车添加商品 html 结构
    $('.shop-cart').on('addShopItem', function (_, numObj, data) {

        // 保存商品对象
        var $elem = numObj.self;  
        // 从数据中获取 chooseCount 值
        var chooseCount = data.chooseCount;  
        // 获取显示购物车共计金额的元素
        var $totalPrice = $('.total-price-span');

        // 创建购物车 html 结构
        function createShopCartHtml() {
            // 如果商品对象的 html 为true，那就说明已经在购物车创建了自己的 html 结构，以后不用创建了
            if($elem.data('html')) {
                // 获取 商品对象 的标题名字
                var shopName = $elem.find('.shopping-item-title').text();
                // 获取 购物车 的商品名字
                var $shopItems = $('.selected-item-name');
                // 更新购物车信息
                function updateShopCartInfo(callback) {
                    // 遍历购物车每个商品
                    $shopItems.each(function (_, item) {
                        // 如果商品对象的标题字符串 与 购物车商品名字字符串 相等时
                        if($(item).text() === shopName) {
                            // 调用自己的回调
                            callback && callback($(item));
                            return false;
                        }   
                    });
                }
    
                // 如果 加减后的数值为 0，那么 购物车里的对应的数据也要把 对应的商品信息清空
                if( !numObj.num ) {
                    // 调用 更新购物车信息 函数
                    updateShopCartInfo(function (item) {
                        // 将自己的 html 移除 
                        item.parent().remove();
                        // 并将 右侧商品对象上的 html 设置为false，这样当添加时，又可以在购物车创建自己的商品信息
                        // 【避免在购物车重复创建商品信息】
                        $elem.data('html', false);
                    });
                }else{
                    // 调用 更新购物车信息 函数
                    updateShopCartInfo(function (item) {
                        // 更新 购物车 对应的商品数量
                        $(item).parent().find('.shopping-item-count').text(chooseCount);
                    });
                }
    
            }else{
                // 能走到这里的，那就说明在购物车里没有对应的商品 html 结构，所以在这里创建
                // 防线：商品数量为 0 的，不能创建商品 html 结构
                if(!numObj.num) return;
                // 然后把商品对象的 html 为true 以后不用创建了 【避免在购物车重复创建商品信息】
                $elem.data('html', true);

                var addShopHtml = `<div class="selected-item">
                                        <div class="selected-item-name one-line">$name</div>
                                        <div class="selected-item-price">￥<span class="selected-total-price">$price</span></div>
                                        <div class="shopping-item-select">
                                            <div class="shopping-item-minus"></div>
                                            <div class="shopping-item-count">$chooseCount</div>
                                            <div class="shopping-item-plus"></div>
                                        </div>
                                    </div>`;
                var html = '';
                // 如果数据中的选择数量大于0，创建 html 结构
                if(data.chooseCount > 0) {
                    // 购物车每个商品自己的共计金额
                    var oneselfTotalPrice = data.min_price * data.chooseCount;
    
                    html += addShopHtml.replace('$name', data.name)
                                       .replace('$price', oneselfTotalPrice)
                                       .replace('$chooseCount', chooseCount);
    
                    var $html = $(html);
                    // 在【 购物车里的商品对象 】挂载【 对应的右侧商品对象 】，这样 双方都能找到
                    $html.data('that', numObj.self);
                    // 在【 右侧商品对象 】挂载 【 对应的购物车里的商品对象 】，这样 双方都能找到
                    $( numObj.self).data('self', $html);
                    // 同时把商品信息数据挂载到 购物车商品对象上
                    $html.data('data', data);
                    $('.selected-shop-item').append($html);
                }
            }
            // -----------------------------------------------------------------------------
            // 购物车的 加减按钮 共用函数
            function _plusAndMinusEvent(e, callback) {

                // 在当前元素上找到 【 对应的右侧商品对象 】
                var $parent = $(e.currentTarget).parents('.selected-item').data('that');
                // 从【 对应的右侧商品对象 】上找到 选择的商品数量
                var num = $parent.find('.shopping-item-count').text();

                // 得到加减后的数量
                var _totalCount = callback && callback(num);
                // 如果 得到的数字 为负数，那就不在执行以下代码
                if(_totalCount < 0) return 

                // 从【 对应的右侧商品对象 】上找到 显示商品数量的元素， 更新数值
                $parent.find('.shopping-item-count').text(_totalCount);
                // 根据当前元素找到显示数量的元素，更新共计数值 
                $(e.currentTarget).parents('.selected-item').find('.shopping-item-count').text(_totalCount);
                // 从【 对应的右侧商品对象 】上找到 商品的单价
                var price = parseFloat($parent.find('.shopping-item-price').text().replace('￥', ''));
                // 计算购物车每一个商品的共计金额
                var _totalPrice = _totalCount * price;
                // 更新 显示每一个商品的共计金额的元素，数值
                $(e.currentTarget).parents('.selected-item').find('.selected-total-price').text(_totalPrice);
                // 执行 【 更新购物车所有商品的总共金额 】 函数
                _writeContentTotalPrice();
            }

            // 点击购物车 加减按钮 事件
            $('.selected-item').off('click')
            .on('click', '.shopping-item-plus', function (e) {
                // 调用 购物车的加减按钮共用函数
                _plusAndMinusEvent(e, function (num) {
                    // 将 操作后数据返回
                   return parseInt(num)+1;
                });
            }).on('click', '.shopping-item-minus', function (e) {
                // 调用 购物车的加减按钮共用函数
                _plusAndMinusEvent(e, function (num) {
                    // 将 操作后数据返回
                    return parseInt(num)-1
                });
            });
        }
        createShopCartHtml();
        // -----------------------------------------------------------------------------------------------------------------

        // 【 更新购物车所有商品的总共金额 】 函数
        function _writeContentTotalPrice() {
            // 获取购物车每一个商品元素
            var $selectedItems = $('.selected-item');
            // 获取显示在圆形形状 显示数量的元素
            var $dotNum = $('.dot-num');
            // 如果购物车商品商量长度为 0
            if(!$selectedItems.length) {
                // 将 【 购物车所有商品的总共金额 】设置为 0
                $totalPrice.text(0);
                // 并隐藏 小圆点
                $dotNum.addClass('hide');
                return;
            };
            // 购物车所有商品共计金额
            var bottoemTotalPrice = 0;
            // 购物车所有商品共计数量
            var bottoemTotalcount = 0;
            // 遍历 购物车每个商品
            $selectedItems.each(function (_, item) {
                // 计算 购物车所有商品共计金额
                bottoemTotalPrice += parseFloat($(item).find('.selected-total-price').text().replace('￥',''));
                // 计算 购物车所有商品共计数量
                bottoemTotalcount += parseFloat($(item).find('.shopping-item-count').text());
            })
            // 更新  购物车所有商品共计金额
            $totalPrice.text(bottoemTotalPrice);
            // 如果  购物车所有商品共计数量为 0
            if(!bottoemTotalcount) {
                // 隐藏小圆点
                $dotNum.addClass('hide');
            }else{
                // 显示小圆点并更新数量
                $dotNum.removeClass('hide');
                $dotNum.text(bottoemTotalcount);
            }
        }
        // 【 更新购物车所有商品的总共金额 】 函数挂载到 window 上
        window.BottoemTotalPrice = {
            _writeContentTotalPrice : _writeContentTotalPrice
        }

        // 清除 购物车事件
        $('.clear-cart').off('click')
        .on('click', function () {
            // 获取装入购物车商品的容器
            var $topElem = $('.shop-cart').find('.selected-shop-item');
            // 获取显示购物车所有商品共计数量元素
            var $dotNum = $('.dot-num');
            // 获取购物车商品元素集合
            var $items = $topElem.find('.selected-item');
            // 将显示购物车所有商品共计数量设置为 0
            $dotNum.text(0)
            // 获取显示购物车所有商品共计数量元素 隐藏
            $dotNum.addClass('hide');
            // 隐藏 购物车顶部内容
            $('.choose-content').addClass('hide');
            // 隐藏黑灰色遮罩层
            $('.mask').addClass('hide');
            // 遍历购物车商品元素集合
            $items.each(function (_, item) {

                // 找到【 对应的右侧商品对象 】将 html 设置为 false，以后可以重新创建自己的 html 结构，不然就创建不了了 
                $($(item).data('that')[0]).data('html', false);
                // 并将【 对应的右侧商品对象 】上的显示 数量的元素 设置为 0
                $(item).data().that.find('.shopping-item-count').text(0);
                // 数据中的 chooseCount 也要设置为 0
                data.chooseCount = 0;
            });
            // 最后将 【 装入购物车商品的容器 】里的内容，全部清空
            $('.selected-shop-item').html('');    
            // 将显示购物车所有商品共计金额 设置为 0
            $totalPrice.text(0)    
        });
        
    });

    $('.mask').on('click', function () {
        $('.mask').addClass('hide');
        $('.choose-content').addClass('hide');
    })

    // 初始化
    function init() {
        createShopCartTopHtml(); 
    }
    init();

    // 点击购物车图片，同时显示/隐藏购物车 顶部内容和黑灰色遮罩层
    $('.shop-pic').on('click', function () {
        $('.choose-content').toggleClass('hide');
        $('.mask').toggleClass('hide');
        
    });


}(Zepto));