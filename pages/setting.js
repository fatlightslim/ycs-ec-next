import axios from "axios"
import { useState, useEffect } from "react"
import Notification from "../components/Notification"
// import Content from "../components/Content"
// import Customers from "../components/Customers"
// import Wip from "../components/Wip"
import DropzoneInput from "../components/DropzoneInput"
import SidebarDesktop from "../components/SidebarDesktop"
import SidebarMobile from "../components/SidebarMobile"
import DeptForm from "../components/DeptForm"
import Aggregate from "../components/Aggregate"
import Archived from "../components/Archived"

const Map = {
  // content: Content,
  // customers: Customers,
  // wip: Wip,
  csv: DropzoneInput,
  depts: DeptForm,
  aggregate: Aggregate,
  products: Archived
  
}

export default function Setting({data}) {
  const [depts, setDepts] = useState(data)
  const [currentDept, setCurrentDept] = useState(data[0])
  const [updated, setUpdated] = useState(false)
  const [current, setCurrent] = useState("depts")
  const [form, setForm] = useState({ method: "PATCH", url: "/api/depts" })

  // useEffect(() => {
  //   axios.get("/api/depts").then((r) => {
  //     setDepts(r.data)
  //     setCurrentDept(r.data[0])
  //   })
  // }, [])

  const props = {
    setCurrentDept,
    currentDept,
    updated,
    setUpdated,
    current,
    setCurrent,
    depts,
    setDepts,
    form,
    setForm,
  }

  let Tagname = Map[current]
  return !depts || !currentDept ? null : (
    <div className="h-screen bg-white overflow-hidden flex">
      <SidebarMobile {...props} />
      <SidebarDesktop {...props} />
      <main
        className="flex-1 relative z-0 overflow-y-auto focus:outline-none"
        tabIndex={0}
      >
        <div className="">
          <div className="max-w-7xl mx-auto">
            <div className="">
              <Tagname {...props} />
            </div>
          </div>
        </div>
      </main>
      <Notification updated={updated} />
    </div>
  )
}

// export async function getStaticProps() {
//   return axios.get("http://localhost:3000/api/customers").then((res) => {
//     return {
//       props: {
//         customers: res.data,
//       },
//     };
//   });
// }

export async function getStaticProps() {
  // const res = await fetch(`http://localhost:3000/api/depts`)
  // const depts = await res.json()

  // if (!depts) {
  //   return {
  //     notFound: true,
  //   }
  // }

  return {
    // props: { data: depts }, // will be passed to the page component as props
    props: {
      data: [
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
    }
  }
}
