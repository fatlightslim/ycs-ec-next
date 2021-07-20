export default function ProductList({
  products,
  setCurrentProduct,
  formatter,
}) {
  return products.length > 0 ? (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <ul className="divide-y divide-gray-200">
        {products.map((v) => {
          const props = {
            setCurrentProduct,
            formatter,
            v,
          }
          return <List key={v._id} {...props} />
        })}
      </ul>
    </div>
  ) : null
}

function List({ v, setCurrentProduct, formatter }) {
  return (
    <li>
      <a
        href="#"
        onClick={() => setCurrentProduct(v)}
        className="block hover:bg-gray-50"
      >
        <div className="flex items-center px-4 py-4 sm:px-6">
          <div className="min-w-0 flex-1 flex items-center">
            <div className="min-w-0 flex-1 px-4 md:grid md:grid-cols-2 md:gap-4">
              <div>
                <p className="text-sm font-medium text-indigo-600 truncate">
                  {v.name}
                </p>
                <p className="mt-2 flex items-center text-sm text-gray-500">
                  <span className="mx-1">
                    売上: {formatter.format(v.sales * v.price)}
                  </span>
                  <span className="mx-1">
                    料金: {formatter.format(v.price)}
                  </span>
                  <span className="mx-1">在庫: {v.qty}</span>
                  <span className="mx-1">販売数: {v.sales}</span>
                </p>
              </div>
              <div className="hidden md:block">
                <div>
                  <p className="text-sm text-gray-500">
                    最終注文:
                    <time dateTime="">
                      {new Date(v.updatedAt).toLocaleString("ja-JP")}
                    </time>
                  </p>
                  <p className="mt-2 flex items-center text-sm text-gray-500">
                    作成日:
                    <time dateTime="">
                      {new Date(v.createdAt).toLocaleString("ja-JP")}
                    </time>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div>
            {/* Heroicon name: chevron-right */}
            <svg
              className="h-5 w-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
      </a>
    </li>
  )
}
