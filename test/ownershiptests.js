// Unit testing assignment

// requirement: truffle-assertions
// install: npm install truffle-assertions
// usage: const truffleAssert = require('truffle-assertions');

// Tests:
// Check onlyOwner works correctly
// Check person deletion works correctly

// Ownable ensures require(msg.sender == owner);
// Functions using onlyOwner:
// function deletePerson(address creator) public onlyOwner {
// function getCreator(uint index) public view onlyOwner returns(address){
// function withdrawAll() public onlyOwner returns(uint) {

const People = artifacts.require("People");
const truffleAssert = require('truffle-assertions');

contract("People", async function(accounts) {
    let instance;
    
    // before() runs once before anythign else
    before(async function() {
        instance = await People.Deployed();
    });

    // beforeEach() will initialise a new contract with startup values prior to each test
    beforeEach(async function() {
        instance = People.new();
    });

    it("Non-owner should not be able to delete people", async function() {
        await instance.createPerson("Person 1", 35, 170, {from: accounts[1], value: web3.utils.toWei("1", "ether")});
        await truffleAssert.fails(instance.deletePerson(accounts[1], {from: accounts[1]}), truffleAssert.ErrorType.REVERT);
    });
    it("Owner should be able to delete people", async function() {
        await instance.createPerson("Person 1", 35, 170, {from: accounts[2], value: web3.utils.toWei("1", "ether")});
        await truffleAssert.passes(instance.deletePerson(accounts[2], {from: accounts[0]}));
    });
});