// testing createPerson require statements

// requirement: truffle-assertions
// install: npm install truffle-assertions
// usage: const truffleAssert = require('truffle-assertions');

// Tests:
//      require(age < 150, "Age needs to be below 150");
//      require(msg.value >= 1 ether);

const People = artifacts.require("People");
const truffleAssert = require('truffle-assertions');

contract("People", async function() {
    it("Shouldn't create a person with age over 150 years", async function() {
        let instance = await People.deployed();
        
        // Testing for contract failure, if the test passes the require function worked correctly
        await truffleAssert.fails(
            instance.createPerson(
                "Bob", 
                200, 
                175, 
                {
                    value: web3.utils.toWei(
                        "1", 
                        "ether"
                    )
                }
            ),
            truffleAssert.ErrorType.REVERT
        );
    });
    it("Shouldn't create a person without payment", async function () {
        let instance = await People.deployed();

        await truffleAssert.fails(
            instance.createPerson(
                "Bill",
                50,
                169,
                {
                    value: web3.utils.toWei(
                        "0.01",
                        "ether"
                    )
                }
            ),
            truffleAssert.ErrorType.REVERT
        );
    });
});