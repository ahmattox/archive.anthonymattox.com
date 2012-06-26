// javascript for The List List
// http://www.thelistlist.com

// this is taking me way too long

$(document).ready(init);

// for test site
var url;
var highlight = '#FFF1AE';

// variables for info panels
var currentinfo=null;
var heights=Array();
	
function init() {
	// for live site
	url = 'http://'+window.location.host+'/index.php/';
	
	// form stuff
	$('.name_field').each(function() {
		inputset($(this));
	});
	
	// info panels
	$('.info').each(function(i) {
		heights.push($(this).height());
		$(this).css({'opacity':0, 'height':0, 'display':'none'});
	});
	// add event functions to info panel links to show panels
	$('#head ul li a').each(function(i) {
		$(this).click(function() {
			if (currentinfo) {
				currentinfo.stop().animate({
					'opacity': 0,
					'height':0
				}, 500, function() {$(this).hide()});
			}
			currentinfo=$('.info:eq('+i+')');
			currentinfo.stop().show().animate({
				'opacity': 1,
				'height': heights[i]+'px'
			}, 500);
			$('#list').stop().animate({
				'opacity': 0,
				'height': 0,
				'margin-top': 0
			}, 500, function() {$(this).remove()});
			return false;
		});
	});
	
	// reposition right list to align with position in main list
	/*
	var p = $('#lists ol').position().top;
	if ($('#list').length>0) {
		$('#lists li.current').append('<div class="arr"></div>');
		var t=$('#lists li.current').position().top;
		$('#list').css('margin-top', t+p);
	}
	*/
	
	// contact form stuff
	$('form#contactform label + .field').each(function() {
		$(this).addClass('default');
		$(this).val($(this).prev().hide().text());
		$(this).focus(function() {
			if ($(this).hasClass('default')) {
				$(this).val('');
				$(this).removeClass('default');
			}
			if ($(this).hasClass('invalid')) {
				$(this).removeClass('invalid').stop(true).animate({
					'background-color': '#FFFFFF'
				},200, function() {
					$(this).attr('style', '');
				});
			}
		});
		$(this).blur(function() {
			if ($(this).val()=='') {
				$(this).val($(this).prev().text());
				$(this).addClass('default');
			}
		});
	});
	// ajax send email info
	$('form#contactform #submit').click(function() {
		// validate form data
		var valid = true;
		if ($('#contactform #author').val() == '' || $('#contactform #author').val() == 'your name') {
			contactInvalid($('#contactform #author'));
			valid=false;
		}
		if ($('#contactform #email').val() == '' || $('#contactform #email').val() == 'your email address') {
			contactInvalid($('#contactform #email'));
			valid=false;
		}
		if ($('#contactform #message').val() == '' || $('#contactform #message').val() == 'message') {
			contactInvalid($('#contactform #message'));
			valid=false;
		}
		// send to email script
		if (valid) {
			$('form#contactform').animate({
				'opacity': 0
			},150, function() {
				$(this).hide();
			});
			$('#contact').prepend('<div class="loading">sending...</div>');
			$('#content .loading').css({'top': t+p, 'opacity': 0}).animate({'opacity':.7},700).animate({'opacity':.3},1000).animate({'opacity':.7},1000).animate({'opacity':.3},1000).animate({'opacity':.7},1000);
			$('#contact').animate({
				'height': '30px'
			},150, function() {
				$.post(url+'functions/contact/',
					{author: $('#contactform #author').val(), email: $('#contactform #email').val(), message: $('#contactform #message').val() },
					function(data) {
						$('#content .loading').stop(true).animate({'opacity': 0},400, function() {
							$(this).remove();
							$('#contact .infoc').html('<div id="result">'+data+'</div>');
							$('#contact #result').css('opacity', 0).animate({
								'opacity': 1
							}, 150);
							$('#contact').animate({
								'height': '100px'
							},150);
						});
					}
				);
			});
		} else {
		}
		return false;
	});
	
	// AJAX STUFF
	
	// ajax add list
	$('form#addlist input.submit').each(function() {
		addlistinit($(this));
	});
	// add item
	$('form#additem input.submit').each(function() {
		 additeminit($(this));
	})
	
	// load list
	$('#lists li a.itemlink').each(function() {
		$(this).click(function() {
			loadlist($(this));
			return false;
		});
	});
	
	// vote
	$('li a.button').each(function() {
		voter($(this));
	});
	
	// load list if hash is set
	if (window.location.hash!='') {
		var id = window.location.hash.substr(6);
		var L = $('#lists li#'+id+' a.itemlink');
		if (L.length>0) {
			loadlist($('#lists li#'+id+' a.itemlink'));
		}
	}
}

