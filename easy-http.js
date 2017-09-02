function http(options) {

  return new Promise(function(resolve, reject) {

    var xhr = new XMLHttpRequest()
    xhr.open(options.method, options.url)

    function ResponseError(status, message) {
      this.status = status
      this.message = message
    }

    function paserJson(dataString) {
      return JSON.parse(dataString)
    }

    function parseString(json) {
      return JSON.stringify(json)
    }

    function addHeaders(headers) {
      if (headers) {
        Object.keys(headers).forEach(function(key) {
          xhr.setRequestHeader(key, headers[key])
        })
      }
    }

    xhr.onload = function onload() {
      if (this.status >= 200 && this.status < 300) {
        return resolve(paserJson(xhr.response))
      }
      return reject(new ResponseError(this.status, xhr.statusText))
    }

    xhr.onerror = function onerror() {
      return reject(new ResponseError(this.status, xhr.statusText))
    }

    addHeaders(options.headers)
    xhr.send(parseString(options.data))
  })
}

/*
MIT License

Copyright (c) 2016 Marcos Florencio

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/