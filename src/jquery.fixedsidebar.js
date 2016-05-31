/*!
 * jQuery Fixed Sidebar v0.2.2
 * (c) Internet Ecompuer
 *
 * Authors:
 *  - Pablo Largo <devnix.code@gmail.com>
 */

jQuery(function ($) {

    console.log('library');
    $.fn.extend({
        fixedSidebar: function (options) {
            var requestAnimationFrame = window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                window.msRequestAnimationFrame ||
                window.oRequestAnimationFrame ||
                // IE Fallback, you can even fallback to onscroll
                function (callback) {
                    window.setTimeout(callback, 1000 / 60)
                };

            return this.each(function () {
                var self = $(this);
                var settings = $.extend(true, {
                    bottomOffset: 0,
                    responsive: {
                        start: 0,
                        end: false
                    }
                }, options);

                var $document = $(document);
                var cacheFixed = false;

                var sidebarInitialTop = self.offset().top;


                var cacheBottom = false;

                $('head').append('<style>.fixed-sidebar{transform:translate3d(0,0,0);-moz-transform:translate3d(0,0,0);-webkit-transform:translate3d(0,0,0)}.fixed-sidebar.fixed-sidebar-following{position:fixed;top:0}.fixed-sidebar.fixed-following-bottom{position:absolute;bottom:0}</style>');

                var lastScroll = null;
                var lastWidth = null;
                var intoResponsive = false;

                self.parent().css('min-height', self.innerHeight());

                setTimeout(function() {
                    sidebarInitialTop = self.offset().top;
                    update();
                },1000);

                function update() {
                    var scroll = $document.scrollTop();

                    // Responsive checking
                    if (lastWidth !== $document.width()) {
                        lastWidth = $document.width();

                        if (lastWidth >= settings.responsive.start && ( settings.responsive.end === false || lastWidth <= settings.responsive.end)) {
                            intoResponsive = false;
                            lastScroll = null;
                            self.addClass('fixed-sidebar');
                        } else {
                            intoResponsive = true;

                            self.removeClass('fixed-following-bottom');
                            self.removeClass('fixed-sidebar-following');
                            self.removeClass('fixed-sidebar');
                            cacheBottom = false;
                            cacheFixed = false;
                        }
                    }

                    //console.log(intoResponsive);


                    // Checker to avoid calculations when not scrolling
                    if (lastScroll === scroll) {
                        requestAnimationFrame(update);
                        return false;
                    } else {
                        console.log('must fixed');

                        if (!intoResponsive) {
                            var sidebarPosition = self.offset();

                            var sidebarHeight = self.innerHeight();
                            var documentHeight = $document.innerHeight();
                            console.log(scroll,sidebarInitialTop);

                            var footer = documentHeight - (sidebarPosition.top + sidebarHeight);
                            if (scroll >= sidebarInitialTop) {
                                if (!cacheFixed) {
                                    self.addClass('fixed-sidebar-following');
                                    cacheFixed = true;

                                    self.removeClass('fixed-following-bottom');
                                    cacheBottom = false;
                                }
                            } else if (cacheFixed) {
                                self.removeClass('fixed-sidebar-following');
                                cacheFixed = false;
                            }

                            if (scroll >= documentHeight - (sidebarHeight + settings.bottomOffset)) {
                                if (!cacheBottom) {
                                    self.addClass('fixed-following-bottom');
                                    cacheBottom = true;

                                    self.removeClass('fixed-sidebar-following');
                                    cacheFixed = false;
                                }
                            } else if (cacheBottom) {
                                self.removeClass('fixed-following-bottom');
                                cacheBottom = false;
                            }

                            lastScroll = scroll;
                        }

                        requestAnimationFrame(update);

                        return true;
                    }
                }
            });
        }
    });
});
