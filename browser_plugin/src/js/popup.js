// #############################################################################
// HELPERS

// Detect and return browser api

window.browser = (function () {
  return window.msBrowser ||
    window.browser ||
    window.chrome;
})();

// HELPER INDEXDB
/*eslint-disable */
//suppress all warnings between comments
!function(){function e(t,o){return n?void(n.transaction("s").objectStore("s").get(t).onsuccess=function(e){var t=e.target.result&&e.target.result.v||null;o(t)}):void setTimeout(function(){e(t,o)},100)}var t=window.indexedDB||window.mozIndexedDB||window.webkitIndexedDB||window.msIndexedDB;if(!t)return void console.error("indexDB not supported");var n,o={k:"",v:""},r=t.open("d2",1);r.onsuccess=function(e){n=this.result},r.onerror=function(e){console.error("indexedDB request error"),console.log(e)},r.onupgradeneeded=function(e){n=null;var t=e.target.result.createObjectStore("s",{keyPath:"k"});t.transaction.oncomplete=function(e){n=e.target.db}},window.ldb={get:e,set:function(e,t){o.k=e,o.v=t,n.transaction("s","readwrite").objectStore("s").put(o)}}}();
/* eslint-enable */

// #############################################################################
// LOCALES

const $locales = $("[data-locales]");

$locales.each(function (index) {
  const $locale = $locales.eq(index);

  $locale.html(
    window.browser.i18n.getMessage($locale.data("locales"))
  );
});

// #############################################################################
// POPUP

const $db_info_disabled = $("[data-db-info=\"disabled\"]");
const $db_info_disabled_slider = $("[data-db-info=\"disabled-slider\"]");
const $db_info_ignore_name = $("#popupInfoIgnoreName");
const $db_info_ignore_description = $("#popupInfoIgnoreDescription");
const $db_info_ignore_link = $("#popupInfoIgnoreLink");
const $db_info_fraud = $("[data-db-info=\"fraud\"]");
const $db_info_fraud_name = $("#popupInfoFraudName");
const $db_info_fraud_description = $("#popupInfoFraudDescription");
const $db_info_fraud_link = $("#popupInfoFraudLink");
const $db_info_maybe_fraud = $("[data-db-info=\"maybe-fraud\"]");
const $db_info_not_analyzed = $("[data-db-info=\"not-analyzed\"]");
const $db_info_not_checked = $("[data-db-info=\"not-checked\"]");
const $db_info_successful = $("[data-db-info=\"successful\"]");
const $db_info_successful_listing = $("[data-db-info=\"successful-listing\"]");

const $db_info_successful_name = $("#popupInfoSuccessfulName");
const $db_info_successful_description = $("#popupInfoSuccesfulDescription");
const $db_info_successfull_trustmark = $("[data-db-info=\"successful-trustmark\"]");
const $db_info_successful_link = $("#popupInfoSuccesfulLink");
const $db_info_very_failed = $("[data-db-info=\"failed\"]");
const $db_info_working = $("[data-db-info=\"working\"]");
const $disabled_plugin = $("[data-locales=\"disableText\"]");

const $db_info_very_low = $("[data-db-info=\"very-low\"]");
const $db_info_low = $("[data-db-info=\"low\"]");
const $db_info_below_avg = $("[data-db-info=\"below-avg\"]");
const $db_info_above_avg = $("[data-db-info=\"above-avg\"]");
const $db_info_high = $("[data-db-info=\"high\"]");
const $db_info_very_high = $("[data-db-info=\"very-high\"]");

const $info = $("[data-info]");

const $indicator_icon = $("[data-indicator-icon]");

const disableSwitch = document.getElementById("disableSwitch");

