import { Alchemy, Network } from 'alchemy-sdk';
import { useEffect, useState, useRef } from 'react';

import Blockchain from './Blockchain';

// Refer to the README doc for more information about using API
// keys in client-side code. You should never do this in production
// level code.
const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};

// In this week's lessons we used ethers.js. Here we are using the
// Alchemy SDK is an umbrella library with several different packages.
//   You can read more about the packages here:
//   https://docs.alchemy.com/reference/alchemy-sdk-api-surface-overview#api-surface
const alchemy = new Alchemy(settings);

function App() {
  const [blockNumber, setBlockNumber] = useState(-1);
  const [latestBlock, setLatestBlock] = useState(-1);
  const inputRef = useRef();

  const handleInput = (e) => {
    const result = e.target.value.replace(/\D/g, '');
    inputRef.current.value = result;
  }

  async function setLatestBlockNumber() {
    const latest = await alchemy.core.getBlockNumber()
    setLatestBlock(latest);
    setBlockNumber(latest);
  }
  useEffect(() => { setLatestBlockNumber(); }, []);

  async function setNextBlockNumber() {
    if (blockNumber < latestBlock) setBlockNumber(blockNumber+1);
    else {
      const latest = await alchemy.core.getBlockNumber()
      setLatestBlock(latest);
      if (blockNumber < latest) setBlockNumber(blockNumber+1);
    }
  }

  function setPrevBlockNumber() {
    if (blockNumber) setBlockNumber(blockNumber-1);
  }

  async function setInputBlock() {
    const block = parseInt(inputRef.current.value);
    if (block <= latestBlock) setBlockNumber(block);
    else {
      const latest = await alchemy.core.getBlockNumber()
      setLatestBlock(latest);
      if (block <= latest) setBlockNumber(block);
    }
  }

  return (<>
    <input 
      ref={inputRef} 
      onChange={handleInput} 
      onKeyDown={e => { if (e.key==='Enter') setInputBlock(); }}
      placeholder='Find block by number'
    />
    <button onClick={() => setInputBlock()}>Find</button>
    <button onClick={() => setNextBlockNumber()}>Next</button>
    <button onClick={() => setPrevBlockNumber()}>Prev</button>
    <button onClick={() => setLatestBlockNumber()}>Latest</button>
    <Blockchain blockNumber={blockNumber}/>
  </>);
}

export default App;
