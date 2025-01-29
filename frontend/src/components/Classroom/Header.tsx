import { NavLink, useParams } from "react-router-dom";
import { Copy } from "lucide-react/icons";

const Header = () => {
  const { roomId } = useParams();
  return (
    <header className="bg-amber-200 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <NavLink to={"/"}>
          <h1 className="text-3xl font-bold text-orange-800 font-mono">
            ClassRoom
          </h1>
        </NavLink>
        <div
          className="flex items-center space-x-4 cursor-pointer"
          onClick={() => navigator.clipboard.writeText(roomId!)}
        >
          Room:
          <span className="text-orange-800 font-mono ml-2 font-bold truncate max-w-36">
            {roomId}
          </span>
          <Copy size={20} className="text-orange-800 font-bold" />
        </div>
      </div>
    </header>
  );
};

export default Header;
