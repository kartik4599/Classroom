import { cn } from "@/lib/utils";
import { User } from "lucide-react";

interface UserCubicleProps {
  name: string;
  isTeacher: boolean;
  isMe: boolean;
}

const UserCubicle = ({ name, isTeacher, isMe }: UserCubicleProps) => {
  return (
    <div className="bg-[#73bda8]/40 border-2 border-[#73bda8] rounded-lg p-4 shadow-md">
      <div className="bg-amber-100 border-2 border-[#73bda8] rounded-t-lg p-2 mb-2">
        <User className="text-orange-800 mx-auto" size={32} />
      </div>
      <div className="text-center">
        <span className={cn("font-mono text-sm", isTeacher && "font-bold")}>
          {name}
        </span>
        {isTeacher && (
          <div className="mt-1">
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-mono">
              Host
            </span>
          </div>
        )}
        {isMe && (
          <div className="mt-1">
            <span className="bg-[#73bda8] text-white text-xs px-4 py-1 rounded-full font-mono">
              Me
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserCubicle;
