(function () {
  "use strict";

  var system = require('system');
  var target = system.args[1];

  var setting = require('./setting/' + target + '.json');

  var path = {
    images: 'images/' + target + '/' + dateFormat()
  };

  // 同時接続数
  var limit = setting.limit || 10

  var renderedUrl = [];

  /**
   * console装飾
   * @type {{reset: string, green: string, red: string}}
   */
  var consoleColor = {
    reset: '\u001b[0m',
    green: '\u001b[32m',
    red: '\u001b[31m'
  };

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
   * @param {Object} site
   * @param {String} slot
   */
  function screenshot(site, slot) {
    var page = require('webpage').create();

    if (setting.ua) {
      page.customHeaders = {
        'User-Agent': setting.ua
      };
    }

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
        console.log(consoleColor.green + 'captured: ' + site.url + consoleColor.reset);

        renderedUrl.push(site.url);

        // レンダリング済の配列ををユニークに加工
        var uniqRenderedUrl = renderedUrl.filter(function (element, index, self) {
          return self.indexOf(element) === index;
        });

        // キューから削除
        queueu[slot] = null;

        if (uniqRenderedUrl.length === setting.site.length) {
          phantom.exit();
        }
      }
    }

    return slot;
  }

  // キュースタック方式で実行
  var queueu = {},
      timer = null,
      siteIndex = 0;
  for( var i = 0; i < limit; i++ ){
    queueu['slot' + i] = null;
  }

  /**
   * Seek empty slot
   * @return {String}
   */
  function seekSlot(){
    for( var prop in queueu ){
      if( queueu.hasOwnProperty(prop) && null === queueu[prop] ){
        return prop;
      }
    }
    return null;
  }

  var slotTimer = setInterval(function(){
    var slot;
    while( slot = seekSlot() ){
      if( siteIndex >= setting.site.length ){
        clearInterval(slotTimer);
        break;
      }
      queueu[slot] = screenshot(setting.site[siteIndex], slot);
      siteIndex++;
    }
  }, 500);

})();