// function loading: hiển thị preload
function loading(){
    $('.loading').show();
    setInterval(function(){
        $('.loading').hide(100);
    }, 1200);
}
//Xóa sessionStorage sau khi load trang
// sessionStorage.clear();

// Check level
var level = sessionStorage.getItem('level');
if(!level) {
    window.location.href = 'index.html';
}
$('.span-title').text(`-- Level ${level} | EASY --`);    

//Loại bỏ click chuột để tránh copy text
document.addEventListener('contextmenu', event => event.preventDefault());

// Đọc dữ liệu từ file json
$.get('json/easy.json', null, null, 'json')
.then(function(response){
    const COUNTER = 5,
        TOTAL_TEXT = 5;
    var counter = COUNTER,
        blacklist = [],
        keyText = null,
        itemChecked = '',
        correct = 0;
    response = response[level];
    //function hashText: mã hóa chuỗi MD5
    function hashText(text) {
        return CryptoJS.MD5(text).toString();
    }

    //function validateText: validate text
    function validateText(text) {
        return text.toLowerCase().trim();
    }

    //function randomText: random text
    function randomText (min, max, blacklist) {
        if(!blacklist)
            blacklist = []
        var rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
        var retv = 0;
        while(blacklist.indexOf(retv = rand(min,max)) > -1) { }
        return retv;
    }

    function getTextCorrect (data){
        var textCorrect = '&#10071 Try harder &#10071';
        switch (data) {
            case 5:
                textCorrect = '&#11088 Excellent &#11088';
                break;
            case 4:
                textCorrect = '&#10024 Very good &#10024';
                break;
            case 3:
                textCorrect = '&#127383 Good &#127383';
                break;
            default:
                break;
        }
        return textCorrect;
    }
    
    //function loadText: hiển thị text
    function loadText() {
        $('.times').html('00:0'+COUNTER);
        keyText = randomText(0, response.length-1, blacklist);
        blacklist.push(keyText);
        var text = response[keyText].split(":");
        sessionStorage.setItem(keyText, hashText(keyText+validateText(text[0])));
        $('.flicker').text(validateText(text[0]));
        $('.easy-img').attr("src", `picture/easy/${level}_${text[0]}.jpg`);
        $('.easy-img').show();
        $('.text-translate').text(validateText(text[1]));
        countTime = setInterval(function() {
            counter--;
            $('.times').html('00:0'+counter);
            if (counter == 0) {
                clearInterval(countTime);
                $('.flicker').html('');
                $('.text-remember').hide();
                $('.counter').hide();
                $('.easy-img').hide();
                $('.input-group').show();
                $('#text-check').focus();
                return false;
            }
        }, 1000);
    }

    function setInputText(result) {
        var buttonSubmit = $('button[type=submit]'),
            textCheck = $('#text-check');
        switch (result) {
            case true:
                textCheck.css('backgroundColor', 'lightgreen');
                buttonSubmit.addClass('btn-success');
                buttonSubmit.text('Correct');
                break;
            case false:
                textCheck.css('backgroundColor', 'lightcoral');
                buttonSubmit.addClass('btn-danger');
                buttonSubmit.text('Wrong');
                break;
            default:
                textCheck.val('');
                textCheck.removeAttr("style");
                buttonSubmit.removeClass('btn-danger');
                buttonSubmit.removeClass('btn-success');
                buttonSubmit.text('Check');
                break;
        }
    }
    
    //click start
    $('.btn-start').on('click', function() {
        loading();
        $('.modal-intro').hide();
        $('.modal-easy').show();
        loadText();
    });

    //click submit
    $('button[type=submit]').on('click', function() {
        var textInput = validateText($('#text-check').val());
        if(textInput == "") {
            alert('The text is required');
            return false;
        }else if(textInput && keyText != null && hashText(keyText+textInput) == sessionStorage.getItem(keyText)){
            setInputText(true);
            correct++;
            var flagCheck = true;
        }else{
            setInputText(false);
            var flagCheck = false;
        }
        $('.easy-img').show().delay(1500).hide(500);
        $('.text-remember').show().delay(1500).hide(500);
        $(this).prop("disabled", true);
        var text = response[keyText].split(":");
        itemChecked += `<tr class="bg-${flagCheck ? "success" : "danger"}">
                            <td>${validateText(text[0])}</td>
                            <td>${textInput}</td>
                            <td>${validateText(text[1])}</td>
                            <td><img src="picture/easy/${level}_${text[0]}.jpg" alt="${text[0]}" height=75 width=75></img></td>
                            <td><span class="label label-${flagCheck ? "success" : "danger"}">${flagCheck ? "Correct" : "Wrong"}</span></td>
                        </tr>`;

        // Next text
        setTimeout(function(){
            if(blacklist.length < TOTAL_TEXT){
                setInputText(null);
                $('button[type=submit]').prop("disabled", false);
                $('.input-group').hide();
                $('.text-remember').show();
                $('.counter').show();
                counter = COUNTER;
                loadText();
                $('#text-check').focus();
            }else{
                loadText();
                var htmlResult = `
                                <h3 class="text-center text-danger">Correct: ${correct}/${TOTAL_TEXT}</h3>
                                <h3 class="text-center text-danger">${getTextCorrect(correct)}</h3>
                                <table class="table table-condensed">
                                    <thead class="thead-dark">
                                        <tr>
                                            <th class="text-center">Text</th>
                                            <th class="text-center">Your input</th>
                                            <th class="text-center">Translate</th>
                                            <th class="text-center">Image</th>
                                            <th class="text-center">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${itemChecked}
                                    </tbody>
                                </table>
                                <a href="/easy.html" class="btn btn-primary btn-md">Reset</a>
                                `;
                $('.modal-body').html(htmlResult);
                $('.modal-easy').hide();
                $('.modal-intro').show();
            }
        }, 2000);
    });

    //click reset
    $('.btnResetQuestion').on('click', function() {
        location.reload();
    });
});
