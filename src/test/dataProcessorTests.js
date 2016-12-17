var assert = chai.assert;


// Testing the DataProcessor get people function returns nothing with empty array
describe('No Messages', function() {
  it('Should return nothing ', function() {

    
    let ma = [];
    let dp = new DataProcessor(ma,"Nicky van Hulst");
    let res = dp.listPeople();

    assert.equal(res.length, 0);
  });
});