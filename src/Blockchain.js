import { Alchemy, Network } from "alchemy-sdk";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const settings = {
	apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
	network: Network.ETH_MAINNET,
};
const alchemy = new Alchemy(settings);


export default function Blockchain({ blockNumber, setBlockNumber }) {
	const [blocks, setBlocks] = useState([]);

	useEffect(() => {
		const newBlocks = [];
		for (let i = blockNumber; i >= 0 && blockNumber - i < 10; i--) newBlocks.push(i);
		setBlocks(newBlocks);
	}, [blockNumber]);

	return (
		blocks.map(block => {
			return <Block blockNumber={block} setBlockNumber={setBlockNumber} key={block} />
		})
	)
}

function Block({ blockNumber, setBlockNumber }) {
	const [hash, setHash] = useState();
	const [numTx, setNumTx] = useState();

	useEffect(() => {
		async function setBlockInfo() {
			const block = await alchemy.core.getBlock(blockNumber);
			setNumTx(block.transactions.length);
			setHash(block.hash);
		}
		setBlockInfo();
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	return (<>
		<h4><Link to="/blockview" onClick={() => setBlockNumber(blockNumber)}>Block {blockNumber}:</Link></h4>
		<p>&emsp; Block Hash: {hash}</p>
		<p>&emsp; Number of Transactions: {numTx}</p>
	</>)
}