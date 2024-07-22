import { ComponentPropsWithoutRef } from "react";

type Props = {
  id: string;
  label: string;
} & ComponentPropsWithoutRef<"input">;

export default function Input({ id, label, ...props }: Props) {
  return (
    <p>
      <label htmlFor={id}>{label}</label>
      <input id={id} {...props} />
    </p>
  );
}
