function callService(service, params, options) {
    var defer = $.Deferred();
    service(params, function (res) {
        if (res == undefined) {
            defer.resolve(undefined);
        } else if (_.has(res, 'exception')) {
            ArmanJsManager.trigger("error:server", res);
            if (options && options.error) {
                options.error(res.exception);
            }
            defer.resolve(undefined);
        } else {
            if (options && options.success) {
                options.success(res);
            }
            defer.resolve(res);
        }
    });
    return defer.promise();
}
function createServiceContext(tags) {
    var context = {
        userId:themeDisplay.getUserId(),
        scopeGroupId:themeDisplay.getScopeGroupId(),
        companyId:themeDisplay.getCompanyId(),
        layoutURL:themeDisplay.getLayoutURL(),
        plid:themeDisplay.getPlid()
    };

    if (tags) {
        context.assetTagNames = tags;
    }

    return JSON.stringify(context)
}

function callServiceByUrl(url, params, options) {
    var defer = $.Deferred();
    app.loading.begin(options.loadingKey);
    app.loader.notReady(url);
    var _url = url;
	var urlParams = '';
	
	//params.p_auth = authToken;
	
	for (var key in params) {
		if(params[key] != null){
			urlParams += '/' + key ;
			if(typeof params[key] === 'object'){
				//alert(JSON.stringify(params[key]));
				urlParams += '/' + JSON.stringify(params[key]);
				//urlParams += '/' + "salam";
			}else{
				if(params[key] === ""){
					params[key] = " ";
				}
				urlParams += '/' + params[key];
			}
		}else{
			urlParams += '/-' + key ;
		}
	}
	$.ajax({
		type:'GET',
		url:url + urlParams + '?p_auth=' + authToken,
		success: options.success,
		error: options.error,
		dataType:"jsonp"
	});

    return defer;
}