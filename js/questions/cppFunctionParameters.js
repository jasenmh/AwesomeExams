// TODO: from file:///home/jasen/code/AwesomeNextSteps/html/quiz.html?seed=&questionType=cppFunctionParameters&showQuestions=yes&showKey=yes&showJSON=no&jsonString=%7B%22version%22%3A0.1%2C%22title%22%3A%22%22%2C%22quiz%22%3A%5B%7B%22question%22%3A%22cppFunctionParameters%22%2C%22repeat%22%3A%225%22%7D%5D%7D
// question 2: passing pointer problem has correct answer in answer list twice
// question 4: pass-by-reference correct answer is incorrect, unchanged from initial value
// question 5: pass array problem does not specify which array element gets printed, correct answer appears twice

function cppFunctionParametersA(randomStream)
{
    var parameterPassTypes =
        [
            ["pass by value", "", 0],
            ["pass by reference", "&", -1],
            ["passing a pointer", "*", -1],
            ["passing an array", "[]", 1]
        ];

    var retType = getRandomReturnType(randomStream);
    var funcName = cppGetRandomId(randomStream, randomStream.nextIntRange(3));
    var paramType = getRandomReturnType(randomStream);
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

function cppFunctionParametersB(randomStream)
{
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

    // make all the decisions about how the program will be arranged
    var passTypeIndex = randomStream.nextIntRange(4);
    var doesCalledFunHave2ndParameter; // if passTypeIndex == 3, this must be true
    if(passTypeIndex === 3)
        doesCalledFunHave2ndParameter = true;
    else
        doesCalledFunHave2ndParameter = cppGenerateRandomValue(randomStream, 2);
    var doesCalledFunReturn = cppGenerateRandomValue(randomStream, 2);
    var doesMainStoreReturn; // if doesCalledFunReturn == false, this must be false too
    if(!doesCalledFunReturn)
        doesMainStoreReturn = false;
    else
        doesMainStoreReturn = cppGenerateRandomValue(randomStream, 2);
    var calledFunMultiplier = randomStream.nextIntRange(10) + 1;
    var calledFunAdder = randomStream.nextIntRange(10) + 1;
    var calledFunEvaluatedValue;
    var calledFunEvaluatedArrayIndex;

    // set some initial values
    var mainVarName1; var mainVarName2;
    var mainVarVal1; var mainVarVal2;
    var calledFunArgName1; var calledFunArgName2;
    var mainReturnStorageName;
    mainVarName1 = cppGetRandomId(randomStream, 0);
    mainVarName2 = cppGetRandomId(randomStream, 1);
    if(passTypeIndex === 3)
    {
        mainVarVal1 = [ (randomStream.nextIntRange(10) + 2),
            (randomStream.nextIntRange(10) + 2), (randomStream.nextIntRange(10) + 2) ];
        mainVarVal2 = 3;
    }
    else
    {
        mainVarVal1 = randomStream.nextIntRange(10) + 2;
        mainVarVal2 = randomStream.nextIntRange(10) + 2;
    }
    calledFunArgName1 = cppGetRandomId(randomStream, 2);
    calledFunArgName2 = cppGetRandomId(randomStream, 3);

    mainReturnStorageName = calledFunArgName2;
    do
    {
        mainReturnStorageName = cppGetRandomId(randomStream, 3);
    } while(mainReturnStorageName === calledFunArgName2)

    if(passTypeIndex === 3)
    {
        calledFunEvaluatedValue = mainVarVal1;
        calledFunEvaluatedValue.map(function(element) {
           return element * calledFunMultiplier + calledFunAdder;
        });
        calledFunEvaluatedArrayIndex = randomStream.nextIntRange(3);
    }
    else
    {
        calledFunEvaluatedValue = mainVarVal1 * calledFunMultiplier + calledFunAdder;
    }

    // write main() function
    mainFun += "int main()\n{\n";
    if(passTypeIndex === 3)
    {
        mainFun += "  int " + mainVarName1 + "[] = [ " + mainVarVal1.join(", ") + " ];\n";
    }
    else
    {
        mainFun += "  int " + mainVarName1 + " = " + mainVarVal1 + ";\n";
    }

    if(doesCalledFunHave2ndParameter)
        mainFun += "  int " + mainVarName2 + " = " + mainVarVal2 + ";\n";

    mainFun += "  int " + mainReturnStorageName + ";\n";

    mainFun += "\n";
    if(doesMainStoreReturn)
        mainFun += "  " + mainReturnStorageName + " = ";
    else
        mainFun += "  ";

    mainFun += "fun(" + mainVarName1 +
        (doesCalledFunHave2ndParameter ? ", " + mainVarName2 : "") +
        ");\n\n";
    mainFun += "  std:: cout << " + (doesMainStoreReturn ? mainReturnStorageName : mainVarName1) +
        " << std::endl;\n\nreturn 0;\n}\n";

    // write called function
    calledFun += "#include &lt;iostream>\n\n";
    calledFun += (doesCalledFunReturn ? "int " : "void ") + "fun(" +
        (passTypeIndex === 1 ? "&" : (passTypeIndex === 2 ? "*" : "")) +
        calledFunArgName1 + (passTypeIndex === 3 ? "[]" : "") +
        (doesCalledFunHave2ndParameter ? ", " + calledFunArgName2 : "") + ")\n";

    var usingArg1;
    if(passTypeIndex === 2)
        usingArg1 = "(*" + calledFunArgName1 + ")";
    else
        usingArg1 = calledFunArgName1;

    if(passTypeIndex === 3)
    {
        calledFun += "  for(int i = 0; i < " + calledFunArgName2 +" ++i)\n" +
            "    " + calledFunArgName1 + "[i] = " + calledFunArgName1 + "[i] * " + calledFunMultiplier +
            " + " + calledFunAdder + ";\n";
    }
    else
    {
        calledFun += "  " + usingArg1 + " = " + usingArg1 + " * " + calledFunMultiplier +
        " + " + calledFunAdder + ";\n";
    }

    // TODO: if passTypeIndex is 1 or 2 and called returns, have chance where it returns 1 or 0
    if(doesCalledFunReturn)
    {
        calledFun += "  return ";
        if(passTypeIndex === 3)
            calledFun += calledFunArgName1 + "[" + calledFunEvaluatedArrayIndex + "];\n";
        else
            calledFun += calledFunArgName1 + ";\n";
    }

    calledFun += "}\n\n";

    /* TODO: determine value of variable printed out
        - if main stores called fun return, we print that
        - if not stored
            - if called by value it'll be the original value
            - if called by pointer/reference it'll be the changed value
            - if an array, print the element in the index calledFunEvaluatedArrayIndex
     */

    var correctAnswer;
    var redHerrings = [];

    // determine correct answer
    if(doesMainStoreReturn)
    {
        correctAnswer = calledFunEvaluatedValue;
    }
    else if(passTypeIndex === 0)
    {
        correctAnswer = mainVarVal1;
    }
    else if(passTypeIndex === 1 || passTypeIndex === 2)
    {
        correctAnswer = calledFunEvaluatedValue;
    }
    else if(passTypeIndex === 3)
    {
        correctAnswer = calledFunEvaluatedValue[calledFunEvaluatedArrayIndex];
    }
    correctAnswer = correctAnswer.toString();

    // generate red herrings
    if(correctAnswer !== 0)
        redHerrings.push("0");
    if(correctAnswer !== mainVarVal1)
        redHerrings.push(mainVarVal1.toString());
    redHerrings.push("an error");
    redHerrings.push("a memory address");
    if(passTypeIndex === 3)
    {
        for(var x in calledFunEvaluatedValue)
        {
            if(x !== correctAnswer)
                redHerrings.push(x.toString());
        }

        for(var x in mainVarVal1)
        {
            if(x !== correctAnswer)
                redHerrings.push(x.toString());
        }
    }
    else
    {
        if(correctAnswer !== calledFunEvaluatedValue)
            redHerrings.push(calledFunEvaluatedValue.toString());
    }
    while(redHerrings.length < 3)
    {
        var newHerring = (randomStream.nextIntRange(97) + 2).toString();
        if(newHerring === correctAnswer)
            continue;
        for(var y in redHerrings)   // random herring isn't already a herring?
        {
            if(y === newHerring)
                continue;
        }
        redHerrings.push(newHerring);
    }

    // TODO: shuffle redHerring and pull the first 3 with slice() to fill answerChoices

    this.answerChoices = [];
    this.correctIndex = -1;
    this.formatQuestion = undefined;
    this.formatQuestionHTML = undefined;
    this.formatAnswer = undefined;
    this.formatAnswerHTML = undefined;
}

function cppFunctionParametersQuestion(randomStream)
{
/*
    if(randomStream.nextIntRange(3) === 0)
        return new cppFunctionParametersA(randomStream);
    else
*/
        return new cppFunctionParametersB(randomStream);
}
