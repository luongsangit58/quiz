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
    const COUNTER = 5;
    var counter = COUNTER,
        blacklist = [],
        keyText = null,
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
        keyText = randomText(0, response.length-1, blacklist);
        console.log(keyText, response[keyText]);
        blacklist.push(keyText);
        sessionStorage.setItem(keyText, hashText(keyText+response[keyText]));
        $('.flicker').text(response[keyText]);
        console.log(response[keyText]);
        console.log(blacklist);
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

    $('#text-check').on('keypress', function (e) {
        if(e.which === 13){
            $('button[type=submit]').trigger( "click" );
        }
    });

    $('button[type=submit]').on('click', function() {
        $(this).prop("disabled", true);
        var text = $('#text-check').val();
        if(text && keyText != null && hashText(keyText+text) == sessionStorage.getItem(keyText)){
            setInputText(true);
        }else{
            setInputText(false);
        }
        setTimeout(function(){
            if(blacklist.length < 5){
                setInputText(null);
                $('button[type=submit]').prop("disabled", false);
                $('.input-group').hide();
                $('.sign').show();
                $('.counter').show();
                counter = COUNTER;
                loadText();
                $('#text-check').focus();
            }else{
                location.reload();
            }
        }, 2000);
    });

    function setInputText(result) {
        switch (result) {
            case true:
                $('#text-check').css('backgroundColor', 'lightgreen');
                $('button[type=submit]').addClass('btn-success');
                break;
            case false:
                $('#text-check').css('backgroundColor', 'lightcoral');
                $('button[type=submit]').addClass('btn-danger');
                break;
            default:
                $('#text-check').val('');
                $('#text-check').removeAttr("style");
                $('button[type=submit]').removeClass('btn-danger');
                $('button[type=submit]').removeClass('btn-success');
                break;
        }
    }

    $('.btnResetQuestion').on('click', function() {
        location.reload();
    });
});