// ------------------------------------
// ------------- end of document onload
// ------------------------------------






// list loader function
function loadlist(itemLink) {
	// pass a.itemlink
	$('#lists li.current').removeClass('current').find('.arr').remove();
	var p = $('#lists ol').position().top;
	var t;
	if ($('#lists ol li.blank').length>0) {
		t = $('#lists ol li.blank').position().top;
		if ($('#lists ol li.blank').hasClass('down')) {
			t-=30;
		}
	} else {
		t = $(itemLink).closest('li').position().top;
	}
	$(itemLink).closest('li').addClass('current').append('<div class="arr"></div>');
	
	// if an info panel is open, close it
	if (currentinfo) {
		currentinfo.stop().animate({
			'opacity': 0,
			'height':0
		}, 500, function() {$(this).hide()});
		currentinfo=null;
	}
	
	// remove current list
	var id = $(itemLink).closest('li').attr('id');
	if ($('#content #list').length==0) {
		console.log($(itemLink).closest('li').find('.list-content'));
		
		$('#content').append($(itemLink).closest('li').find('.list-content #list').clone());
		inputset($('#list .name_field'));
		$('#content #list').css({'opacity': 0, 'margin-top': t+p}).animate({
			'opacity': 1
		}, 200, function() {
			$('#list li a.button').each(function() {
				voter($(this));
			});
			additeminit($('form#additem input.submit'));
		});
		
	} else {
		$('#content').animate({
			'opacity': 0
		}, 200, function() {
			$('#content #list').remove();
			$('#content').append($(itemLink).closest('li').find('.list-content #list').clone());
			$('#content #list').css({'margin-top': t+p});
			inputset($('#list .name_field'));
			$('#content').animate({
				'opacity': 1
			}, 200, function() {
				$('#list li a.button').each(function() {
					voter($(this));
				});
				additeminit($('form#additem input.submit'));
			});
		});
	}
	window.location.hash='#list-'+id;
}

