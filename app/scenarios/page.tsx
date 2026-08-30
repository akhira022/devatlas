import type { Metadata } from "next";

import { ScenarioPreview } from "@/components/home/scenario-preview";

export const metadata: Metadata = {
  title: "Scenarios",
  description: "End-to-end technology flow scenarios",
};

export default function ScenariosPage() {
  return (
    <div className="py-10">
      <div className="container mb-4 px-4">
        <h1 className="text-3xl font-bold">What Happens When?</h1>
        <p className="mt-2 text-muted-foreground">
          Follow complete technology flows from start to finish
        </p>
      </div>
      <ScenarioPreview />
    </div>
  );
}
