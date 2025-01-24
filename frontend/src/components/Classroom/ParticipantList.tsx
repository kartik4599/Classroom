import UserCubicle from "./UserCubicle";

const participants = [
  { id: 1, name: "Teacher", isTeacher: true },
  { id: 2, name: "Alice", isTeacher: false },
  { id: 3, name: "Bob", isTeacher: false },
  { id: 4, name: "Charlie", isTeacher: false },
];
const ParticipantList = () => {
  return (
    <div className="bg-amber-100 border-2 border-orange-800 rounded-lg p-4">
      <h2 className="text-2xl font-bold text-orange-800 mb-4 font-serif">
        Participants
      </h2>
      <div className="grid grid-cols-2 gap-4">
        {participants.map((participant) => (
          <UserCubicle
            key={participant.id}
            name={participant.name}
            isTeacher={participant.isTeacher}
          />
        ))}
      </div>
    </div>
  );
};

export default ParticipantList;
