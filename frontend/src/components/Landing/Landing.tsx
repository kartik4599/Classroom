import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

const Landing = () => {
  return (
    <div className="min-h-screen bg-amber-50 flex items-center justify-center p-4 retro-scanlines">
      <div className="w-full max-w-md bg-[#ece6c2]/50 border-4 border-[#6f5643] rounded-lg shadow-lg p-6 space-y-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20"></div>
        <h1 className="text-4xl font-bold text-center text-[#6f5643] font-retro retro-glow relative z-10">
          Retro Meet
        </h1>

        <div className="space-y-4 relative z-10">
          <Input
            type="text"
            placeholder="Enter your name"
            // value={username}
            // onChange={(e) => setUsername(e.target.value)}
            className="border-[#cc6b49] focus-visible:ring-0 text-[#cc6b49] placeholder-[#cc6b49]"
          />

          <Tabs defaultValue="create" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-[#6f5643]/80">
              <TabsTrigger
                value="create"
                className="text-gray-100 data-[state=active]:bg-[#cc6b49] data-[state=active]:text-gray-100"
              >
                Create Room
              </TabsTrigger>
              <TabsTrigger
                value="join"
                className="text-gray-100 data-[state=active]:bg-[#cc6b49] data-[state=active]:text-gray-100"
              >
                Join Room
              </TabsTrigger>
            </TabsList>
            <TabsContent value="create">
              <Button
                className="w-full bg-[#cc6b49]/90 hover:bg-[#cc6b49] text-gray-100 font-bold font-retro"
                // onClick={handleCreateRoom}
                // disabled={!username}
              >
                Create Room
              </Button>
            </TabsContent>
            <TabsContent value="join">
              <div className="space-y-4">
                <Input
                  type="text"
                  placeholder="Enter room number"
                  //   value={roomNumber}
                  //   onChange={(e) => setRoomNumber(e.target.value)}
                  className="border-[#cc6b49] focus-visible:ring-0 text-[#cc6b49] placeholder-[#cc6b49]"
                />
                <Button
                  className="w-full bg-[#cc6b49]/90 hover:bg-[#cc6b49] text-gray-100 font-bold font-retro"
                  //   onClick={handleJoinRoom}
                  //   disabled={!username || !roomNumber}
                >
                  Join Room
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Landing;
