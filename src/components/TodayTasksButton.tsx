"use client";
import React, { useState } from "react";
import { Button } from "@/components/UI/Button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/UI/dialog";
import { Task } from "@/types/models";

interface TodayTasksButtonProps {
  tasks: Task[];
  showDueDate?: boolean;
  goalTitle?: string;
}

const TodayTasksButton: React.FC<TodayTasksButtonProps> = ({ tasks, showDueDate = true, goalTitle }) => {
  const [open, setOpen] = useState(false);
  const today = new Date().toISOString().split("T")[0];
  const todayTasks = tasks.filter((task) => task.due_date === today && !task.is_done);

  return (
    <>
      <Button
        className="relative bg-gradient-to-r from-green-400 via-blue-400 to-pink-400 text-white font-bold px-4 py-2 rounded-full shadow-lg hover:scale-105 transition-all duration-200"
        onClick={() => setOpen(true)}
      >
        Today&apos;s Tasks
        <span className="ml-2 bg-white text-green-700 font-bold px-2 py-0.5 rounded-full text-xs shadow border border-green-300">
          {todayTasks.length}
        </span>
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[400px] bg-gradient-to-br from-white via-blue-50 to-pink-50 rounded-2xl shadow-2xl p-6 border border-blue-200">
          <DialogHeader>
            <DialogTitle className="text-xl font-extrabold bg-gradient-to-r from-green-600 via-blue-500 to-pink-500 bg-clip-text text-transparent">
              {goalTitle ? `Today's Tasks for ${goalTitle}` : "Today's Tasks"}
            </DialogTitle>
          </DialogHeader>
          {todayTasks.length === 0 ? (
            <div className="text-gray-500 py-4 text-center">No tasks for today! 🎉</div>
          ) : (
            <ul className="space-y-3 mt-4">
              {todayTasks.map((task) => (
                <li key={task.id} className="flex items-center gap-3 p-2 rounded-lg bg-green-50">
                  <span className="font-medium text-gray-800">{task.text}</span>
                  {showDueDate && (
                    <span className="text-xs text-gray-500 ml-auto">{task.due_date}</span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TodayTasksButton;
