import React, { useState } from 'react';
import TaxasForm from './components/TaxasForm';
import './styles.css';
import Footer from './components/footer';

function App() {
  const [taxas] = useState({
    debito: 2,
    credito: {
      1: 4.5,
      2: 5.0, 
      3: 6.5, 
      4: 6.5, 
      5: 8.5, 
      6: 8.5, 
      7: 10.0, 
      8: 10.0, 
      9: 12.5,
      10: 12.5, 
      11: 14.0, 
      12: 14.0, 
      13: 18.0, 
      14: 18.0, 
      15: 19.0, 
      16: 20.0, 
      17: 20.0, 
      18: 22.0
    }
  });

  return (
    <>
      <div  className="app-container">
        <h1 className="app-title">Calculadora AXN</h1>
        <TaxasForm taxas={taxas} />
      </div>
      <Footer />
    </>
  );
}

export default App;