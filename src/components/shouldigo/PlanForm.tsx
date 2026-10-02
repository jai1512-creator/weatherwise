import { useState, type FormEvent } from "react";
import type { Plan } from "../../types/plan";

export type PlanFormProps = {
  onSubmit: (plan: Plan) => void;
  defaultDestination?: string;
  isEvaluating?: boolean;
};

export function PlanForm({
  onSubmit,
  defaultDestination = "",
  isEvaluating = false,
}: PlanFormProps) {
  const today = new Date();
  const minDate = today.toISOString().split("T")[0];
  const maxDate = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  const currentHour = today.getHours();
  const nextHour = (currentHour + 1) % 24;
  const defaultTime = `${String(nextHour).padStart(2, "0")}:00`;

  const [destinationInput, setDestinationInput] = useState("");
  const [date, setDate] = useState(minDate);
  const [time, setTime] = useState(defaultTime);
  const [activity, setActivity] = useState<Plan["activity"]>("walk");

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const finalDestination = destinationInput.trim() || defaultDestination;
    onSubmit({
      destination: finalDestination,
      date,
      time,
      activity,
    });
  };

  return (
    <form className="plan-form" onSubmit={submit} aria-label="Activity plan evaluation form">
      <label className="plan-form__field">
        <span className="plan-form__label">Destination / Location</span>
        <input
          type="text"
          value={destinationInput}
          onChange={(event) => setDestinationInput(event.target.value)}
          placeholder={defaultDestination ? `Current: ${defaultDestination}` : "e.g. City or landmark"}
          className="plan-form__input"
        />
      </label>

      <label className="plan-form__field">
        <span className="plan-form__label">Date (Next 7 days)</span>
        <input
          type="date"
          min={minDate}
          max={maxDate}
          value={date}
          onChange={(event) => setDate(event.target.value)}
          required
          className="plan-form__input"
        />
      </label>

      <label className="plan-form__field">
        <span className="plan-form__label">Time</span>
        <input
          type="time"
          value={time}
          onChange={(event) => setTime(event.target.value)}
          required
          className="plan-form__input"
        />
      </label>

      <label className="plan-form__field">
        <span className="plan-form__label">Activity</span>
        <select
          value={activity}
          onChange={(event) =>
            setActivity(event.target.value as Plan["activity"])
          }
          className="plan-form__select"
        >
          <option value="walk">🚶 Walking</option>
          <option value="run">🏃 Running</option>
          <option value="picnic">🧺 Picnic</option>
          <option value="outdoor-event">🎪 Outdoor Event</option>
          <option value="cycling">🚴 Cycling</option>
          <option value="hiking">🥾 Hiking</option>
        </select>
      </label>

      <button
        type="submit"
        disabled={isEvaluating}
        className="button button--primary plan-form__submit"
      >
        {isEvaluating ? "Analyzing forecast…" : "Evaluate my plan"}
      </button>
    </form>
  );
}
