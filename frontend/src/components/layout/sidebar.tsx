import { Button } from "../ui/button";
import { ModeToggle } from "../ui/mode-toggle";

export default function Sidebar() {
  return (
    <nav className="flex justify-center items-center border-b">
      <div className="w-[90%] flex justify-between py-4">
        <div className="text-3xl sm:text-4xl font-semibold">LoGo</div>
        <div className="flex gap-4 justify-center items-center">
          <Button className="text-1xl">Login</Button>
          <ModeToggle />
        </div>
      </div>
    </nav>
  );
}
