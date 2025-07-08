import { allGoals } from "@/mock/goals";
import { Goal } from "@/types/models";
import CustomiseGoalPage from "../../../components/CustomiseGoalPage";

export async function generateStaticParams() {
  return allGoals.map((goal: Goal) => ({
    goalId: goal.id,
  }));
}

// type GoalPageProps = {
//   params: Promise<{
//     goalId: string;
//   }>;
// };

export default async function CustomisePage() {
  return <CustomiseGoalPage  />;
}