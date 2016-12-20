var Cropper = (function() {

  var $size = 1200;

  var $uploadCrop;
  var $uploadedImageOrientation = 0;

  var $profileShape = 'square';

  function readFile(input) {
		if (input.files && input.files[0]) {
      $('.upload-msg').text('Reading Image');

      var reader = new FileReader();
      reader.onload = function (e) {
        $('.upload-msg').css('display', 'none');
        $('.upload-result').css('display', 'inline-block');
        $('.advanced-options').css('display', 'block');
			  $('.cropper-area').addClass('ready');

      	$uploadCrop.croppie('bind', {
      		url: e.target.result,
          zoom: 0
      	}).then(function() {
          console.log('jQuery bind complete');
        });
      }
      reader.readAsDataURL(input.files[0]);
    } else {

    }
	}

  function showResult() {
    $uploadCrop.croppie('result', {
      type: 'canvas',
      size: { width: $size, height: $size },
      format: 'png'
    }).then(function (resp) {
      popupResult({
        src: resp
      });
    });
  }

  function popupResult(result) {
    $('.right-pane .processing-area').css('display', 'block');
    $('.right-pane #result-wrapper').css('display', 'none');

    var cnv = document.getElementById("result-canvas");
    var ctx = cnv.getContext("2d");

    var image = new Image();
    image.src = result.src;
    image.onload = function() {
      var imageOverlay = new Image();
      if ($profileShape == 'square')
        imageOverlay.src = '/img/badge_left_' + $size + '.png';
      else
        imageOverlay.src = '/img/badge_left_circle_' + $size + '.png';
      imageOverlay.onload = function() {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, $size, $size);
        ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0, image.width, image.height);
        ctx.drawImage(imageOverlay, 0, 0, imageOverlay.width, imageOverlay.height, 0, 0, imageOverlay.width, imageOverlay.height);
        var jpegUrl = cnv.toDataURL("image/jpeg");
        $('#result-wrapper .image-area').html('<img src="' + jpegUrl + '" download="profile.jpg">');
        $('#result-wrapper').css('display', 'block');
        $('.right-pane .processing-area').css('display', 'none');
      };
    };
  }

  $uploadCrop = $('.cropper-area').croppie({
      enableExif: true,
      viewport: {
          width: 280,
          height: 280,
          type: 'square'
      },
      boundary: {
          width: 300,
          height: 300
      }
  });
  $('#upload').on('change', function () {
    readFile(this);
  });
  $('.upload-result').on('click', function () { showResult(); });

  $('input[type=radio][name=profile-shape]').change(function() {
    $profileShape = this.value;
    if ($profileShape == 'circle') {
      $('#badge-overlay-left').css('display', 'none');
      $('#circle-display-frame').css('display', 'inline-block');
      $('#badge-overlay-left-circle').css('display', 'inline-block');
    } else {
      $('#badge-overlay-left').css('display', 'inline-block');
      $('#circle-display-frame').css('display', 'none');
      $('#badge-overlay-left-circle').css('display', 'none');
    }
  });

  $profileShape = $('input[type=radio][name=profile-shape]').val();

})();