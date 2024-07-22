/** React Bootstrap */
import Spinner from "react-bootstrap/Spinner";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import { useFormik } from "formik";
import * as Yup from "yup";

import { useEffect, useState } from "react";
import { Account } from "../components/AccountInfo";

export default function PageAddAccount() {
  const formik = useFormik({
    initialValues: {
      account_id: "",
      account_name: "",
    },
    validationSchema: Yup.object({
      account_id: Yup.number().required("Required"),
      account_name: Yup.string()
        .min(5, "Must be 5 characters or more")
        .required("Required"),
    }),
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
    },
  });
  return (
    <>
      <h5 className="py-3">Add Account</h5>
      <Container>
        <Form onSubmit={formik.handleSubmit}>
          <Form.Group className="mb-3" controlId="accountForm.AccountId">
            <Form.Label>Account Id</Form.Label>
            <Form.Control
              type="number"
              isInvalid={!!formik.errors.account_id}
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
          <Button type="submit">Submit form</Button>
        </Form>
      </Container>
    </>
  );
  return (
    <form onSubmit={formik.handleSubmit}>
      <label htmlFor="account_id">First Name</label>
      <input
        id="account_id"
        type="text"
        {...formik.getFieldProps("account_id")}
      />
      {formik.touched.account_id && formik.errors.account_id ? (
        <div>{formik.errors.account_id}</div>
      ) : null}

      <label htmlFor="account_name">Last Name</label>
      <input
        id="account_name"
        type="text"
        {...formik.getFieldProps("account_name")}
      />
      {formik.touched.account_name && formik.errors.account_name ? (
        <div>{formik.errors.account_name}</div>
      ) : null}

      <label htmlFor="email">Email Address</label>
      <input id="email" type="email" {...formik.getFieldProps("email")} />
      {formik.touched.email && formik.errors.email ? (
        <div>{formik.errors.email}</div>
      ) : null}

      <button type="submit">Submit</button>
    </form>
  );
}
