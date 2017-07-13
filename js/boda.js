var userData = {};
var username = "";
var loading = false;

toggleProgress = function(currState) {
    if (currState === undefined)
        currState = false;
    if (!currState)
        $("#blockSpinner").fadeIn("fast");
    else {
        var spinner = $("#blockSpinner");
        spinner.stop();
        spinner.fadeOut("fast");
    }
};


var confirm = function(ans) {
	if ( userData.id <= 0) {
		return alert("Intentá otra vez, por fa.");
	} else {
		userData.comments = $("#commentTxt").val().trim();
		toggleProgress(false);
		userData.status = parseInt(ans);
		webAPICall("Boda", "ConfirmGuest", userData, function(err, resp) {
			if (err || resp.error) {
				toggleProgress(true);
				return alert("Disculpá, posiblemente la cagamos de alguna forma :)");
			}
			if (ans == 1){
				alert ("Gracias por confirmar, te esperamos");
				$('#confirmText').hide();
				$('#confirmBtns').hide();
				$('#nopeText').hide();
				$('#confirmedText').show();
				$('#confirmedBtns').show();
			}
			else{
				alert ("Qué madre, pero gracias por avisarnos");
				$('#confirmText').hide();
				$('#confirmBtns').hide();
				$('#nopeText').show();
				$('#confirmedText').hide();
				$('#confirmedBtns').hide();
			}
			toggleProgress(true);
		});
	}
};

var verify = function () {
	loading = true;
	checkCode();
};

var checkCode = function() {
	var code = $("#code").val().trim();
	if ( code === "" || !loading) {
		return alert("Por favor poné el código que te pasamos acá.");
	} else {
		toggleProgress(false);
		webAPICall("Boda", "GetInviteInfo?code=" + code, null, function(err, resp) {
			if (err || resp.error) {
				toggleProgress(true);
				return alert("Disculpá, posiblemente la cagamos de alguna forma :)");			
			}
			if (resp.data.guest.id == 0)
				return alert("Verificá bien el código que te pasamos.");
			else {
				userData = resp.data.guest;
				$('#page-top').append(resp.data.txtHtml);
				$('#first').hide();
				$('footer').show();
				$('#mainNav').show();
				switch(resp.data.guest.status){
					case 0:
						$('#confirmText').show();
						$('#confirmBtns').show();
						$('#nopeText').hide();
						$('#confirmedText').hide();
						$('#confirmedBtns').hide();
						break;
					case 1:
						$('#confirmText').hide();
						$('#confirmBtns').hide();
						$('#nopeText').hide();
						$('#confirmedText').show();
						$('#confirmedBtns').show();
						break;
					case 2:
						$('#confirmText').hide();
						$('#confirmBtns').hide();
						$('#nopeText').show();
						$('#confirmedText').hide();
						$('#confirmedBtns').hide();
						break;
					default:
						$('#confirmText').show();
						$('#confirmBtns').show();
						$('#nopeText').hide();
						$('#confirmedText').hide();
						$('#confirmedBtns').hide();
						break;
				}
				Cookies.set('user', code);
				$("#complement").text(userData.complement);
				$(".verbConfirm").text(userData.can);
				$(".dijoVerb").text(userData.say);
				$("#pronoun").text(userData.pronoun);
				$("#tieneVerb").text(userData.have);
				$("#seats").text(userData.seats > 1 ? userData.seats + " espacios" : userData.seats + " espacio");
				var myVar = setInterval(function() {
					toggleProgress(true);
				}, 4000);
			}
		});
	}
};


var webAPICall = function(mod, fn, data, callback) {
	// var url = "http://ec2-35-162-192-94.us-west-2.compute.amazonaws.com/api/" + mod + "/" + fn;
	var url = "http://henrycalderonve.ga/api/" + mod + "/" + fn;
	// var url = "http://localhost:59223/api/" + mod + "/" + fn;
	var type = data === null ? "GET" : "POST";
	if (data !== undefined && data !== null)
		data = JSON.stringify(data);
	goAjax(url, data, function(err, resp) {
		if (err)
			return callback(err, resp);
		callback(err, resp);
	}, "JSON", type);
};	

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

var displayData = function() {
	$('#first').hide();
	$('header').show();
	$('footer').show();
	$('#mainNav').show();
	$('#detalles').show();
	$('#about').show();
	$('#rsvp').show();
}

var changeUser = function (){
	$('#first').show();
	$('header').hide();
	$('footer').hide();
	$('#mainNav').hide();
	$('#detalles').hide();
	$('#about').hide();
	$('#rsvp').hide();
}

var loadFromCookies = function () {
	username = Cookies.get('user');
	if (username != undefined || username.trim() !== "") {
		$('#loginForm').hide();
		$('#code').val(username);
		loading = true;
		checkCode();
	}			
};

loadFromCookies();