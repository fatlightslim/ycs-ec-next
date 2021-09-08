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

import initializeBasicAuth from "nextjs-basic-auth"

const users = [
  { user: process.env.USER, password: process.env.PASSWORD },
  { user: "ycs", password: "1q2w3e4r" },
]
const basicAuthCheck = initializeBasicAuth({
  users: users,
})

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
  const [checkedData, setCheckedData] = useState([])
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
    checkedData,
    setCheckedData,
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

export async function getServerSideProps(ctx) {
  const { req, res } = ctx

  const url = "https://ycs-ec-next.vercel.app/api/depts"
  const r = await fetch(url)
  const data = await r.json()

  if (!data) {
    return {
      notFound: true,
    }
  }

  await basicAuthCheck(req, res)

  return {
    props: {
      depts: JSON.parse(JSON.stringify(data)),
    },
  }
}

// export async function getStaticProps() {
//   // const { data, error } = useSWR(`/api/depts`)
//   // if (error) return <div>failed to load</div>
//   // if (!data) return <div>loading...</div>
//   const url = "https://ycs-ec-next.vercel.app/api/depts"
//   const res = await fetch(url)
//   const data = await res.json()

//   if (!data) {
//     return {
//       notFound: true,
//     }
//   }

//   return {
//     props: {
//       depts: JSON.parse(JSON.stringify(data)),
//     },
//   }
// }
