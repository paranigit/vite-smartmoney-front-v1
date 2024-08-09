/** React Bootstrap */
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import Dropdown from "react-bootstrap/Dropdown";
import Spinner from "react-bootstrap/Spinner";
// import PageHeader from "react-bootstrap";

/** Form libraries */
import { useFormik } from "formik";
import * as Yup from "yup";
import { useEffect, useState } from "react";

export default function PageAddAccount() {
  const [accountsets, setAccountsets] = useState<string[]>([]);
  const [selectedAccountsets, setSelectedAccountsets] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [alertType, setAlertType] = useState<string>("primary");

  const formik = useFormik({
    initialValues: {
      account_id: "",
      account_name: "",
      accountsets: "",
      investment: 0,
    },
    validationSchema: Yup.object({
      account_id: Yup.string().required("Required"),
      account_name: Yup.string()
        .min(5, "Must be 5 characters or more")
        .required("Required"),
      accountsets: Yup.string().required("Select atleast one accountset."),
      investment: Yup.number().required("Required"),
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
        "https://3gqf36yau6b2bnuwg3x6y6w5bq0ohikb.lambda-url.eu-west-2.on.aws/?action=insert",
        requestOptions
      )
        .then((response) => response.json())
        .then((jsondata) => {
          console.log(jsondata);
          if (jsondata["error"]) {
            setAlertMessage("Account cannot be added.");
            setAlertType("danger");
            setIsLoading(false);
          } else {
            setAlertMessage(jsondata["message"]);
            setAlertType("success");
            setIsLoading(false);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  });

  // Functions
  const getAccountsets = async () => {
    console.log("getAccountsets");
    fetch(
      "https://33qbh4wk7y7bd4rdhylok5er4a0ftbbq.lambda-url.eu-west-2.on.aws/?action=read&accountset-ids-only=true"
    )
      .then((response) => response.json()) // Fetch JSON data
      //   .then((jsondata) => console.log(jsondata["accountsets"]))
      .then((jsondata) => {
        setAccountsets(jsondata["accountsets"]);
      })
      .catch((err) => {
        console.log(err);
        setAccountsets([]);
      });
  };

  const toggleAccountset = (option: string) => {
    // remove option; already available
    if (selectedAccountsets.includes(option)) {
      setSelectedAccountsets(
        selectedAccountsets.filter((item) => item !== option)
      );
      // add option
    } else {
      setSelectedAccountsets([...selectedAccountsets, option]);
    }
  };

  // For componentDidMount
  useEffect(() => {
    getAccountsets();
  }, []);

  useEffect(() => {
    if (selectedAccountsets.length > 0) {
      formik.setFieldValue("accountsets", selectedAccountsets.join(","));
    } else {
      formik.setFieldValue("accountsets", "");
    }
  }, [selectedAccountsets]);

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
        <h4 className="py-3">Add Account</h4>
        <Form onSubmit={formik.handleSubmit}>
          <Form.Group className="mb-3" controlId="accountForm.AccountId">
            <Form.Label>Account Id</Form.Label>
            <Form.Control
              type="text"
              isInvalid={
                formik.touched.account_id && !!formik.errors.account_id
              }
              {...formik.getFieldProps("account_id")}
            />
            {formik.touched.account_id && formik.errors.account_id ? (
              <p>{formik.errors.account_id}</p>
            ) : null}
          </Form.Group>
          <Form.Group className="mb-3" controlId="accountForm.AccountName">
            <Form.Label>Account Name</Form.Label>
            <Form.Control
              type="text"
              isInvalid={
                formik.touched.account_name && !!formik.errors.account_name
              }
              {...formik.getFieldProps("account_name")}
            />
            {formik.touched.account_name && formik.errors.account_name ? (
              <p>{formik.errors.account_name}</p>
            ) : null}
          </Form.Group>

          <Form.Group className="mb-3" controlId="accountForm.Accountsets">
            <Form.Label>Accountsets</Form.Label>
            <Dropdown>
              <Dropdown.Toggle variant="success" id="dropdown-basic">
                Select Accountsets
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {accountsets.map((option, index) => (
                  <Dropdown.Item
                    key={index}
                    onClick={() => toggleAccountset(option)}
                    active={selectedAccountsets.includes(option)}
                  >
                    {option}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
            <Form.Control
              disabled
              type="text"
              className="my-2"
              isInvalid={!!formik.errors.accountsets}
              {...formik.getFieldProps("accountsets")}
            />
            {formik.errors.accountsets ? (
              <p>{formik.errors.accountsets}</p>
            ) : null}
          </Form.Group>

          <Form.Group className="mb-3" controlId="accountForm.Investment">
            <Form.Label>Investment</Form.Label>
            <Form.Control
              type="text"
              isInvalid={
                formik.touched.investment && !!formik.errors.investment
              }
              {...formik.getFieldProps("investment")}
            />
            {formik.touched.investment && formik.errors.investment ? (
              <p>{formik.errors.investment}</p>
            ) : null}
          </Form.Group>
          <Button type="submit">Submit</Button>
        </Form>
      </div>
    );
  };

  return (
    <>
      {/* Alert */}

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
