import { useState } from "react"
import Notification from "../components/Notification"
import DropzoneInput from "../components/DropzoneInput"
import SidebarDesktop from "../components/SidebarDesktop"
import SidebarMobile from "../components/SidebarMobile"
import DeptForm from "../components/DeptForm"
import Aggregate from "../components/Aggregate"
import Archived from "../components/Archived"
import CsvUpload from "../components/CsvUpload"

import initializeBasicAuth from "nextjs-basic-auth"
const users = [
  { user: process.env.USER, password: process.env.PASSWORD },
  { user: "ycs", password: "1q2w3e4r" },
]
const basicAuthCheck = initializeBasicAuth({
  users: users,
})

const Map = {
  // content: Content,
  // customers: Customers,
  // wip: Wip,
  // csv: DropzoneInput,
  depts: DeptForm,
  aggregate: Aggregate,
  products: Archived,
  csv: CsvUpload,
}

export default function Setting({ data }) {
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

export async function getServerSideProps(ctx) {
  const { req, res } = ctx

  const url = "https://ycs-ec-next.vercel.app/api/depts"
  const r = await fetch(url)
  const d = await r.json()

  if (!d) {
    return {
      notFound: true,
    }
  }

  await basicAuthCheck(req, res)

  return {
    props: {
      data: JSON.parse(JSON.stringify(d)),
    },
  }
}
