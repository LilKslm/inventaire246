import { useState } from 'react'
import PersonLookup from '../components/return/PersonLookup.jsx'
import ReturnConfirm from '../components/return/ReturnConfirm.jsx'

const STEPS = { LOOKUP: 0, CONFIRM: 1, SUCCESS: 2 }

export default function ReturnPage() {
  const [step, setStep] = useState(STEPS.LOOKUP)
  const [personName, setPersonName] = useState('')
  const [checkouts, setCheckouts] = useState([])

  function handleFound(name, results) {
    setPersonName(name)
    setCheckouts(results)
    setStep(STEPS.CONFIRM)
  }

  if (step === STEPS.SUCCESS) {
    return (
      <div className="page-enter max-w-lg mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-4">✅</div>
        <h2 className="text-xl font-bold text-apple-dark mb-2">Retour effectué!</h2>
        <p className="text-apple-secondary text-sm mb-8">
          Les articles ont été retournés à l'inventaire. Merci!
        </p>
        <button
          onClick={() => { setStep(STEPS.LOOKUP); setPersonName(''); setCheckouts([]) }}
          className="px-8 py-3 rounded-2xl font-semibold text-sm text-white bg-apple-blue hover:bg-apple-blue-dark transition-colors"
        >
          Retourner d'autres articles
        </button>
      </div>
    )
  }

  if (step === STEPS.CONFIRM) {
    return (
      <ReturnConfirm
        personName={personName}
        checkouts={checkouts}
        onDone={() => setStep(STEPS.SUCCESS)}
        onBack={() => setStep(STEPS.LOOKUP)}
      />
    )
  }

  return <PersonLookup onFound={handleFound} />
}
