cfg = {
  "embedGmapKey" : "AIzaSyAquTlXePfkMLhiegBr4EiCO9F7iyl58Hc"
}

function voidFn() {
  "use strict";
  console.log("void");
}

function logFn(err) {
  "use strict";
  console.log("err", err);
}

function validate_code() {
  "use strict";
  //let codeInput = document.getElementById("code");
  let url = "https://t5gcez6nv5.execute-api.us-east-1.amazonaws.com/prod/userbysession";
  let el = document.getElementById("address");
  wrap_http(
    url,
    (response) => el.setAttribute("data-userID", response.userID),
    (err) => logFn(err)
    );
}

function search_address() {
  "use strict";
  let el = document.getElementById("address");
  let url = encodeURI(
    "https://maps.googleapis.com/maps/api/geocode/json?address=" + el.value +
    ", London, UK&key=AIzaSyAR9Ciiga6WiScmWiiw8S9p_vUCDzAamIM"
    );

  wrap_http(
    url,
    (ret) => process_geolocation(ret),
    (err) => logFn(err)
    );
}


function process_geolocation(ret) {
  "use strict";
  console.log(ret);
  let loc = ret.results[0].geometry.location;
  let stopPointTypes = [
  "NaptanBusWayPoint", "NaptanOnstreetBusCoachStopCluster", "NaptanOnstreetBusCoachStopPair", "NaptanPrivateBusCoachTram",
  "NaptanPublicBusCoachTram"
  ];
  let url = encodeURI(
    "https://api.tfl.gov.uk/StopPoint?modes=bus&stopTypes=" + stopPointTypes.join(",") + "&lat=" + loc.lat +
    "&lon=" + loc.lng + "&categories=none"
    );
  console.log(url);
  wrap_http(
    url,
    (ret) => process_stops(ret),
    (err) => logFn(err)
    );
  //let iframe = create_iframe(gmap_url(cfg.embedGmapKey, loc.lat, loc.lng));
  //let div = document.getElementById("map");
  //div.appendChild(iframe);
}

function process_stops(ret) {
  "use strict";
  console.log(ret);
  let div = document.getElementById("busStops");
  div.textContent = "List of StopPoints";
  ret.stopPoints.reduce(function (accumulator, curValue) {
    accumulator.appendChild(stop_to_div(curValue));
    return accumulator;
}, div);
}

function stop_to_div(stopPoint) {
  "use strict";
  let el = document.createElement("div");
  let span = document.createElement("span");
  span.textContent = stopPoint.commonName;
  el.appendChild(span);
  console.log(stopPoint.lines);
  let sul = document.createElement("ul");
  let ul = stopPoint.lines.reduce(function (accumulator, curValue) {
    accumulator.appendChild(line_to_li(curValue));
    return accumulator;
}, sul);
  el.appendChild(ul);
  return el;
}

function line_to_li(line) {
  "use strict";
  let li = document.createElement("li");
  li.textContent = line.name;
  return li;
}



function myMap() {
    var mapOptions = {
        center: new google.maps.LatLng(51.5, -0.12),
        zoom: 10,
        mapTypeId: google.maps.MapTypeId.HYBRID
    }
var map = new google.maps.Map(document.getElementById("map"), mapOptions);
}


/*
function gmap_url(key, lat, lng, zoom = 14, maptype = "roadmap",query = "") {
  url = encodeURI(
    "https://www.google.com/maps/view/v1/search?"
    .concat("key=" + key)
    .concat("&center=" + lat + "," + lng)
    .concat("&zoom=" + zoom)
    .concat("&maptype=" + maptype)
    )
  return url
}

function create_iframe(src, width = 450, height = 450, frameborder="0", style="border:0") {
  let iframe = document.createElement("IFRAME");
  iframe.width = width
  iframe.height = height
  iframe.frameborder = frameborder
  iframe.style = style
  iframe.src = src
  return iframe
}
*/