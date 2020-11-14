// Process and display train table from csv file upload
$('input[name="csv-upload"').change(function(e) {

  const extension = $('input[name="csv-upload"').val().split(".").pop().toLowerCase();

  // Show error if file upload uses the wrong extension
  if ($.inArray(extension, ["csv"]) == -1) {
    $('.error-message').text('File must have a .csv extension');
    return false;
  }

  if (e.target.files != undefined) {
    const reader = new FileReader();
    reader.onload = function(e) {

      $('.error-message').text('');

      // Create array from the csv file 
      const lines = e.target.result.split('\r\n');

      // Init final array to print with the heading row
      const headerArray = lines[0];

      // Init array consisting of train line entries
      let trainArray = [];

      // Init array of train list with duplicate entries removed
      let filteredTrainArr = [];

      // Populate array with train entries
      trainArray = populateTrainArray(lines, trainArray);

      //Sort train entries in alphabetical order by run number
      trainArray = sortTrainArray(trainArray);

      // Remove duplicate train entries
      filteredTrainArr = removeDuplicates(trainArray, filteredTrainArr);


      // Combine the header and alphebetically ordered and filtered train array
      const completeArray = [].concat(headerArray, filteredTrainArr);

      // Remove the table elements for a new file upload
      $('.results-container .train-table thead tr td').remove();
      $('.results-container .train-table tbody tr td').remove();

      // Remove the pagination div
      $('.results-container .nav').remove();

      // Create the table.
      createTrainTable(completeArray);

      // Create pagination navigation
      paginate();
    };
    reader.readAsText(e.target.files.item(0));
  }

  return false;
});

function populateTrainArray(lines, trainArray) {
  for (i = 0; i < lines.length; ++i) {
    if (i > 0) {
      trainArray.push(lines[i]);
    }
  }

  return trainArray;
}

function sortTrainArray(trainArray) {
  trainArray.sort(function(a, b) {
    if (a.split(',')[2].trim() < b.split(',')[2].trim()) {
      return -1;
    }

    if (a.split(',')[2].trim() > b.split(',')[2].trim()) {
      return 1;
    }

    return 0;
  });

  return trainArray;
}

function removeDuplicates(trainArray, filteredTrainArr) {
  $.each(trainArray, function(key, value) {
    if (!filteredTrainArr.includes(value)) {
      filteredTrainArr.push(value);
    }
  });

  return filteredTrainArr;
}

function createTrainTable(completeArray) {
  for (i = 0; i < completeArray.length; ++i) {
    let lineArray = completeArray[i].split(',');

    // Create extra row if more entries exist
    if (i > $('.results-container .train-table tbody tr').length) {
      $('.results-container .train-table tbody').append('<tr></tr>');
    }

    // Create table data elements
    $.each(lineArray, function(value) {
      if (i === 0) {
        $('.results-container .train-table thead tr').append('<td><strong>'+ lineArray[value].trim() + '</strong></td>');
      } else {
        $('.results-container .train-table tbody tr:nth-child('+ i +')').append('<td>'+ lineArray[value].trim() + '</td>');
      }
    });

    // Remove empty table rows
    $( ".results-container .train-table tbody tr" ).each(function() {
      if ($(this).is(':empty')) {
        $(this).remove();
      }
    });
  }
}

function paginate() {

  // Create div for pagination navigation
  $('.train-table').after('<div class="nav"></div>');

  let rowstoDisplay = 5;
  let totalRows = $('.train-table tbody tr').length;
  let pages = totalRows/rowstoDisplay;

  // Create page links
  for(i = 0; i < pages; i++) {
    let page = i + 1;
    $('.nav').append('<a href="#" rel="'+ i +'">'+page+'</a> ');
  }

  // Show first page
  $('.train-table tbody tr').hide();
  $('.train-table tbody tr').slice(0, rowstoDisplay).show();
  $('.nav a:first').addClass('active');

  // Show page of items on naviation click
  $('.nav a').bind('click', function() {

    $('.nav a').removeClass('active');
    $(this).addClass('active');
    let currPage = $(this).attr('rel');
    let firstItem = currPage * rowstoDisplay;
    let lastItem = firstItem + rowstoDisplay;

    $('.train-table tbody tr').css('opacity','0.0').hide().slice(firstItem, lastItem).
    css('display','table-row').animate({opacity:1}, 200);
  });
}
