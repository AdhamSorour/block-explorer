import { Alchemy, Network } from "alchemy-sdk";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const settings = {
	apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
	network: Network.ETH_MAINNET,
};
const alchemy = new Alchemy(settings);


export default function BlockView({ setBlockNumber }) {
	const [timestamp, setTimestamp] = useState();
	const [transactions, setTransactions] = useState([]);

	const params = useParams();
	const blockNumber = parseInt(params.blockNumber);

	useEffect(() => {
		async function postTransactions() {
			const block = await alchemy.core.getBlockWithTransactions(blockNumber);
			setTimestamp(block.timestamp);
			setTransactions(block.transactions);
		}

		setBlockNumber(blockNumber);
		postTransactions();
	}, [blockNumber, setBlockNumber]);

	return (
		<>
			<p><Link to="/">Home</Link></p>
			<h2>Block {blockNumber}</h2>
			<h3>Timestamp: {new Date(timestamp * 1_000).toLocaleString()}</h3>
			<h3>Transactions: {transactions && transactions.length}</h3>
			<hr />
			<Transactions transactions={transactions} />
		</>
	);
}


function Transactions({ transactions }) {
	return (
		transactions.map((tx, i) => {
			return (
				<div key={tx.hash}>
					<h4>Tx{i} hash: {tx.hash}</h4>
					<p>&emsp; From: {tx.from}</p>
					<p>&emsp; To: {tx.to}</p>
				</div>
			);
		})
	);
}