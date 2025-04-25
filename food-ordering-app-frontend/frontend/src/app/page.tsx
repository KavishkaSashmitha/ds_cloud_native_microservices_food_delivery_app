import OrderForm from "@/components/order-form"
import { Navigation } from "@/components/navigation"

export default function Home() {
  return (
    <>
      <Navigation />
    {/* <main className="min-h-screen bg-orange-50 py-10"> */}
      <div className="container mx-auto px-4">
        {/* <h1 className="mb-8 text-center text-3xl font-bold text-orange-800">Food Order</h1> */}
        <OrderForm />
      </div>
      </>
    // </main>
  )
}
