var assert = chai.assert;

// Some data to

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

    let DPRandom = new DataProcessor(new DataGen(someWords,names).getMessageArray(100),'nicky van hulst');
    let words = DPRandom.getUniqueWords();


    assert(words.length != 0, "Should not be empty");
    console.log(words);
  });
});
