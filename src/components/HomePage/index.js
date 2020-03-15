import React from 'react';
import { useHistory } from 'react-router-dom';
import { Header, Box, LinkBase } from '@aragon/ui';

function HomePage() {
  const history = useHistory();

  return (
    <>
      <Header primary='Welcome to Opyn Dashboard' />
      <div style={{ padding: 5, opacity: 0.5 }}> Tools for DeFi Risk Management. </div>
      <div style={{ padding: '1%', display: 'flex', alignItems: 'center' }}>
        <div style={{ width: '30%', marginRight: '3%' }}>
          <MainButton title='My Vaults' description='Manage collateral, Mint/Burn oTokens' iconUrl='https://opyn.co/static/media/1.68813886.svg'  onClick={()=>{
            history.push('/myvaults')
          }} />
        </div>

        <div style={{ width: '30%' }}>
          <MainButton title='All Contracts' description=' Monitor and liquidate vaults.' iconUrl='https://opyn.co/static/media/2.18d22be0.svg'  onClick={()=>{
            history.push('/options/')
          }} />
        </div>

        <div style={{ width: '30%', marginLeft: '3%' }}>
          <MainButton title='Trade' description='Buy, Sell or Provided Liquidity.' iconUrl='https://opyn.co/static/media/3.4da8b24d.svg'  onClick={()=>{
            history.push('./trade')
          }} />
        </div>
      </div>
    </>
  );
}

function MainButton({ title, description, iconUrl, onClick }) {
  return (
    <LinkBase onClick={onClick} style={{ width: '100%' }}>
      <Box>
        <div style={{ padding:10, fontSize: 18 }}>{title}</div>
        <img alt='icon' style={{ padding:10 }} src={iconUrl}></img>
        <div style={{ paddingTop: 5, opacity: 0.5 }}> {description} </div>
        
      </Box>
    </LinkBase>
  );
}

export default HomePage;
