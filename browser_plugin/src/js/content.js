// listen for commands

// #############################################################################
// GLOBAL VARS

const $body = $("body");


// #############################################################################
// HELPERS

// Detect and return browser api

window.browser = (function () {
  return window.msBrowser ||
    window.browser ||
    window.chrome;
})();


// #############################################################################
// MESSAGES

function insertFraudWarning () {
  console.log("Inside Insert Fraud");
  let warning = "";

  warning += "<div aria-live=\"polite\" id=\"fs-warning\" style=\"background: #E9ECEF; position: fixed; display: flex; align-items: center; justify-content: center; top: 0; left: 0; right: 0; bottom: 0; z-index: 2147483647;\">";
  warning += "<div style=\"display: flex; width: 100%; max-width: 400px; padding: 10px;\">";
  warning += "<div style=\"flex: 0 0 64px; background-position: top right; background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHN0eWxlPSdmaWxsLXJ1bGU6ZXZlbm9kZDtjbGlwLXJ1bGU6ZXZlbm9kZDtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLW1pdGVybGltaXQ6MjsnPjxwYXRoIGQ9J00zMi4zNjQsMmwtMjYuMzY0LDEwLjkwOWwwLDE2LjM2NGMwLDE1LjEzNiAxMS4yNDgsMjkuMjkxIDI2LjM2NCwzMi43MjdjMTUuMTE1LC0zLjQzNiAyNi4zNjMsLTE3LjU5MSAyNi4zNjMsLTMyLjcyN2wwLC0xNi4zNjRsLTI2LjM2MywtMTAuOTA5Wicgc3R5bGU9J2ZpbGw6I2IyMTAxMDtmaWxsLXJ1bGU6bm9uemVybzsnLz48cGF0aCBkPSdNNDIuODM2LDQ3LjM2OWwtMTAuNjYsLTEwLjY1OWwtMTAuNTgsMTAuNThsLTQuNDU1LC00LjQ1NWwxMC41OCwtMTAuNThsLTEwLjU4LC0xMC41OGw0LjUwOCwtNC41MDhsMTAuNTgsMTAuNThsMTAuNTgsLTEwLjU4bDQuNDU1LDQuNDU1bC0xMC41OCwxMC41OGwxMC42NiwxMC42NTlsLTQuNTA4LDQuNTA4Wicgc3R5bGU9J2ZpbGw6I2ZmZjtmaWxsLXJ1bGU6bm9uemVybztzdHJva2U6I2ZmZjtzdHJva2Utd2lkdGg6MC42NHB4OycvPjwvc3ZnPgo='); width: 64px; height: 64px;\"></div>";
  warning += "<div style=\"flex: 1 1 auto; padding: 0 10px 0 10px; font-family: Arial, sans-serif; font-size: 14px; line-height: 1.5; color: #212529;\">";
  warning += "<div id=\"fs-warning-text\">Dieser Shop wurde als ein betrügerisches Angebot eingestuft, hier sollten Sie nicht einkaufen!</div>";
  warning += "<div id=\"fs-warning-link\" tabindex=\"1\" \" style=\"display: inline-block; color: #007BB3; outline: 0; cursor: pointer; margin-top: 10px;\" onclick=\"$('#fs-warning').css('display', 'none');\">Warnung ignorieren</div>";
  warning += "</div>";
  warning += "</div>";

  console.log("warning", $("fs-warning"));
  if (!document.getElementById("fs-warning")) {
    console.log("Append");
    $body.append(warning);
  }

  const $link = $("#fs-warning-link");

  $link.on("focus", function () {
    $link.css("text-decoration", "underline");
  }).on("blur", function () {
    $link.css("text-decoration", "none");
  });

  $body.on("click", "#fs-warning", function () {
    console.log("clicked ignore");
    // document.getElementById("fs-warning").style.display = "none";
    $("#fs-warning").css("display", "none");
  });
}

