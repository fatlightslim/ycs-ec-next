// import useSWR from "swr"
import { useState, useEffect } from "react"
import Notification from "../components/Notification"
import Layout from "../components/Layout"
import ProductList from "../components/ProductList"
import OrderList from "../components/OrderList"
import Stats from "../components/Stats"
import StatusButton from "../components/StatusButton"
import Printable from "../components/Printable"
import Duplicate from "../components/Duplicate"
import ProductForm from "../components/ProductForm"
import OrderForm from "../components/OrderForm"
import { statusList } from "../util/status"

const formatter = new Intl.NumberFormat("ja", {
  style: "currency",
  currency: "JPY",
})

export default function Home({ depts }) {
  // console.log(depts);
  const [currentDept, setCurrentDept] = useState()
  const [products, setProducts] = useState([])
  const [currentProduct, setCurrentProduct] = useState(null)
  const [orders, setOrders] = useState([])
  const [form, setForm] = useState(null)

  const [updated, setUpdated] = useState(null)
  const [status, setStatus] = useState(statusList[0].status)
  const [editOrder, setEditOrder] = useState({})
  const [printableData, setPrintableData] = useState([])
  const [duplicate, setDuplicate] = useState([])
  const [printedData, setPrintedData] = useState([])
  const [loading, setLoading] = useState(false)

  // const { data, error } = useSWR(`/api/products/${currentDept._id}`)
  // console.log(data);
  // const { data, error } = useSWR(`/api/products/${currentDept._id}`)

  // useEffect(() => {
  //   if (updated) {
  //     setTimeout(() => {
  //       setUpdated(false)
  //     }, 3000)
  //   }
  // }, [updated])

  useEffect(() => {
    if (!form) {
      document.body.scrollTop = 0 // For Safari
      document.documentElement.scrollTop = 0 // For Chrome, Firefox, IE and Opera
    }
  }, [form])

  useEffect(() => {
    if (!currentDept) return
    setLoading(true)

    async function fetchProducts() {
      let response = await fetch(`/api/products/${currentDept._id}`)
      response = await response
      return response.json()
    }

    async function fetchOrders() {
      let response = await fetch(`/api/orders/${currentProduct._id}`)
      response = await response
      return response.json()
    }

    fetchProducts().then((response) => {
      response = response.filter((v) => !v.done)
      setProducts(response)
    })
    if (currentProduct) {
      fetchOrders().then((response) => {
        setOrders(response)
      })
      setProducts([])
    }
  }, [currentDept, currentProduct, updated])

  const props = {
    // ordersByStatus,
    // setOrdersByStatus,
    statusList,
    formatter,
    depts,
    status,
    setStatus,
    editOrder,
    setEditOrder,
    updated,
    setUpdated,
    form,
    setForm,
    printedData,
    setPrintedData,
    duplicate,
    setDuplicate,
    printableData,
    setPrintableData,
    currentProduct,
    setCurrentProduct,
    products,
    setProducts,
    currentDept,
    setCurrentDept,
    orders,
    setOrders,
    loading,
    setLoading,
  }
  // console.log(props.currentProduct);

  return (
    <>
      {form ? (
        form.url === "/api/products" ? (
          <ProductForm {...props} />
        ) : (
          <OrderForm {...props} />
        )
      ) : (
        <Layout {...props}>
          {!currentProduct ? (
            <ProductList {...props} />
          ) : (
            <>
              <Stats {...props} />
              {duplicate.length > 0 && <Duplicate {...props} />}
              {printableData.length > 0 && loading ? (
                "Loading..."
              ) : (
                <Printable {...props} />
              )}
              {duplicate.length === 0 && printableData.length === 0 && (
                <>
                  <StatusButton {...props} />
                  <OrderList {...props} />
                </>
              )}
            </>
          )}
          <Notification updated={updated} />
        </Layout>
      )}
    </>
  )
}

// export async function getServerSideProps(context) {
export async function getStaticProps() {
  // const { data, error } = useSWR(`/api/depts`)
  // if (error) return <div>failed to load</div>
  // if (!data) return <div>loading...</div>
  // const res = await fetch(`http://localhost:3000/api/depts`)
  // const data = await res.json()
  // // console.log(res.data);

  // if (!data) {
  //   return {
  //     notFound: true,
  //   }
  // }

  return {
    props: {
      // depts: JSON.parse(JSON.stringify(data)),
      depts: [
        {
          address1: "八千代市高津678-2",
          address2: "グリーンハイランドⅠ",
          createdAt: "2020-09-24T17:13:15.174Z",
          customers: "takatsu",
          fax: "047-459-3803",
          fullName: "読売センターゆりのき高津",
          name: "新聞",
          old_id: "8LKNsHpFP5uKQTxk0nQB",
          person: "所長 館坂 民和",
          status: "active",
          tel: "047-459-0084",
          updatedAt: "2021-01-17T07:06:19.999Z",
          zip: "〒276-0036",
          _id: "6003e1ec724e6b1fcf5fb3f4",
        },
        {
          address1: "千葉県東金市堀上",
          address2: "５６−４",
          createdAt: "2020-11-01T08:14:28.003Z",
          customers: "togane",
          fax: "0475-52-4766",
          fullName: "読売センター東金中央",
          name: "東金",
          old_id: "WY11IJ6B58TwaguXdMXK",
          person: "所長 館坂 民和",
          status: "active",
          tel: "0475-52-2240",
          updatedAt: "2021-01-17T07:06:19.999Z",
          zip: "〒283-0063",
          _id: "6003e1ec724e6b1fcf5fb3f5",
        },
        {
          address1: "八千代市高津678-2",
          address2: "グリーンハイランドⅠ",
          createdAt: "1970-01-01T00:00:00.000Z",
          customers: "takatsu",
          fax: "047-459-3803",
          fullName: "読売センターゆりのき高津",
          name: "食品",
          old_id: "fNhboDabBd0pw0tlO9n8",
          person: "所長 館坂 民和",
          status: "active",
          tel: "047-459-0084",
          updatedAt: "2021-01-17T07:06:19.999Z",
          zip: "〒276-0036",
          _id: "6003e1ec724e6b1fcf5fb3f6",
        },
      ],
    },
  }
}
