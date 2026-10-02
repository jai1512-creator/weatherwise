import { activityRules } from "../../data/activityRules";
import type { Plan } from "../../types/plan";

export function PlanSummary({ plan }: { plan: Plan }) {
  const activityLabel = activityRules[plan.activity]?.label ?? plan.activity;
  return (
    <div className="plan-summary">
      <span className="plan-summary__activity">{activityLabel}</span>
      {plan.destination && (
        <span className="plan-summary__dest"> in {plan.destination}</span>
      )}
      <span className="plan-summary__time">
        {" "}
        · {plan.date} at {plan.time}
      </span>
    </div>
  );
}
