p10(jQuery);

function imgloaded(img) {
	jQuery(img).addClass('loaded');
}

var neckHeight


function p10 ($) {
	$(document).ready(init);
	
	function init() {
	
		neckHeight = $('.neck').height();
		
		$('.lightbox, .thickbox').fancybox({
			'overlayColor': '#FFFFFF',
			'overlayOpacity': .85,
			'centerOnScroll': true,
			'titlePosition'	: 'inside'
		});
		
		
		// contact page functions
		$('#contactForm').each(function() {
			//$(this).addClass('js');
			$('input[type=text], textarea').each(function() {
				var def = $(this).prev('label').hide().text();
				$(this).addClass('default').val(def);
				$(this).focus(function() {
					if($(this).hasClass('default')){
						$(this).val('');
						$(this).removeClass('default');
					}
				});
				$(this).blur(function() {
					if ($(this).val()==''){
						$(this).addClass('default');
						$(this).val(def);
					} else
					if ($(this).val()==def) {
						$(this).addClass('default');
					}
				});
			});
			
			//$('#robot input').checkBox();
			//$('#subjects input').checkBox();
			
			$(this).submit(function() {
				$('#submitButton').val('sending...');
				$('input[type=text], textarea').each(function(N) {
					if ($(this).hasClass('default')) {
						$(this).val('');
					}
				});
			});
		});
		
		
		
		// BLOG
		$('.blog').each(function() {
	    $('.post').each(function() {
		    $(this).find('.meta').height($(this).find('.content').height());
	    });
	    
		  $(window).scroll(function() {
		    //var st = $(window).scrollTop()+neckHeight;
		    $('.post').each(function(i) {
		      //var pt = $(this).position().top;
					if ($(this).position().top+$(this).height()<$(window).scrollTop()+neckHeight+$(this).find('.metacontent').outerHeight()) {
				    $(this).removeClass('metafloat').addClass('metabottom');
					} else 
					if ($(this).position().top<$(window).scrollTop()+neckHeight){
						if (!$(this).hasClass('metafloat')) {
		          $(this).find('.meta').height($(this).find('.content').height());
		        }
						$(this).removeClass('metabottom').addClass('metafloat');
				  } else {
						$(this).removeClass('metafloat metabottom');
				  }
		    });
		  });
		});
		
		// blog thumbnail hovers
		$('.body.thumb').each(function() {
			$('.post').each(function() {
				if ($(this).find('img').length!=0){
					$(this).find('.title').animate({'opacity':0},0);
					$(this).hover(
					function() {
						$(this).find('.title').stop().animate({'opacity':1},300);
					},
					function() {
						$(this).find('.title').stop().animate({'opacity':0},300);
					});
				}
			})
		})
		
		// header tabs
		$('#head .tab').each(function() {
			if ($(this).hasClass('current')) {
				var tabID = $(this).attr('rel');
				$('#head .tabwindow#'+tabID).show();
			}
			$(this).click(function() {
				if ($(this).hasClass('current')) {
					var tabID = $(this).attr('rel');
					$('#head .tabwindow#'+tabID).hide();
					$(this).removeClass('current');
				} else {
					var c = $('#head .tab.current');
					if ($(c).length!=0) {
						$('#head .tabwindow#'+$(c).attr('rel')).hide();
						$(c).removeClass('current');
					}
					var tabID = $(this).attr('rel');
					$('#head .tabwindow#'+tabID).show();
					$(this).addClass('current');
				}
				return false;
			});
		});
		
		// big links
		$('.inactive').click(function() {
			return false;
		})
		
		
		
		// work page functions
		$('#work').each(function() {
			$('#workhead #cats ul a').each(function() {
				$(this).click(function() {
					if (!$(this).hasClass('current')) {
						$('#workhead #cats a.current').removeClass('current');
						$(this).addClass('current');
						var cat = $(this).attr('rel');
						$('.project').each(function() {
							if ($(this).hasClass(cat)) {
								$(this).removeClass('dim');
							} else {
								$(this).addClass('dim');
							}
						});
					}
					return false;
				});
			});
		});
		
		
		
		
		
		// slide set
		$('.slides').each(function() {
			var currentIndex = 0;
			var container = $(this);
			var slides = $(this).find('.slide');
			if (!$(this).hasClass('fullwindow')) {
				slides.each(function() {
					$(this).height(container.height());
				});
			}
			slides.first().addClass('current');
			
			$('#slidenav a.next, a#nextpage').click(function() {
				switchToPost(currentIndex+1);
				return false;
			});
			$('#slidenav a.prev, a#prevpage').addClass('inactive').click(function() {
				switchToPost(currentIndex-1);
				return false;
			});
			
			if (slides.length<=1) {
				$('#slidenav a.next, a#nextpage').addClass('inactive');
			}
			
			$('a#nextpage, a#prevpage').hover(
				function() {
					$(this).animate({'opacity':1},200);
				},
				function() {
					$(this).animate({'opacity':0},200);
				}
			);
		
			function switchToPost(i) {
				if (i<0) {
					currentIndex=0;
				} else
				if (i>=$(slides).length) {
					currentIndex = slides.length-1;
				} else {
					currentIndex = i;
				}
				$('.slidenum').text(currentIndex+1);
				$('.slide.current').removeClass('current');
				$('.slide:eq('+currentIndex+')').addClass('current');
				
				if (currentIndex==0) {
					$('#slidenav a.prev, a#prevpage').addClass('inactive');
				} else {
					$('#slidenav a.prev, a#prevpage').removeClass('inactive');
				}
				if (currentIndex==slides.length-1){
					$('#slidenav a.next, a#nextpage').addClass('inactive');
				} else {
					$('#slidenav a.next, a#nextpage').removeClass('inactive');
				}
			}
			
			
			// project page keyboard navigation
			$(document).keydown(function(e){
				if (e.keyCode==37) {
					// left
					switchToPost(currentIndex-1);
				} else
				if (e.keyCode==39) {
					// right
					switchToPost(currentIndex+1);
				}
			});
		});
		
		$('#project, .project').each(function() {
			// project page keyboard navigation
			$(document).keydown(function(e){
				if (e.keyCode==38) {
					//up
					var linkurl = $('#projecthead #projectsnav a.prev').attr('href');
					if (linkurl!='#' && linkurl!='' && linkurl!=undefined) {
						window.location.href = linkurl;
						return false;
					}
				} else
				if (e.keyCode==40) {
					//down
					var linkurl = $('#projecthead #projectsnav a.next').attr('href');
					if (linkurl!='#' && linkurl!='' && linkurl!=undefined) {
						window.location.href = linkurl;
						return false;
					}
				}
			});
		});
		
		
		// scaling background images
		var scaleBGs = $('.scaleBG');
		if (scaleBGs.length>0) {
			scaleBGs.each(function() {
				var bg = $(this).find('img.bgIMG');
				if (bg.hasClass('loaded')) {
					resizeBG(bg, $(this))
				} else {
					var bgOf = $(this);
					bg.load(function() {
						resizeBG(bg, bgOf);
					});
				}
			});
			
			$(window).resize(function() {
				scaleBGs.each(function() {
					var bg = $(this).find('img.bgIMG');
					if (bg.hasClass('loaded')) {
						resizeBG(bg, $(this))
					} else {
						var bgOf = $(this);
						bg.load(function() {
							resizeBG(bg, bgOf);
						});
					}
				});
			});
		}
		
	}
	
	function resizeBG(bg, bgOf) {
		if (!bg.attr('rel') || bg.attr('rel') == 'NaN') {
			bg.attr('rel', bg.width()/bg.height())
		}
		var bgRatio = bg.attr('rel');
		if (bgOf.hasClass('Fit')){
			var H = bgOf.height()-$('#foot').height()-40;
			if (bgRatio > bgOf.width()/H) {
				bg.width(bgOf.width());
				bg.height(Math.ceil(bgOf.width()/bgRatio));
			} else {
				bg.height(H);
				bg.width(Math.ceil(H*bgRatio));
			}
		} else {
			if (bgRatio < bgOf.width()/bgOf.height()) {
				bg.width(bgOf.width());
				bg.height(Math.ceil(bgOf.width()/bgRatio));
				bg.css('left', 0);
			} else {
				bg.width(Math.ceil(bgOf.height()*bgRatio));
				bg.height(bgOf.height());
				if (bg.width()>0){
					bg.css('left', -.5 * (bg.width()-bgOf.width()));
				}
			}
		}
	}
}