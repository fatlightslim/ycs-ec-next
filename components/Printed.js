import axios from "axios"

export default function Printed({
  setPrintableData,
  printedData,
  modalOpen,
  setModalOpen,
  setCurrentProduct,
  setPrintedData,
  setDuplicate
}) {
  const overlay = modalOpen
    ? "ease-out duration-300 opacity-100 opacity-100"
    : "ease-in duration-200 opacity-0"
  const modal = modalOpen
    ? "ease-out duration-300 opacity-100 translate-y-0 sm:scale-100"
    : "ease-in duration-200 opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/*
Background overlay, show/hide based on modal state.

Entering: "ease-out duration-300"
  From: "opacity-0"
  To: "opacity-100"
Leaving: "ease-in duration-200"
  From: "opacity-100"
  To: "opacity-0"
    */}
        <div
          className={`${overlay} fixed inset-0 transition-opacity`}
          aria-hidden="true"
        >
          <div className="absolute inset-0 bg-gray-500 opacity-75" />
        </div>
        {/* This element is to trick the browser into centering the modal contents. */}
        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          ​
        </span>
        {/*
Modal panel, show/hide based on modal state.

Entering: "ease-out duration-300"
  From: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
  To: "opacity-100 translate-y-0 sm:scale-100"
Leaving: "ease-in duration-200"
  From: "opacity-100 translate-y-0 sm:scale-100"
  To: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
    */}
        <div
          className={`${modal} inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6`}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
        >
          <div>
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              {/* Heroicon name: check */}
              <svg
                className="h-6 w-6 text-green-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div className="mt-3 text-center sm:mt-5">
              <h3
                className="text-lg leading-6 font-medium text-gray-900"
                id="modal-headline"
              >
                ステータスを<strong>印刷済</strong>に変更しますか？
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  変更すると印刷した領収書に紐づく全ての注文が
                  <strong>印刷済</strong>に変更されます。
                  無視するを選んだ場合は、<strong>処理中</strong>
                  として残ります。変更はいつでも可能です。
                </p>
              </div>
            </div>
          </div>
          <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
            <button
              onClick={() => {
                changeStatus(printedData, "printed" ).then(() => {
                  setPrintableData([])
                  setPrintedData([])
                  setModalOpen(false)
                  setDuplicate([])
                })
              }}
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm"
            >
              変更する
            </button>
            <button
              onClick={() => {
                setPrintableData([])
                setModalOpen(false)
              }}
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
            >
              無視する
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function changeStatus(data, status) {
  const props = {
    data,
    status,
  }
  return new Promise((resolve) => {
    axios.put("/api/orders", props).then((res) => {
      resolve(res.data)
    })
  })
}