window.browser.tabs.query({
  active: true,
  lastFocusedWindow: true,
}, function ($tabs) {
  var url = $tabs[0].url;
  var client_id = window.localStorage.getItem("client_id");
  const optional_params = {
    method: "POST",
    body: JSON.stringify({ site_baseURL: url, clientID: client_id }),
    headers: {
      "Content-Type": "application/json",
    },
    auth_clinetId: 1,
  };

  const disabled_time = localStorage.getItem("disabled_time");
  const disable_offset = (15 * 60 * 1000);

  // CHECK IF PLUGIN IS TEMPORARLY DISABLED
  if (disabled_time == null || disabled_time < (Date.now() - disable_offset)) {
    // IF NOT DISABLED CHECK IF DATE NEEDS TO BE DELETED IF YES DELETE IT
    if (disabled_time != null && disabled_time > disable_offset) {
      localStorage.removeItem("disable_time");
    }
    if (!url.startsWith("chrome://") && !url.startsWith("about://")) {
      // CLEAN UP URL
      url = new URL(url);
      url = url.hostname;
      url = url.replace("www.", "");
      var found = false;
      // CHECK IF SHOP IS FAKE
      window.ldb.get("blacklist", function (value) {
        const blacklist = JSON.parse(value);
        for (var j = 0; j < blacklist.length && found === false; j++) {
          if (found === false && blacklist[j].site_baseURL === url) {
            $db_info_working.addClass("hidden");
            found = true;
            $db_info_fraud_link.append("<a target='_blank' href=\"" + blacklist[j]["site-information-link"] + "\"> Details zum Fake - Shop</a>");
            $db_info_fraud_name.html("Gefunden in: ").append(blacklist[j]["blacklist-name"]);
            $db_info_fraud_description.append(blacklist[j]["blacklist-description"]);
            $db_info_fraud.removeClass("hidden");
            $indicator_icon.addClass("indicator-fraud");
          }
        }
        // CHECK IF SHOP IS IN WHITELIST
        window.ldb.get("whitelist", function (value) {
          const whitelist = JSON.parse(value);
          for (var i = 0; i < whitelist.length && found === false; i++) {
            if (found === false && whitelist[i].site_baseURL === url) {
              $db_info_working.addClass("hidden");
              found = true;
              if (whitelist[i].whitelist_type === "trustmark") {
                $db_info_successful_name.html("Dieser Shop ist Träger des Gütezeichens ");
                $db_info_successfull_trustmark.removeClass("hidden");
              } else {
                $db_info_successful_name.html("Dieser Shop ist auf ");
              }
              $db_info_successful_link.append("<a target='_blank' href=\"" + whitelist[i]["whitelist-url"] + "\"> Details zur Quelle</a>");
              $db_info_successful_name.append(whitelist[i]["whitelist-name"]);
              if(whitelist[i].whitelist_type === "secure_listing"){
                $db_info_successful_name.append(" angeführt.");
                $db_info_successful_listing.removeClass("hidden");
              }
              $db_info_successful_description.text(whitelist[i]["whitelist-description"]);
              if (whitelist[i].whitelist_type === "trustmark") {
                $db_info_successful_description.append("<br><br>Sie befinden sich auf einem vertrauenswürdigen Onlineshop.")

              }
              $db_info_successful.removeClass("hidden");
              $indicator_icon.addClass("indicator-successful");
              $info.removeClass("hidden");
            }
          }
          // CHECK IF SHOP IS IN IGNORELIST ELSE MAKE ANALYZE CALL
          window.ldb.get("ignorelist", function (value) {
            const ignorelist = JSON.parse(value);
            for (var i = 0; i < ignorelist.length && found === false; i++) {
              if (found === false && ignorelist[i].site_baseURL === url) {
                found = true;
                $db_info_ignore_link.append("<a target='_blank' href=\"" + ignorelist[i]["ignorelist-url"] + "\"> Details zur Quelle</a>");
                $db_info_ignore_name.html("Gelistet durch: ").append(ignorelist[i]["ignorelist-name"]);
                $db_info_ignore_name.append(ignorelist[i]["ignorelist-description"]);

                $db_info_working.addClass("hidden");
                $db_info_disabled.removeClass("hidden");
                $indicator_icon.addClass("indicator-ignorelist");
                $info.addClass("hidden");
              }
            }
            if (found === false) {
              // If not found in cache make a REST call
              fetch("https://mal2.ait.ac.at/fake-shop-detector/api/1.1/analyze", optional_params)
                .then(data => data.json()).then(function (json) {
                  $db_info_working.addClass("hidden");
                  if (json.status === 400) {
                    $db_info_very_failed.removeClass("hidden");
                    // $db_info_disabled.removeClass("hidden");
                    $indicator_icon.addClass("indicator-not-analyzed");
                    $info.addClass("hidden");
                  } else if (json.risk_score === "very low" && json.processor === "mal2_ai") {
                    $db_info_very_low.removeClass("hidden");
                    $indicator_icon.addClass("indicator-successful");
                  } else if (json.risk_score === "low" && json.processor === "mal2_ai") {
                    $db_info_low.removeClass("hidden");
                    $indicator_icon.addClass("indicator-medium");
                  } else if (json.risk_score === "below average" && json.processor === "mal2_ai") {
                    $db_info_below_avg.removeClass("hidden");
                    $indicator_icon.addClass("indicator-medium");
                  } else if (json.risk_score === "above average" && json.processor === "mal2_ai") {
                    $db_info_above_avg.removeClass("hidden");
                    $indicator_icon.addClass("indicator-medium");
                  } else if (json.risk_score === "high" && json.processor === "mal2_ai") {
                    $db_info_high.removeClass("hidden");
                    $indicator_icon.addClass("indicator-medium");
                  } else if (json.risk_score === "very high" && json.processor === "mal2_ai") {
                    $db_info_very_high.removeClass("hidden");
                    $indicator_icon.addClass("indicator-fraud");
                  } else if (json.processor === "whitelist") {
                    if (json.whitelist_type === "trustmark") {
                      $db_info_successful_name.html("Verifiziert durch: ");
                    } else {
                      $db_info_successful_name.html("Gelistet bei: ");
                    }
                    $db_info_successful_name.append(json["whitelist-name"]);
                    $db_info_successful_description.text(json["whitelist-description"]);
                    $db_info_successful.removeClass("hidden");
                    $indicator_icon.addClass("indicator-successful");
                    $info.removeClass("hidden");
                  } else if (json.processor === "blacklist") {
                    $db_info_fraud_name.html("Gefunden in: ").append(json["blacklist-name"]);
                    $db_info_fraud_description.append(json["blacklist-description"]);
                    $db_info_fraud.removeClass("hidden");
                    $indicator_icon.addClass("indicator-fraud");
                  } else {
                    $db_info_disabled.removeClass("hidden");
                    $indicator_icon.addClass("indicator-disabled");
                    $info.addClass("hidden");
                  }
                });
            }
          });
        });
      });
    } else {
      $db_info_disabled.removeClass("hidden");
      $indicator_icon.addClass("indicator-disabled");
      $info.addClass("hidden");
    }
  } else {
    // IF PLUGIN IS DISABLED SET SWITCH TO FALSE
    $db_info_working.addClass("hidden");
    $disabled_plugin.removeClass("hidden");
    $db_info_disabled_slider.removeClass("hidden");
    disableSwitch.checked = false;
  }
});

// #############################################################################
// Activate / Deactivate Plugin

disableSwitch.onclick = function (element) {
  if (disableSwitch.checked === false) {
    localStorage.setItem("disabled_time", Date.now());
    disableSwitch.checked = false;
  } else {
    localStorage.removeItem("disabled_time");
  }
  // Notify BACKGROUND.js if disabled status has changed, reload Popup after that
  window.browser.runtime.sendMessage({}, function () {
    window.location.reload(true);
  });
  window.location.reload(true);
};
