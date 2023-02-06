import { Alchemy, Network } from "alchemy-sdk";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const settings = {
	apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
	network: Network.ETH_MAINNET,
};
const alchemy = new Alchemy(settings);


export default function BlockView({ blockNumber }) {
	const [timestamp, setTimestamp] = useState();
	const [transactions, setTransactions] = useState([]);

	useEffect(() => {
		async function getTransactions() {
			const block = await alchemy.core.getBlockWithTransactions(blockNumber);
			setTimestamp(block.timestamp);
			setTransactions(block.transactions);
		}
		getTransactions();
	}, [blockNumber]);

	return (
		<>
			<p><Link to="/">Home</Link></p>
			<h2>Block Number: {blockNumber}</h2>
			<h3>Timestamp: {new Date(timestamp * 1_000).toLocaleString()}</h3>
			<h3>Transactions: {transactions && transactions.length}</h3>
			<hr />
			<Transactions transactions={transactions} />
		</>
	);
}

function Transactions({ transactions }) {
	return (
		transactions.map(tx => {
			return (
				<div key={tx.hash}>
					<h4>Hash: {tx.hash}</h4>
					<p>&emsp; From: {tx.from}</p>
					<p>&emsp; To: {tx.to}</p>
				</div>
			);
		})
	);
}