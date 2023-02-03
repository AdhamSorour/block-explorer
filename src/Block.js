import { useEffect, useState } from "react"

// Example Response from getBlock()
/*
{
  hash: '0x92fc42b9642023f2ee2e88094df80ce87e15d91afa812fef383e6e5cd96e2ed3',
  parentHash: '0x6890edf8ad6900a5472c2a7ee3ef795f020ef6f907afb7f4ebf6a92d6aeb1804',
  number: 15221026,
  timestamp: 1658877717,
  nonce: '0xd8c399035d6e6e8f',
  difficulty: null,
  gasLimit: BigNumber { _hex: '0x01ca35d2', _isBigNumber: true },
  gasUsed: BigNumber { _hex: '0x01ca1ae1', _isBigNumber: true },
  miner: '0x52bc44d5378309EE2abF1539BF71dE1b7d7bE3b5',
  extraData: '0x6e616e6f706f6f6c2e6f7267',
  transactions: [
    '0xba4938ea41154427c8cb424ea89d9f150f139ed10065fe43ce11102dc82e1c37',
    '0x98cc6b4b66453e184f65728fee265a726b030c5ddcfc1311a01ea5345c3959ab',
    '0x2cbb4968cce66c73f2755fe7ef177981962afa7943f658b323e61850f31e4163'
  ],
  baseFeePerGas: BigNumber { _hex: '0x02aa2d1d80', _isBigNumber: true },
  _difficulty: BigNumber { _hex: '0x2a31d8a2cf4dd7', _isBigNumber: true }
}
*/

export default function Block({blockNumber, alchemy}) {
    const [hash, setHash] = useState();
    const [numTx, setNumTx] = useState();

    useEffect(() => {
        async function setBlockInfo() {
            const block = await alchemy.core.getBlock(blockNumber);
            setNumTx(block.transactions.length);
            setHash(block.hash);
        }
        setBlockInfo();
        // eslint-disable-next-line
    }, [])

    return (<>
        <b>Block {blockNumber}:</b>
        <p>&emsp; Block Hash: {hash}</p>
        <p>&emsp; Nuumber of Transactions: {numTx}</p>
    </>)
}