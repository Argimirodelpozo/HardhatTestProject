//SPDX-License-Identifier: UNLICENSED

// Solidity files have to start with this pragma.
// It will be used by the Solidity compiler to validate its version.
pragma solidity ^0.8.9;


// This is the main building block for smart contracts.
contract Token {
    // Some string type variables to identify the token.
    string public name = "Fantasy Token";
    string public symbol = "TF";

    // The current token supply and maximum ammount of tokens allowed
    uint256 public currentSupply = 1000000;
    uint256 private maximumSupply = 10000000;

    // An address type variable is used to store ethereum accounts.
    address public owner;

    // A mapping is a key/value map. Here we store each account's balance.
    mapping(address => uint256) balances;

    // The Transfer event helps off-chain applications understand
    // what happens within your contract.
    event Transfer(address indexed _from, address indexed _to, uint256 _value);

    /**
     * Contract initialization.
     */
    constructor() {
        // The totalSupply is assigned to the transaction sender, which is the
        // account that is deploying the contract.
        balances[msg.sender] = currentSupply;
        owner = msg.sender;
    }

    /**
     * Issue given ammount of tokens and assign them to SM owner
     */
    function issueTF(uint256 ammount) external {
        require(currentSupply + ammount <= maximumSupply, "Can not issue required ammount of TFs as they surpass maximum supply");
        currentSupply += ammount;
        balances[owner] += ammount;
    }


    /**
     * return the current ammount of TF in circulation
     */
    function viewCurrentSupply() external view returns (uint256) {
        return currentSupply;
    }


    /**
     * A function to transfer tokens.
     */
    function transfer(address from, address to, uint256 amount) external {
        // Check if the transaction sender has enough tokens.
        require(balances[from] >= amount, "Not enough tokens");
        require(msg.sender == owner, "You don't have the required privileges to make this transaction");

        // Transfer the amount.
        balances[from] -= amount;
        balances[to] += amount;

        // Notify off-chain applications of the transfer.
        emit Transfer(from, to, amount);
    }

    /**
     * Read only function to retrieve the token balance of a given account.
     */
    function balanceOf(address account) external view returns (uint256) {
        return balances[account];
    }
}