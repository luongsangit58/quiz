$.get('json/medium.json', null, null, 'json')
.then(function(response){
    // var iAmNumberFour = response.filter(function(q){
    //     return q.id === question;
    // })[0];

    var userAnswers = {},
        totalCorrect = 0,
        questionId = 0,
        counter = 10,
        countTime;

    response = response.sort(() => Math.random() - 0.5);

    function hashAnswer(answer) {
        return CryptoJS.MD5(answer).toString();
    }

    function loadQuestion(q) {
        question = response[q];

        var htmlAnswer = '';
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
                    <div class="col-xs-3 5"></div>
                    <div class="quiz question-answers" id="quiz" data-toggle="buttons">
                        ${htmlAnswer}
                    </div>
                </div>
                <div class="div-btn-quiz-medium text-center">
                    <button type="submit" class="btn-submit btn btn-lg btn-primary">Submit</button>
                </div>
            </div>
        `;
        $('.modal-quiz').append(html);

        var answer = '';

        countTime = setInterval(function() {
            counter--;
            $('.counter').html('<h4>00:0'+counter+'</h4>');
            // Display 'counter' wherever you want to display it.
            if (counter == 0) {
                // Display a login box
                $('.counter').html('<h4 class="timeUp">Time up!!!</h4>');
                answer = 'null';
                $('.btn-submit').trigger("click");
                return false;
            }
        }, 1000);

        $('.question-answers label').on('click', function() {
            answer = $(this).attr('data-value');
        });

        $('.btn-submit').on('click', function() {
            if(answer !== '') {  
                clearInterval(countTime);
                questionId++;
                userAnswers[String(question.id)] = answer;
                if(question.correct === hashAnswer(question.id+answer)) {
                    totalCorrect++;
                    $('.question-'+question.id).find("label[data-value='"+answer+"']").addClass('btn-success');
                }else{
                    $('.question-'+question.id).find("label[data-value='"+answer+"']").addClass('btn-danger');
                }
                $('label').attr("disabled",true);
                $('.btn-submit').remove();                
                $('.div-btn-quiz-medium').html('<button type="submit" class="btn-next btn btn-lg btn-primary">Next</button>');

                $('.btn-next').on('click', function() {
                    counter = 10;
                    if(questionId < Object.keys(response).length){
                        $('.question-'+question.id).remove();
                        loadQuestion(questionId);
                    }else{
                        $('.question-'+question.id).remove();
                        loadAllQuestions();
                    }
                    console.log(userAnswers)
                });
            }else{
                alert('Chosse an answer!!!')
            }
        });
    }

    function loadAllQuestions() {
        if(userAnswers){
            $('.counter').remove();
            $('.total').append(`Correct: ${totalCorrect}/${Object.keys(response).length}`);
            $('.total').css('display', 'block');
            $.each(response, function(key, question) {
                loadQuestion(key);
                $('.div-btn-quiz-medium').remove();
                $('label').attr("disabled",true);
    
                var tmp = '';
    
                $("label").each(function(k, val) {                
                    if(question.correct === hashAnswer(question.id+$(val).attr('data-value'))) {
                        tmp = $(val).attr('data-value');
                    }
                });
                if (userAnswers[question.id] !== tmp){
                    $('.question-'+question.id).find("label[data-value='"+userAnswers[question.id]+"']").addClass('btn-danger');
                }
                $('.question-'+question.id).find("label[data-value='"+tmp+"']").addClass('btn-success');
            });
        }
    }

    $('.btn-start').on('click', function() {
        $('.modal-intro').remove();
        $('.modal-quiz').css('display', 'block');
        loadQuestion(questionId);
    });

    $('.btnResetQuestion').on('click', function() {
        location.reload();
    });
});