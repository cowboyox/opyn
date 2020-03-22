import React from 'react';
// eslint-disable-next-line no-unused-vars
import BigNumber from 'bignumber.js'

import { BalanceBlock, AddressBlock } from '../common';

/**
 * 
 * @param {{ poolTokenBalance: BigNumber, poolETHBalance: BigNumber }}  
 */
const HeaderDashboard = ({ symbol, poolETHBalance, poolTokenBalance, uniswapExchange }) => {
  return (
    <div style={{ padding: '2%', display: 'flex',  alignItems: 'center' }}>
      <div style={{ width: '30%' }}>
        <BalanceBlock asset='Total ETH Liquidity' balance={poolETHBalance} />
      </div>
      <div style={{ width: '30%' }}>
        <BalanceBlock asset={`${symbol} Liquidity`} balance={poolTokenBalance} />
      </div>
      <div style={{ width: '40%' }}>
        <>
          <AddressBlock label="Uniswap Contract" address={uniswapExchange} />
        </>
      </div>
    </div>
  );
};

export default HeaderDashboard;
