import ExcalidrawComponent from "../ExcalidrawComponent";
import { Button } from "../ui/button";
import Header from "./Header";
import ParticipantList from "./ParticipantList";

const Classroom = () => {
  return (
    <div className="min-h-screen bg-amber-50">
      <Header />
      <main className="container mx-auto py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <ExcalidrawComponent />
            <div className="flex justify-center space-x-4">
              <Button className="bg-green-600 hover:bg-green-700 text-white font-mono">
                Raise Hand
              </Button>
              <Button className="bg-red-600 hover:bg-red-700 text-white font-mono">
                Leave Class
              </Button>
            </div>
          </div>
          <div className="lg:col-span-1">
            <ParticipantList />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Classroom;
