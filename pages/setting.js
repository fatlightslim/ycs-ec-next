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
  const url = 'https://ycs-ec-next.vercel.app/api/depts'
  const res = await fetch(url)
  const depts = await res.json()

  if (!depts) {
    return {
      notFound: true,
    }
  }

  return {
    props: { data: depts }, // will be passed to the page component as props
  }
}
