import { useEffect, useState } from "react";
import { Accountset } from "../components/AccountInfo";

/** React Bootstrap */
import Spinner from "react-bootstrap/Spinner";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Modal from "react-bootstrap/Modal";

export default function PageAccountsets() {
  const [accountsets, setAccountsets] = useState<Accountset[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [accountsetId, setAccountsetId] = useState<string>("");

  // Functions
  const getAccountSets = async () => {
    console.log("getAccountSets");
    setIsLoading(true);
    fetch(
      "https://33qbh4wk7y7bd4rdhylok5er4a0ftbbq.lambda-url.eu-west-2.on.aws/?action=read"
    )
      .then((response) => response.json()) // Fetch JSON data
      // .then((jsondata) => console.log(jsondata["accountsets"]))
      .then((jsondata) => {
        setAccountsets(jsondata["accountsets"]);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setAccountsets([]);
        setIsLoading(false);
      });
  };

  const deleteAccountset = async (accountset_id: string) => {
    const requestOptions = {
      method: "POST",
      headers: {},
      body: JSON.stringify({
        accountset_id: accountset_id,
      }),
    };
    fetch(
      "https://33qbh4wk7y7bd4rdhylok5er4a0ftbbq.lambda-url.eu-west-2.on.aws/?action=delete",
      requestOptions
    )
      .then((response) => response.json())
      .then((jsondata) => {
        console.log(jsondata);
        setShowDeleteModal(false);
        getAccountSets();
        // setAlertMessage(jsondata["message"]);
        // setAlertType("success");
      })
      .catch((err) => {
        console.log(err);
        setShowDeleteModal(false);
        // setAlertMessage(err["message"]);
        // setAlertType("danger");
      });
  };

  const popupDeletionModal = (accountset_id: string) => {
    setAccountsetId(accountset_id);
    setShowDeleteModal(true);
  };
  const handleClose = () => setShowDeleteModal(false);

  useEffect(() => {
    console.log("useEffect called.");
    getAccountSets();
  }, []);

  const RenderAccountsetsTable = () => {
    return isLoading ? (
      <div className="py-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    ) : (
      <>
        <table className="table table-striped">
          <thead>
            <tr className="status-param-table">
              <th scope="col">#</th>
              <th scope="col">Accountset Id</th>
              <th scope="col">Accountset Name</th>
              <th scope="col">Category</th>
              {/* <th scope="col">Last updated date</th> */}
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {accountsets.length === 0 && (
              <tr>
                <td colSpan={5}>No items found!</td>
              </tr>
            )}
            {accountsets.map((item, idx) => (
              <tr className="status-param-table" key={idx}>
                <td scope="row">{idx + 1}</td>
                <td>{item["accountset_id"]}</td>
                <td>{item["accountset_name"]}</td>
                <td>{item["category"]}</td>
                <td>
                  <ButtonGroup aria-label="Basic example">
                    <Button variant="primary" className="px-4">
                      Edit
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => popupDeletionModal(item["accountset_id"])}
                    >
                      Delete
                    </Button>
                  </ButtonGroup>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </>
    );
  };

  const DeleteModal = () => {
    return (
      <Modal show={showDeleteModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Deletion confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>Would you like to delete - {accountsetId}?</Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            onClick={() => deleteAccountset(accountsetId)}
          >
            Yes
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            No
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  return (
    <>
      <Container fluid>
        {DeleteModal()}
        <Row>
          <Col>
            <h5>Accountsets</h5>
          </Col>
          <Col xs={5}>
            <Button
              variant="primary"
              href="/accountsets-add"
              className="mx-3 float-end"
            >
              Add Accountset
            </Button>
          </Col>
        </Row>
        {RenderAccountsetsTable()}
      </Container>
    </>
  );
}
