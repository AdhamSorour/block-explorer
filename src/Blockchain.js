import { useState, useEffect } from 'react';
import Block from "./Block"

export default function Blockchain({blockNumber}) {
    const [blocks, setBlocks] = useState([]);

    useEffect(() => {
        const newBlocks = [];
        for (let i = blockNumber; i >= 0 && blockNumber-i < 10; i--) newBlocks.push(i);
        setBlocks(newBlocks);
    }, [blockNumber]);
    
    return (
        blocks.map(block => {
            return <Block blockNumber={block} key={block}/>
        })
    )
}