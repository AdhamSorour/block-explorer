import { Alchemy, Network } from 'alchemy-sdk';
import { useEffect, useState, useRef } from 'react';
import { Routes, Route, Link, Outlet, useNavigate, useLocation } from "react-router-dom";

import Blockchain from './Blockchain';
import BlockView from './Blockview';

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


export default function App() {
	const [blockNumber, setBlockNumber] = useState(0);

	return (
		<Routes>
			<Route path="/" element={<Layout blockNumber={blockNumber} setBlockNumber={setBlockNumber} />}>
				<Route index element={<Blockchain blockNumber={blockNumber} />} />
				<Route path="block/:blockNumber" element={<BlockView setBlockNumber={setBlockNumber}/>} />
				<Route path="*" element={<NoMatch />} />
			</Route>
		</Routes>
	);
}


function Layout({ blockNumber, setBlockNumber }) {
	const [latestBlock, setLatestBlock] = useState(0);
	const navigate = useNavigate();
	const location = useLocation();

	useEffect(() => {
		if (location.pathname === "/") setLatestBlockNumber();
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	const inputRef = useRef();
	const handleInput = (e) => {
		const result = e.target.value.replace(/\D/g, '');
		inputRef.current.value = result;
	}

	const gotoBlock = (blockNumber) => {
		if (location.pathname.startsWith("/block")) {
			navigate(`/block/${blockNumber}`);
		} else {
			setBlockNumber(blockNumber);
		}
	}


	async function setInputBlock() {
		const inputBlock = parseInt(inputRef.current.value);
		inputRef.current.value = "";

		if (inputBlock <= latestBlock) gotoBlock(inputBlock);
		else {
			const latest = await alchemy.core.getBlockNumber();
			setLatestBlock(latest);
			if (inputBlock <= latest) gotoBlock(inputBlock);
		}
	}

	function setPrevBlockNumber() {
		if (blockNumber) gotoBlock(blockNumber - 1);
	}

	async function setNextBlockNumber() {
		if (blockNumber < latestBlock) gotoBlock(blockNumber + 1);
		else {
			const latest = await alchemy.core.getBlockNumber();
			setLatestBlock(latest);
			if (blockNumber < latest) gotoBlock(blockNumber + 1);
		}
	}

	async function setLatestBlockNumber() {
		const latest = await alchemy.core.getBlockNumber();
		setLatestBlock(latest)
		gotoBlock(latest);
	}

	return (
		<>
			<input
				ref={inputRef}
				onChange={handleInput}
				onKeyDown={e => { if (e.key === 'Enter') setInputBlock(); }}
				placeholder='Find block by number'
			/>
			<button onClick={setInputBlock}>Find</button>
			<button onClick={setPrevBlockNumber}>Prev</button>
			<button onClick={setNextBlockNumber}>Next</button>
			<button onClick={setLatestBlockNumber}>Latest</button>
			<hr />
			{/* An <Outlet> renders whatever child route is currently active, you can think 
			about this <Outlet> as a placeholder for the child routes defined above. */}
			<Outlet />
		</>
	);
}


function NoMatch() {
	return (
		<>
			<h2>Nothing to see here!</h2>
			<p>
				<Link to="/">Go to the home page</Link>
			</p>
		</>
	);
}
