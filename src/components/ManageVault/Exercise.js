import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  Box, DataView, IdentityBadge, TransactionBadge,
} from '@aragon/ui';


import { getExerciseHistory } from '../../utils/graph';
import { formatDigits, toTokenUnitsBN, timeSince } from '../../utils/number';

function ExerciseHistory({
  owner, token, collateralDecimals, tokenDecimals,
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [entries, setEntries] = useState([]);

  useMemo(async () => {
    const actions = await getExerciseHistory(owner, token);
    setEntries(actions);
    setIsLoading(false);
  }, [owner, token]);

  return (
    <>
      {/* History Section */}
      <Box heading="History">
        <DataView
          status={isLoading ? 'loading' : 'default'}
          fields={['Tx', 'Collateral', 'oToken', 'Exerciser', 'Time']}
          entries={entries}
          entriesPerPage={4}
          renderEntry={({
            amtCollateralToPay, oTokensToExercise, exerciser, timestamp, transactionHash,
          }) => [
            <TransactionBadge transaction={transactionHash} />,
            formatDigits(
              toTokenUnitsBN(amtCollateralToPay, collateralDecimals).toNumber(),
              5,
            ),
            formatDigits(
              toTokenUnitsBN(oTokensToExercise, tokenDecimals).toNumber(),
              5,
            ),
            <IdentityBadge entity={exerciser} />,
            timeSince(parseInt(timestamp * 1000, 10)),
          ]}
        />
      </Box>
    </>
  );
}

ExerciseHistory.propTypes = {
  owner: PropTypes.string.isRequired,
  token: PropTypes.string.isRequired,
  collateralDecimals: PropTypes.number.isRequired,
  tokenDecimals: PropTypes.number.isRequired,
};

export default ExerciseHistory;
