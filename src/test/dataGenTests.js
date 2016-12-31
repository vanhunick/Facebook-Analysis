var assert = chai.assert;


// Testing the Datagen get message array returns one with the right length
describe('Checking message array size', function() {
  it('Should have size 10', function() {

    let dataGen = new DataGen(someWords,names);

    assert.equal(dataGen.getMessageArray(10).length, 10);
  });
});

// Testing the format of the messageData
describe('Checking message format', function() {
  it('attributes should all be defined', function() {

    let dataGen = new DataGen(someWords,names);
    let messageData = dataGen.getMessageArray(1)[0];

    assert(messageData.sender !== undefined, "Sender should not be undefined");
    assert(messageData.peopleInThread !== undefined, "PeopleInThread should not be undefined");
    assert(messageData.timeData !== undefined, "TimeData should not be undefined");
    assert(messageData.words !== undefined, "Words should not be undefined");
  });
});

// Testing the timeData generator
describe('Checking time data validity', function() {
  it('attributes of time data valid', function() {

    let dataGen = new DataGen(someWords,names);
    let messageData = dataGen.getMessageArray(1)[0];
    let timeDataTest = messageData.timeData;

    assert(days.indexOf(timeDataTest.day) != -1, "day should be in the day array");
    assert(months.indexOf(timeDataTest.month) != -1, "the month should be in the month array");
    assert(timeDataTest.monthDay > 0 && timeDataTest.monthDay <= 31, "the day of the month should be between 1 and 31");
    assert(timeDataTest.year > 0, "Year should not be negative");
    assert(timeDataTest.am === true || timeDataTest.am === false, "Should be am or pm");
  });
});
