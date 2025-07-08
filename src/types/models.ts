export interface Task {
    id: string;
    sub_goal_id: string;
    text: string;
    is_done: boolean;
    due_date: string | null;
    sort_order?: number; // ✅ Add this
  }
  
  export interface SubGoal {
    id: string;
    main_goal_id: string;
    title: string;
    sort_order: number;
    tasks: Task[];
  }
  
  export interface Goal {
    id: string;
    user_id: string;
    title: string;
    sub_goals: SubGoal[];
  }
  export interface PageProps {
    params: { goalId: string };
  }
