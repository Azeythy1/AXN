import React, { useState } from 'react';
import TaxasForm from './components/TaxasForm';
import './styles.css';
// import Footer from './components/footer';

function App() {
  const [taxas] = useState({
    debito: 2,
    credito: {
      1: 4.5,
      2: 5.0, 
      3: 6.5, 
      4: 6.7, 
      5: 8.5, 
      6: 8.7, 
      7: 10.0, 
      8: 10.2, 
      9: 12.5,
      10: 12.9, 
      11: 14.2, 
      12: 14.5, 
      13: 18.2, 
      14: 18.5, 
      15: 19.5, 
      16: 20.2, 
      17: 20.5, 
      18: 22.5
    }
  });

  return (
    <>
      <div  className="app-container">
        <h1 className="app-title">Calculadora AXN</h1>
        <TaxasForm taxas={taxas} />
      </div>
      {/* <Footer /> */}
    </>
  );
}

export default App;