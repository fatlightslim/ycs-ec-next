import Link from "next/link"
import { Home } from "./Svg"

const menu = [
  { key: "depts", label: "部門編集" },
  { key: "csv", label: "CSVアップロード" },
  { key: "aggregate", label: "集金人" },
  // { key: "customers", label: "顧客データ" },
  // { key: "products", label: "販売済商品" },
  // { key: "wip", label: "処理中" },
  { key: "content", label: "ホームに戻る" },
]

export const Logo = (params) => {
  return (
    <div className="flex-shrink-0 px-4 flex items-center">
      <a href="/">YCS-EC</a>
    </div>
  )
}

export const Menu = ({ current, setCurrent }) => (
  <div className="flex-grow mt-5 flex flex-col">
    <div className="flex-1 space-y-1">
      {menu.map((v, i) => {
        const base =
          "group border-l-4 py-2 px-3 flex items-center text-sm font-medium"
        let className =
          current === v.key
            ? "bg-purple-50 border-purple-600 text-purple-600"
            : "border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50"
        className += ` ${base}`
        return i === menu.length - 1 ? (
            <a key={v.key} href="/" className={className}>
              <Home className="mr-3 h-6 w-6 text-gray-400 group-hover:text-gray-500" />
              {v.label}
            </a>
        ) : (
          <a
            key={v.key}
            href="#"
            onClick={() => setCurrent(v.key)}
            className={className}
          >
            <Svg />
            {v.label}
          </a>
        )
      })}
    </div>
  </div>
)

export const Help = () => (
  <div className="flex-shrink-0 block w-full">
    <a
      href="#"
      className="group py-2 px-4 flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
    >
      <Q />
      Help
    </a>
  </div>
)

const Svg = () => (
  <svg
    className="mr-3 h-6 w-6 text-gray-400 group-hover:text-gray-500"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
)

const Q = () => (
  <svg
    className="text-gray-400 group-hover:text-gray-500 mr-3 h-6 w-6"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="{2}"
      d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
)
