/** React Bootstrap */
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import Spinner from "react-bootstrap/Spinner";
// import PageHeader from "react-bootstrap";

/** Form libraries */
import { useFormik } from "formik";
import * as Yup from "yup";
import { useEffect, useState } from "react";

export default function PageAddAccountset() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [alertType, setAlertType] = useState<string>("primary");

  const formik = useFormik({
    initialValues: {
      accountset_id: "",
      accountset_name: "",
      category: "",
    },
    validationSchema: Yup.object({
      accountset_id: Yup.string().required("Required"),
      accountset_name: Yup.string()
        .min(5, "Must be 5 characters or more")
        .required("Required"),
      category: Yup.string().required("Select a category"),
    }),
    onSubmit: (values) => {
      setIsLoading(true);
      // alert(JSON.stringify(values, null, 2));
      const requestOptions = {
        method: "POST",
        headers: {},
        body: JSON.stringify(values),
      };
      console.log(requestOptions);
      fetch(
        "https://33qbh4wk7y7bd4rdhylok5er4a0ftbbq.lambda-url.eu-west-2.on.aws/?action=insert",
        requestOptions
      )
        .then((response) => response.json())
        .then((jsondata) => {
          console.log(jsondata);
          if (jsondata["error"]) {
            setAlertMessage("Accountset cannot be added.");
            setAlertType("danger");
            setIsLoading(false);
          } else {
            setAlertMessage(jsondata["message"]);
            setAlertType("success");
            setIsLoading(false);
          }
        })
        .catch((err) => err.json())
        .catch((jsondata) => {
          console.log(jsondata);
        });
    },
  });

  // Functions
  // For componentDidMount
  useEffect(() => {}, []);

  // useEffect(() => {
  //   if (processStatus === "errored") {
  //   }
  // }, [processStatus]);

  const RenderAccountForm = () => {
    return isLoading ? (
      <div className="py-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    ) : (
      <div className="py-5">
        <h4 className="py-3">Add Accountset</h4>
        <Form onSubmit={formik.handleSubmit}>
          <Form.Group className="mb-3" controlId="accountForm.Accountset">
            <Form.Label>Accountset Id</Form.Label>
            <Form.Control
              type="text"
              isInvalid={
                formik.touched.accountset_id && !!formik.errors.accountset_id
              }
              {...formik.getFieldProps("accountset_id")}
            />
            {formik.touched.accountset_id && formik.errors.accountset_id ? (
              <p>{formik.errors.accountset_id}</p>
            ) : null}
          </Form.Group>
          <Form.Group className="mb-3" controlId="accountForm.AccountsetName">
            <Form.Label>Accountset Name</Form.Label>
            <Form.Control
              type="text"
              isInvalid={
                formik.touched.accountset_name &&
                !!formik.errors.accountset_name
              }
              {...formik.getFieldProps("accountset_name")}
            />
            {formik.touched.accountset_name && formik.errors.accountset_name ? (
              <p>{formik.errors.accountset_name}</p>
            ) : null}
          </Form.Group>

          <Form.Group className="mb-3" controlId="accountForm.Category">
            <Form.Label>Category</Form.Label>
            <Form.Select {...formik.getFieldProps("category")}>
              <option value={""}>Select a category</option>
              <option value={"prod"}>Prod</option>
              <option value={"dev"}>Dev</option>
            </Form.Select>
            {formik.errors.category ? <p>{formik.errors.category}</p> : null}
          </Form.Group>

          <Button type="submit">Submit</Button>
        </Form>
      </div>
    );
  };

  return (
    <>
      <Container>
        {RenderAccountForm()}
        {alertMessage !== "" ? (
          <Alert key={alertType} variant={alertType}>
            {alertMessage}
          </Alert>
        ) : (
          <></>
        )}
        <hr />
      </Container>
    </>
  );
}
