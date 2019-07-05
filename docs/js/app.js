
function openNav() {
  document.getElementById("mySidenav").style.width = "100%";
}

function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
}

function onscroll(event){
	if (window.matchMedia('(min-width: 992px)').matches) {
	   var st = $(this).scrollTop();
	   if(Math.min(st, 60) <=60){
	     $("#bar").css('margin-top', Math.min(st, 60));
	   }
	   if($("#imgDisplay").height() > $("#myresult").height() + st){
	     $("#myresult").css('margin-top', st);
	   }
	}
}

function excel_product_item(){
	var excel_items = "";
	var excel_item = $("#excel_item").html();
	$("#excel_item").html('');
	$.get("https://honeyweb.org/api/22", function(data, status){
	  if(status = "success"){
	    var products = data;
	    for (var i = 0; i < products.length; i++) {
	      if(i%4==0){
	        excel_items = excel_items + '<div class="row">';
	      }
	      var t = excel_item;
	      t = t.replace("%id%", products[i].id);
	      t = t.replace("%name%", products[i].title);
	      t = t.replace("%excerpt%", products[i].excerpt);
	      t = t.replace("%price%", products[i].price);
	      t = t.replace("%category%", products[i].category);
	      var rhtml = "";
	      for (var j = products[i].rating - 1; j >= 0; j--) {
	        rhtml = rhtml + '<span class="fa fa-star checked"></span>';
	      };
	      for (var j = 5 - products[i].rating - 1; j >= 0; j--) {
	        rhtml = rhtml + '<span class="fa fa-star"></span>';
	      };
	      t = t.replace("%rating%", rhtml);
	      var images = JSON.parse(products[i].images);
	      t = t.replace("%image%", '<img src="'+images[0]+'" alt="image" style="width: 100%" />');
	      excel_items = excel_items + t;
	      if(i%4==3){
	        excel_items = excel_items + '</div>';
	      }
	    };
	    $("#excel_items").html(excel_items);
	  }
	});
}

function product_description(){
	var imgDisplay = $("#imgDisplay").html();
  $("#imgDisplay").html('');
  $.get("https://honeyweb.org/api/23/"+localStorage.getItem('param'),function(data, status){
    if(status == "success"){
      var iHtml = imgDisplay.replace('%title%',data.title);
      var iHtml = iHtml.replace('%price%',data.price);
      var iHtml = iHtml.replace('%description%',data.description);
      var iHtml = iHtml.replace('%category%',data.category);
      //--------------------
      var rhtml = "";
      for (var j = data.rating - 1; j >= 0; j--) {
        rhtml = rhtml + '<span class="fa fa-star checked"></span>';
      };
      for (var j = 5 - data.rating - 1; j >= 0; j--) {
        rhtml = rhtml + '<span class="fa fa-star"></span>';
      };
      iHtml = iHtml.replace("%rating%", rhtml);
      //--------------------
      var images = JSON.parse(data.images);
      var sihtml = "";
      for (var i = images.length - 1; i >= 0; i--) {
        sihtml = sihtml + '<div class="sideImages text-center"><img src="'+images[i]+'" style="width: 100%" /></div>';
      }
      var iHtml = iHtml.replace('%sihtml%',sihtml);
      //--------------------
      $("#imgDisplay").html(iHtml);
      //--------------------
      imageZoom("myimage", "myresult"); 
      $(".img-zoom-container").hover(function(){
        $("#myresult").toggleClass("hidden");
      });
      $("#myresult").toggleClass("hidden");
    }
  });
}

function cart_list(){
	$.get("https://honeyweb.org/api/22", function(data, status){
    if(status = "success"){
      var products = data;
      var cart_items = "";
      var cart_item = $("#cart_item").prop('outerHTML');
      var cartHeading = $("#cartHeading").prop('outerHTML');
      cartHeading = cartHeading.replace("%n%",products.length)
      for (var i = 0; i < products.length; i++) {
        var t = cart_item;
        t = t.replace("%name%", products[i].name);
        cart_items = cart_items + t;
      };
      $("#cart_items").html(cartHeading + cart_items);
    }
  });
}

function plusF(e){
  $(e).next().val(parseInt($(e).next().val()) + 1);
}

function minusF(e){
  if(parseInt($(e).prev().val()) > 0){
    $(e).prev().val(parseInt($(e).prev().val()) - 1);
  }
}

$(document).ready(function() {
  $('.plus').click(function() {
    $(this).next().val(parseInt($(this).next().val()) + 1);
  });
  $('.minus').click(function() {
    if(parseInt($(this).prev().val()) > 0){
	    $(this).prev().val(parseInt($(this).prev().val()) - 1);
	  }
  });
});

// $().ready(function() {
//     var $scrollingDiv = $("#bar");

//     $(window).scroll(function(){            
//         $scrollingDiv
//             .stop()
//             .animate({"marginTop": ($(window).scrollTop() )}, "fast" );         
//     });
// });

function routing(){
	var path = window.location.pathname;
  path = path.replace('.html','');
  path = path.replace('/excel_store','');

	if(path == '' || path == '/' || path == '/index'){
		excel_product_item();
	}else if(path == '/cart'){
		cart_list();
	}else if(path == '/product_description'){
		product_description();
	}
}
routing();

function route(path, param = null){
  localStorage.setItem('param',param);
  window.location.href = $("base").prop('href') + path + ((window.location.hostname == 'localhost')?'.html':'');
}

if(window.location.hostname == 'localhost'){
  $("base").prop('href',window.location.protocol + '//' + window.location.host + '/');
}