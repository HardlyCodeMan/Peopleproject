// Value testing assignment

// requirement: truffle-assertions
// install: npm install truffle-assertions
// usage: const truffleAssert = require('truffle-assertions');

// Tests:
// Check contract handles values correctly
// - When createPerson(), balance increases and increases correctly
// - Must match the new correct balance of the contract address on the blockchain
// - Check the owner can withdraw the balance
// - Check the balance is reduced to 0
// - Check the owner wallet address is updated correctly on the blockchain

// Helpers
// web3.eth.getBalance(address)
// get the contract address from instance.address

// Functions tested:
// function createPerson(string memory name, uint age, uint height) public payable costs(1 ether)
// function deletePerson(address creator) public onlyOwner {
// function getCreator(uint index) public view onlyOwner returns(address){
// function withdrawAll() public onlyOwner returns(uint) {

const People = artifacts.require("People");
const truffleAssert = require('truffle-assertions');

contract("People", async function(accounts) {
    let instance;
    let preBalance;
    let postBalance;
    
    // before() runs once before anythign else
    before(async function() {
        instance = await People.deployed();
    });

    it("Check balances are increased correctly when creating a person.", async function() {
        preBalance = await web3.eth.getBalance(instance.address);
        console.log(" > > Balance pre creation: " + preBalance);
        await instance.createPerson("Person 1", 35, 170, {from: accounts[1], value: web3.utils.toWei("1", "ether")});
        postBalance = await web3.eth.getBalance(instance.address);
        console.log(" > > Balance pre creation: " + postBalance);

        await truffleAssert.passes(postBalance === preBalance + web3.utils.toWei("1", "ether"));
        await truffleAssert.passes(instance.balance === postBalance);
    });

    /*
    it("Non-owner should not be able to delete people", async function() {
        await instance.createPerson("Person 1", 35, 170, {from: accounts[1], value: web3.utils.toWei("1", "ether")});
        await truffleAssert.fails(instance.deletePerson(accounts[1], {from: accounts[1]}), truffleAssert.ErrorType.REVERT);
    });
    it("Owner should be able to delete people", async function() {
        await instance.createPerson("Person 1", 35, 170, {from: accounts[2], value: web3.utils.toWei("1", "ether")});
        await truffleAssert.passes(instance.deletePerson(accounts[2], {from: accounts[0]}));
    });
    */
});