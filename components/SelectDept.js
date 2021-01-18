
export default function SelectDept({ reset, depts, currentDept, setCurrentDept, ...rest }) {
  return (
    <div className="mb-8" >
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {depts.map((v) => {
            return (
              <a
                key={v._id}
                href="#"
                onClick={() => {
                  reset && reset()
                  setCurrentDept(v)
                }}
                className={`${
                  currentDept._id === v._id
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                aria-current="page"
              >
                {v.name}
              </a>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
