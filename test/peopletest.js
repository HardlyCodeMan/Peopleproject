// testing createPerson require statements

// requirement: truffle-assertions
// install: npm install truffle-assertions
// usage: const truffleAssert = require('truffle-assertions');

// Tests:
//      require(age < 150, "Age needs to be below 150");
//      require(msg.value >= 1 ether);

const People = artifacts.require("People");
const truffleAssert = require('truffle-assertions');

contract("People", async function(accounts) {
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
    it("Should create a person and set the senior flag as true", async function () {
        let instance = await People.deployed();

        instance.createPerson(
            "Alice",
            70,
            142,
            {
                value: web3.utils.toWei(
                    "1",
                    "ether"
                )
            }
        );

        let result = await instance.getPerson();
        assert(result.senior === true, "Senior flag not set");
    });
    it("Should set age correctly", async function () {
        let instance = await People.deployed();
        let result = await instance.getPerson();
        assert(result.age.toNumber() === 70, "Age not set correctly");
    });  
});