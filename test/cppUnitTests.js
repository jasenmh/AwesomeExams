QUnit.module( "Project Awesome C++ question unit tests", {
  setup: function( assert ) {
    this.rs = new RandomStream(determineSeed("0x0"));

    assert.ok(this.rs != undefined, "instance RandomStream in module setup");
    assert.equal(this.rs.nextIntRange(2), 1, "expected results from RandomStream in module setup");
  }, teardown: function( assert ) {
    //assert.ok( true, "teardown successful" );
  }
});

QUnit.test("cppUtilities", function(assert) {

    for(var i = 0; i < CppRandomNames.length; ++i)
    {
        var b = cppGetRandomId(this.rs, i);
        assert.ok(CppRandomNames[i].indexOf(b) != -1, "cppGetRandomId() list " + i + " returns expected value");
    }

    var a = cppGetRandomReturnType(this.rs);
    assert.ok(CppRandomReturnTypes.indexOf(a) != -1, "cppGetRandomReturnType() returns expected return type");

    var c = cppGenerateRandomValue(this.rs, 0);
    assert.ok((c >= 0) && (c < 100), "cppGenerateRandomValue() Integer returns expected value");
    c = cppGenerateRandomValue(this.rs, 1);
    assert.ok(c == parseFloat(c).toString(), "cppGenerateRandomValue() Double returns expected value");
    c = cppGenerateRandomValue(this.rs, 2);
    assert.ok(["true", "false"].indexOf(c) != -1, "cppGenerateRandomValue() Boolean returns expected value");
});

QUnit.test("cppAppropriateVariables", function(assert) {
    var  intAnswerRegex = /(^\d+$|^\d+\s{1}[\+\-\*\/]\s{1}\d+$)/;
    var  dblAnswerRegex = /(^\d+\.\d+$|^\d+\.\d+\s{1}[\+\-\*\/]\s{1}\d+\.\d+$)/;
    var boolAnswerRegex = /(^(true|false)$|^(\d+|\d+\.\d+)\s(==|!=|>=|<=|>|<)\s(\d+|\d+\.\d+)$)/;

    var intAns = cppGenerateIntAnswer(this.rs);
    assert.ok(intAnswerRegex.test(intAns), "cppGenerateIntAnswer() returns expected value");
    var dblAns = cppGenerateDoubleAnswer(this.rs);
    assert.ok(dblAnswerRegex.test(dblAns), "cppGenerateDoubleAnswer() returns expected value");
    var boolAns = cppGenerateBoolAnswer(this.rs);
    assert.ok(boolAnswerRegex.test(boolAns), "cppGenerateBoolAnswer() returns expected value");
});

// cppArgcArgv has no methods eligible for unit test
// cppBooleanEval has no methods eligible for unit testing
// cppFunctionOverloading has no methods eligible for unit testing
// cppFunctionParameters has no methods eligible for unit testing
// cppPointerAssignment has no methods eligible for unit testing