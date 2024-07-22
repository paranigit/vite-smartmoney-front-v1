import { SetStateAction, useEffect, useState } from "react";
import Form from "react-bootstrap/Form";

export interface BsFormSelectProps {
  title: string;
  options: string[];
  onChange: (evtKey: number) => void;
}

export default function BsFormSelect(props: BsFormSelectProps) {
  const [selectedItem, setSelectedItem] = useState<number>(-1);
  const handleSelected = (evtKey: SetStateAction<number>) => {
    setSelectedItem(evtKey);
  };

  useEffect(() => {
    props.onChange(selectedItem);
  }, [selectedItem]);

  return (
    <Form.Select
      onChange={(evt) => {
        handleSelected(Number(evt.target.value));
      }}
    >
      <option value="-1">{props.title}</option>
      {props.options.map((option, idx) => (
        <option key={idx} value={idx}>
          {option}
        </option>
      ))}
    </Form.Select>
  );
}
