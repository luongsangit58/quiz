// function loading: hiển thị preload
function loading(){
    $('.loading').show();
    setInterval(function(){
        $('.loading').hide(100);
    }, 1200);
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
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

// Check level
var level = sessionStorage.getItem('level');
if(!level) {
    window.location.href = 'index.html';
}
$('.span-title').text(`-- Level ${level} | MEDIUM --`);    

// Đọc dữ liệu từ file json
$.get('json/medium.json', null, null, 'json').then(function(response){
    const COUNTER_TIME = 10,
        TOTAL_QUESTIONS = 5;
    var userAnswers = {},
    totalCorrect = 0,
    questionId = 0,
    counter = COUNTER_TIME,
    flagLoadCorrect = false,
    htmlEnd = '',
    countTime;
    response = response[level].sort(() => Math.random() - 0.5).slice(-TOTAL_QUESTIONS);
    
    //function hashAnswer: mã hóa chuỗi MD5
    function hashAnswer(answer) {
        return CryptoJS.MD5(answer).toString();
    }

    //function loadQuestion: hiển thị câu hỏi trắc nghiệm với tham số là id truyền vào
    function loadQuestion(q) {
        var answer = null;
            htmlAnswer = '';

        question = response[q];
        var tmp = shuffleArray(question.answers);
        console.log(tmp)
        // key start at 0, 65 is "A"
        $.each(tmp , function( key, value ) {
            htmlAnswer += `
            <label class="element-animation btn btn-lg btn-default btn-block" data-value="${value}">
                <span class="btn-label">${String.fromCharCode(key+65)}</span> 
                <input type="radio" name="q_answer" value="${String.fromCharCode(key+65)}"> ${value}
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
        htmlEnd += html;
        $('.modal-quiz').append(html);

        //Check flag load correct
        if(!flagLoadCorrect){
            countTime = setInterval(function() {
                counter--;
                countTimeUp(counter)
                if (counter == 0) {
                    clickSubmit(answer, question);
                    return false;
                }
            }, 1000);
        }

        $('.question-answers label').on('click', function() {
            answer = $(this).attr('data-value');
            countTimeUp(COUNTER_TIME);
            clickSubmit(answer, question);
        });
    }
    
    //function countTimeUp: hiển thị đồng hồ đếm thời gian 
    function countTimeUp(time){
        if(time == 0) {
            $('.times').html('Time up!!!');
            $('.counter h4').addClass('text-danger');
        }else{
            time = (time < COUNTER_TIME) ? '0'+time : time;
            $('.times').html('00:'+time);
            $('.counter h4').removeClass('text-danger');
        }
    }

    // Click button submmit
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
        setTimeout(function(){ nextQuestion(question); }, 1500);
    }

    // function nextQuestion: chuyển tiếp đến câu hỏi tiếp theo
    function nextQuestion(question) {
        counter = COUNTER_TIME;
        countTimeUp(COUNTER_TIME);
        // Kiểm tra xem đã là câu hỏi cuối chưa
        if(questionId < TOTAL_QUESTIONS){
            $('.question-'+question.id).remove();
            loadQuestion(questionId);
        }else{
            $('.question-'+question.id).remove();
            loading();
            flagLoadCorrect = true;
            loadAllQuestions();
        }
    }

    // function loadAllQuestions: hiển thị kết quả 
    function loadAllQuestions() {
        if(userAnswers){
            $('.counter').remove();
            $('.total').append(`Correct: ${totalCorrect}/${TOTAL_QUESTIONS}`);
            $('.total').append(`<p class="text-correct text-center">${getTextCorrect(totalCorrect)}</p>`);
            $('.total').show();
            $('.modal-quiz').append(htmlEnd);
            $.each(response, function(key, question) {
                var tmp = '';
                // loadQuestion(key);
                setInterval(function(){ $('.div-btn-quiz-medium').remove(); }, 2000);
                $('label').attr("disabled", true);
    
                $("label").each(function(k, val) {                
                    if(question.correct === hashAnswer(question.id+$(val).attr('data-value'))) {
                        tmp = $(val).attr('data-value');
                    }
                });

                if (userAnswers[question.id] !== tmp){
                    $('.question-'+question.id).find("label[data-value='"+userAnswers[question.id]+"']").addClass('btn-danger');
                    // Cau hoi khong tra loi
                    if (userAnswers[question.id] == null){
                        $('.question-'+question.id).css('backgroundColor', 'lightgray');
                    }
                }

                $('.question-'+question.id).find("label[data-value='"+tmp+"']").addClass('btn-success');
            });
        }
    }

    // Click bắt đầu
    $('.btn-start').on('click', function() {
        loading();
        $('.modal-intro').remove();
        $('.modal-quiz').show();
        loadQuestion(questionId);
    });

    // Click reset
    $('.btnResetQuestion').on('click', function() {
        location.reload();
    });
});
