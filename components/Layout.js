import Cookies from "js-cookie"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X, Plus, Cog, Divider, Home } from "./Svg"

export default function Layout({
  children,
  depts,
  setCurrentDept,
  currentDept,
  setCurrentProduct,
  currentProduct,
  setStatus,
  setPrintableData,
  setProducts,
  setDuplicate,
  setForm,
  form,
}) {
  const [menuOpen, setMenuOpen] = useState(true)

  useEffect(() => {
    const dept = Cookies.get("lastSelectedDept")
    setCurrentDept(dept ? JSON.parse(dept) : depts[0])
  }, [])

  const MobileMenu = () => (
    <button
      onClick={() => setMenuOpen(!!!menuOpen)}
      className="bg-white inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
    >
      {/* {!menuOpen ? ( */}
        <Menu className="block h-6 w-6" />
      {/* ) : ( */}
        {/* <X className="block h-6 w-6" /> */}
      {/* )} */}
    </button>
  )

  const Setting = () => (
    <Link href="/setting">
      <a className="hidden  ml-auto sm:inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
        <Cog className="w-4 h-4 text-gray-400" />
        <span className="ml-1 text-sm text-gray-400">管理</span>
      </a>
    </Link>
  )

  const AddProduct = () => {
    return (
      <button
        onClick={() => setForm({ method: "POST", url: "/api/products" })}
        type="button"
        className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <Plus className="-ml-0.5 mr-2 h-4 w-4" />
        商品を登録
      </button>
    )
  }

  const Title = () => (
    <div className="flex-shrink-0 flex items-center">YCS-EC</div>
  )

  const Depts = () => {
    return depts.map((v) => {
      return (
        <a
          key={v._id}
          onClick={() => {
            setPrintableData([])
            setDuplicate([])
            setProducts([])
            setCurrentProduct(null)
            setStatus("active")
            setCurrentDept(v)

            Cookies.set("lastSelectedDept", v, { expires: 365 })
          }}
          href="#"
          className={`${
            currentDept._id === v._id
              ? "border-indigo-500 text-gray-900"
              : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
          } inline-flex items-center px-2 sm:px-1 pt-1 border-b-2 text-sm font-medium`}
          aria-current="page"
        >
          {v.name}
        </a>
      )
    })
  }

  const List = ({ v }) => (
    <li className="flex">
      <div className="flex items-center">
        <Divider />
        <a
          href="#"
          className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700"
        >
          {v}
        </a>
      </div>
    </li>
  )

  const Nav = () => (
    <nav className="bg-gray-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
              <Title />
              <Depts />
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <AddProduct />

            <div className="ml-3 relative">
              <Setting />
            </div>
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <Title />

            <MobileMenu />
          </div>
        </div>
      </div>
      <div className={`${menuOpen ? "block" : "hidden"} sm:hidden`}>
        <div className="pt-2 pb-3 space-y-1">
          <Depts />
        </div>
        <div className="pt-4 pb-3 border-t border-gray-200">
          <div className="flex items-center px-4">
            <div className="flex-shrink-0">
              <AddProduct />
            </div>
            <Setting />
          </div>
        </div>
      </div>
    </nav>
  )

  if (!currentDept) {
    return "Loading..."
  }

  return (
    <div className="min-h-screen bg-white">
      {!form && <Nav />}
      <div className="py-4">
        {!form && (
          <header className="hidden sm:block">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <nav className="flex mb-4 " aria-label="Breadcrumb">
                <ol className="bg-white rounded-md shadow px-6 flex space-x-4">
                  <li className="flex">
                    <div className="flex items-center">
                      <a href="#" className="text-gray-400 hover:text-gray-500">
                        <Home className="flex-shrink-0 h-5 w-5" />
                      </a>
                    </div>
                  </li>
                  {currentProduct
                    ? [
                        currentDept.name,
                        currentProduct.name,
                        "注文一覧",
                      ].map((v, i) => <List key={i} v={v} />)
                    : [currentDept.name, "商品一覧"].map((v, i) => (
                        <List key={i} v={v} />
                      ))}
                </ol>
              </nav>
            </div>
          </header>
        )}
        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  )
}
