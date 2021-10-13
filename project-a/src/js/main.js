var ProgressBar = function (selector, length) {
  this.parent =
    typeof selector === 'string' ? document.querySelector(selector) : selector;
  var i = 0;
  var height = window.getComputedStyle(this.parent).height;
  var progressItems = this.parent.querySelector('.progress-items');
  for (; i < length; i++) {
    var item = document.createElement('div');
    item.style.boxSizing = 'border-box';
    item.style.display = 'inline-block';
    item.style.width = 100 / length + '%';
    item.style.height = height;
    if (i !== length - 1) {
      item.style.borderRight = '4px solid white';
    }
    progressItems.appendChild(item);
  }

  this.progressRate = this.parent.querySelector('.progress-rate');
};

ProgressBar.prototype = {
  to: function (p) {
    this.progressRate.style.width = Math.floor(p * 100) + '%';
  },
};

var target = document.querySelector('#demo-img');
//给element注入transform属性
Transform(target, true);

new PhyTouch({
  touch: '#demo1', //反馈触摸的dom
  vertical: false, //不必需，默认是true代表监听竖直方向touch
  target: target, //运动的对象
  property: 'rotateY', //被滚动的属性
  touchStart: function (evt) {
    evt.stopPropagation();
  },
  bindSelf: true,
  touchMove: function (evt) {
    evt.stopPropagation();
  },
});

var scroller = document.querySelector('#scroller');
Transform(scroller, true);

var at = new PhyTouch({
  touch: '#demo0', //反馈触摸的dom
  target: scroller, //运动的对象
  property: 'translateY', //被滚动的属性
  min: 250 - 2000,
  touchStart: function (evt) {
    evt.stopPropagation();
  },
  touchMove: function (evt) {
    evt.stopPropagation();
  },
  bindSelf: true,
  max: 0, //不必需,滚动属性的最大值
});

var pb;
var fp = new PhyTouch.FullPage('#fullpage', {
  animationEnd: function () {},
  leavePage: function (index) {
    console.log('leave' + index);
  },
  beginToPage: function (index) {
    console.log('to' + index);
    pb.to(index / (this.length - 1));
  },
});
pb = new ProgressBar('#progress', fp.length - 1);
