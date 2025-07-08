'use client'
import { Button } from "@/components/UI/Button";
import { getGoalsbyId } from "@/lib/goalsApi";
import {  Goal, SubGoal, Task } from "@/types/models";
import Link from "next/link";
import TodayTasksButton from "@/components/TodayTasksButton";
import React, { useEffect, useState } from "react";


const GoalDetails =  ({ goalId }: { goalId: string }) => {
  const [goal, setGoal] = useState<Goal | undefined>(undefined);
  const localKey = `goal_${goalId}`;

  useEffect(() => {
    function fetchGoal() {
      // Try to get from all_goals array (single source of truth)
      const allGoalsRaw = localStorage.getItem("all_goals");
      let goalObj = null;
      if (allGoalsRaw) {
        try {
          const allGoals = JSON.parse(allGoalsRaw);
          goalObj = allGoals.find((g: Goal) => g.id === goalId);
        } catch {
          goalObj = null;
        }
      }
      if (goalObj) {
        setGoal(goalObj);
        // Also update per-goal key for backward compatibility
        localStorage.setItem(localKey, JSON.stringify(goalObj));
      } else {
        // fallback to per-goal key
        const saved = localStorage.getItem(localKey);
        if (saved) {
          setGoal(JSON.parse(saved));
        } else {
          // fallback to API
          getGoalsbyId(goalId as string).then((data) => {
            setGoal(data);
            localStorage.setItem(localKey, JSON.stringify(data));
          });
        }
      }
    }
    fetchGoal();
  }, [goalId,localKey]);

  // Utility to update both localStorage per-goal and all_goals array
  const updateGoal = (updatedGoal: Goal, goalIdOverride?: string) => {
    setGoal(updatedGoal);
    const key = goalIdOverride ? `goal_${goalIdOverride}` : localKey;
    // Update per-goal key using always up-to-date id
    localStorage.setItem(key, JSON.stringify(updatedGoal));
    // Update all_goals array
    const allGoalsRaw = localStorage.getItem("all_goals");
    let allGoals: Goal[] = [];
    if (allGoalsRaw) {
      try {
        allGoals = JSON.parse(allGoalsRaw);
      } catch {
        allGoals = [];
      }
    }
    const idx = allGoals?.findIndex((g) => g.id === updatedGoal.id);
    if (idx !== -1) {
      allGoals[idx] = updatedGoal;
    } else {
      allGoals.push(updatedGoal);
    }
    localStorage.setItem("all_goals", JSON.stringify(allGoals));
  };

  // Example: toggling a task
  const toggleTask = (subGoalId: string, taskId: string) => {
    if (!goal) return;
    const updatedGoal = {
      ...goal,
      sub_goals: goal?.sub_goals?.map((sub: SubGoal) =>
        sub.id === subGoalId
          ? {
              ...sub,
              tasks: sub.tasks.map((task: Task) =>
                task.id === taskId ? { ...task, is_done: !task.is_done } : task
              ),
            }
          : sub
      ),
    };
    updateGoal(updatedGoal, updatedGoal.id);
  };

  // Example: use updateGoal(updatedGoal) for any other edits/adds/deletes to this goal


  if (!goal) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 py-8 px-2 md:px-0">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="flex justify-between items-center mb-6 px-2 md:px-0 gap-4 flex-wrap">
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow">{goal.title}</h1>
          <div className="flex gap-3 items-center">
            {/* Today's Tasks Button for this goal */}
            {/* Import at top: import TodayTasksButton from "@/components/TodayTasksButton"; */}
            <TodayTasksButton
              tasks={goal?.sub_goals?.flatMap?.((sg:SubGoal) => sg.tasks) || []}
              showDueDate={true}
              goalTitle={goal?.title}
            />
            <Link href={`/customise/${goalId}`}>
              <Button className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white px-4 py-2 rounded-lg shadow hover:scale-105 transition-all font-semibold" type="button">
                Customise
              </Button>
            </Link>
          </div>
        </div>
        {/* Overall Progress Bar */}
        {(() => {
          const allTasks = goal?.sub_goals?.flatMap((sub: SubGoal) => sub.tasks);
          const total = allTasks.length;
          const completed = allTasks.filter((task: Task) => task.is_done).length;
          const percent = total === 0 ? 0 : (completed / total) * 100;
          return (
            <div className="mb-6 px-2 md:px-0">
              <div className="h-4 bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 rounded-full overflow-hidden shadow-inner">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-700 shadow-lg"
                  style={{ width: `${percent}%` }}
                />
              </div>
              <p className="text-sm text-blue-900 mt-2 font-medium text-center">
                {completed} of {total} tasks completed
              </p>
            </div>
          );
        })()}
        {/* Subgoals */}
        <div className="space-y-6">
          {goal?.sub_goals?.map((sub: SubGoal) => {
            const totalTasks = sub.tasks.length;
            const completedTask = sub.tasks.filter((task) => task.is_done).length;
            const progressPercent =
              totalTasks === 0 ? 0 : (completedTask / totalTasks) * 100;
            return (
              <div
                key={sub.id}
                className="border-2 border-blue-200 bg-gradient-to-r from-white via-blue-50 to-pink-50 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all"
              >
                <h2 className="font-bold text-lg mb-3 bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  {sub.title}
                </h2>
                <div className="mb-3">
                  <div className="h-3 bg-gradient-to-r from-green-200 to-green-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-400 via-green-500 to-green-600 transition-all duration-500 shadow"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <p className="text-xs text-green-800 mt-1 font-semibold text-right">
                    {completedTask} of {totalTasks} tasks done
                  </p>
                </div>
                <ul className="space-y-2">
                  {sub.tasks.map((task: Task) => (
                    <li
                      className={`flex items-center gap-3 p-2 rounded-lg ${task.is_done ? 'bg-green-50' : 'bg-white'} hover:bg-blue-50 transition-all`}
                      key={task.id}
                    >
                      <input
                        type="checkbox"
                        checked={task.is_done}
                        onChange={() => toggleTask(sub.id, task.id)}
                        className="accent-green-500 w-5 h-5 rounded shadow"
                      />
                      <span
                        className={task.is_done ? "line-through text-gray-400 font-medium" : "text-gray-800 font-medium"}
                      >
                        {task.text}
                      </span>
                      <span
                        className={task.is_done ? "line-through text-gray-400 text-xs" : "text-gray-500 text-xs"}
                      >
                        {task.due_date}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default GoalDetails;
