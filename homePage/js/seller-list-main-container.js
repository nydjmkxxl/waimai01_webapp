;(function ($) {
   "use strict";
        
    // 创建 附近商家 每一项的 html 结构 字符串 
    var sellerListMainContainerHtml = ` <div class="seller-item-container">
                                            <img class="seller-item-pic" src="$img-url" />
                                            $brand
                                            <div class="seller-item-allInfo">
                                                <p class="seller-item-title">$name</p>
                                                <div class="seller-item-disc-container clearfix">
                                                    <div class="seller-item-score">$wm_poi_score</div>
                                                    <div class="seller-item-monthSeller">月售$monthNum</div>
                                                    <div class="seller-item-distance">&nbsp;$distance</div>
                                                    <div class="seller-item-time">$mt_delivery_time&nbsp;|</div>
                                                </div>
                                                <div class="seller-item-price-container">
                                                    <div class="seller-item-price">$min_price_tip</div>
                                                </div>
                                                <div class="seller-item-activeInfo-container">$activeInfo</div>
                                            </div>
                                        </div>`; 
    // 获取 父级 Zepto 对象
    var sellerListMainContainer = $('.seller-list-main-container');
    // 规定当前页数为 0
    var page = 0;
    // 初始 正在加载 状态 为 false
    var isLoading = false;

    // 创建 附近商家 每一项的 html 结构 函数
    function createSellerListMainHtml() {

        // 每创建一次 页数 递加
        page++;
        // 此时 正在加载 状态 为 true
        isLoading = true;

        // 获取 需要的 json 数据
        $.get('orderPage/json/homelist.json', function ( data ) {

            var list = data.data.poilist || [];
            var html = '';

            // 遍历 创建 附近商家 每一页 的 html 结构
            list.forEach( (item)=>{
                
                html += sellerListMainContainerHtml
                        .replace('$img-url', item.pic_url)
                        .replace('$name', item.name)
                        .replace('$distance', item.distance)
                        .replace('$min_price_tip', item.min_price_tip)
                        .replace('$mt_delivery_time', item.mt_delivery_time)
                        .replace('$brand', createBrandLabel( item ))
                        .replace('$monthNum', createMonthNum( item ))
                        .replace('$activeInfo', createActiveInfo( item ))
                        .replace('$wm_poi_score',new CreateStar( item.wm_poi_score ).createStar());   

            });
            // 追加 html 内容
            sellerListMainContainer.append(html);
            // 将 正在加载 状态 为 false
            isLoading = false;
        });
    }

    // 创建 商家 自己的 活动信息
    function createActiveInfo(data) {
        
        var arr = data.discounts2;
        var html = '';

        arr.forEach((item)=>{
            var _str = `<div class="seller-item-activeInfo">
                            <img src=$icon_url class="activeInfo-icon" />
                            <p class="activeInfo-text one-line">$info</p>
                       </div>`;
            html += _str
                    .replace('$icon_url', item.icon_url)
                    .replace('$info', item.info); 
        });
        return html;
    }

    // 创建 商家  品牌/新到 标签
    function createBrandLabel( data ) {
        if(data.brand_type) {
            return '<div class="seller-item-brand seller-item-brand-pin">品牌</div>'
        }else{
            return '<div class="seller-item-brand seller-item-brand-xin">新到</div>'
        }
    }

    // 创建 月售 信息
    function createMonthNum( data ) {
        // console.log(data,'LOOL');
        var num = data.month_sale_num;
        if(num > 999) {
            return '999+';
        }else{
            return num;
        }
    }

    // 创建 滚动加载 商品资源 函数
    function scrollLoad() {

        window.addEventListener('scroll', function () {
            if( isLoading ) return;
            var clientHeight = document.documentElement.clientHeight;
            var scrollHeight = document.body.scrollHeight;
            var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            // 提前 触发 加载 数值
            var proDis = 30;

            // 滚过的高度 + 视口高度 大于或等于 滚动条总高 - 提前量
            if( (scrollTop + clientHeight) >= (scrollHeight-proDis) ) {
                if( page < 3) {
                    createSellerListMainHtml();
                }else{
                    $('.loading').text('我也是有底线的')
                }
            }
        });
    }

    function init() {
        createSellerListMainHtml();
        scrollLoad();
    }
    init();

}(Zepto));