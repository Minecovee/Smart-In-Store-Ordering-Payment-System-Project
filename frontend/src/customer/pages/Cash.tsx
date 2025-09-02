import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

export default function CustomerIndex() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Header />

      <div className="flex flex-1 ">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 p-4 bg-black">
          


        </main>
      </div>
    </div>
  );
}
