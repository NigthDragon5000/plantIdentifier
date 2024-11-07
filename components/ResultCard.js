

// components/ResultCard.jsx
export default function ResultCard({ result }) {
    return (
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Resultado:</h2>
        <p className="text-gray-700 whitespace-pre-line">{result}</p>
      </div>
    )
  }