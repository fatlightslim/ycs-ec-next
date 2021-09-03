import axios from "axios"
import { Fragment, useState } from "react"
import { Dialog, Transition } from "@headlessui/react"
import { CheckIcon } from "@heroicons/react/outline"
import Select from "./Select"
import CSVReader from "react-csv-reader"

const subRegions = {
  片貝: "tobu",
  高津: null,
  東金: "chuo",
}

const shops = {
  片貝: "東金東部",
  高津: "ゆりのき高津",
  東金: "東金中央",
}

export default function CsvUpload() {
  const [csv, setCsv] = useState([])
  const [yc, setYc] = useState("")
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  function csvUpload() {
    setLoading(true)
    axios.post("/api/customers", csv).then((res) => {
      setOpen(true)
      setLoading(false)
      setYc("")
    })
  }

  function csvParse(data, fileInfo) {
    const result = data.map((v) => {
      return {
        tel: v[82],
        area: v[13],
        area2: v[14],
        customerNumber: v[150],
        route: v[147],
        address1: v[79],
        address2: v[152],
        name: v[151],
        collector: v[133],
        yc: v[79].substr(0, 2),
      }
    })

    setYc(shops[result[0].yc])
    const result2 = result.map((v) => {
      return {
        ...v,
        region: result[0].yc === "高津" ? "takatsu" : "togane",
        subRegion: subRegions[result[0].yc],
      }
    })
    setCsv(result2)
  }

  return (
    <div className="bg-white">
      <div className="px-4 py-5 sm:p-6">
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              顧客データ更新
            </h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500">
              <p>
              ヘッダー情報なし、集金人入りのCSVファイルをアップロードしてください。
              </p>
              <p>店舗はCSVデータから自動で判別します。</p>
            </div>
            <div className="mt-5">
              <label className="block -mb-3">CSVファイル</label>
              <CSVReader
                parserOptions={{ header: false, skipEmptyLines: true }}
                fileEncoding="sjis"
                onFileLoaded={csvParse}
              />
            </div>

            <div className="mt-2">
              {/* <Select selected={selected} setSelected={setSelected} /> */}
              <div>
                <label
                  htmlFor="yc"
                  className="block text-sm font-medium text-gray-700"
                >
                  店舗
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="yc"
                    id="yc"
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-3/4 sm:text-sm border-gray-300 rounded-md"
                    readOnly
                    value={yc}
                  />
                </div>
              </div>
            </div>
            <div className="mt-5">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={csvUpload}
              >
                {loading && (
                  <div className="mr-2 -ml-2">
                    <svg
                      className="animate-spin   h-5 w-5 text-white inline-block "
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx={12}
                        cy={12}
                        r={10}
                        stroke="currentColor"
                        strokeWidth={4}
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                  </div>
                )}
                アップロード
              </button>
            </div>
          </div>
        </div>
      </div>

      <Modal setOpen={setOpen} open={open} />
    </div>
  )
}

function Modal({ open, setOpen, dept }) {
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-10 inset-0 overflow-y-auto"
        onClose={setOpen}
      >
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
              <div>
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                  <CheckIcon
                    className="h-6 w-6 text-green-600"
                    aria-hidden="true"
                  />
                </div>
                <div className="mt-3 text-center sm:mt-5">
                  <Dialog.Title
                    as="h3"
                    className="text-lg leading-6 font-medium text-gray-900"
                  >
                    正常にアップロードしました
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      {dept}のデータは最新の顧客情報に更新されました。
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6">
                <button
                  type="button"
                  className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                  onClick={() => setOpen(false)}
                >
                  閉じる
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
