$.get('json/easy.json', null, null, 'json')
.then(function(response){
    // var iAmNumberFour = response.filter(function(q){
    //     return q.id === question;
    // })[0];
    response = response.sort(() => Math.random() - 0.5);
    var counter = 5;
    console.log(response[0].text)
    // $('.flicker').text(response[0].text);

    function loadText(q) {
        text = response[q];
        $('.flicker').text(response[0].text);

        countTime = setInterval(function() {
            counter--;
            $('.counter').html('<h4>00:0'+counter+'</h4>');
            // Display 'counter' wherever you want to display it.
            if (counter == 0) {
                clearInterval(countTime);
                $('.flicker').hide();
                $('.counter').hide();
                $('.input-group').show();
                return false;
            }
        }, 1000);
    }

    $('.btn-start').click(function(){
        $('.modal-intro').remove();
        $('.modal-easy').css('display', 'block');
        loadText(0);
    });

    $('.btnResetQuestion').on('click', function() {
        location.reload();
    });
});