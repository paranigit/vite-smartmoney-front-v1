import Alert from "react-bootstrap/Alert";

export interface BsAlertProps {
  variant: string;
  message: string;
}

export default function BsAlert({ variant, message }: BsAlertProps) {
  if (message != "") {
    return (
      <Alert key={variant} variant={variant} dismissible>
        {message}
      </Alert>
    );
  }
}
