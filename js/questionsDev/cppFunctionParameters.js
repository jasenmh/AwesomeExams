function cppFunctionParametersA(randomStream)
{
    var parameterPassTypes =
        [
            ["pass by value", "", 0],
            ["pass by reference", "&", -1],
            ["passing a pointer", "*", -1],
            ["passing an array", "[]", 1]
        ];

    var retType = cppGetRandomReturnType(randomStream);
    var funcName = cppGetRandomId(randomStream, randomStream.nextIntRange(3));
    var paramType = cppGetRandomReturnType(randomStream);
    var paramName = cppGetRandomId(randomStream, 3);

    this.answerChoices = [
        { value: parameterPassTypes[0][0], specialChar: parameterPassTypes[0][1],
            specialPos: parameterPassTypes[0][2], flag: false},
        { value: parameterPassTypes[1][0], specialChar: parameterPassTypes[1][1],
            specialPos: parameterPassTypes[1][2], flag: false},
        { value: parameterPassTypes[2][0], specialChar: parameterPassTypes[2][1],
            specialPos: parameterPassTypes[2][2], flag: false},
        { value: parameterPassTypes[3][0], specialChar: parameterPassTypes[3][1],
            specialPos: parameterPassTypes[3][2], flag: false}
    ];

    randomStream.shuffle(this.answerChoices);

    this.correctIndex = randomStream.nextIntRange(4);
    this.answerChoices[this.correctIndex][3] = true;

    this.formatQuestion = function(format) {
        switch (format) {
            case "HTML": return this.formatQuestionHTML();
        }
        return "unknown format";
    };

    this.formatQuestionHTML = function () {
        var questionText = "<p>The following prototype is an example of which type of parameter passing?</p>" +
            "<pre>" + retType + " " + funcName + "(" + paramType + " ";
        if(this.answerChoices[this.correctIndex].specialPos == -1)
            questionText += this.answerChoices[this.correctIndex].specialChar;
        questionText += paramName;
        if(this.answerChoices[this.correctIndex].specialPos == 1)
            questionText += this.answerChoices[this.correctIndex].specialChar;
        questionText += ");</pre>";

        questionText += "<p><strong>a) </strong>"
            + this.answerChoices[0].value + "<br><strong>b) </strong>"
            + this.answerChoices[1].value + "<br><strong>c) </strong>"
            + this.answerChoices[2].value + "<br><strong>d) </strong>"
            + this.answerChoices[3].value + "</p>";

        return questionText;
    };

    this.formatAnswer = function(format) {
        switch (format) {
            case "HTML": return this.formatAnswerHTML();
        }
        return "unknown format";
    };

    this.formatAnswerHTML = function () {
        return String.fromCharCode(this.correctIndex+97); //0 = 'a', 1 = 'b', 2 = 'c', etc...
    };

}

