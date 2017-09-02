function wrap_http(url, thenFn = voidFn, catchFn = voidFn, method = 'GET'){
	http ({
		method: method,
		url: url
	})
	.then(thenFn)
	.catch(catchFn)
}