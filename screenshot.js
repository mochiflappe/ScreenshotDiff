(function () {

  var page = require('webpage').create();

  page.customHeaders = {
    'User-Agent': 'Mozilla/5.0 (iPhone; U; CPU like Mac OS X; en) AppleWebKit/420+ (KHTML, like Gecko) Version/3.0 Mobile/1C28 Safari/419.3'
  };

  var timer;
  page.onResourceReceived = function () {
    timer || clearTimeout(timer);
    timer = setTimeout(capture, 3000);
  };

  function capture() {
    page.evaluate(function () {
      document.body.bgColor = '#fff';
    });
    page.settings = {
      //userName: "shokai",
      //password: "zanmai"
    };
    page.render('images/google.png');
    console.log('captured: ' + 'https://www.google.co.jp/');
    phantom.exit();
  }

  page.open('https://www.google.co.jp/', function () {
  });

})();