// add vote events
function voter(button) {
	// pass array of buttons to be rerouted
	// setup data to sent
	var iID;
	var lID = $(button).closest('li').attr('id');
	if (lID=='') {
		lID = $('#lists li.current').attr('id');
		var iID = $(button).closest('li').attr('class');
	} else {
		var iID = -1;
	}
	var d=$(button).text();
	
	$(button).click(function() {
		var li=$(this).closest('li');
		$.get(url+'functions/vote/'+lID+'/'+iID+'/'+d, function(data) {
			// remove buttons
			$(li).find('a.button').remove();
			$(li).append('<div class="dimbuttons" title="you can only vote on each item once a day"></div>');
			var shuffle = false;
			// reorder items
			if (d == 'up') {
				// voted up
				$(li).find('.pro').text(parseFloat($(li).find('.pro').text())+1);
				var r = Math.floor(parseFloat($(li).find('.pro').text()) / (parseFloat($(li).find('.con').text()) + parseFloat($(li).find('.pro').text()) ) *10000)/100;
				$(li).find('.percent').text(r);
				$(li).prevAll('li').each(function (i) {
					// loops through previous elements beginning with the one just before
					if (parseFloat($(this).find('.percent').text())>=r) {
						// stop at the first greater percent
						if (i>0) {
							// if it is above the current position, shuffle the list
							$(this).after('<li class="blank"><a>blank</a></li>');
							shuffle = true;
						}
						// return stops 'each' loop
						return false;
					}
				});
			} else {
				// voted down or spam
				$(li).find('.con').text(parseFloat($(li).find('.con').text())+1);
				var r = Math.floor(parseFloat($(li).find('.pro').text()) / (parseFloat($(li).find('.con').text()) + parseFloat($(li).find('.pro').text()) ) *10000)/100;
				$(li).find('.percent').text(r);
				$(li).nextAll('li').each(function (i) {
					// loops through next elements
					if (parseFloat($(this).find('.percent').text())<=r) {
						// stop at the first lower percent
						if (i>0) {
							// if it is below the current position, shuffle the list
							$(this).before('<li class="blank down"><a>blank</a></li>');
							shuffle = true;
						}
						// return stops 'each' loop
						return false;
					}
				});
			}
			
			// if the postition changed, then shuffle the list
			if (shuffle) {
				// i'm making the assumption that only one shuffling will be happening at once
				var blank = $(li).parent().find('.blank');
				var h = $(blank).height();
				var y = $(blank).offset().top;
				$(blank).css({'height':0, 'padding': 0}).animate({
					'height': h
				}, 300);
				$(li).css({'position':'relative'}).animate({
					'top': y - $(li).offset().top - h,
					'margin-bottom': -h
				},300, function() {
					// after we've shuffled, lets set everything straight
					$(li).attr('style', '');
					$(blank).before($(li))
					$(blank).remove();
				});
				//$(li).closest('ol').css('height', $(li).closest('ol').height()).delay(300).attr('style', '');
			}
			
			// if list, load items
			if (iID==-1 && !li.hasClass('current')) {
				loadlist(li.find('a.itemlink'));
			} else
			if (shuffle) {
				var p = $('#lists ol').position().top;
				var t = $('#lists ol .blank').position().top;
				if ($('#lists ol .blank').hasClass('down')) {
					t-=30;
				}
				$('#content #list').animate({'margin-top': t+p}, 300);
			}
			// hightlight item
			$(li).find('a:first').animate({
				'background-color': highlight
			}, 150).delay(1000).animate({
				'background-color': '#E4f1Ef'
			}, 1000, function() {
				$(this).attr('style', '');
			});
			// hightlight current arrow with bg
			$(li).find('.arr').animate({
				'border-left-color': highlight
			}, 150).delay(1000).animate({
				'border-left-color': '#E4f1Ef'
			}, 1000, function() {
				$(this).attr('style', '');
			});
		});
		return false;
	});
}

// initialize 'add' field so default text styled and removed on focus
function inputset(field) {
	$(field).addClass('default');
	$(field).focus(function() {
		// on focus if default value is set, clear it and remove 'default' style
		if ($(this).val() == this.defaultValue) {
			$(this).removeClass('default').val('');
		}
	});
	$(field).blur(function() {
		// on blur if field is empty restore default text and style
		if ($(this).val() == '' || $(this).val() == this.defaultValue) {
			$(this).addClass('default').val(this.defaultValue);
		}
	});
}

// intialize 'add list' field so that it calls an ajax function rather than loading a new page
function addlistinit(button) {
	$(button).click(function() {
		// call add function
		if ($('form#addlist input.name_field').val() != '' && $('form#addlist input.name_field').val() != 'add list') { // check if form is filled correctly
			$.post(url+'functions/add/',
				{name: $('form#addlist input.name_field').val()},
				function(data) {
					if (data=='error') {
						// if function returns error stop here
						error($('form#addlist'), 'The list <em>"'+$('form#addlist input.name_field').val()+'"</em> could not be added.');
						//alert('error');
					} else {
						// SUCCESS
						clearerror($('form#addlist'));
						// append retuned list item to list
						$('#lists ol').append(data);
						// setup vote buttons on new list item
						$('#lists ol li:last a.button').each(function() {
							voter($(this));
						});
						$('#lists ol li:last a.itemlink').click(function() {
							loadlist($(this));
							return false;
						});
						// clear 'add list' input field
						$('form#addlist input.name_field').val('');
						// animate in new list item
						$('#lists ol li:last').css({'height': 0, 'opacity': 0}).animate({
							'height': '27px',
							'opacity': 1
						},150, function() {
							// clear set styles so changes can be effected by css classes later
							$(this).attr('style', '');
						})
						// highlight new list item
						$('#lists ol li:last a:first').css({'background-color': highlight}).delay(1700).animate({
							'background-color': '#E4f1Ef'
						}, 1000, function() {
							$(this).attr('style', '');
						});
						// scroll down to new list if necessary
						var t = $('#lists ol li:last').offset().top;
						var wh = $(window).height();
						if (t>wh-100) {
							$('body').animate({'scrollTop': t-wh/2},1200);
						}
						// load new list
						loadlist($('#lists ol li:last a.itemlink'));
						// hightlight current arrow with bg
						$('#lists ol li:last .arr').css({'border-left-color': highlight}).delay(1700).animate({
							'border-left-color': '#E4f1Ef'
						}, 1000, function() {
							$(this).attr('style', '');
						});
						// update list count
						$('#lists .num').text($('#lists ol li').length + ' lists');
					}
				}
			);
		} else {
			// invalid list input
			error($('form#addlist'), 'Please enter a list.');
		}
		// return false to keep submit button from reloading the page
		return false;
	})
}

