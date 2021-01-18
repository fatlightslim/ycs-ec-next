import { Component, useRef, useState, useEffect } from "react"
import ReactToPrint from "react-to-print"
import MergeReceipt from "./MergeReceipt"
import Printed from "./Printed"

export default function Printable(props) {
  const {duplicate,  setDuplicate, setPrintableData, printableData } = props
  // console.log(printableData);
  const componentRef = useRef()
  const [checked, setChecked] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)

  const PrintBar = () => (
    <div className="flex items-center py-2 mt-4">
      <button
        className="mx-4"
        onClick={() => {
          setDuplicate([])
          setPrintableData([])
        }}
      >
        ← 戻る
      </button>

      <ReactToPrint
        trigger={() => (
          <button className="btn-blue mr-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-4 h-4 mr-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
              />
            </svg>
            印刷
          </button>
        )}
        content={() => componentRef.current}
        onAfterPrint={() => {
          setModalOpen(true)
        }}
      />
      <input
        id="date_check"
        name="date_check"
        type="checkbox"
        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
        onChange={(e) => setChecked(!checked)}
        checked={checked}
      />
      <label htmlFor="date_check" className="ml-2 block text-sm text-gray-900">
        日付を空にする
      </label>
    </div>
  )

  return (
    <div>
      {/* {duplicate.length > 0 ? (
        <Duplicate />
      ) : (
        <> */}
      {printableData.length > 0 && <PrintBar />}
      <ComponentToPrint
        data={printableData}
        ref={componentRef}
        {...props}
        checked={checked}
      />
      {modalOpen && (
        <Printed modalOpen={modalOpen} setModalOpen={setModalOpen} {...props} />
      )}
      {/* </>
      )} */}
    </div>
  )
}

class ComponentToPrint extends Component {
  render() {
    const { data } = this.props

    // const array = checkedData.array.sort((a, b) => b.collector - a.collector)
    return (
      <ul className="grid grid-cols-2 gap-0">
        {data.map((v, i) => (
          <MergeReceipt key={v._id} {...this.props} v={v} />
        ))}
      </ul>
    )
  }
}
