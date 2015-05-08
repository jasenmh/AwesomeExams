CppRandomNames =
[
    ["foo","bar","baz","fiddle","faddle","bim","bam","quux","snork","snap"],
    ["squish","squash","smoot","spiffle","splin","squal","spork","smop","smick","smock"],
    ["blarp","squeeble","blurgle","podiddle","tulopulop","porskidor","swamwam"],
    ["MOOP","MooP","mOOp","mooP","Moop","moop","minx","mox","mole","moof","moog"]
];
CppRandomTypes = [ "int", "double", "bool", "void" ];
CppBoolComparisons = [ "==", "!=", ">", "<", ">=", "<=" ];
CppRandomReturnTypes = ["int", "float", "double", "string"];

function cppGetRandomId(randomStream, num)
{
    return CppRandomNames[num][randomStream.nextIntRange(CppRandomNames[num].length)];
}

function cppGetRandomReturnType(randomStream)
{
    return CppRandomReturnTypes[randomStream.nextIntRange(4)];
}

function cppGenerateRandomValue(randomStream, num)  // 0: integer, 1: double, 2: boolean
{
    switch(num)
    {
        case 0:
            return randomStream.nextIntRange(100);
        case 1:
            return randomStream.nextIntRange(99) + "." + randomStream.nextIntRange(99);
        default:
            return ["true", "false"][randomStream.nextIntRange(2)];
    }
}

function cppGetUniqueRandomId(randomStream, num, uniques)
{
    var uName;

    do {
        uName = cppGetRandomId(randomStream, num);
    } while(uniques.indexOf(uName) !== -1);

    uniques.push(uName);
    return uName;
}

function cppAddUniqueToList(unique, uList)
{
    if(uList.indexOf(unique) === -1)
    {
        uList.push(unique);
    }
}

function cppEnsureElementNotInList(element, aList)
{
    var eIdx = aList.indexOf(element);

    if(eIdx !== -1)
    {
        aList.splice(eIdx, 1);
    }
}