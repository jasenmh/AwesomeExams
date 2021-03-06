//quiz.js -- handles the generation of the Quiz from a QuizDescriptor and a Seed,
//and the rendering of it as HTML
var Quiz = function Quiz(seed,quizDescriptor) // TODO: does this need to be a named function before stored in a var?
{
    // Quiz can receive an existing RandomStream to use instead of instancing a new one
    if(typeof(seed) === "number")   // instance RandomStream using given seed
    {
        this.seed = seed;
        this.randomStream = new RandomStream(seed);

    }
    else                            // given seed is really an existing RandomStream, use it
    {
        this.seed = seed.currentSeed;
        this.randomStream = seed;
    }

    this.jsonObject = quizDescriptor;
    this.questions = interpretQuizJSON(this.jsonObject, this.randomStream);
    this.quizname = this.jsonObject.quizTitle;

    //Create a string that is a list of all the questions
    this.formatQuestionsHTML = function() {
        var text = "";
        for(var i=0; i<this.questions.length; i++)
            // text += "<h3>Question " + (i+1) + ":</h3>" + this.questions[i].formatQuestion("HTML") + "<br>"; TODO: modified to use Awesome questions in exams
            text += this.questions[i].formatQuestion("HTML") + "<br>";
        return text;
    };

    //Create a string that is a list of all the questions
    this.formatQuestionsExam = function() {
	console.log("this.questions=" + JSON.stringify(this.questions));
	if (this.questions.length == 1) {
            return this.questions[0].formatQuestion("HTML");
	}
	// else 
        var text = "<ol>";
        for(var i=0; i<this.questions.length; i++)
            text += "<li>" + this.questions[i].formatQuestion("HTML") + "</li>";
        return text + "</ol>";
    }


    //Create a string that is a list of all the answers
    this.formatAnswersHTML = function() { var text = ""; for(var i=0;
    i<this.questions.length; i++) text += "<strong>" + (i+1) +
    ". </strong>" + this.questions[i].formatAnswer("HTML") + "<br>";
    return text; }

    //Create a string that is a list of all the questions
    this.formatAnswersExam = function() {

	if (this.questions.length == 1) {
            return this.questions[0].formatAnswer("HTML");
	}
	// else 
        var text = "<ol>";
        for(var i=0; i<this.questions.length; i++)
            text += "<div class='pa-question-answer'><strong>Answer " + this.questions[i].formatAnswer("HTML") + "</strong></div>";
        return text;
    };

    this.key = this.formatAnswersHTML();
};

function buildQuiz() {

    var url = purl(); //Parse the current URL using the purl library

    var jsonString = url.param("jsonString");
    var showQuestions = url.param("showQuestions");
    var showKey = url.param("showKey");
    var showJson = url.param("showJson");

    var seed = determineSeed(url.param("seed"));

    var quizDescriptor = JSON.parse(jsonString);

    var quiz = new Quiz(seed,quizDescriptor);

    $("#linkBack").html("<a href='" + url.attr("protocol") + "://" + url.attr("host") + url.attr("directory") + "startAdvanced.html'>generate new quiz</a>");
    $("#quizname").html(quiz.quizname);

    //Depending on URL parameters, either show the questions, answer key, and JSON, or provide links to them.
    var linkQuestions = ("<p><a href='" + linkToQuiz(url,"&showQuestions=yes",seed) + "'>Show Questions</a></p>");
    var linkKey = ("<p><a href='" + linkToQuiz(url,"&showKey=yes",seed) + "'>Show Answer Key</a></p>");
    var linkJSON = ("<p><a href='" + linkToQuiz(url,"&showJson=yes",seed) + "'>Show JSON</a></p>");

    if (showQuestions=="yes") { 
        $("#questions").html("<h2>Questions</h2>\n" + quiz.formatQuestionsHTML()); 
    } else {
        $("#questions").html(linkQuestions);
    }

    if (showKey=="yes") { 
        $("#key").html("<h2>Key</h2>\n" +  quiz.formatAnswersHTML());
    } else {
        $("#key").html(linkKey);
    }

    if (showJson=="yes") { 
        $("#json").html("<h2>Json</h2>\n" +  "<textarea id='jsontextarea' rows='10' cols='30'>" + jsonString + "</textarea>");
    } else {
        $("#json").html(linkJSON);
    }
}
