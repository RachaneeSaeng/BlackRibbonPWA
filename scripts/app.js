var resultCanvas = document.getElementById('resultCanvas');
var resultCtx = resultCanvas.getContext('2d');
var img = new Image();  

$(function() {  
  $('#upload').on('change', function() {
    showUploadedImage(this);
  });
});

function showUploadedImage(input){ 
  if (input.files && input.files[0]) {
      var reader = new FileReader();

      reader.onload = function (e) {  
          img.crossOrigin ='anonymous'; 
          img.onload = function() {                             
                            $('#outputImage').css('width',img.width);   
                            $('#outputImage').css('height',img.height);          
                            $('#outputImage').css('background-image', 'url(' + img.src + ')');
                        };
         img.src = e.target.result; 
      }
      reader.readAsDataURL(input.files[0]);
  }   
}

function showTextOutput(){
    var txt = $('#inputText').val();
    $('#outputText').html(txt.replace(/\n\r?/g, '<br/>'));
}

function buildResultAndDownload(){
    resultCtx.clearRect(0, 0, resultCanvas.width, resultCanvas.height);
      
    $(resultCanvas).attr('width',img.width);   
    $(resultCanvas).attr('height',img.height);          
    resultCtx.drawImage(img, 0, 0);
     
    var divStyle = [
                    'width:' + img.width +'px',
                    'height:' + img.height +'px',
                    'display:flex',
                    'align-items:center',
                    'justify-content: center',                    
                    'text-align: center',
                    'color: white',
                    'text-shadow: 1px 0px gray',
                    'font-weight: 300',
                    'font-size: 1em',
                     'font-family: Arial, Helvetica, sans-serif'
                  ];  

    var svgData = '<svg xmlns="http://www.w3.org/2000/svg">' +
           '<foreignObject width="100%" height="100%">' +
           '<div xmlns="http://www.w3.org/1999/xhtml" style="' + divStyle.join(';') + '">' +           
            $('#outputText').html().replace(/<div>/g,'<br/>').replace(/<\/div>/g,'').replace(/<br>/g,'<br/>') +            
           '</div>' +
           '</foreignObject>' +
           '</svg>';

    var imgTxt = new Image();   
    imgTxt.crossOrigin ='anonymous';
    imgTxt.onload = function() {                
                    resultCtx.drawImage(imgTxt, 0, 0);
                    var link = document.createElement('a');
                    link.download = "yourQuote.png";
                    link.href = resultCanvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
                    link.click();                
                };
    imgTxt.src = buildSvgImageUrl(svgData);   
}

function buildSvgImageUrl(svgData) {
    var b64 = window.btoa(unescape(encodeURIComponent(svgData)));
    return 'data:image/svg+xml;base64,' + b64;
}