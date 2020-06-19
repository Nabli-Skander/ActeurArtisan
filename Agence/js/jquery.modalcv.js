

(function (factory) {
  if(typeof module === "object" && typeof module.exports === "object") {
    factory(require("jquery"), window, document);
  }
  else {
    factory(jQuery, window, document);
  }
}(function($, window, document, undefined) {

  var modalcvs = [],
      getCurrent = function() {
        return modalcvs.length ? modalcvs[modalcvs.length - 1] : null;
      },
      selectCurrent = function() {
        var i,
            selected = false;
        for (i=modalcvs.length-1; i>=0; i--) {
          if (modalcvs[i].$blocker) {
            modalcvs[i].$blocker.toggleClass('current',!selected).toggleClass('behind',selected);
            selected = true;
          }
        }
      };

  $.modalcv = function(el, options) {
    var remove, target;
    this.$body = $('body');
    this.options = $.extend({}, $.modalcv.defaults, options);
    this.options.doFade = !isNaN(parseInt(this.options.fadeDuration, 10));
    this.$blocker = null;
    if (this.options.closeExisting)
      while ($.modalcv.isActive())
        $.modalcv.close(); 
    modalcvs.push(this);
    if (el.is('a')) {
      target = el.attr('href');
      if (/^#/.test(target)) {
        this.$elm = $(target);
        if (this.$elm.length !== 1) return null;
        this.$body.append(this.$elm);
        this.open();
      } else {
        this.$elm = $('<div>');
        this.$body.append(this.$elm);
        remove = function(event, modalcv) { modalcv.elm.remove(); };
        this.showSpinner();
        el.trigger($.modalcv.AJAX_SEND);
        $.get(target).done(function(html) {
          if (!$.modalcv.isActive()) return;
          el.trigger($.modalcv.AJAX_SUCCESS);
          var current = getCurrent();
          current.$elm.empty().append(html).on($.modalcv.CLOSE, remove);
          current.hideSpinner();
          current.open();
          el.trigger($.modalcv.AJAX_COMPLETE);
        }).fail(function() {
          el.trigger($.modalcv.AJAX_FAIL);
          var current = getCurrent();
          current.hideSpinner();
          modalcvs.pop();
          el.trigger($.modalcv.AJAX_COMPLETE);
        });
      }
    } else {
      this.$elm = el;
      this.$body.append(this.$elm);
      this.open();
    }
  };

  $.modalcv.prototype = {
    constructor: $.modalcv,

    open: function() {
      var m = this;
      this.block();
      if(this.options.doFade) {
        setTimeout(function() {
          m.show();
        }, this.options.fadeDuration * this.options.fadeDelay);
      } else {
        this.show();
      }
      $(document).off('keydown.modalcv').on('keydown.modalcv', function(event) {
        var current = getCurrent();
        if (event.which == 27 && current.options.escapeClose) current.close();
      });
      if (this.options.clickClose)
        this.$blocker.click(function(e) {
          if (e.target==this)
            $.modalcv.close();
        });
    },

    close: function() {
      modalcvs.pop();
      this.unblock();
      this.hide();
      if (!$.modalcv.isActive())
        $(document).off('keydown.modalcv');
    },

    block: function() {
      this.$elm.trigger($.modalcv.BEFORE_BLOCK, [this._ctx()]);
      this.$body.css('overflow','hidden');
      this.$body.css('padding-right','17px');
      this.$blocker = $('<div class="jquery-modalcv blocker current"></div>').appendTo(this.$body);
      selectCurrent();
      if(this.options.doFade) {
        this.$blocker.css('opacity',0).animate({opacity: 1}, this.options.fadeDuration);
      }
      this.$elm.trigger($.modalcv.BLOCK, [this._ctx()]);
    },

    unblock: function(now) {
      if (!now && this.options.doFade)
        this.$blocker.fadeOut(this.options.fadeDuration, this.unblock.bind(this,true));
      else {
        this.$blocker.children().appendTo(this.$body);
        this.$blocker.remove();
        this.$blocker = null;
        selectCurrent();
        if (!$.modalcv.isActive())
          this.$body.css('overflow','');
          this.$body.css('padding-right','');
      }
    },

    show: function() {
      this.$elm.trigger($.modalcv.BEFORE_OPEN, [this._ctx()]);
      if (this.options.showClose) {
        this.closeButton = $('<a href="#close-modalcv" rel="modalcv:close" class="close-modalcv ' + this.options.closeClass + '">' + this.options.closeText + '</a>');
        this.$elm.append(this.closeButton);
      }
      this.$elm.addClass(this.options.modalcvClass).appendTo(this.$blocker);
      if(this.options.doFade) {
        this.$elm.css('opacity',0).show().animate({opacity: 1}, this.options.fadeDuration);
      } else {
        this.$elm.show();
      }
      this.$elm.trigger($.modalcv.OPEN, [this._ctx()]);
    },

    hide: function() {
      this.$elm.trigger($.modalcv.BEFORE_CLOSE, [this._ctx()]);
      if (this.closeButton) this.closeButton.remove();
      var _this = this;
      if(this.options.doFade) {
        this.$elm.fadeOut(this.options.fadeDuration, function () {
          _this.$elm.trigger($.modalcv.AFTER_CLOSE, [_this._ctx()]);
        });
      } else {
        this.$elm.hide(0, function () {
          _this.$elm.trigger($.modalcv.AFTER_CLOSE, [_this._ctx()]);
        });
      }
      this.$elm.trigger($.modalcv.CLOSE, [this._ctx()]);
    },

    _ctx: function() {
      return { elm: this.$elm, $blocker: this.$blocker, options: this.options };
    }
  };

  $.modalcv.close = function(event) {
    if (!$.modalcv.isActive()) return;
    if (event) event.preventDefault();
    var current = getCurrent();
    current.close();
    return current.$elm;
  };


  $.modalcv.isActive = function () {
    return modalcvs.length > 0;
  };

  $.modalcv.defaults = {
    closeExisting: true,
    escapeClose: true,
    clickClose: true,
    closeText: 'Close',
    closeClass: '',
    modalcvClass: "modalcv",
    fadeDuration: 300,   
    fadeDelay: 0.3    
  };

  // Event constants
  $.modalcv.BEFORE_BLOCK = 'modalcv:before-block';
  $.modalcv.BLOCK = 'modalcv:block';
  $.modalcv.BEFORE_OPEN = 'modalcv:before-open';
  $.modalcv.OPEN = 'modalcv:open';
  $.modalcv.BEFORE_CLOSE = 'modalcv:before-close';
  $.modalcv.CLOSE = 'modalcv:close';
  $.modalcv.AFTER_CLOSE = 'modalcv:after-close';


  $.fn.modalcv = function(options){
    if (this.length === 1) {
      new $.modalcv(this, options);
    }
    return this;
  };

  // Automatically bind links with rel="modalcv:close" to, well, close the modalcv.
  $(document).on('click.modalcv', 'a[rel="modalcv:close"]', $.modalcv.close);
  $(document).on('click.modalcv', 'a[rel="modalcv:open"]', function(event) {
    event.preventDefault();
    $(this).modalcv();
  });
}));
