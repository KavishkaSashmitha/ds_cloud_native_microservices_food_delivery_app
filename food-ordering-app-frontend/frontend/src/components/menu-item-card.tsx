import { Minus, Plus } from "lucide-react";
import Image from "next/image";

interface MenuItemCardProps {
  name: string;
  price: number;
  image: string;
  isVeg: boolean;
  discount?: number;
  quantity?: number;
}

const MenuItemCard = ({
  name,
  price,
  image,
  isVeg,
  discount = 0,
  quantity = 1,
}: MenuItemCardProps) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200">
      <div className="relative">
        {discount > 0 && (
          <div className="absolute top-2 left-2 bg-yellow-400 text-black font-medium px-2 py-1 rounded-md text-sm">
            {discount}% Off
          </div>
        )}
        <Image
          src={image || "/placeholder.svg"}
          alt={name}
          width={400}
          height={250}
          className="w-full h-40 object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="font-medium text-lg">{name}</h3>
        <div className="flex justify-between items-center mt-2">
          <div className="text-xl font-semibold text-green-600">
            ${price.toFixed(2)}
          </div>
          <div className="flex items-center">
            <span
              className={`inline-block w-2 h-2 rounded-full mr-1 ${
                isVeg ? "bg-green-500" : "bg-red-500"
              }`}
            ></span>
            <span className="text-sm text-gray-500">
              {isVeg ? "Veg" : "Non Veg"}
            </span>
          </div>
        </div>
        <div className="flex justify-between items-center mt-4">
          <button className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center">
            <Minus className="w-4 h-4" />
          </button>
          <span className="font-medium">{quantity}</span>
          <button className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center">
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuItemCard;
