import React from 'react';
import BigNumber from 'bignumber.js';

function PriceSection({
  label, amt, symbol = '', forceDisplay = false, ethPrice
}:{label:string, amt: string|number|BigNumber, symbol?:string, forceDisplay?:boolean, ethPrice?:BigNumber }) {
  const amtBN = new BigNumber(amt);
  if (amtBN.gt(new BigNumber(0)) || forceDisplay) {
    return (
      <div style={{ padding: 3, opacity: 0.5 }}>
        <span style={{ fontSize: 13 }}>{label}</span>
        <span style={{ fontSize: 13 }}> {amtBN.toNumber().toFixed(5)}</span>
        <span style={{ fontSize: 13 }}> {symbol}</span>
        { ethPrice ? <span style={{ fontSize: 12 }}> ≈{ethPrice.times(amtBN).toFixed(2)} USD </span> : '' }
      </div>
    );
  }
  return <div style={{ padding: 3, opacity: 0.5 }} />;
}


export default PriceSection;
