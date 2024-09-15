import { ViewCard } from "@/components/view-card";
import { ScrollArea } from "@/components/ui/scroll-area";


export default function Component() {
  return (
    <div className="w-full flex justify-center items-center h-screen">
      <ScrollArea className="w-[500px] h-[850px] rounded-md border p-4">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="mb-4">
            <ViewCard />
          </div>
        ))}
      </ScrollArea>
    </div>
  );
}
