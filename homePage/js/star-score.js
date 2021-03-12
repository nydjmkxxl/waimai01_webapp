;(function () {
   "use strict";
    
    // 创建 星星 结构 字符串    
    var starScoreHtml = `<div class="star-score">$star</div>`;

    // 创建 星星 结构 函数 
    function createStar() {
        
        // 将 挂在window上的 StartScore 属性 下的 score 属性值 转换成 字符串
        var _scoreStr = this.score.toString();
        // 利用 数组的方法 将 浮点数字 以 . 为作为分开的基准
        var scoreArr = _scoreStr.split('.');

        var fullStar = parseInt( scoreArr[0] );
        var halfStar = parseInt( scoreArr[1] ) >= 5 ? 1 : 0;
        var zeroStar = 5 - fullStar - halfStar;

        var starStr = '';
        // 遍历 数组 来创建 对应 星星 的个数
        for(var i=0; i<fullStar; i++) {
            starStr += `<div class="star fullstar"></div>`;
        }
        for(var j=0; j<halfStar; j++) {
            starStr += `<div class="star halfstar"></div>`;
        }
        for(var k=0; k<zeroStar; k++) {
            starStr += `<div class="star zerostar"></div>`;
        }
        // 将 字符串 结构 追加 到 html 中 
        return starScoreHtml.replace('$star', starStr);
    }

    // 将 score 数值 和 创建星星 方法 挂到 window 上
    window.CreateStar = function ( score ) {
        
        this.score = score || '';
        this.createStar = createStar;
    }

}());