// Agency Theme JavaScript

(function($) {
    "use strict"; // Start of use strict

    // jQuery for page scrolling feature - requires jQuery Easing plugin
    $('a.page-scroll').bind('click', function(event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: ($($anchor.attr('href')).offset().top - 50)
        }, 1250, 'easeInOutExpo');
        event.preventDefault();
    });

    // Highlight the top nav as scrolling occurs
    $('body').scrollspy({
        target: '.navbar-fixed-top',
        offset: 51
    });

    // Closes the Responsive Menu on Menu Item Click
    $('.navbar-collapse ul li a').click(function(){ 
            $('.navbar-toggle:visible').click();
    });

    // Offset for Main Navigation
    $('#mainNav').affix({
        offset: {
            top: 100
        }
    });
	
	function goAjax(url, data, callback, dataType, type, processData) {
		var ajaxOptions = {
			url: url,
			data: data,
			success: function(resp) {
				callback(null, resp);
			},
			error: function(a, b, c) {
				callback(c, a.responseText);
			}
		};
		if (processData !== undefined)
			ajaxOptions.processData = processData;
		if (type !== undefined)
			ajaxOptions.type = type;
		if (dataType !== undefined) {
			ajaxOptions.dataType = dataType;
			if (dataType.toString().toUpperCase() === "JSON" && !processData)
				ajaxOptions.contentType = "application/json";
		}
		$.ajax(ajaxOptions);
	}
	
	function clickingGo() {
		console.log("test");
        $('#confirmacion').show();
	};
	
	$("#changeV").click(function(){
		
    });  
	
	var checkCode = function() {
		var code = $("#code").val().trim();
		if ( code === "") {
			return alert("Por favor poné el código que te pasamos acá.");
		} else {
			webAPICall("Code", "validateCode", null, function(err, resp) {
				ws.toggleProgress("blockSpinner", true);
				if (err || resp.error) { //probably means invalid token, thus user needs to login again
					return console.log("Error retrieving logging information: " + (err ? err : resp.error));
				}
				$scope.setSession(resp.data); //API responds with user data from the token which is stored in global var
			});
		}
		
	};
	
	var webAPICall = function(mod, fn, data, callback) {
		var url = location.origin + "/webapi/" + mod + "/" + fn;
		var type = data === null ? "GET" : "POST";
		if (data !== undefined && data !== null)
			data = JSON.stringify(data);
		goAjax(url, data, function(err, resp) {
			if (err)
				return callback(err, resp);
			//TODO: manage authentication
			callback(err, resp);
		}, "JSON", type);
	};	

})(jQuery); // End of use strict
