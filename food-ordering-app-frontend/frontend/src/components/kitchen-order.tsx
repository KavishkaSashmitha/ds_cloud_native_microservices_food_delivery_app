interface KitchenOrderProps {
  id: string
  itemCount: number
  kitchen: string
  status: string
}

const KitchenOrder = ({ id, itemCount, kitchen, status }: KitchenOrderProps) => {
  return (
    <div className="flex items-center gap-4 bg-orange-50 p-3 rounded-lg">
      <div className="w-10 h-10 rounded-full bg-orange-400 flex items-center justify-center text-white font-medium">
        {id}
      </div>
      <div className="flex-1">
        <div className="font-medium">
          {itemCount} Items → {kitchen}
        </div>
        <div className="text-sm text-gray-500">{status}</div>
      </div>
    </div>
  )
}

export default KitchenOrder
