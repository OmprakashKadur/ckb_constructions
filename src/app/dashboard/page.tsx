"use client";

import React, { useEffect, useState } from "react";
import TodayTasksButton from "@/components/TodayTasksButton";
import { allGoals as mockGoals } from "@/mock/goals";
import { Goal } from "@/types/models";
import { Button } from "@/components/UI/Button";
import GoalForm from "@/components/GoalForm";


const Dashboard = () => {
  const LOCAL_KEY = "all_goals";
  const [goals, setGoals] = useState<Goal[]>([]);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

  useEffect(() => {
    const savedGoals = localStorage.getItem(LOCAL_KEY);
    if (savedGoals) {
      setGoals(JSON.parse(savedGoals));
    } else {
      setGoals(mockGoals);
      localStorage.setItem(LOCAL_KEY, JSON.stringify(mockGoals));
    }
  }, []);

  const handleSaveGoal = (goal: Goal) => {
    let updated: Goal[];
    if (editingGoal) {
      updated = goals.map((g) => (g.id === editingGoal.id ? goal : g));
    } else {
      updated = [...goals, goal];
    }
    setGoals(updated);
    localStorage.setItem(LOCAL_KEY, JSON.stringify(updated));
    setEditingGoal(null);
  };

  return (
    <div className=" max-w-4xl min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 p-0 md:p-8">
      <div className="flex justify-between items-center mb-8 px-4 md:px-0 gap-4 flex-wrap">
        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow">
          🎯 Your Goals
        </h1>
        <div className="flex gap-3 items-center">
          <TodayTasksButton
            tasks={goals.flatMap(
              (g) => g.sub_goals?.flatMap?.((sg) => sg.tasks) || []
            )}
            showDueDate={true}
          />
          <GoalForm
            onSave={handleSaveGoal}
            initialData={editingGoal || undefined}
            addEditText=" + Add New Goal"
          />
        </div>
      </div>

      <ul className="space-y-6 min-h-[200px] px-4 md:px-0">
        {goals.length === 0 ? (
          <li className="text-center text-gray-400 py-10">
            No goals yet. Click &quot;+ Add New Goal&quot; to get started!
          </li>
        ) : (
          goals.map((goal) => (
            <li
              key={goal.id}
              className="flex items-center justify-between bg-gradient-to-r from-white via-blue-50 to-pink-50 rounded-xl p-6 shadow-lg border border-blue-100 hover:shadow-xl transition-all"
            >
              <a
                href={`/goals/${goal.id}`}
                className="text-xl font-bold text-blue-700 hover:underline flex-1"
                onClick={() => {
                  const perGoalKey = `goal_${goal.id}`;
                  const existing = localStorage.getItem(perGoalKey);
                  if (!existing) {
                    localStorage.setItem(perGoalKey, JSON.stringify(goal));
                  }
                }}
              >
                {goal.title}
              </a>
              <div className="flex gap-2 ml-4">
                <div    
                  onClick={() => {
                    setEditingGoal(goal);
                  }}
                >
                  <GoalForm
                    variant="outline"
                    className="px-4 py-1 border-blue-400 text-blue-700 hover:bg-blue-100 hover:text-blue-900 font-semibold rounded-full shadow-sm"
                    onSave={handleSaveGoal}
                    initialData={editingGoal || undefined}
                    addEditText=" Edit"
                  />
                </div>
             
                <Button
                  variant="destructive"
                  className="px-4 py-1 rounded-full shadow-sm"
                  onClick={() => {
                    const updated = goals.filter((g) => g.id !== goal.id);
                    setGoals(updated);
                    localStorage.setItem(LOCAL_KEY, JSON.stringify(updated));
                  }}
                >
                  Delete
                </Button>
              </div>
            </li>
          ))
        )}
      </ul>

      {/* <Dialog open={showGoalForm} onOpenChange={(open) => {
        setShowGoalForm(open);
        if (!open) setEditingGoal(null);
      }}>
        <DialogContent className="sm:max-w-[500px] bg-gradient-to-br from-white via-blue-50 to-pink-50 rounded-2xl shadow-2xl p-8 z-50 border border-blue-200">
          <DialogHeader>
            <DialogTitle className="text-2xl font-extrabold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              {editingGoal ? 'Edit Goal' : 'Add New Goal'}
            </DialogTitle>
            <DialogDescription className="mb-2 text-blue-900">
              {editingGoal ? 'Update your goal details below.' : 'Fill in the details for your new goal.'}
            </DialogDescription>
          </DialogHeader>

          <GoalForm
            onSave={handleSaveGoal}
            initialData={editingGoal || undefined}
          />

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" className="border-blue-400 text-blue-700 px-4 py-1 rounded-full shadow-sm">Cancel</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog> */}
    </div>
  );
};

export default Dashboard;
