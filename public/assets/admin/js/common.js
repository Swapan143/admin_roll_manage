

$(document).ready(function() 
{
  $("#sign_in").validationEngine();
  $('.js-example-basic-search').select2();
  $(".only_integer").keypress(function (event) {
      var inputValue = event.charCode;
      if (!(inputValue >= 48 && inputValue <= 57)) {
          event.preventDefault();
      }
  });

  $(".only_character").keypress(function (e) {
      var regex = new RegExp("^[a-zA-Z ]+$");
      var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
      if (regex.test(str)) {
          return true;
      }

      e.preventDefault();
      return false;
  });

  $(".number_character").keypress(function (e) {
      var regex = new RegExp("^[a-zA-Z  0-9]+$");
      var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
      if (regex.test(str)) {
          return true;
      }

      e.preventDefault();
      return false;
  });
  $(".number_character_hipen").keypress(function (e) {
    var regex = new RegExp("^[a-zA-Z  0-9/]+$");
    var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
    if (regex.test(str)) {
        return true;
    }

    e.preventDefault();
    return false;
  });

  $('.decimal').keypress(function(event) 
  {    
    var $this = $(this);
    if ($this.val().length == 0 && event.which == 48 )
    {
            return false;
    }
    else
    {
      if ((event.which != 46 || $this.val().indexOf('.') != -1) &&
      ((event.which < 48 || event.which > 57) &&
      (event.which != 0 && event.which != 8))) 
      {
          event.preventDefault();
      }

      var text = $(this).val();
      if ((event.which == 46) && (text.indexOf('.') == -1)) 
      {
          setTimeout(function() {
              if ($this.val().substring($this.val().indexOf('.')).length > 3) {
                  $this.val($this.val().substring(0, $this.val().indexOf('.') + 3));
              }
          }, 1);
      }

      if ((text.indexOf('.') != -1) &&
          (text.substring(text.indexOf('.')).length > 2) &&
          (event.which != 0 && event.which != 8) &&
          ($(this)[0].selectionStart >= text.length - 2)) 
          {
              event.preventDefault();
          }   
    }   
  });
});



function show_less_ks_desc(transid) {
  $('#more_ks_desc_' + transid).show();
  $('#less_ks_desc_' + transid).hide();
}

function show_more_ks_desc(transid) {
  $('#more_ks_desc_' + transid).hide();
  $('#less_ks_desc_' + transid).show();
}

function why_we_show_less_ks_desc(transid) {
  $('#why_we_more_ks_desc_' + transid).show();
  $('#why_we_less_ks_desc_' + transid).hide();
}

function why_we_show_more_ks_desc(transid) {
  $('#why_we_more_ks_desc_' + transid).hide();
  $('#why_we_less_ks_desc_' + transid).show();
}

function details_desc_show_less_ks_desc(transid) {
  $('#details_desc_more_ks_desc_' + transid).show();
  $('#details_desc_less_ks_desc_' + transid).hide();
}

function details_desc_show_more_ks_desc(transid) {
  $('#details_desc_more_ks_desc_' + transid).hide();
  $('#details_desc_less_ks_desc_' + transid).show();
}

// page refresh
$('#refresh').click(function() 
{
  location.reload();
});

function get_company() 
{
  $("#input_upload_company").trigger("click"); 
}

function show_photo_company(input) 
{
  if (input.files && input.files[0]) 
  {
    var reader = new FileReader();
    var FileSize = input.files[0].size / 1024 / 1024; // in MB
    var FileType = input.files[0].type;
    var ext = $('#input_upload_company').val().split('.').pop().toLowerCase();
    if($.inArray(ext, ['JPEG','PNG','JPG','png','jpg','jpeg']) == -1) 
    {
        alert('invalid extension!');
        $("#input_upload_company").val('');
    }
    else
    {
      if(FileSize < 1)
      {
        reader.onload = function (e) {
        $('#upload_photo_company')
        .attr('src', e.target.result)
        .width(100)
        .height(100);
        };
        reader.readAsDataURL(input.files[0]);
      }
      else
      {
        alert('Maximum file size 1MB can be upload');
        $(input).val('');
      }
    }
  }
}

function status_change(id)
{
  var current_url = $('#current_url').val();
 
  $.ajax({
   url:current_url+'/status',
   type:'POST',
   data:{id:id},
   success: function(data)
   {
       if (data.success) 
       {
        toastr.options.positionClass = 'toast-top-full-width';
        toastr.success("Status updated sucessfully.");
       }
       else
       {
        toastr.options.positionClass = 'toast-top-full-width';
        toastr.success("Something went wrong!");
       }
   }
  })
}


    





