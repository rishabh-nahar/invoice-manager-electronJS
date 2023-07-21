import MainLayout from './layout/main';
import ClientList from './pages/clients';
import CreateClient from './pages/createclient';
import CreateInvoice from './pages/createinvoice';
import Dashboard from './pages/dashboard';
import InvoiceList from './pages/invoicelist';
import InvoiceDetailPage from './pages/showdetailedinvoice';
import UpdateClientForm from './pages/updateclientdetails';
import "./styles/style.css"
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <>
      <div className="App">

        <Router basename={process.env.PUBLIC_URL}>
          <div className="app">

            <MainLayout>
              <Routes>  
                <Route exact path="/" element={<Dashboard />} />
                <Route exact path="/dashboard" element={<Dashboard />} />
                <Route path="/invoice" element={<InvoiceList/>} />
                <Route path="/clients" element={<ClientList/>} />
                <Route path="/createclient" element={<CreateClient/>} />
                <Route path="/updateclient/:clientId" element={<UpdateClientForm />} />
                <Route path="/createinvoice/" element={<CreateInvoice />} />
                <Route path="/createinvoice/:clientId" element={<CreateInvoice />} />
                <Route path="/updateinvoice/:invoiceNumber" element={<InvoiceDetailPage />} />
              </Routes>
            </MainLayout>

            

          </div>
        </Router>

        
      </div>
    </>
  );
}

export default App;
