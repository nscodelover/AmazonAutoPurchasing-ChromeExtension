/*
Created by Alok 2017/2/8
*/

$(document).ready(function() {

  function toggleButton(button) {

    if(button.checked ==true) {
      console.log("checked");
    }
    else {
      console.log("unchecked");
    }

  }

  $("#cmn-toggle-1").click(function() {
    toggleButton(this);
  });

});
