;(function ($) {
   "use strict";
        
    var starScoreHtml = `<div class="star-score">$star</div>`;

    function createStar() {
        
        var _scoreStr = this.score.toString();
        var scoreArr = _scoreStr.split('.');

        var fullStar = parseInt( scoreArr[0] );
        var halfStar = parseInt( scoreArr[1] ) >= 5 ? 1 : 0;
        var zeroStar = 5 - fullStar - halfStar;

        var starStr = '';

        for(var i=0; i<fullStar; i++) {
            starStr += `<div class="star fullstar"></div>`;
        }
        for(var j=0; j<halfStar; j++) {
            starStr += `<div class="star halfstar"></div>`;
        }
        for(var k=0; k<zeroStar; k++) {
            starStr += `<div class="star zerostar"></div>`;
        }
        
        return starScoreHtml.replace('$star', starStr);
    }

    window.StartScore = function ( score ) {
        
        this.score = score || '';
        this.createStar = createStar;
    }

}(jQuery));