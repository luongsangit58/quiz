function loading(){
    $('.loading').show();
    setInterval(function(){
        $('.loading').hide(100);
    }, 1200);
}
loading();
$.get('json/medium.json', null, null, 'json')
.then(function(response){
    const COUNTER_TIME = 10,
        TOTAL_QUESTIONS = 5;
    var userAnswers = {},
    totalCorrect = 0,
    questionId = 0,
    counter = COUNTER_TIME,
    countTime;

    response = response.sort(() => Math.random() - 0.5).slice(-TOTAL_QUESTIONS);
    function hashAnswer(answer) {
        return CryptoJS.MD5(answer).toString();
    }

    function loadQuestion(q) {
        var answer = null;
            htmlAnswer = '';

        question = response[q];

        $.each( question.answers, function( key, value ) {
            htmlAnswer += `
            <label class="element-animation btn btn-lg btn-default btn-block" data-value="${value}">
                <span class="btn-label">${key.toUpperCase()}</span>
                <input type="radio" name="q_answer" value="${key}"> ${value}
            </label> 
            `;
        });

        html = `
            <div class="question-${question.id}">
                <div class="modal-header">
                    <h3 class="question-lable">${q+1}. ${question.question}</h3>
                </div>
                <div class="modal-body">
                    <div class="col-xs-3"></div>
                    <div class="quiz question-answers" id="quiz" data-toggle="buttons">
                        ${htmlAnswer}
                    </div>
                </div>
            </div>
        `;

        $('.modal-quiz').append(html);

        countTime = setInterval(function() {
            counter--;
            countTimeUp(counter)
            if (counter == 0) {
                clickSubmit(answer, question);
                return false;
            }
        }, 1000);

        $('.question-answers label').on('click', function() {
            answer = $(this).attr('data-value');
            countTimeUp(COUNTER_TIME);
            clickSubmit(answer, question);
        });
    }

    function countTimeUp(time){
        if(time == 0) {
            $('.times').html('Time up!!!');
            $('.counter').addClass('time-up');
        }else{
            time = (time < COUNTER_TIME) ? '0'+time : time;
            $('.times').html('00:'+time);
            $('.counter').removeClass('time-up');
        }
    }

    function clickSubmit(answer, question) { 
        clearInterval(countTime);
        questionId++;
        userAnswers[String(question.id)] = answer;
        $('label').attr("disabled",true);
        if(question.correct === hashAnswer(question.id+answer)) {
            totalCorrect++;
            $('.question-'+question.id).find("label[data-value='"+answer+"']").addClass('btn-success');
        }else{
            $('.question-'+question.id).find("label[data-value='"+answer+"']").addClass('btn-danger');
        }

        $('.question-'+question.id).append(`
        <div class="div-btn-quiz-medium text-center question-${question.id}">
            <button type="submit" class="btn-next btn btn-lg btn-primary">Next</button>
        </div>`);

        $('.btn-next').on('click', function() {
            nextQuestion(question);
        });
    }

    function nextQuestion(question) {
        countTimeUp(COUNTER_TIME);
        if(questionId < Object.keys(response).length){
            $('.question-'+question.id).remove();
            loadQuestion(questionId);
        }else{
            $('.question-'+question.id).remove();
            loading();
            loadAllQuestions();
        }
    }

    function loadAllQuestions() {
        if(userAnswers){
            $('.counter').remove();
            $('.total').append(`Correct: ${totalCorrect}/${Object.keys(response).length}`);
            $('.total').css('display', 'block');
            $.each(response, function(key, question) {
                loadQuestion(key);
                setInterval(function(){ $('.div-btn-quiz-medium').remove(); }, 2000);
                $('label').attr("disabled",true);
                var tmp = '';
    
                $("label").each(function(k, val) {                
                    if(question.correct === hashAnswer(question.id+$(val).attr('data-value'))) {
                        tmp = $(val).attr('data-value');
                    }
                });
                console.log(userAnswers[question.id])
                if (userAnswers[question.id] !== tmp){
                    $('.question-'+question.id).find("label[data-value='"+userAnswers[question.id]+"']").addClass('btn-danger');
                    if (userAnswers[question.id] == null){
                        $('.question-'+question.id).css('backgroundColor', 'lightgray');
                    }
                }
                $('.question-'+question.id).find("label[data-value='"+tmp+"']").addClass('btn-success');
            });
        }
    }

    $('.btn-start').click(function(){
        loading();
        $('.modal-intro').remove();
        $('.modal-quiz').css('display', 'block');
        loadQuestion(questionId);
    });

    $('.btnResetQuestion').on('click', function() {
        location.reload();
    });
});
