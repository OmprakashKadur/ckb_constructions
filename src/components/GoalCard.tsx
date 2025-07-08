import React from "react";
import { Goal } from "@/types/models";

const GoalCard = ({ goal }: { goal: Goal }) => {
  return (
    <div className="bg-white rounded-xl p-4 shadow hover:shadow-md transition">
      <h2 className="text-lg font-bold mb-2">{goal.title}</h2>
      <p className="text-sm text-gray-600 mb-2">
        {goal?.sub_goals?.length || 0} Subgoals •
        <span> {goal?.sub_goals?.reduce((sum, sg) => sum + (sg?.tasks?.length || 0), 0)} Tasks</span>
      </p>
      <div className="space-y-2">
        {goal?.sub_goals?.map((subGoal) => (
          <div key={subGoal.id} className="border rounded p-2 bg-gray-50">
            <div className="font-medium mb-1">{subGoal.title}</div>
            <ul className="ml-3 list-disc">
              {subGoal?.tasks?.length === 0 && (
                <li className="text-xs text-gray-400">No tasks</li>
              )}
              {subGoal?.tasks?.map((task) => (
                <li key={task.id} className="flex items-center gap-2 text-sm">
                  <span>{task.text}</span>
                  {task.due_date && (
                    <span className="text-xs text-gray-500 ml-2">(Due: {task.due_date})</span>
                  )}
                  {task.is_done && (
                    <span className="ml-1 text-green-500">✔</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GoalCard;
