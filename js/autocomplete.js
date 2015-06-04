    $(function(){

      // applied typeahead to the text input box
      $('#professor_input').typeahead({
        name: 'professors',

        // data source
        prefetch: '../professors.json',

        // max item numbers list in the dropdown
        limit: 10
      });

    });