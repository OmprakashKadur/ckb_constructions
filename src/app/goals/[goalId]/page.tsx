import { allGoals } from "@/mock/goals";
import GoalDetails from "../../../components/GoalDetails";
import { Goal } from "@/types/models";

export async function generateStaticParams() {
  return allGoals.map((goal: Goal) => ({
    goalId: goal.id,
  }));
}

type GoalPageProps = {
  params: Promise<{
    goalId: string;
  }>;
};

export default async function GoalPage({ params }: GoalPageProps) {
  const { goalId } = await params;
  return <GoalDetails goalId={goalId} />;
}
