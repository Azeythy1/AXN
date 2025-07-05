import React, { useState } from 'react';
import TaxasForm from './components/TaxasForm';
import './styles.css';
// import { library } from '@fortawesome/fontawesome-svg-core';
// import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
// library.add(faWhatsapp);
import Footer from './components/footer';

function App() {
  const [taxas] = useState({
    debito: 2,
    credito: {
      1: 4.5,
      2: 5.0, 
      3: 6.2, 
      4: 6.5, 
      5: 8.2, 
      6: 8.5, 
      7: 10.0, 
      8: 10.1, 
      9: 12.2,
      10: 12.5, 
      11: 14.0, 
      12: 14.2,  
      13: 18.2, 
      14: 18.5, 
      15: 19.5, 
      16: 20.2, 
      17: 20.5, 
      18: 22.5
    }
  });

  return (
    <><Footer />
      <div  className="app-container">
        <h1 className="app-title">Calculadora AXN</h1>
        <TaxasForm taxas={taxas} />
      </div>
 
      
    </>
  );
}

export default App;