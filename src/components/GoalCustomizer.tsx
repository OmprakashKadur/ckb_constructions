"use client";
import React, { useEffect, useState } from "react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
  DraggableProvided,
  DroppableProvided,
} from "@hello-pangea/dnd";
import { Goal, SubGoal  } from "@/types/models";
import { Button } from "./UI/Button";

interface GoalCustomizerProps {
  goal: Goal;
  setGoal: (goal: Goal) => void;
  localKey: string;
}

const GoalCustomizer = ({ goal, setGoal, localKey }: GoalCustomizerProps) => {
  const [subGoals, setSubGoals] = useState<SubGoal[]>(goal?.sub_goals || []);

  useEffect(() => {
    setSubGoals(goal?.sub_goals || []);
  }, [goal]);

  const applySortOrder = <T extends { sort_order?: number }>(items: T[]): T[] =>
    items.map((item, index) => ({
      ...item,
      sort_order: index + 1,
    }));

  const updateGoalSubGoals = (updated: SubGoal[]) => {
    const updatedGoal: Goal = { ...goal, sub_goals: updated };
    setGoal(updatedGoal);
    localStorage.setItem(localKey, JSON.stringify(updatedGoal));
  };

  const onDragEnd = (result: DropResult) => {
    const { source, destination, type } = result;
    if (!destination) return;

    if (type === "subgoal") {
      const reordered = [...subGoals];
      const [moved] = reordered.splice(source.index, 1);
      reordered.splice(destination.index, 0, moved);
      const withOrder = applySortOrder(reordered);
      setSubGoals(withOrder);
      updateGoalSubGoals(withOrder);
      return;
    }

    if (type === "task") {
      const sourceSubGoal = subGoals.find((s) => s.id === source.droppableId);
      const destSubGoal = subGoals.find((s) => s.id === destination.droppableId);
      if (!sourceSubGoal || !destSubGoal) return;

      const sourceTasks = [...sourceSubGoal.tasks];
      const [movedTask] = sourceTasks.splice(source.index, 1);

      if (source.droppableId === destination.droppableId) {
        sourceTasks.splice(destination.index, 0, movedTask);
        const updatedTasks = applySortOrder(sourceTasks);
        const updated = subGoals.map((s) =>
          s.id === sourceSubGoal.id ? { ...s, tasks: updatedTasks } : s
        );
        setSubGoals(updated);
        updateGoalSubGoals(updated);
      } else {
        const destTasks = [...destSubGoal.tasks];
        destTasks.splice(destination.index, 0, movedTask);
        const updated = subGoals.map((s) => {
          if (s.id === sourceSubGoal.id)
            return { ...s, tasks: applySortOrder(sourceTasks) };
          if (s.id === destSubGoal.id)
            return { ...s, tasks: applySortOrder(destTasks) };
          return s;
        });
        setSubGoals(updated);
        updateGoalSubGoals(updated);
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">{goal?.title}</h2>
        <Button
          className="bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          onClick={() => {
            const updatedGoal = { ...goal, sub_goals: subGoals };
            console.log("Saving Goal :", updatedGoal);
          }}
        >
          Save
        </Button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="subgoals" direction="horizontal" type="subgoal">
          {(provided: DroppableProvided) => (
            <div
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {subGoals?.map((subGoal, subIdx) => (
                <Draggable key={subGoal.id} draggableId={subGoal.id} index={subIdx}>
                  {(dragProvided: DraggableProvided) => (
                    <div
                      ref={dragProvided.innerRef}
                      {...dragProvided.draggableProps}
                      className="p-4 border rounded bg-gray-100 shadow"
                    >
                      <h3
                        {...dragProvided.dragHandleProps}
                        className="font-bold mb-2"
                      >
                        {subGoal.title}
                      </h3>

                      <Droppable droppableId={subGoal.id} type="task">
                        {(taskDrop: DroppableProvided) => (
                          <ul
                            ref={taskDrop.innerRef}
                            {...taskDrop.droppableProps}
                            className="space-y-2"
                          >
                            {subGoal.tasks.map((task, taskIdx) => (
                              <Draggable
                                key={task.id}
                                draggableId={task.id}
                                index={taskIdx}
                              >
                                {(taskDrag: DraggableProvided) => (
                                  <li
                                    ref={taskDrag.innerRef}
                                    {...taskDrag.draggableProps}
                                    {...taskDrag.dragHandleProps}
                                    className="bg-white p-2 rounded shadow text-sm"
                                  >
                                    {task.text}
                                  </li>
                                )}
                              </Draggable>
                            ))}
                            {taskDrop.placeholder}
                          </ul>
                        )}
                      </Droppable>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default GoalCustomizer;