function insertPotentialFraudWarning () {
  let warning = "";

  warning += "<div aria-live=\"polite\" id=\"fs-warning\" style=\"background: #E9ECEF; position: fixed; display: flex; align-items: center; justify-content: center; top: 0; left: 0; right: 0; bottom: 0; z-index: 2147483647;\">";
  warning += "<div style=\"display: flex; width: 100%; max-width: 400px; padding: 10px;\">";
  warning += "<div style=\"flex: 0 0 64px; background-position: top right; background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHN0eWxlPSdmaWxsLXJ1bGU6ZXZlbm9kZDtjbGlwLXJ1bGU6ZXZlbm9kZDtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLW1pdGVybGltaXQ6MjsnPjxwYXRoIGQ9J00zMi4zNjQsMmwtMjYuMzY0LDEwLjkwOWwwLDE2LjM2NGMwLDE1LjEzNiAxMS4yNDgsMjkuMjkxIDI2LjM2NCwzMi43MjdjMTUuMTE1LC0zLjQzNiAyNi4zNjMsLTE3LjU5MSAyNi4zNjMsLTMyLjcyN2wwLC0xNi4zNjRsLTI2LjM2MywtMTAuOTA5Wicgc3R5bGU9J2ZpbGw6I2IyMTAxMDtmaWxsLXJ1bGU6bm9uemVybzsnLz48cGF0aCBkPSdNNDIuODM2LDQ3LjM2OWwtMTAuNjYsLTEwLjY1OWwtMTAuNTgsMTAuNThsLTQuNDU1LC00LjQ1NWwxMC41OCwtMTAuNThsLTEwLjU4LC0xMC41OGw0LjUwOCwtNC41MDhsMTAuNTgsMTAuNThsMTAuNTgsLTEwLjU4bDQuNDU1LDQuNDU1bC0xMC41OCwxMC41OGwxMC42NiwxMC42NTlsLTQuNTA4LDQuNTA4Wicgc3R5bGU9J2ZpbGw6I2ZmZjtmaWxsLXJ1bGU6bm9uemVybztzdHJva2U6I2ZmZjtzdHJva2Utd2lkdGg6MC42NHB4OycvPjwvc3ZnPgo='); width: 64px; height: 64px;\"></div>";
  warning += "<div style=\"flex: 1 1 auto; padding: 0 10px 0 10px; font-family: Arial, sans-serif; font-size: 14px; line-height: 1.5; color: #212529;\">";
  warning += "<div id=\"fs-warning-text\">Diese Internetseite wurde automatisch überprüft. Zahlreiche Elemente der Seite weisen auf ein betrügerischen Online-Shop hin.<br>Handelt es sich nicht um einen Onlineshop? Warnung ignorieren</div>";
  warning += "<div id=\"fs-warning-link\" tabindex=\"1\" \" style=\"display: inline-block; color: #007BB3; outline: 0; cursor: pointer; margin-top: 10px;\" onclick=\"$('#fs-warning').css('display', 'none');\">Warnung ignorieren</div>";
  warning += "</div>";
  warning += "</div>";

  console.log("warning", $("fs-warning"));
  if (!document.getElementById("fs-warning")) {
    console.log("Append");
    $body.append(warning);
  }

  const $link = $("#fs-warning-link");

  $link.on("focus", function () {
    $link.css("text-decoration", "underline");
  }).on("blur", function () {
    $link.css("text-decoration", "none");
  });

  $body.on("click", "#fs-warning", function () {
    console.log("clicked ignore");
    // document.getElementById("fs-warning").style.display = "none";
    $("#fs-warning").css("display", "none");
  });
}

window.browser.runtime.onMessage.addListener(function (request, sender, response) {
  console.log("Hello fraud", request.command);
  if (request.command === "show_fraud_warning") {
    insertFraudWarning();
  }
  if (request.command === "show_potential_fraud_warning") {
    insertPotentialFraudWarning();
  }
});
