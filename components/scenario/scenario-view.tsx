"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import {
  ScenarioConceptChips,
  ScenarioSteps,
} from "@/components/scenario/scenario-steps";
import { FlowPlayer } from "@/components/visualization/flow-player";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Scenario } from "@/types/scenario";
import type { Visualization } from "@/types/visualization";

interface ScenarioViewProps {
  scenario: Scenario;
  visualization: Visualization;
}

export function ScenarioView({ scenario, visualization }: ScenarioViewProps) {
  const [currentStep, setCurrentStep] = useState(0);

  return (
    <div className="container max-w-4xl px-4 py-10">
      <Button variant="ghost" size="sm" className="mb-4" render={<Link href="/scenarios" />}>
        <ArrowLeft className="size-4" />
        All Scenarios
      </Button>

      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold">{scenario.title}</h1>
          <p className="prose-content mt-2">{scenario.description}</p>
        </div>

        <Badge className="capitalize">{scenario.difficulty}</Badge>

        <div>
          <p className="mb-2 text-sm text-muted-foreground">Concepts involved:</p>
          <ScenarioConceptChips scenario={scenario} />
        </div>
      </div>

      <div className="mt-8">
        <FlowPlayer
          visualization={visualization}
          externalStep={Math.min(currentStep, visualization.steps.length - 1)}
          onStepChange={setCurrentStep}
        />
      </div>

      <div className="mt-8">
        <ScenarioSteps
          steps={scenario.steps}
          currentStep={currentStep}
          onStepClick={setCurrentStep}
        />
      </div>
    </div>
  );
}
