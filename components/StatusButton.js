export default function StatusButton({ statusList, setStatus }) {
  return (
    <div className="bg-white overflow-hidden">
      <div className="px-4 py-4 sm:p-6 gird">
        {statusList.map((v, i) => (
          <button
          // i !== 3 && <button
            key={v.status}
            onClick={() => setStatus(v.status)}
            className={`inline-flex items-center px-2.5 py-0.5 mx-1 rounded-md text-sm font-medium ${v.bg}`}
          >
            <svg
              className={`-ml-0.5 mr-1.5 h-2 w-2 ${v.dot}`}
              fill="currentColor"
              viewBox="0 0 8 8"
            >
              <circle cx={4} cy={4} r={3} />
            </svg>
            {v.label}
          </button>
        ))}
      </div>
    </div>
  )
}
