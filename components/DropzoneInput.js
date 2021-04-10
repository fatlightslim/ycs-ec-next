import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import csv from "csv"
import axios from "axios"
import encoding from "encoding-japanese"
import SelectDept from "./SelectDept"

export default function DropzoneInput(props) {
  const { currentDept } = props
  const [result, setResult] = useState()
  const [subRegion, setSubRegion] = useState("chuo")
  // console.log(currentDept);

  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader()
      reader.onabort = () => console.log("file reading was aborted")
      reader.onerror = () => console.log("file reading has failed")
      reader.onload = () => {
        csv.parse(reader.result, async (err, data) => {
          const json = await convertData(data, currentDept.customers, subRegion)
          setResult(json)
        })
      }
      reader.readAsBinaryString(file)
    })
  }, [])
  const { getRootProps, getInputProps } = useDropzone({ onDrop })

  const saveCustomers = () => {

    axios.post("/api/customers", result).then((response) => {
      alert("更新が完了しました")
    })
  }

  return (
    <div className="mx-auto p-8">
      <SelectDept className="mb-8" {...props} />
      {currentDept.customers === "togane" && (
        <SelectSub setSubRegion={setSubRegion} subRegion={subRegion} />
      )}
      <Upload
        {...props}
        getRootProps={getRootProps}
        getInputProps={getInputProps}
      />
      <div className={result ? "block" : "hidden"}>
        <button
          onClick={() => saveCustomers()}
          type="button"
          className="mt-4 text-xs btn-blue"
        >
          アップロード
        </button>
      </div>
    </div>
  )
}

function SelectSub({ setSubRegion, subRegion }) {
  return (
    <div className="max-w-lg pb-6">
      <div>
        {/* <label htmlFor="location" className="block text-sm font-medium text-gray-700">Sub</label> */}
        <select
          id="location"
          name="location"
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          value={subRegion}
          onChange={(e) => setSubRegion(e.target.value)}
        >
          <option value="chuo">中央</option>
          <option value="tobu">東部</option>
        </select>
      </div>
    </div>
  )
}

function Upload({ getRootProps, getInputProps }) {
  return (
    <div {...getRootProps()}>
      <div className="max-w-lg flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
        <div className="space-y-1 text-center">
          <Svg />
          <div className="flex text-sm text-gray-600">
            <label
              htmlFor="file-upload"
              className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
            >
              <p>CSVファイルをアップロード</p>
              <input {...getInputProps()} />
            </label>
          </div>
          <p className="text-xs text-gray-500">
            ドラッグ&amp;ドロップも可能です
          </p>
        </div>
      </div>
    </div>
  )
}

function Svg(params) {
  return (
    <svg
      className="mx-auto h-12 w-12 text-gray-400"
      stroke="currentColor"
      fill="none"
      viewBox="0 0 48 48"
      aria-hidden="true"
    >
      <path
        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function str2Array(str) {
  var array = [],
    i,
    il = str.length
  for (i = 0; i < il; i++) array.push(str.charCodeAt(i))
  return array
  // return new Uint8Array(str)
}

function itemsNeedToConvert(v, region) {
  return { address1: v[79], address2: v[152], name: v[151], collector: v[133] }
  // return region === "takatsu"
  //   ? { address1: v[79], address2: v[152], name: v[151], collector: v[133] }
  //   : { address1: v[52], address2: v[152], name: v[51], collector: v[133] }
}

function itemsNotJapanese(v, region) {
  return {
    tel: v[82],
    area: v[13],
    area2: v[14],
    customerNumber: v[150],
    route: v[147],
  }
  // return region === "takatsu"
  //   ? {
  //       tel: v[82],
  //       area: v[13],
  //       area2: v[14],
  //       customerNumber: v[150],
  //       route: v[147],
  //     }
  //   : {
  //       tel: v[82],
  //       area: v[13],
  //       area2: v[14],
  //       customerNumber: v[50],
  //       route: v[147],
  //     }
}

function convertData(data, region, subRegion) {
  const array = []
  data.forEach((v, i) => {
    let item = itemsNeedToConvert(v, region)

    Object.keys(item).forEach((v) => {
      if (item[v]) {
        // const a = encoding.detect(str2Array(item[v]))
        // console.log(a)
        var str = encoding.convert(str2Array(item[v]), {
          from: "SJIS",
          to: "UNICODE",
          // type: 'string'
        })
        // console.log(encoding.codeToString(str));
        item[v] = encoding.codeToString(str)
      }
    })

    if (region === "togane")  item.subRegion = subRegion
    // console.log(item);
    array.push({ ...item, ...itemsNotJapanese(v), region })
  })
  // console.log(array)
  return Promise.resolve(array)
}
