const express = require("express");
const app = express();

/** Decode Form URL Encoded data */
app.use(express.urlencoded());

  
  app.listen(8000, () => {
    console.log(`Example app listening at http://localhost:${8000}`)
  })


let fs = require("fs");
let Web3 = require('web3'); // https://www.npmjs.com/package/web3


// Create a web3 connection to a running geth node over JSON-RPC running at
// http://localhost:8545
let web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));


let source = fs.readFileSync("Token.json");
let contracts = JSON.parse(source);
let myContract = new web3.eth.Contract(contracts.abi, '0x5fbdb2315678afecb367f032d93f642f64180aa3', {
    from: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
    gasPrice: '771682232' });


//Show a simple HTML form for front end
app.get('/', (req, res, next) => {
    myContract.methods.viewCurrentSupply().call()
    .then(function(result){
        res.send(`<h1> FANTASY TOKEN (TF) </h1>
                  <p>Attempt to increase token supply by the provided value:</p>
                  <form method="POST" action="/increaseSupply">
                  <input type="number" name="value">
                  <input type="submit">
                  </form>
                  <p>Current TF supply:` + result + `</p>
                  <br>

                  <p>Get TF balance of account:</p>
                  <form method="GET" action="/getBalance">
                  <input type="text" name="address">
                  <input type="submit">
                  </form>
                  <br>

                  <form method="POST" action="/transferTF">
                  <p>Transfer <input type="number" name="TFAmmount"> FROM: <input type="text" name="transferAddrTF1"> TO: <input type="text" name="transferAddrTF2"> </p>
                  <input type="submit">
                  </form>
                  <br>

                  <h1> ETHERS </h1>
                  <h3> BALANCE </h3>
                  <p> Input a valid address to view ETH balance:</p>
                  <form method="POST" action="/ETHBalance">
                  <input type="text" name="ethBalance">
                  <input type="submit">
                  </form>
                  <br>
                  <h3> TRANSFER </h3>
                  <form method="POST" action="/ETHTransfer">
                  <p> Input SENDER address:</p>
                  <input type="text" name="fromTransfer">
                  <p> Input DESTINATION address:</p>
                  <input type="text" name="toTransfer">
                  <p> Input AMMOUNT to transfer:</p>
                  <input type="number" name="ammount">
                  <input type="submit">
                  </form>`);
    });
});


app.get('/getBalance', (req, res) => {
    myContract.methods.balanceOf(req.query.address).call()
    .then(function(result){
        res.send("<b>Account ID: </b>" + req.query.address + "<br> <b>BALANCE: </b>"+ result + " TF");
    }).catch(err => {
        console.log(err);
        res.send(err);
    });
});

app.post('/transferTF', (req, res) => {
    myContract.methods.transfer(req.body.transferAddrTF1, req.body.transferAddrTF2, req.body.TFAmmount).send()
    res.send("Transaction succesful");
    // .then(function(result){
    //     console.log(result + ' ' + "TF")
    //     res.send(result+ ' ' + 'TF');
    // }).catch(err => {
    //     console.log(err)
    //     res.send(err);
    // });
});


app.post('/increaseSupply', (req, res) => { 
    myContract.methods.issueTF(req.body["value"]).send()
    .then(function(result){
        res.send("Token base succesfully increased by " + req.body["value"] + "!");
    }).catch(err => {
        console.log(err)
        res.send(err);
    });
});


app.post('/ETHBalance', async (req, res, next) => {
    const balance = await web3.eth.getBalance(req.body["ethBalance"]);
    const etherBalance = web3.utils.fromWei(balance, 'ether');
    
    res.send("<b>Account ID: </b>" + req.body["ethBalance"] + "<br> <b>BALANCE: </b>"+ etherBalance + " ETH");
    
});


app.post('/ETHTransfer', async (req, res, next) => {
    let sender = req.body["fromTransfer"];
    let receiver = req.body["toTransfer"];
    let val = req.body["ammount"];
    web3.eth.sendTransaction({to:receiver, from:sender, value:web3.utils.toWei(val, "ether")});   
    res.send(sender);
});