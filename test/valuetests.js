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
// function withdrawAll() public onlyOwner returns(uint) {

const People = artifacts.require("People");
const truffleAssert = require('truffle-assertions');

contract("People", async function(accounts) {
    let instance;
    let contractPreBalance;
    let contractPostBalance;
    let ownerPreWithdrawl;
    let ownerPostWithdrawl;
    
    // before() runs once before anythign else
    before(async function() {
        instance = await People.deployed();
    });

    it("Check contract balances are increased correctly when creating a person.", async function() {
        contractPreBalance = await web3.eth.getBalance(instance.address);
        console.log(" > > Balance pre creation: " + contractPreBalance);
        await instance.createPerson("Person 1", 35, 170, {from: accounts[1], value: web3.utils.toWei("1", "ether")});
        contractPostBalance = await web3.eth.getBalance(instance.address);
        console.log(" > > Balance post creation: " + contractPostBalance);

        await truffleAssert.passes(contractPostBalance === contractPreBalance + web3.utils.toWei("1", "ether"));
        await truffleAssert.passes(instance.balance === contractPostBalance);
    });
    it("Check contract balance is zeroed and owner balance is increased correctly when withdrawing.", async function() {
        contractPreBalance = await web3.eth.getBalance(instance.address);
        ownerPreWithdrawl = await web3.eth.getBalance(accounts[0]);

        console.log(" > > Contract balance pre creation: " + contractPreBalance);
        console.log(" > > Owner balance pre creation: " + ownerPreWithdrawl);

        await instance.withdrawAll({from: accounts[0]});
        contractPostBalance = await web3.eth.getBalance(instance.address);
        ownerPostWithdrawl = await web3.eth.getBalance(accounts[0]);
        
        console.log(" > > Contract balance post withdrawl: " + contractPostBalance);
        console.log(" > > Owner balance post withdrawl: " + ownerPostWithdrawl);

        await truffleAssert.passes(contractPostBalance === 0);
        await truffleAssert.passes(ownerPostWithdrawl === ownerPreWithdrawl + contractPreBalance);
    });
});