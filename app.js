(function () {

  var path = {
    img: 'images/'
  };

  var sites = [
    {
      url: 'https://www.google.co.jp/',
      image: path.img + 'google1.png'
    },
    {
      url: 'https://www.google.co.jp/',
      image: path.img + 'google2.png'
    }
  ];
  var captured = 0;

  function capture(site) {
    var page = require('webpage').create();
    //page.viewportSize = { width: 960, height: 1080 };

    //page.customHeaders = {
    //	'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A403 Safari/8536.25'
    //};


    page.settings = {
    //userAgent: 'Mozilla/5.0 (iPhone; U; CPU like Mac OS X; en) AppleWebKit/420+ (KHTML, like Gecko) Version/3.0 Mobile/1C28 Safari/419.3'
    //userName: "name",
    //password: "pass"
    };

    page.open(site.url, function () {

      page.evaluate(function () {
        document.body.bgColor = '#fff';
      });

      page.render(site.image);
      console.log('captured ' + site.url);
      captured++;
      if (captured === sites.length) {
        phantom.exit();
      }
    });
  }

  for (var i = 0, j = sites.length; i < j; i++) {
    capture(sites[i]);
  }

})();


/*
 * PhantomJS Screen Capture Script
 * Usage: phantomjs capture.js {address} {output}
 */

/* configure */
/*
 var width = 1366;
 var height = 768;
 var zoom = 1.0;
 var resourceWaitTime = 3000;

 var args = require('system').args;

 if(args.length < 3) {
 console.log('few arguments');
 phantom.exit(1);
 }

 console.log('begin capture: ' + args[1]);

 var page = require('webpage').create();
 page.zoomFactor = zoom;
 page.viewportSize = {
 width: width,
 height: height
 };

 page.clipRect = {
 left: 0,
 top: 0,
 width: width,
 height: height
 };

 var timer;

 page.onResourceReceived = function(response) {
 timer || clearTimeout(timer);
 timer = setTimeout(capture, resourceWaitTime);
 };

 function capture() {
 page.render(args[2]);
 console.log('captured: ' + args[1]);
 phantom.exit();
 }

 page.open(args[1], function () {});
 */