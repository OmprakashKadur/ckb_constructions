"use client";
import GoalCustomizer from "@/components/GoalCustomizer";
import { getGoalsbyId } from "@/lib/goalsApi";
import { Goal } from "@/types/models";
import { useParams } from "next/navigation";

import React, { useEffect, useState } from "react";

const CustomiseGoalPage = () => {
  const { goalId } = useParams() as { goalId: string };
  const [goal, setGoal] = useState<Goal | undefined>(undefined);
  const localKey = `goal_${goalId}`;

  useEffect(() => {
    const saved = localStorage.getItem(localKey);
    if (saved) {
      setGoal(JSON.parse(saved));
    } else {
      getGoalsbyId(goalId as string).then((data) => {
        setGoal(data);
        localStorage.setItem(localKey, JSON.stringify(data));
      });
    }
  }, [goalId, localKey]);

  return (
    <div className=" min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 py-8 px-2 md:px-0">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex justify-between items-center mb-6 px-2 md:px-0 gap-4 flex-wrap">
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow">
            🎨 Customise Goal
          </h1>
        </div>
        <div className="bg-white/80 rounded-2xl shadow-lg border border-blue-100 p-6">
          {goal && (
            <GoalCustomizer goal={goal} setGoal={setGoal} localKey={localKey} />
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomiseGoalPage;
