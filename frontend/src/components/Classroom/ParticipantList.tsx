import useRoom from "@/hooks/useRoom";
import UserCubicle from "./UserCubicle";

const ParticipantList = () => {
  const data = useRoom((state) => state?.data);

  return (
    <div className="bg-amber-100 border-2 border-orange-800 rounded-lg p-4">
      <h2 className="text-2xl font-bold text-orange-800 mb-4 font-serif">
        Participants
      </h2>
      <div className="grid grid-cols-2 gap-4">
        {data?.members.map(({ id, name }) => (
          <UserCubicle key={id} name={name} isTeacher={data.hostId === id} />
        ))}
      </div>
    </div>
  );
};

export default ParticipantList;
