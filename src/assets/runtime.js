// (function (window) {
//     window.__env = window.__env || {};
//     window.__env.BASE_URL = 'http://backend_service:8000';
//   })(this);


  (function(window) {
    window["env"] = window["env"] || {};
  
    // Environment variables
    window["env"]["apiUrl"] = "http://backend_service:8000";
    window["env"]["debug"] = true;
  })(this);
  