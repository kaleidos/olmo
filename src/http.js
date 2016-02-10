import R from 'ramda';
import Rx from 'rx';

// type alias Settings = { onProgress : Observer
//                       , desiredResponseType : String
//                       , crossDomain : Bool
//                       , timeout : Int
//                       , withCredentials : Maybe Bool}

export const defaultRequest = {verb: 'GET',
                               headers: [],
                               url: ''};

export const defaultSettings = {onProgress: Rx.Observer.create(),
                                desiredResponseType: 'text',
                                withCredentials: false,
                                timeout: 0};


// get : Decoder v -> String -> Task Error v
export function get(decoder, url) {
  return request(decoder, 'GET', url);
}


// post : Decoder v -> String -> Body -> Task Error v
export function post(decoder, url, body) {
  return request(decoder, 'POST', url);
}


// put : Decoder v -> String -> Body -> Task Error v
export function put(decoder, url, body) {
  return request(decoder, 'PUT', url);
}


// patch : Decoder v -> String -> Body -> Task Error v
export function patch(decoder, url, body) {
  return request(decoder, 'PATCH', url, body);
}


// del : Decoder v -> String -> Task Error v
export function del(decoder, url) {
  return request(decoder, 'DELETE', url);
}


// request : Decoder v -> String -> String -> Body -> [[String]] -> Task Error v
export function request(decoder, verb, url, body=undefined, headers=[]) {
  const request = {verb, url, body, headers};
  return send(defaultSettings, request).map(decoder);
}

// type alias Request = { verb : String
//                      , headers : List (String, String)
//                      , url : String
//                      , body: Maybe Body }

// type alias Response = { status : Int
//                       , statusText : String
//                       , headers : Dict String String
//                       , url : String
//                       , value : Value }

// send : Settings -> Request -> Task Error Response
export function send(settings, request) {
  return Rx.Observable.create(function sendObservable(observer) {
    const req = new XMLHttpRequest();

    req.addEventListener('progress', function(event) {
      settings.onProgress.onNext(event);
    });
    req.addEventListener('error', function(event) {
      observer.onError(event);
    });
    req.addEventListener('abort', function(event) {
      observer.onCompleted();
    });

    req.addEventListener('load', function(event) {
      observer.onNext(toResponse(req));
      observer.onCompleted();
    });

    req.open(request.verb, request.url, true);
    R.forEach(([key, value]) => req.setRequestHeader(key, value),
              request.headers);

    req.timeout = settings.timeout;
    req.withCredentials = settings.withCredentials;
    req.desiredResponseType = settings.desiredResponseType;

    req.send(request.body);
  });
}

export function url(baseUrl, params=[]) {
  let url = `${baseUrl}`;
  let query = R.join('&', R.map(R.pipe(R.map(uriEncode), R.join('=')), params));
  if (query) {
    url += `?${query}`;
  }
  return url;
}

export const uriEncode = encodeURI;
export const uriDecode = decodeURI;

function toResponse(xreq) {
  return {
    status: xreq.status,
    statusText: xreq.statusText,
    headers: parseHeaders(xreq.getAllResponseHeaders()),
    url: xreq.responseURL,
    value: xreq.response
  };
}

function parseHeaders(rawHeaders) {
  var headers = {};
  var headerPairs = rawHeaders.split('\u000d\u000a');
  for (var i = headerPairs.length; i--; ) {
    var headerPair = headerPairs[i];
    var index = headerPair.indexOf('\u003a\u0020');
    if (index > 0) {
      var key = headerPair.substring(0, index);
      var value = headerPair.substring(index + 2);

      headers[key] = value;
    }
  }
  return headers;
}

export default {
  url,
  get,
  post,
  put,
  patch,
  del,
  request,
  send,
  uriDecode,
  uriEncode,
  defaultSettings,
  defaultRequest,
};
