import DStorage from '../abis/DStorage.json'
import React, { Component } from 'react';
import Navbar from './Navbar'
import Main from './Main'
import Web3 from 'web3';
import './App.css';

//+-Declare IPFS:_
const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' }) //(leaving out the arguments will default to these values).

class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3
    //+-Load account:_
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    //+-Network ID:_
    const networkId = await web3.eth.net.getId()
    const networkData = DStorage.networks[networkId]
    if(networkData) {
      //+-Assign contract:_
      const dstorage = new web3.eth.Contract(DStorage.abi, networkData.address)
      this.setState({ dstorage })
      //+-Get files amount:_
      const filesCount = await dstorage.methods.fileCount().call()
      this.setState({ filesCount })
      //+-Load files&sort by the newest:_
      for (var i = filesCount; i >= 1; i--) {
        const file = await dstorage.methods.files(i).call()
        this.setState({
          files: [...this.state.files, file]
        })
      }
    } else {
      window.alert('DStorage contract not deployed to detected network.')
    }
  }

   //+-Get file from user:_
  captureFile = event => {
    event.preventDefault()

    const file = event.target.files[0]
    const reader = new window.FileReader()

    reader.readAsArrayBuffer(file)
    reader.onloadend = () => {
      this.setState({
        buffer: Buffer(reader.result),
        type: file.type,
        name: file.name
      })
      console.log('buffer', this.state.buffer)
    }
  }


  //+-Upload File:_
  uploadFile = description => {
    console.log("Submitting file to I.P.F.S.");

    //+-Add file to the I.P.F.S.:_
    ipfs.add(this.state.buffer, (error, result) => {
      console.log('I.P.F.S. result', result);

      if(error) {
        console.error(error);
        return
      }

      this.setState({ loading: true });
      //+-Assign value for the file without extension:_
      if(this.state.type === ''){
        this.setState({type: 'none'})
      }

      this.state.dstorage.methods.uploadFile(result[0].hash, result[0].size, this.state.type, this.state.name, description).send({ from: this.state.account }).on('transactionHash', (hash) => {
        this.setState({
         loading: false,
         type: null,
         name: null
       })
       window.location.reload()
      }).on('error', (e) =>{
        window.alert('Error');
        this.setState({loading: false});
      });
    });
  }

  //+-Set states:_
  constructor(props) {
    super(props)
    this.state = {
      account: '',
      dstorage: null,
      files: [],
      loading: false,
      type: null,
      name: null
    }
    //+-Bind functions:_
  }

  render() {
    return (
      <div>
        <Navbar account={this.state.account} />
        { this.state.loading
          ? <div id="loader" className="text-center mt-5"><p>Loading...</p></div>
          : <Main
              files={this.state.files}
              captureFile={this.captureFile}
              uploadFile={this.uploadFile}
            />
        }
      </div>
    );
  }
}

export default App;