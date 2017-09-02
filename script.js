

function voidFn() {
    console.log("void");
}

function logFn(err) {
    console.log("err", err);
}

function validate_code() {
    let codeInput = document.getElementById("code");
    let url = "https://t5gcez6nv5.execute-api.us-east-1.amazonaws.com/prod/userbysession";
    let el = document.getElementById("address");
    wrap_http(url,
        (response) => el.setAttribute("data-userID", response.userID),
        (err) => logFn(err)
    );
}

function search_address(){
    let el = document.getElementById("address");
    let url=encodeURI("https://maps.googleapis.com/maps/api/geocode/json?address=" + el.value + ", London, UK&key=AIzaSyAR9Ciiga6WiScmWiiw8S9p_vUCDzAamIM");

    wrap_http(url,
        (ret) => process_geolocation(ret),
        (err) => logFn(err)
    );
}


function process_geolocation(ret){
    console.log(ret);
    let loc = ret.results[0].geometry.location;
    //update_map(ret.results[0].location)
    //find list of stops (location)

    let stopPointTypes = ["NaptanBusWayPoint", "NaptanOnstreetBusCoachStopCluster", "NaptanOnstreetBusCoachStopPair",
  "NaptanPrivateBusCoachTram", "NaptanPublicBusCoachTram"];

    let url = encodeURI("https://api.tfl.gov.uk/StopPoint?modes=bus&stopTypes="+ stopPointTypes.join(",") + "&lat=" + loc.lat +
                    "&lon=" + loc.lng + "&categories=none");
    console.log(url);
    wrap_http(url,
        (ret) => process_stops(ret),
        (err) => logFn(err)
    );  
}

function process_stops(ret){
    console.log(ret);

    let div = document.getElementById("busStops");
    div.textContent = "List of StopPoints";

    ret.stopPoints.reduce(function(accumulator, curValue) {
        accumulator.appendChild(stop_to_div(curValue));
        return accumulator;
    }, div);
    //div.appendChild(ul);

}

function stop_to_div(stopPoint) {
    let el = document.createElement("div");
    let span = document.createElement("span");
    span.textContent = stopPoint.commonName;
    el.appendChild(span);
    //let ul = document.createElement("ul");

    console.log (stopPoint.lines);
    let sul = document.createElement("ul")
    let ul = stopPoint.lines.reduce(function(accumulator, curValue) {
        accumulator.appendChild(line_to_li(curValue))
        return accumulator;
    }, sul);

    el.appendChild(ul);

    return el;
}
    //stopPoint.lines.Map(line_to_line).map((x) => x.appendChild(x));
    


function line_to_li(line) {
    let li = document.createElement("li");
    li.textContent = line.name;
    return li;
}
/*
 <!---
  <div class="expanded-result-details">
<a href="javascript:void(0);">
<div class="nearby-mode-details">
<span class="nearby-list-heading">Camden Town Station / Bayham Street</span>
<h4 class="visually-hidden">Bus routes</h4>
<ul class="nearby-list-information">
<li class="bus-route">168</li>
<li class="bus-route">214</li>
<li class="bus-route">253</li>
<li class="bus-route">274</li>
<li class="bus-route">C2</li>
</ul>
</div>
<div class="nearby-mode-information">
<span class="mode-icon blank-bus-stop-icon"><span class="visually-hidden">Bus stop </span>T</span>
</div>
</a>
</div>
-->

*/
    /*http({
      method: 'GET',
      url: 'https://t5gcez6nv5.execute-api.us-east-1.amazonaws.com/prod/userbysession'
    })
    .then(function(response) {
      console.log('response', response)
      
    })
    .catch(function(err) {
      console.log('err', err)
    })
    */
    //return p1 * p2;              // The function returns the product of p1 and p2