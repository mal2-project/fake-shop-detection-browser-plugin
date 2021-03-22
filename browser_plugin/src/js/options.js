document.addEventListener("DOMContentLoaded", function () {
  const $eulaCheckbox = document.getElementById("eulaCheckbox");
  const acceptedEula = window.localStorage.getItem("accepted_eula");
  if (acceptedEula) {
    console.log("Hello Init");
    $eulaCheckbox.checked = true;
  }
  if (acceptedEula === true) {
    console.log("Hello Init DOM");
    $eulaCheckbox.checked = true;
  }
  console.log($eulaCheckbox);
  $eulaCheckbox.onclick = function (element) {
    if ($eulaCheckbox.checked === true) {
      console.log("Write eula");
      window.localStorage.setItem("accepted_eula", true);
      $eulaCheckbox.checked = true;
    } else {
      window.localStorage.removeItem("accepted_eula");
    }
  };
});
