// (function (window) {
//     window.__env = window.__env || {};
//     window.__env.BASE_URL = 'http://backend_service:8000';
//   })(this);


(function(window) {
    window.env = window.env || {};
  
    // Environment variables
    window["env"]["apiUrl"] = "${API_URL}";
    window["env"]["debug"] = "${DEBUG}";
  })(this);
  