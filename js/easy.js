function loading(){
    $('.loading').show();
    setInterval(function(){
        $('.loading').hide(100);
    }, 1200);
}
loading();
sessionStorage.clear();
document.addEventListener('contextmenu', event => event.preventDefault());
$.get('json/easy.json', null, null, 'json')
.then(function(response){
    const COUNTER = 5,
        TOTAL_TEXT = 10;
    var counter = COUNTER,
        blacklist = [],
        keyText = null,
        itemChecked = '',
        correct = 0;
        response = response[0].text.split("|");
        console.log(response)

    function hashText(text) {
        return CryptoJS.MD5(text).toString();
    }

    function validateText(text) {
        return text.toLowerCase().trim();
    }

    function randomText (min, max, blacklist) {
        if(!blacklist)
            blacklist = []
        var rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
        var retv = 0;
        while(blacklist.indexOf(retv = rand(min,max)) > -1) { }
        return retv;
    }

    function loadText() {
        $('.times').html('00:0'+COUNTER);
        keyText = randomText(0, response.length-1, blacklist);
        blacklist.push(keyText);
        var text = response[keyText].split(":");
        sessionStorage.setItem(keyText, hashText(keyText+validateText(text[0])));
        $('.flicker').text(validateText(text[0]));
        $('.text-translate').text(validateText(text[1]));
        countTime = setInterval(function() {
            counter--;
            $('.times').html('00:0'+counter);
            if (counter == 0) {
                clearInterval(countTime);
                $('.flicker').html('');
                $('.text-remember').hide();
                $('.counter').hide();
                $('.input-group').show();
                $('#text-check').focus();
                return false;
            }
        }, 1000);
    }

    $('.btn-start').click(function(){
        loading();
        $('.modal-intro').hide();
        $('.modal-easy').show();
        loadText();
    });

    $('button[type=submit]').on('click', function() {
        var textInput = validateText($('#text-check').val());
        if(textInput == "") {
            alert('The text is required');
            return false;
        }else if(textInput && keyText != null && hashText(keyText+textInput) == sessionStorage.getItem(keyText)){
            setInputText(true);
            correct++;
            var statusChecked = `<span class="label label-success">Correct</span>`;
        }else{
            var statusChecked = `<span class="label label-danger">Wrong</span>`;
            setInputText(false);
        }
        $(this).prop("disabled", true);
        var text = response[keyText].split(":");
        itemChecked += `<tr>
                            <td>${validateText(text[0])}</td>
                            <td>${textInput}</td>
                            <td>${validateText(text[1])}</td>
                            <td>${statusChecked}</td>
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
                                <table class="table table-striped table-condensed">
                                    <thead>
                                        <tr>
                                            <th class="text-center">Text</th>
                                            <th class="text-center">Your input</th>
                                            <th class="text-center">Translate</th>
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
        }, 1600);
    });

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

    $('.btnResetQuestion').on('click', function() {
        location.reload();
    });
});
