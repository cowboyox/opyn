import React, { useState, useMemo, useEffect } from 'react';

import {
  Box, DataView, IdentityBadge, TransactionBadge, TextInput, Button,
} from '@aragon/ui';

import PropTypes from 'prop-types';
import BigNumber from 'bignumber.js';

import { BalanceBlock, MaxButton } from '../common/index.ts';
import { liquidate } from '../../utils/web3';
import { getMaxLiquidatable } from '../../utils/infura';
import { getLiquidationHistory } from '../../utils/graph.ts';
import {
  formatDigits, fromWei, toTokenUnitsBN, timeSince, toBaseUnitBN,
} from '../../utils/number';

/**
 *
 * @param {{userTokenBalance: BigNumber}} param0
 */
function LiquidationHistory({
  owner, token, isOwner, tokenDecimals, userTokenBalance,
}) {
  const [maxLiquidatable, setMaxLiquidatable] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [entries, setEntries] = useState([]);

  const [amountToLiquidate, setAmtToLiquidate] = useState(0);

  useEffect(() => {
    async function updateLiquidatable() {
      const maxToLiquidate = await getMaxLiquidatable(token, owner);
      setMaxLiquidatable(toTokenUnitsBN(maxToLiquidate, tokenDecimals).toNumber());
    }
    updateLiquidatable();
  }, [owner, token, tokenDecimals]);

  useMemo(async () => {
    async function updateList() {
      const actions = await getLiquidationHistory(owner);
      const actionsForThisVault = actions.filter(
        (entry) => entry.vault.optionsContract.address === token,
      ).sort((actionA, actionB) => {
        if (actionA.timestamp > actionB.timestamp) return -1;
        return 1;
      });
      setEntries(actionsForThisVault);
      setIsLoading(false);
    }
    updateList();
  }, [owner, token]);

  return (
    <>
      {isOwner ? (
        <></>
      ) : (
        <Box heading="Liquidate">
          <>
            <div style={{ display: 'flex' }}>
              {/* balance */}
              <div style={{ width: '30%' }}>
                <BalanceBlock asset="Max To Liquidate" balance={maxLiquidatable} />
              </div>
              <div style={{ width: '70%', paddingTop: '2%' }}>
                <div style={{ display: 'flex' }}>
                  <div style={{ width: '60%' }}>
                    <>
                      <TextInput
                        type="number"
                        wide
                        value={amountToLiquidate}
                        onChange={(event) => {
                          setAmtToLiquidate(event.target.value);
                        }}
                      />
                      <MaxButton
                        onClick={() => {
                          const maximum = Math.min(userTokenBalance.toNumber(), maxLiquidatable);
                          setAmtToLiquidate(maximum);
                        }}
                      />
                    </>
                  </div>
                  <div style={{ width: '40%' }}>
                    <Button
                      disabled={maxLiquidatable <= 0}
                      label="Liquidate"
                      onClick={() => {
                        const amtToLiquidate = toBaseUnitBN(
                          amountToLiquidate,
                          tokenDecimals,
                        ).toString();
                        liquidate(token, owner, amtToLiquidate);
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </>
        </Box>
      )}

      {/* History Section */}
      <Box heading="History">
        <DataView
          status={isLoading ? 'loading' : 'default'}
          fields={['Tx', 'Amount', 'Liquidator', 'Date']}
          entries={entries}
          entriesPerPage={4}
          renderEntry={({
            collateralToPay, liquidator, timestamp, transactionHash,
          }) => [
            <TransactionBadge transaction={transactionHash} />,
            formatDigits(fromWei(collateralToPay), 5),
            <IdentityBadge entity={liquidator} />,
            timeSince(parseInt(timestamp, 10) * 1000),
          ]}
        />
      </Box>
    </>
  );
}

LiquidationHistory.propTypes = {
  owner: PropTypes.string.isRequired,
  token: PropTypes.string.isRequired,
  isOwner: PropTypes.bool.isRequired,
  tokenDecimals: PropTypes.number.isRequired,
  userTokenBalance: PropTypes.instanceOf(BigNumber).isRequired,
};
export default LiquidationHistory;
