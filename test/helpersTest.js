const { assert } = require('chai');

const { getUserWithEmail } = require('../helpers.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};
describe('getUserWithEmail', function() {
  it('should return a user with valid email', function() {
    const user = getUserWithEmail("user@example.com", testUsers).id;
    const expectedUserID = "userRandomID";
    // Write your assert statement here
    assert.isTrue(user === expectedUserID);
  });
  it('should return undefined if the email is not in the database', function() {
    const user = getUserWithEmail("bindle@bandle.com", testUsers)
    const expectedUserID = undefined;
    // Write your assert statement here
    assert.isTrue(user === expectedUserID)
  });
});