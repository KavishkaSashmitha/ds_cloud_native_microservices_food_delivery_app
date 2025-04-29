import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function UnsuccessPage() {
    return (
      <div className="p-6 text-center">

<div className="mb-6">
                <Link href="/customer/dashboard" className="mb-4 flex items-center text-gray-600 hover:text-orange-500">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Continue Shopping
                </Link>
                
        </div>

        <h1 className="text-2xl font-bold text-green-600">Payment Unsuccessful !!</h1>
        <p className="mt-4 text-gray-700">Try Again !</p>
      </div>
    )
  }