// intialize 'add item' field so that it calls an ajax function rather than loading a new page
function additeminit(button) {
	$(button).click(function() {
		// call add function
		if ($('form#additem input.name_field').val() != '' && !$('form#additem input.name_field').hasClass('default')) { // check if form is filled correctly
			$.post(url+'functions/add/',
				{name: $('form#additem input.name_field').val(), list: $('form#additem input.listid').val()},
				function(data) {
					//alert('data received');
					if (data=='error') {
						// if function returns error stop here
						error($('form#additem'), 'The item <em>"'+$('form#additem input.name_field').val()+'"</em> could not be added.');
					} else {
						// SUCCESS
						clearerror($('form#additem'));
						// append returned list item to list
						// alert('sucess');
						if ($('#list ol').length == 0) {
							$('#list div.empty').before('<ol></ol>');
							$('#list div.empty').animate({
								'opacity': 0,
								'height': '0px'
							},300, function() {
								$(this).remove();
							});
						}
						$('#list ol').append(data);
						// setup vote buttons on new list item
						$('#list ol li:last a.button').each(function() {
							voter($(this));
						});
						// clear 'add list' input field
						$('form#additem input.name_field').val('');
						// animate in new list item
						$('#list ol li:last').css({'height': 0, 'opacity': 0}).animate({
							'height': '27px',
							'opacity': 1
						},150, function() {
							// clear set styles so changes can be effected by css classes later
							$(this).attr('style', '');
						});
						// highlight new list item
						$('#list ol li:last a:first').css({'background-color': '#FFFFFF','padding-left': '5px'}).animate({
							'background-color': highlight
						}, 400, function() {
							$(this).delay(1000).animate({
								'background-color': '#FFFFFF',
								'padding-left': '0px'
							}, 400, function() {
								$(this).attr('style', '');
							});
						});
						// update list count
						$('#list .num').text($('#list ol li').length + ' items');
					}
				}
			);
		} else {
			error($('form#additem'), 'Please enter an item.');
		}
		return false;
	});
}

// function to add error box to a form
function error(form, text) {
	// remove any existing error boxes associated with this form
	$(form).parent().find('.error').remove();
	// add a new error box after the form
	$(form).after('<div class="error"><div>'+text+'</div></div>');
	var errorbox = $(form).parent().find('.error');
	// get height of the errorbox
	var H = $(errorbox).height();
	// set make invisible and animate the height up
	$(errorbox).css({'height': '0px', 'opacity': 0, 'background-color': highlight}).animate({
		'height': H
	},200, function() {
		// animate opacity in
		$(this).animate({'opacity':1}, 300, function() {
			// fade hightlight color
			$(this).delay(2000).animate({'background-color':'#FFF'},500,function() {
				// fade out error box
				$(this).attr('style', '').delay('10000').animate({'opacity':0}, 500, function() {
					$(this).animate({'height':0}, 300, function() {
						$(this).remove();
					});
				});
			});
		});
	});
}

function clearerror(form) {
	$(form).parent().find('.error').stop(true).animate({'opacity':0}, 300, function() {
		$(this).animate({'height':0}, 300, function() {
			$(this).remove();
		});
	});
}

function contactInvalid(field) {
	$(field).addClass('invalid').stop(true).css('background-color', '#FFFFFF').animate({
		'background-color': highlight
	},200, function() {
		$(this).delay(15000).animate({
			'background-color': '#FFFFFF'
		},500, function() {
			$(this).attr('style', '');
		});
	});
}