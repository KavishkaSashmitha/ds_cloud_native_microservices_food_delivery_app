import Link from "next/link"
import Image from "next/image"
import { Menu, Table, CalendarClock, Truck, Calculator, Settings, LogOut } from "lucide-react"

const Sidebar = () => {
  return (
    <div className="w-64 h-full bg-white border border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200 flex items-center gap-2">
        <div className="w-8 h-8 bg-gray-200 flex items-center justify-center rounded">
          <Image src="/placeholder.svg?height=32&width=32" alt="CHILI POS" width={32} height={32} />
        </div>
        <h1 className="text-xl font-bold">CHILIIII</h1>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-6">
          <li>
            <Link href="/" className="flex items-center gap-3 text-green-600 font-medium">
              <Menu className="w-5 h-5" />
              <span>Menu</span>
            </Link>
          </li>
          <li>
            <Link href="/table-services" className="flex items-center gap-3 text-gray-600 hover:text-green-600">
              <Table className="w-5 h-5" />
              <span>Table Services</span>
            </Link>
          </li>
          <li>
            <Link href="/reservation" className="flex items-center gap-3 text-gray-600 hover:text-green-600">
              <CalendarClock className="w-5 h-5" />
              <span>Reservation</span>
            </Link>
          </li>
          <li>
            <Link href="/delivery" className="flex items-center gap-3 text-gray-600 hover:text-green-600">
              <Truck className="w-5 h-5" />
              <span>Delivery</span>
            </Link>
          </li>
          <li>
            <Link href="/accounting" className="flex items-center gap-3 text-gray-600 hover:text-green-600">
              <Calculator className="w-5 h-5" />
              <span>Accounting</span>
            </Link>
          </li>
          <li>
            <Link href="/settings" className="flex items-center gap-3 text-gray-600 hover:text-green-600">
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </Link>
          </li>
          <li>
            <Link href="/add-restaurant" className="flex items-center gap-3 text-gray-600 hover:text-green-600">
              <Settings className="w-5 h-5" />
              <span>Add Restaurant</span>
            </Link>
          </li>
          <li>
            <Link href="/add-menu" className="flex items-center gap-3 text-gray-600 hover:text-green-600">
              <Settings className="w-5 h-5" />
              <span>Add Menu</span>
            </Link>
          </li>
          <li>
            <Link href="/restaurants" className="flex items-center gap-3 text-gray-600 hover:text-green-600">
              <Settings className="w-5 h-5" />
              <span>Restaurants</span>
            </Link>
          </li>
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <Link href="/logout" className="flex items-center gap-3 text-gray-600 hover:text-red-600">
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </Link>
      </div>
    </div>
  )
}

export default Sidebar
