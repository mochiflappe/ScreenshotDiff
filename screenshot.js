(function () {
  "use strict";

  var sites = [
    {url: 'https://www.google.co.jp/', name: 'google'},
    {url: 'http://www.yahoo.co.jp/', name: 'yahoo'},
    {url: 'https://www.apple.com/jp/', name: 'apple'}
  ];

  var ua = 'Mozilla/5.0 (iPhone; U; CPU like Mac OS X; en) AppleWebKit/420+ (KHTML, like Gecko) Version/3.0 Mobile/1C28 Safari/419.3';

  /**
   * フォーマット済の日付を取得
   * @returns {string}
   */
  function dateFormat() {
    var date = new Date();
    var y = date.getFullYear();
    var m = ('0' + (date.getMonth() + 1)).slice(-2);
    var d = ('0' + date.getDate()).slice(-2);
    return y + m + d;
  }

  var path = {
    images: 'images/' + dateFormat()
  };

  var renderedUrl = [];

  /**
   * 配列に値があるか確認する関数
   * @param array
   * @param value
   * @returns {boolean}
   */
  function isExists(array, value) {
    for (var i = 0, len = array.length; i < len; i++) {
      if (value === array[i]) {
        return true;
      }
    }
    return false;
  }

  /**
   * スクリーンショットを撮影
   * @param site
   */
  function screenshot(site) {
    var page = require('webpage').create();

    page.customHeaders = {
      'User-Agent': ua
    };

    // ベーシック認証
    //page.settings.userName = "name";
    //page.settings.password = "pass";

    page.open(site.url, function () {
      console.log('open: ' + site.url);
    });

    // 読み込みがなくなったらレンダリングに移る
    var timer;
    page.onResourceReceived = function () {
      timer || clearTimeout(timer);
      timer = setTimeout(capture, 6000);
    };

    function capture() {
      // レンダリングしてないurlを処理
      if (!isExists(renderedUrl, site.url)) {

        page.evaluate(function () {
          document.body.bgColor = '#fff';
        });
        page.render(path.images + '/' + site.name + '.png');
        console.log('captured: ' + site.url);

        renderedUrl.push(site.url);

        // レンダリング済の配列ををユニークに加工
        var uniqRenderedUrl = renderedUrl.filter(function (element, index, self) {
          return self.indexOf(element) === index;
        });

        if (uniqRenderedUrl.length === sites.length) {
          phantom.exit();
        }
      }
    }
  }

  for (var i = 0, siteLen = sites.length; i < siteLen; i++) {
    screenshot(sites[i]);
  }

})();
