import { allGoals } from "@/mock/goals";

export async function getGoalsbyId(goalId:string){
    return allGoals.find((g)=>g.id === goalId)
}