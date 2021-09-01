function loading(){
    $('.loading').show();
    setInterval(function(){
        $('.loading').hide(100);
    }, 1000);
}
loading();
sessionStorage.clear();
document.addEventListener('contextmenu', event => event.preventDefault());
$.get('json/easy.json', null, null, 'json')
.then(function(response){
    const COUNTER = 5,
        TOTAL_TEXT = 2;
    var counter = COUNTER,
        blacklist = [],
        keyText = null,
        itemChecked = '',
        correct = 0,
        response = response[0].text.split(" ");

    function hashText(text) {
        return CryptoJS.MD5(text).toString();
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
        sessionStorage.setItem(keyText, hashText(keyText+response[keyText].toLowerCase()));
        $('.flicker').text(response[keyText].toLowerCase());
        countTime = setInterval(function() {
            counter--;
            $('.times').html('00:0'+counter);
            if (counter == 0) {
                clearInterval(countTime);
                $('.sign').hide();
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
        $(this).prop("disabled", true);
        var text = $('#text-check').val().toLowerCase();
        if(text && keyText != null && hashText(keyText+text) == sessionStorage.getItem(keyText)){
            setInputText(true);
            correct++;
            var statusChecked = `<span class="label label-success">Correct</span>`;
        }else{
            var statusChecked = `<span class="label label-danger">Wrong</span>`;
            setInputText(false);

        }
        itemChecked += `<tr>
                            <td>${response[keyText].toLowerCase()}</td>
                            <td>${text}</td>
                            <td>${statusChecked}</td>
                        </tr>`;

        setTimeout(function(){
            if(blacklist.length < TOTAL_TEXT){
                setInputText(null);
                $('button[type=submit]').prop("disabled", false);
                $('.input-group').hide();
                $('.sign').show();
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
        switch (result) {
            case true:
                $('#text-check').css('backgroundColor', 'lightgreen');
                $('button[type=submit]').addClass('btn-success');
                $('button[type=submit]').text('Correct');
                break;
            case false:
                $('#text-check').css('backgroundColor', 'lightcoral');
                $('button[type=submit]').addClass('btn-danger');
                $('button[type=submit]').text('Wrong');
                break;
            default:
                $('#text-check').val('');
                $('#text-check').removeAttr("style");
                $('button[type=submit]').removeClass('btn-danger');
                $('button[type=submit]').removeClass('btn-success');
                $('button[type=submit]').text('Check');
                break;
        }
    }

    $('.btnResetQuestion').on('click', function() {
        location.reload();
    });
});
