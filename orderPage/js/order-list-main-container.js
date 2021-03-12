;(function ($) {
   "use strict";
        
    // 创建 订单 页面 每一项 结构 字符串
    var orderListHtml = `<div class="order-item">
                            <div class="order-info">
                                <img class="order-pic" src="$poi_pic" />
                                <div class="order-detail-info-container">
                                    <div class="order-seller-name-container">
                                        <p class="order-seller-name one-line">$poi_name</p>
                                            <div class="order-arrow"></div>
                                        <div class="order-status">$status_description</div>
                                    </div>
                                    <div class="order-detail-info">$create_info</div>
                                </div>
                            </div>
                            $create_appraise
                        </div>`;    
    // 获取 父级 Zepto 对象
    var $orderList = $('.order-wrap');
    // 规定当前页数为 0
    var page = 0;
    // 初始 正在加载 状态 为 false
    var isLoading = false;

    // 创建 订单 页面 每一项 结构 html
    function createOrderListHtml() {

        // 此时 正在加载 状态 为 true
        isLoading = true;
         // 每创建一次 页数 递加
        page ++; 

        // 获取 需要的 json 数据
        $.get('orderPage/json/orders.json', function ( data ) {

            var listArr = data.data.digestlist || [];
            var html = ``;

            // 遍历 创建 订单 每一页 的 html 结构
            listArr.forEach(( item )=>{
                html += orderListHtml
                        .replace('$poi_pic', item.poi_pic)
                        .replace('$poi_name', item.poi_name)
                        .replace('$status_description', item.status_description)
                        .replace('$create_info',  createDetailInfo( item ))
                        .replace('$create_appraise',  createAppraise( item ));
            });
            // 追加 html 内容
            $orderList.append( html );
            // 将 正在加载 状态 为 false           
            isLoading = false;
        });
    }

    // 创建 评价 html
    function createAppraise( data ) {

        var evaluation = !data.is_comment;

        if(evaluation) {
            return `<div class="evaluation clearfix">
                        <div class="evaluation-btn">评价</div>
                    </div>`;
        }
        return '';
    }

    // 创建 共计 钱数 html
    function createTotalPrice( data ) {

        var html = `<div class="product-item">
                        <span >...</span>
                        <div class="p-total-count">
                            总计${data.product_list.length-1}个菜, 实付
                            <span class="total-price">￥${data.total}</span>
                        </div>
                    </div>`;
        return html;
    }

    // 创建 商品 数量和名称
    function createDetailInfo( data ) {

        var listArr = data.product_list;
        var html = '';

        // 在数组最后放入 more 当遍历到 more 时， 再将 共计钱数的 html 拼接 到尾部 
        listArr.push( { type : 'more' } );

        listArr.forEach((item)=>{

            if( item.type === 'more') {
                html += createTotalPrice( data );
            }else{
                html += `<div class="product-name">${item.product_name}
                            <div class="product-count">x${item.product_count}</div>
                        </div>`
                        ;
            }
        });
        return html;
    }

    // 创建 滚动加载 商品资源 函数
    function scrollLoad() {
        
        window.addEventListener('scroll', function () {

            var clientHeight = document.documentElement.clientHeight;
            var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            var scrollHeight = document.body.scrollHeight;
            // 提前 触发 加载 数值
            var proHeight = 30;

            // 滚过的高度 + 视口高度 大于或等于 滚动条总高 - 提前量
            if( (scrollTop + clientHeight) >= (scrollHeight - proHeight) ) {

                if( page < 4) {

                    if( isLoading ) return;
                    createOrderListHtml();
                }else{
                    $('.loading').text('我也是有底线的')
                }
            }
        });
    }

    function init() {
        createOrderListHtml();
        scrollLoad();
    }
    init();

}(Zepto));