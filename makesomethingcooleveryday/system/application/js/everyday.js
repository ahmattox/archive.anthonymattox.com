$(document).ready(init);

var days;
var ndays;
var cols = 0;
var rows = 0;
var tilesize = 125;
var boxup = false;
var imgH = 0;
var imgW = 0;
var imgR = 1;
var pad = 100;
var current = -1;
//var url='http://localhost:8888/everyday/'
//var url='http://makesomethingcooleveryday.anthonymattox.com/'
var url='file://localhost/Users/Anthony/Downloads/makesomethingcooleveryday.anthonymattox.com/';

// on document load
function init() {
	days = $('.day');
	ndays = days.size();
	$('#body').addClass('js');
	$('body').append('<div id="box"><div id="x">x</div></div>');
	$('#box').fadeOut(0).css('opacity', 0);
	
	tile(0);
	$(window).resize(function() {
		tile(300);
		if (boxup && $('#box .thing').hasClass('img')) {
			boxsize();
		}
	});
	
	$('.day').each(function(i) {
		if (!$(this).hasClass('text')) {
			$(this).click(function() {
				$(this).append('<div class="load"><div class="lbg"></div><div class="lgif"></div></div>');
				$(this).find('.load').css({'opacity': 0}).animate({
					'opacity':1
				},200);
				box($(this).attr('id'), i);
			});
		} else {
			$(this).click(function() {
				textbox($(this));
			});
		}
	});
	
	$('#box #x').click(function() {
		closeBox();
	});
	
	//$(body).append('<div style="color:#FFF" id="test"></div>');
	
	$(document).keyup(function(e) {
		//alert('keypressed:  '+e.keyCode);
		//$('#test').html(e.keyCode);
		if (boxup) {
			if (e.keyCode==27) {
				closeBox();
			} else
			if (e.keyCode==37 || e.keyCode==75){
				// left arrow pressed (or k)
				if (current>0) {
					var ni = current-1;
					box($('.day:eq('+ni+')').attr('id'), ni);
				}
			} else
			if (e.keyCode==39 || e.keyCode==74) {
				// right arrow pressed (or j)
				if (current<ndays-2) {
					var ni = current+1;
					box($('.day:eq('+ni+')').attr('id'), ni);
				}
			}
		}
	});
	
	// load item if hash is set
	if (window.location.hash!='') {
		var id = window.location.hash.substr(6);
		var I = $('.day#'+id);
		if (I.length>0) {
			box(id, I.prevAll('.day').length);
			$(I).append('<div class="load"><div class="lbg"></div><div class="lgif"></div></div>');
			$(I).find('.load').css({'opacity': 0}).animate({
				'opacity':1
			},200);
		}
	}
}



// tile images
function tile(time) {
	var ncols = Math.floor(($(window).width()-20)/tilesize);
	if (ncols !=cols) {
		cols = ncols;
		rows = Math.ceil((ndays+2)/cols);
		
		$('#body').stop().animate({
			'height' : rows * tilesize,
			'width' : cols * tilesize
		}, time);
		$('.day').each(function(i) {
			$(this).stop().animate({
				'left' : (i+2)%cols * tilesize,
				'top' : Math.floor((i+2)/cols) * tilesize
			}, time);
		});
	}
}

// load a thing into the pop up box
function box(id, index) {
	current=index;
	$.get(url+'index.php/load/l/'+id+'.html', null, function(data) {
													 
		$('.load').animate({
			'opacity':0
		},200,function(){$(this).remove();});
		
		$('#box').html('<div id="x">x</div>'+data);
		
		$('#box #x').click(function() {
			closeBox();
		});
		
		$('#box').stop().show();
		if ($('#box .thing').hasClass('img')) {
			$('#box img').load(function() {
				imgW = $(this).width();
				imgH = $(this).height();
				imgR = imgH/imgW;
				$('#box').css({'width': imgW, 'margin-left': -imgW/2-20});
				boxsize()
			});
		} else {
			W = $('#box .thing').width();
			H = $('#box .thing').height();
			$('#box').css({'width': W, 'margin-left': -W/2-20});
		}
		$('#box').animate({'opacity': 1}, 300);
		boxup=true;
	});
	window.location.hash='#item-'+id;
}

function textbox(e) {
	$('#box').html('<div id="x">x</div>'+e.find('.textcontent').html());
	
	$('#box #x').click(function() {
		closeBox();
	});
	
	$('#box').stop().show();
	W = 400;
	H = 200;
	$('#box').animate({opacity: 1}, 300);
	$('#box').css({'width': W, 'margin-left': -W/2-20});
	boxup=true;
}

// resize box
function boxsize() {
	var img = $('#box img');
	
	if ($(window).width()-(imgW+100)<0 || $(window).height()-(imgH+200)<0 || img.width()<imgW || img.height()<imgH) {
		if($(window).width()-(imgW+100) > $(window).height()-(imgH+200)) {
			img.height($(window).height()-200)
		} else {
			img.height(($(window).width()-100)*imgR)
		}
		if (img.height()>imgH) {
			img.height(imgH);
		}
	}
	
	var h = img.height();
	var w = img.width();
	if (w<400) {
		w=400;
	}
	$('#box').css({'width': w, 'margin-left': -w/2-20});
}

function closeBox() {
	$('#box').stop().animate({opacity: 0}, 300, function() {$(this).hide();});
	boxup=false;
	window.location.hash='#none';
}