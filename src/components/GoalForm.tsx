import React, { useCallback, useEffect, useState } from "react";
import { Goal, SubGoal, Task } from "@/types/models";
import { Button } from "./UI/Button";
import { Dialog, DialogTitle } from "@radix-ui/react-dialog";
import { DialogContent, DialogHeader } from "./UI/dialog";
import { Trash, X } from "lucide-react";
type ButtonVariant =
  | "default"
  | "outline"
  | "secondary"
  | "ghost"
  | "link"
  | "destructive";

interface GoalFormProps {
  onSave: (goal: Goal) => void;
  initialData?: Goal;
  addEditText: string;
  className?: string;
  variant?: ButtonVariant;
}

const GoalForm: React.FC<GoalFormProps> = ({
  onSave,
  initialData,
  addEditText,
  className,
  variant = "default",
}) => {
  const [title, setTitle] = useState(initialData?.title || "");
  const [subGoals, setSubGoals] = useState<SubGoal[]>(
    initialData?.sub_goals || []
  );
  const [subGoalTitle, setSubGoalTitle] = useState("");
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);

  const resetForm = useCallback(() => {
    setTitle(initialData?.title || "");
    setSubGoals(initialData?.sub_goals || []);
    setSubGoalTitle("");
    setError("");
  }, [initialData]);
  
  // Sync/reset form state when initialData changes (for edit/add)
  useEffect(() => {
    if (addEditText !== "Edit") {
      resetForm();
    }
  
    setTitle(initialData?.title || "");
    setSubGoals(initialData?.sub_goals || []);
    setSubGoalTitle("");
    setError("");
  }, [initialData, addEditText, resetForm]);

  //  Add SubGoal
  const handleAddSubGoal = () => {
    if (!subGoalTitle.trim()) {
      setError("Subgoal title cannot be empty");
      return;
    }
    setSubGoals([
      ...subGoals,
      {
        id: `subgoal_${Date.now()}`,
        main_goal_id: initialData?.id || `goal_${Date.now()}`,
        title: subGoalTitle,
        sort_order: subGoals.length,
        tasks: [],
      },
    ]);
    setSubGoalTitle("");
    setError("");
  };

  // Remove SubGoal
  const handleRemoveSubGoal = (subGoalId: string) => {
    setSubGoals(subGoals.filter((sg) => sg.id !== subGoalId));
  };

  // Add Task to SubGoal
  const handleAddTask = (subGoalId: string) => {
    setSubGoals(
      subGoals.map((sg) =>
        sg.id === subGoalId
          ? {
              ...sg,
              tasks: [
                ...sg.tasks,
                {
                  id: `task_${Date.now()}`,
                  sub_goal_id: subGoalId,
                  text: "",
                  is_done: false,
                  due_date: "",
                },
              ],
            }
          : sg
      )
    );
  };

  // Remove Task
  const handleRemoveTask = (subGoalId: string, taskId: string) => {
    setSubGoals(
      subGoals.map((sg) =>
        sg.id === subGoalId
          ? { ...sg, tasks: sg.tasks.filter((t) => t.id !== taskId) }
          : sg
      )
    );
  };

  // Update Task Field
  const handleTaskChange = (
    subGoalId: string,
    taskId: string,
    field: keyof Task,
    value: string | boolean
  ) => {
    setSubGoals(
      subGoals.map((sg) =>
        sg.id === subGoalId
          ? {
              ...sg,
              tasks: sg.tasks.map((t) =>
                t.id === taskId ? { ...t, [field]: value } : t
              ),
            }
          : sg
      )
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Goal title is required");
      return;
    }
    if (subGoals.length === 0) {
      setError("Add at least one subgoal");
      return;
    }
    onSave({
      id: initialData?.id || `goal_${Date.now()}`,
      user_id: initialData?.user_id || "user_1",
      title,
      sub_goals: subGoals,
    });
    setOpen(false);
    resetForm();
  };

  return (
    <>
      <Button
        variant={variant}
        className={
          className
            ? className
            : "relative bg-gradient-to-r from-green-400 via-blue-400 to-pink-400 text-white font-bold px-4 py-2 rounded-full shadow-lg hover:scale-105 transition-all duration-200"
        }
        onClick={() => setOpen(true)}
      >
        {addEditText}
      </Button>
      <Dialog
        open={open}
        onOpenChange={(open) => {
          setOpen(open);
          if (!open) resetForm();
        }}
      >
        <DialogContent className="sm:max-w-[700px] max-h-[600px] overflow-auto scroll-auto bg-gradient-to-br from-white via-blue-50 to-pink-50 rounded-2xl shadow-2xl p-6 border border-blue-200">
          <DialogHeader>
            <DialogTitle className="text-xl font-extrabold bg-gradient-to-r from-green-600 via-blue-500 to-pink-500 bg-clip-text text-transparent">
              Add/Edit Goal
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                className="w-full p-2 border rounded mb-2"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Goal Title"
                required
              />
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <label className="font-semibold">Subgoals</label>
              <div className="flex gap-2 my-2">
                <input
                  className="flex-1 p-2 border rounded"
                  value={subGoalTitle}
                  onChange={(e) => setSubGoalTitle(e.target.value)}
                  placeholder="New Subgoal Title"
                />
                <button
                  type="button"
                  className="px-3 py-1 bg-blue-500 text-white rounded"
                  onClick={handleAddSubGoal}
                >
                  + Add Subgoal
                </button>
              </div>
              <div className="space-y-2">
                {subGoals.map((subGoal) => (
                  <div key={subGoal.id} className="border p-3 rounded bg-white">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium">{subGoal.title}</span>
                      <button
                        type="button"
                        className="text-red-500 hover:underline"
                        onClick={() => handleRemoveSubGoal(subGoal.id)}
                      >
                        <Trash size={20} color="#f52424" />
                      </button>
                    </div>
                    <div className="ml-4">
                      <label className="block mb-1 font-semibold">Tasks</label>
                      {subGoal?.tasks?.map((task, tIdx) => (
                        <div
                          key={task.id}
                          className="flex gap-2 items-center mb-2"
                        >
                          <input
                            className="p-1 border rounded flex-1"
                            value={task.text}
                            onChange={(e) =>
                              handleTaskChange(
                                subGoal.id,
                                task.id,
                                "text",
                                e.target.value
                              )
                            }
                            placeholder={`Task ${tIdx + 1}`}
                            required
                          />
                          <input
                            type="date"
                            className="p-1 border rounded"
                            value={task.due_date || ""}
                            onChange={(e) =>
                              handleTaskChange(
                                subGoal.id,
                                task.id,
                                "due_date",
                                e.target.value
                              )
                            }
                            required
                          />
                          <button
                            type="button"
                            className="text-red-400 hover:underline"
                            onClick={() =>
                              handleRemoveTask(subGoal.id, task.id)
                            }
                          >
                            <X />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        className="text-blue-600 hover:underline text-sm mt-1"
                        onClick={() => handleAddTask(subGoal.id)}
                      >
                        + Add Task
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >
              {initialData ? "Update Goal" : "Add Goal"}
            </button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GoalForm;
