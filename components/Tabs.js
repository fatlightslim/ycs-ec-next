import Link from "next/link"

export default function Tabs({
  depts,
  setCurrentDept,
  currentDept,
  setCurrentProduct,
  currentProduct,
  setStatus,
  setPrintableData,
  setProducts,
  setDuplicate,
}) {
  return (
    <div className="block mb-8 p-4">
      <nav className="flex " aria-label="Tabs">
        {currentProduct ? (
          <a href="#" onClick={() => setCurrentProduct({ id: null })}>
            <Arrow />
          </a>
        ) : (
          <a href="#" onClick={() => setCurrentDept({ id: null })}>
            <Home />
          </a>
        )}
        {depts.map((v) => {
          return (
            <a
              onClick={() => {
                setPrintableData([])
                setDuplicate([])
                setProducts([])
                setCurrentProduct({ id: null })
                setStatus(null)
                setCurrentDept(v)
              }}
              href="#"
              className={`${
                currentDept._id === v._id
                  ? "bg-indigo-100 text-indigo-700"
                  : "text-gray-500 hover:text-gray-700"
              } px-3 py-2 font-medium text-sm rounded-md mx-2`}
              aria-current="page"
              key={v._id}
            >
              {v.name}
            </a>
          )
        })}

        <button
          onClick={() => setForm({ method: "POST", url: "/api/products" })}
          type="button"
          className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <svg
            className="-ml-0.5 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          商品を登録
        </button>
        <Link href="/setting">
          <a className="ml-auto inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <Cog />
            <span className="ml-1 text-sm text-gray-400">設定</span>
          </a>
        </Link>
      </nav>
    </div>
  )
}

const Home = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="w-4 h-4 mt-2 mr-1"
  >
    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
  </svg>
)

const Cog = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    className="w-4 h-4 text-gray-400"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
)

const Arrow = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="#111"
    viewBox="0 0 24 24"
    stroke="currentColor"
    width={18}
    className="pt-2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10 19l-7-7m0 0l7-7m-7 7h18"
    />
  </svg>
)
