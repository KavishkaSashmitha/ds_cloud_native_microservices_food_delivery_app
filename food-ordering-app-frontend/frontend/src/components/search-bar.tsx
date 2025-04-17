import { Search } from "lucide-react"

const SearchBar = () => {
  return (
    <div className="relative w-full max-w-xl">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Search className="w-5 h-5 text-gray-400" />
      </div>
      <input
        type="search"
        className="w-full p-3 pl-10 text-sm text-gray-900 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500"
        placeholder="Search Product here..."
      />
    </div>
  )
}

export default SearchBar
