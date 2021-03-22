// #############################################################################
// HELPERS

// Detect and return browser api

window.browser = (function () {
  return window.msBrowser ||
    window.browser ||
    window.chrome;
})();

// HELPER OR INDEX DB
/*eslint-disable */

//suppress all warnings between comments
!function(){function e(t,o){return n?void(n.transaction("s").objectStore("s").get(t).onsuccess=function(e){var t=e.target.result&&e.target.result.v||null;o(t)}):void setTimeout(function(){e(t,o)},100)}var t=window.indexedDB||window.mozIndexedDB||window.webkitIndexedDB||window.msIndexedDB;if(!t)return void console.error("indexDB not supported");var n,o={k:"",v:""},r=t.open("d2",1);r.onsuccess=function(e){n=this.result},r.onerror=function(e){console.error("indexedDB request error"),console.log(e)},r.onupgradeneeded=function(e){n=null;var t=e.target.result.createObjectStore("s",{keyPath:"k"});t.transaction.oncomplete=function(e){n=e.target.db}},window.ldb={get:e,set:function(e,t){o.k=e,o.v=t,n.transaction("s","readwrite").objectStore("s").put(o)}}}();
/* eslint-enable */

// #############################################################################
// CHECK IF PAGE IS A FAKE SHOP

function checkFakeShop (tab, url) {
  if (url) {
    let path = "img/action/action-disabled.png";
    const disabled_time = localStorage.getItem("disabled_time");
    const disable_offset = (15 * 60 * 1000);

    // CHECK IF PlUGIN IS TEMPORARILY DISABLED
    if (disabled_time == null || disabled_time < (Date.now() - disable_offset)) {
      if (!url.startsWith("chrome://") && !url.startsWith("about://")) {
        // CLEAN UP URL
        url = new URL(url);

        // PREPARATION FOR POST CALL

        // CHECK IF ID IS SAVED IN LOCALSTORAGE IF NOT GENERATE A NEW ONE
        var client_id = window.localStorage.getItem("client_id");
        if (client_id == null) {
          client_id = Math.random().toString(36).substr(2, 9);
          window.localStorage.setItem("client_id", client_id);
        }
        const optional_params = {
          method: "POST",
          // eslint-disable-next-line
          body: JSON.stringify({"site_baseURL": url, "clientID": client_id}),
          headers: {
            "Content-Type": "application/json",
          },
          auth_clinetId: "1",
        };
        // PREPARE URL FOR INDEXDB DATA
        url = url.hostname;
        url = url.replace("www.", "");
        // GET DATE FROM LOCAL STORAGE END CHECK IF IT IS OLDER THAN ONE DAY
        const date = window.localStorage.getItem("date");
        var one_day = (24 * 60 * 60 * 1000);
        var found = false;

        // INIT INDEXDB WITH DATA
        if (date == null || one_day < (Date.now() - date)) {
          // eslint-disable-next-line no-undef
          fetch("https://mal2.ait.ac.at/fake-shop-detector/api/1.1/whitelist?all=true")
            .then(data => data.json())
            .then(function (json) {
              window.ldb.set("whitelist", JSON.stringify(json));
              const whitelist = json;
              for (var j = 0; j < whitelist.length; j++) {
                if (found === false && whitelist[j].site_baseURL === url) {
                  path = "img/action/action-successful.png";
                  found = true;
                  window.browser.browserAction.setIcon({
                    path: {
                      32: path,
                    },
                  });
                }
              }
            })
            .then(
              fetch("https://mal2.ait.ac.at/fake-shop-detector/api/1.1/blacklist?all=true")
                .then(data => data.json())
                .then(function (json) {
                  window.ldb.set("blacklist", JSON.stringify(json));
                  const blacklist = json;
                  if (found === false) {
                    for (var i = 0; i < blacklist.length && found === false; i++) {
                      if (found === false && blacklist[i].site_baseURL === url) {
                        path = "img/action/action-disabled.png";
                        window.browser.tabs.sendMessage(tab.id, {
                          command: "show_fraud_warning",
                        });
                        found = true;
                        window.browser.browserAction.setIcon({
                          path: {
                            32: path,
                          },
                        });
                      }
                    }
                  }
                })).then(function () {
              fetch("https://mal2.ait.ac.at/fake-shop-detector/api/1.1/ignorelist?all=true")
                .then(data => data.json())
                .then(function (json) {
                  window.ldb.set("ignorelist", JSON.stringify(json));
                  const ignorelist = json;
                  if (found === false) {
                    for (var i = 0; i < ignorelist.length; i++) {
                      if (found === false && ignorelist[i].site_baseURL === url) {
                        path = "img/action/action-ingorelist.png";
                        found = true;
                        window.browser.browserAction.setIcon({
                          path: {
                            32: path,
                          },
                        });
                      }
                    }
                  }
                });
            })
            .then(function () {
              if (found === false) {
                fetch("https://mal2.ait.ac.at/fake-shop-detector/api/1.1/analyze", optional_params)
                  .then(data => data.json())
                  .then(function (json) {
                    if (json.status === 400) {
                      path = "img/action/action-not-analyzed.png";
                    }
                    // Assign right icon
                    if (json.processor === "whitelist") {
                      path = "img/action/action-successful.png";
                    } else if (json.processor === "blacklist") {
                      path = "img/action/action-fraud.png";
                      window.browser.tabs.sendMessage(tab.id, {
                        command: "show_fraud_warning",
                      });
                    } else if (json.processor === "mal2_ai") {
                      if (json.risk_score === "very low" && json.processor === "mal2_ai") {
                        path = "img/action/action-successful.png";
                      } else if (json.risk_score === "low" && json.processor === "mal2_ai") {
                        path = "img/action/action-low.png";
                      } else if (json.risk_score === "below average" && json.processor === "mal2_ai") {
                        path = "img/action/above-avg.png";
                      } else if (json.risk_score === "above average" && json.processor === "mal2_ai") {
                        path = "img/action/action-medium.png";
                      } else if (json.risk_score === "high" && json.processor === "mal2_ai") {
                        path = "img/action/action-maybe-fraud.png";
                      } else if (json.risk_score === "very high" && json.processor === "mal2_ai") {
                        path = "img/action/fraud.png";
                        window.browser.tabs.sendMessage(tab.id, {
                          command: "show_potential_fraud_warning",
                        });
                      }
                    }
                  });
              }
              window.browser.browserAction.setIcon({
                path: {
                  32: path,
                },
              });
              window.localStorage.setItem("date", Date.now());
            });
        } else {
          // USE DATA FROM INDEXDB
          let found = false;
          window.ldb.get("blacklist", function (value) {
            const blacklist = JSON.parse(value);
            for (var j = 0; j < blacklist.length && found === false; j++) {
              if (found === false && blacklist[j].site_baseURL === url) {
                path = "img/action/action-fraud.png";
                window.browser.tabs.sendMessage(tab.id, {
                  command: "show_fraud_warning",
                });
                found = true;
                window.browser.browserAction.setIcon({
                  path: {
                    32: path,
                  },
                });
              }
            }
            window.ldb.get("whitelist", function (value) {
              const whitelist = JSON.parse(value);
              for (var i = 0; i < whitelist.length && found === false; i++) {
                if (found === false && whitelist[i].site_baseURL === url) {
                  path = "img/action/action-successful.png";
                  found = true;
                  window.browser.browserAction.setIcon({
                    path: {
                      32: path,
                    },
                  });
                }
              }
              window.ldb.get("ignorelist", function (value) {
                const ignorelist = JSON.parse(value);
                for (var i = 0; i < ignorelist.length && found === false; i++) {
                  if (found === false && ignorelist[i].site_baseURL === url) {
                    path = "img/action/action-ingorelist.png";
                    found = true;
                    window.browser.browserAction.setIcon({
                      path: {
                        32: path,
                      },
                    });
                  }
                }
                // IF URL NOT FOUND IN CACHED DATA MAKE ANALYZE CALL
                if (found === false) {
                  fetch("https://mal2.ait.ac.at/fake-shop-detector/api/1.1/analyze", optional_params)
                    .then(data => data.json())
                    .then(function (json) {
                      if (json.status === 400) {
                        path = "img/action/action-not-analyzed.png";
                      }
                      // Assign right icon
                      // NO FAKE SHOP
                      if (json.processor === "whitelist") {
                        path = "img/action/action-successful.png";
                        // FAKE SHOP
                      } else if (json.processor === "blacklist") {
                        path = "img/action/action-fraud.png";

                        window.browser.tabs.sendMessage(tab.id, {
                          command: "show_fraud_warning",
                        });
                        // MAYBE FAKE SHOP
                      } else if (json.processor === "mal2_ai") {
                        if (json.risk_score === "very low" && json.processor === "mal2_ai") {
                          path = "img/action/action-successful.png";
                        } else if (json.risk_score === "low" && json.processor === "mal2_ai") {
                          path = "img/action/action-medium.png";
                        } else if (json.risk_score === "below average" && json.processor === "mal2_ai") {
                          path = "img/action/action-above-avg.png";
                        } else if (json.risk_score === "above average" && json.processor === "mal2_ai") {
                          path = "img/action/action-medium.png";
                        } else if (json.risk_score === "high" && json.processor === "mal2_ai") {
                          path = "img/action/action-medium.png";
                        } else if (json.risk_score === "very high" && json.processor === "mal2_ai") {
                          path = "img/action/action-fraud.png";
                          window.browser.tabs.sendMessage(tab.id, {
                            command: "show_potential_fraud_warning",
                          });
                        }
                      }
                      window.browser.browserAction.setIcon({
                        path: {
                          32: path,
                        },
                      });
                    });
                }
              });
            });
          });
          window.browser.browserAction.setIcon({
            path: {
              32: path,
            },
          });
        }
      }
    }
    if (disabled_time != null) {
      path = "img/action/action-not-analyzed.png";
      window.browser.browserAction.setIcon({
        path: {
          32: path,
        },
      });
    } else {
      path = "img/action/action-disabled.png";
      window.browser.browserAction.setIcon({
        path: {
          32: path,
        },
      });
    }
  }
}

window.browser.tabs.onActivated.addListener(function (active_info) {
  window.browser.tabs.getSelected(null, function (tab) {
    checkFakeShop(tab, tab.url);
  });
});

window.browser.tabs.onUpdated.addListener(function (tab_id, change_info, tab) {
  checkFakeShop(tab, tab.url);
});

// Listen if POPUP.js changed disable status and act accordingly
window.browser.runtime.onMessage.addListener(function () {
  window.browser.tabs.getSelected(null, function (tab) {
    checkFakeShop(tab, tab.url);
  });
});

window.browser.runtime.onInstalled.addListener(function (object) {
  window.browser.tabs.create({ url: window.browser.extension.getURL("options/options.html") }, function (tab) {
  });
});
