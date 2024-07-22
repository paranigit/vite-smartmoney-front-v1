import { SetStateAction, useEffect, useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";

export interface BsDropDownProps {
  title: string;
  options: string[];
  onSelect: (evtKey: number) => void;
}

export default function BsDropDown(props: BsDropDownProps) {
  const [selectedItem, setSelectedItem] = useState<number>(-1);
  const handleSelected = (evtKey: SetStateAction<number>) => {
    console.log(evtKey);
    setSelectedItem(evtKey);
  };

  useEffect(() => {
    console.log(selectedItem);
    props.onSelect(selectedItem);
  }, [selectedItem]);

  return (
    <Dropdown
      onSelect={(evtKey, evt) => {
        console.log(evt.target);
        handleSelected(evtKey ? Number(evtKey) : -1);
      }}
    >
      <Dropdown.Toggle variant="success" id="dropdown-basic">
        {props.title}
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {props.options.map((option, idx) => (
          <Dropdown.Item key={idx} eventKey={idx}>
            {option}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
}
