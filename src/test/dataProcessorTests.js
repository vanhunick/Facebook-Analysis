var assert = chai.assert;

// Some data to

// Simple message Array with two messages
msgArray = [
  new messageData(
    // Sender
    "Nicky van Hulst",
    // People in thread
    ["Nicky van Hulst","Alonso Hahn"],
    // Time data Day, Month, Month day, year, time, am (true for am false for pm)
    new timeData("Monday","January",1,2016,"12.00pm","UTC+12",false),
    // Words in message
    ["Hello","my","name","is","nicky"]
  ),
  new messageData(
    // Sender
    "Alonso Hahn",
    // People in thread
    ["Nicky van Hulst","Alonso Hahn"],
    // Time data Day, Month, Month day, year, time, am (true for am false for pm)
    new timeData("Monday","January",1,2016,"12.30pm","UTC+12",false),
    // Words in message
    ["Hi","how","is","it","going","nicky"]
  )
]

// Test get unique words
describe('Unique words', function() {
  it('There should be 9 unique words in the msgArray', function() {

    let ma = msgArray;
    let dp = new DataProcessor(ma,"Nicky van Hulst");
    let uniqueWords = dp.getUniqueWords(true);

    assert.equal(uniqueWords.length, 9);
  });
});


// // Test get unique words punctuation
// describe('No Messages', function() {
//   it('There should be 9 unique words in the msgArray', function() {

//     let ma = msgArray;
//     let dp = new DataProcessor(ma,"Nicky van Hulst");
//     let uniqueWords = dp.getUniqueWords(true);

//     assert.equal(uniqueWords.length, 9);
//   });
// });


// Testing the DataProcessor get people function returns nothing with empty array
describe('No Messages', function() {
  it('Should return nothing ', function() {

    let ma = [];
    let dp = new DataProcessor(ma,"Nicky van Hulst");
    let res = dp.listPeople();

    assert.equal(res.length, 0);
  });
});

// Testing the get unique words function
describe('Should contain at least one word', function() {
  it('Should contain at least one word', function() {
    console.log(new DataGen(someWords,names).getMessageArray(10));
    let DPRandom = new DataProcessor(new DataGen(someWords,names).getMessageArray(100),'nicky van hulst');
    let words = DPRandom.getUniqueWords();

    assert(words.length != 0, "Should not be empty");
  });
});