function cppFunctionParametersB(randomStream) {
    var parameterPassTypes =
        [
            ["pass by value", "", 0],
            ["pass by reference", "&", -1],
            ["passing a pointer", "*", -1],
            ["passing an array", "[]", 1]
        ];

    // initialize sections of code to write
    var mainFun = "";
    var calledFun = "";

    // make some decisions about how the program will be arranged
    var correctAnswer;
    var redHerrings;
    var uniqueNames = [];    // maintain a list to avoid name collisions
    var calledFunName = cppGetUniqueRandomId(randomStream, randomStream.nextIntRange(3), uniqueNames);
    var mainConstVarName = cppGetUniqueRandomId(randomStream, 3, uniqueNames);
    var mainRetVarName = cppGetUniqueRandomId(randomStream, 3, uniqueNames);
    var calledArgName = cppGetUniqueRandomId(randomStream, 3, uniqueNames);
    var calledVarName = cppGetUniqueRandomId(randomStream, 3, uniqueNames);
    var mainConstVarVal = 2 + randomStream.nextIntRange(17);    // 2-19
    var mainRetVarVal;  // TODO: do i need this var?
    var calledArgVal;
    var calledVarVal;
    var calledMultiplicand = 2 + randomStream.nextIntRange(7); // 2-9
    var calledSummand = 2 + randomStream.nextIntRange(17); // 2-19
    var calledReturnsArgNotVar = false;
    var calledReturnsZeroNotVar = false;
    switch (randomStream.pick([0, 1, 2])) {
        case 0:
            calledReturnsArgNotVar = true;
            break;
        case 1:
            calledReturnsZeroNotVar = true;
    }
    var passArgByType = randomStream.pick([0, 1, 2]);

    //////////////////////////////////////////////////////
    // figure out correct answer and legit red herrings //
    //////////////////////////////////////////////////////
    calledArgVal = mainConstVarVal;
    calledVarVal = calledArgVal * calledMultiplicand + calledSummand;
    if (calledReturnsArgNotVar)      /* */
    {
        correctAnswer = calledArgVal;
    }
    else if (calledReturnsZeroNotVar) {
        correctAnswer = 0;
    }
    else {
        correctAnswer = calledVarVal;
    }

    redHerrings = [ 1 ]; //, 'an error', 'a memory address' ]; // standard red herrings
    cppAddUniqueToList(mainConstVarVal, redHerrings);
    cppAddUniqueToList(calledArgVal, redHerrings);
    cppAddUniqueToList((mainConstVarVal + calledSummand) * calledMultiplicand, redHerrings);
    cppAddUniqueToList(mainConstVarVal * (calledMultiplicand + calledSummand), redHerrings);
    cppEnsureElementNotInList(correctAnswer, redHerrings);

    if (redHerrings.length < 3)
    {
        while (redHerrings.length < 3)   // make sure enough were added to create a complete answer list (need 3 RHs)
        {
            cppAddUniqueToList(2 + randomStream.nextIntRange(97));  // 2-99
        }
    }

    if(redHerrings.length > 4)    // the first answers added are more pedagogic and should remain in the list over random answers
    {
        randomStream.shuffle(redHerrings);
        redHerrings.splice(4, redHerrings.length - 4);
    }
    else
    {
        randomStream.shuffle(redHerrings);
    }



    // create called function
    calledFun += "#include &lt;iostream>\n\n";
    switch(passArgByType)
    {
        case 1:
            calledFun += "int " + calledFunName + "(int &" + calledArgName + ")\n{\n";
            break;
        case 2:
            calledFun += "int " + calledFunName + "(int *" + calledArgName + ")\n{\n";
            break;
        default:
            calledFun += "int " + calledFunName + "(int " + calledArgName + ")\n{\n";
    }

    calledFun += "  int " + calledVarName + ";\n\n";
    switch(passArgByType)
    {
        case 2:
            calledFun += "  " + calledVarName + " = (*" + calledArgName + ") * " + calledMultiplicand + " + " +
            calledSummand + ";\n\n";
            break;
        default:
            calledFun += "  " + calledVarName + " = " + calledArgName + " * " + calledMultiplicand + " + " +
                calledSummand + ";\n\n";
    }
    if(calledReturnsArgNotVar)      /* */
    {
        if(passArgByType === 2)
        {
            calledFun += "  return (*" + calledArgName + ");\n}\n\n";
        }
        else
        {
            calledFun += "  return " + calledArgName + ");\n}\n\n";
        }
    }
    else if(calledReturnsZeroNotVar)
    {
        calledFun += "  return 0;\n}\n\n";
    }
    else
    {
        calledFun += "  return " + calledVarName + ";\n}\n\n";
    }



    // create main function
    mainFun += "int main()\n{\n";
    mainFun += "  int " + mainConstVarName + ", " + mainRetVarName + ";\n";
    mainFun += "  " + mainConstVarName + " = " + mainConstVarVal + ";\n\n";
    switch(passArgByType)
    {
        case 2:
            mainFun += "  " + mainRetVarName + " = " + calledFunName + "(&" + mainConstVarName + ");\n\n";
            break;
        default:
            mainFun += "  " + mainRetVarName + " = " + calledFunName + "(" + mainConstVarName + ");\n\n";
    }
    mainFun += "  std::cout << " + mainRetVarName + " << std::endl;\n\n";
    mainFun += "  return 0;\n}\n\n";



    // setup object
    this.answerChoices = [
        {value: correctAnswer, flag: true},
        {value: redHerrings[0], flag: false},
        {value: redHerrings[1], flag: false},
        {value: redHerrings[2], flag: false},
    ];
    randomStream.shuffle(this.answerChoices);

    // TODO: refactor this into its own function, I tend to do it alot
    this.correctIndex = -1;
    for(var i = 0; i < this.answerChoices.length; ++i)
    {
        if(this.answerChoices[i].flag === true)
        {
            this.correctIndex = i;
            break;
        }
    }

    this.formatQuestion = function(format) {
        switch (format) {
            case "HTML": return this.formatQuestionHTML();
        }
        return "unknown format";
    };

    this.formatQuestionHTML = function () {
        var questionText = "<p>What is the output of this program?</p>" +
            "<pre>" + calledFun + mainFun + "</pre>";

        questionText += "<p><strong>a) </strong>"
        + this.answerChoices[0].value + "<br><strong>b) </strong>"
        + this.answerChoices[1].value + "<br><strong>c) </strong>"
        + this.answerChoices[2].value + "<br><strong>d) </strong>"
        + this.answerChoices[3].value + "</p>";

        return questionText;
    };

    this.formatAnswer = function(format) {
        switch (format) {
            case "HTML": return this.formatAnswerHTML();
        }
        return "unknown format";
    };

    this.formatAnswerHTML = function () {
        return String.fromCharCode(this.correctIndex+97); //0 = 'a', 1 = 'b', 2 = 'c', etc...
    };
}

function cppFunctionParametersQuestion(randomStream, params)
{

    if(randomStream.nextIntRange(3) === 0)
        return new cppFunctionParametersA(randomStream, params);
    else
        return new cppFunctionParametersB(randomStream);
}
