/*
=======
  Waypoints integration

  Instatiating the waypoints library for scrolling functions
  Check out http://imakewebthings.com/waypoints/guides/getting-started/ for documentation on waypoints.

=======
*/

(function($) {
  var Waypoints = function() {
    this.elements = {
      viewable: $('.inview'),
      laxContainer: $('.lax-container'),
      laxImg: '.lax-img',
      scrollUp: $('#scrollUp'),
      autovids: $('.autoplayvideo'),
      wHeight: $(window).height()
    }
  }

  Waypoints.prototype.sticky = function(e) {
    var sticky = $('.sticky'),
        stickyWrap  = $('.sticky-wrap');
   if(sticky.length > 0 && stickyWrap.length > 0 ){
      window.scrollTo(0,0); // ensure we're at the top
      console.log('tippety toppety');
      var waypoint = new Waypoint({
         element: sticky,
        handler: function(direction) {
           if (direction === 'down') {
              $(this.element).addClass('fixed');
              sticky.css('top', '140px');
            } if (direction === 'up'){
              $(this.element).removeClass('fixed');
              sticky.css('top', '0');
            }
        },
        offset: 140
      });

    var ofz = stickyWrap.outerHeight() - sticky.outerHeight() - 280;

    var waypoint2 = new Waypoint({
       element: stickyWrap,
      handler: function(direction) {
        if (direction === 'down'){
          sticky.removeClass('fixed');
          sticky.css('top', ofz);
        } if (direction === 'up') {
          sticky.addClass('fixed');
          sticky.css('top', '140px');
        }
      },
      offset: -ofz
    });
    }

  }

  Waypoints.prototype.viewable = function(e) {
    var elements = this.elements.viewable;
    elements.addClass('opaque');
    var fadein = function(name) {
        $name = $(name);
        $name.removeClass('opaque');
        $name.on('transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd', function() {
          $name.removeClass('opaque');
        });
      }
      // Different offset depending on direction
    elements.waypoint(function(direction) {
      if (direction === 'down') {
        fadein(this.element);
      }
    }, {
      offset: '70%'
    });
  }
  Waypoints.prototype.autovid = function(e) {
    var videos = this.elements.autovids;
    videos.waypoint(function(direction) {
      if (direction === 'down') {
        this.element.autoplay = true;
        this.element.play();
      }
    }, {
      offset: '70%'
    });
  }
  Waypoints.prototype.showScroll = function(e) {
    var sup = this.elements.scrollUp;
    var waypointrs = new Waypoint({
      element: $('body'),
      handler: function(direction) {
        if (direction == 'down') {
          sup.removeClass('opaque');
        }
        if (direction == 'up') {
          sup.addClass('opaque');
        }
      },
      offset: -120
    })

  }
  Waypoints.prototype.scrollUp = function(e) {
    e.preventDefault();
    console.log('bout to scroll' + e);
    $("html, body").animate({
      scrollTop: 0
    }, 500);
  }

  Waypoints.prototype.scroller = function(wrapper, objects) {
    var _this = this;
    setVars = function(wrapper) {
      scrollPos = $(window).scrollTop(),
      objectPos = wrapper.offset().top;
    }
    plaxScroll = function(objects, rate, direction) {
      setVars(wrapper);
      var disToScroll = _this.elements.wHeight,
        disScrolled = (scrollPos - objectPos), // Distance already scrolled
        transY = ((rate / disToScroll) * disScrolled),
        transYround = +transY.toFixed(2),
        transCss = 'translate3d( 0, ' + transYround + 'px, ' + '0)';


      function prefixTransform(o, translate) { // prefixer function
        o.css('transform', translate);
        o.css('-moz-transform', translate);
        o.css('-webkit-transform', translate);
        o.css('-o-transform', translate);
        o.css('-ms-transform', translate);
      }
      prefixTransform(objects, transCss);
    }
    window.requestAnimationFrame(function() {
      objects.each(function() { // Loop through laxin objects
        var t = $(this);
        var rate = t.data("scroll");
        plaxScroll(t, rate, "up");
      })
    });
  }
  Waypoints.prototype.plaxInit = function(e) {
    var _this = this;

    this.elements.laxContainer.each(function() {
      var wrapper = $(this),
        objects = wrapper.find(_this.elements.laxImg);

      function laxfunction() {
        _this.scroller(wrapper, objects);
        interval = window.setInterval(function() {
          _this.scroller(wrapper, objects);
        }, 10);
      }
      var inview = new Waypoint.Inview({
        element: wrapper,
        enter: function(direction) {
          new laxfunction();
        },
        exited: function(direction) {
          window.clearInterval(interval);
        }
      })
    });
  }

  Waypoints.prototype.init = function(e) {
      var _this = this;
    var mqTablet = window.matchMedia("( min-width: 650px )"); // Media query for intro slide and navscroll
    var mqTabletmax = window.matchMedia("( max-width: 650px )"); // Media query for intro slide and navscroll
    if (mqTablet.matches) {
      this.viewable();
      this.sticky();
      this.plaxInit();
    }
    if (this.elements.autovids) {
      this.autovid();
    }
    if (mqTabletmax.matches) {
      this.showScroll();
      var _this = this;
      this.elements.scrollUp.click(function(e) {
        _this.scrollUp(e);
      });
    }
  }

  // Instantiation
  new Waypoints().init(); // attach waypoints to global
})(jQuery || {});