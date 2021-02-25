$(document).ready(function() {
    
  
    $(function() {
      $("#sortable1, #sortable2, #sortable3")
        .sortable({
          connectWith: ".list-body"
        })
        .disableSelection();
    });
  });
  