import { useState } from 'react'
import Customers from './components/Customers'
import Accounts from './components/Accounts'
import Deposits from './components/Deposits'

function App() {
  const [currentView, setCurrentView] = useState('customers') // customers, accounts, deposits

  const renderView = () => {
    switch (currentView) {
      case 'accounts':
        return <Accounts />
      case 'deposits':
        return <Deposits />
      case 'customers':
      default:
        return <Customers />
    }
  }

  return (
    <div className="App d-flex flex-column min-vh-100">
      <header className="navbar navbar-expand-lg shadow-sm py-0">
        <div class="container-fluid">
          <span className="navbar-brand mb-0 h1">Bank Management System</span>
          <nav className="ms-auto">
            <div className="btn-group" role="group">
              <button 
                type="button"
                onClick={() => setCurrentView('customers')} 
                className={`btn btn-outline-light ${currentView === 'customers' ? 'active' : ''}`}
              >
                Customers
              </button>
              <button 
                type="button"
                onClick={() => setCurrentView('accounts')} 
                className={`btn btn-outline-light ${currentView === 'accounts' ? 'active' : ''}`}
              >
                Accounts
              </button>
              <button 
                type="button"
                onClick={() => setCurrentView('deposits')} 
                className={`btn btn-outline-light ${currentView === 'deposits' ? 'active' : ''}`}
              >
                Transfers
              </button>
            </div>
          </nav>
        </div>
      </header>

      <main className="container mt-4 flex-grow-1">
        {renderView()}
      </main>

      <footer className="text-center py-3 mt-auto">
        <div class="container">
            <p className="mb-0">&copy; 2024 Banking Application</p>
        </div>
      </footer>
    </div>
  )
}

export default App
