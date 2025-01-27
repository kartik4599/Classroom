const Header = () => {
  return (
    <header className="bg-amber-200 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-3xl font-bold text-orange-800 font-mono">
          ClassRoom
        </h1>
        <div className="flex items-center space-x-4">
          <span className="text-orange-800 font-mono">Room: ABC123</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
