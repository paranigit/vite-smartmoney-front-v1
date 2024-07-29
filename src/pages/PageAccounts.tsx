import { useEffect, useState } from "react";
import { NumericFormat } from "react-number-format";
import { Account } from "../components/AccountInfo";

/** React Bootstrap */
import Spinner from "react-bootstrap/Spinner";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Modal from "react-bootstrap/Modal";

export default function PageAccounts() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [accountId, setAccountId] = useState<string>("");
  const [displayTable, setDisplayTable] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Functions
  const getAccounts = async () => {
    console.log("getAccounts");
    setDisplayTable(false);
    fetch(
      "https://3gqf36yau6b2bnuwg3x6y6w5bq0ohikb.lambda-url.eu-west-2.on.aws/?action=read"
    )
      .then((response) => response.json()) // Fetch JSON data
      //   .then((jsondata) => console.log(jsondata))
      .then((jsondata) => {
        if (jsondata.accounts) {
          setAccounts(jsondata.accounts);
          setDisplayTable(true);
        }
      })
      .catch((err) => console.log(err));
  };

  const deleteAccount = async (account_id: string) => {
    const requestOptions = {
      method: "POST",
      headers: {},
      body: JSON.stringify({
        accountset_id: account_id,
      }),
    };
    fetch(
      "https://3gqf36yau6b2bnuwg3x6y6w5bq0ohikb.lambda-url.eu-west-2.on.aws/?action=delete",
      requestOptions
    )
      .then((response) => response.json())
      .then((jsondata) => {
        console.log(jsondata);
        setShowDeleteModal(false);
        getAccounts();
      })
      .catch((err) => {
        console.log(err);
        setShowDeleteModal(false);
      });
  };

  const popupDeletionModal = (account_id: string) => {
    setAccountId(account_id);
    setShowDeleteModal(true);
  };
  const handleClose = () => setShowDeleteModal(false);

  useEffect(() => {
    // console.log("useEffect called.");
    getAccounts();
  }, []);

  const DeleteModal = () => {
    return (
      <Modal show={showDeleteModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Deletion confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>Would you like to delete - {accountId}?</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => deleteAccount(accountId)}>
            Yes
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            No
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  const RenderAccountsTable = () => {
    return displayTable ? (
      <>
        <table className="table table-striped my-3">
          <thead>
            <tr className="status-param-table">
              <th scope="col">#</th>
              <th scope="col">Account</th>
              <th scope="col">Name</th>
              <th scope="col">Accountsets</th>
              {/* <th scope="col">Last updated date</th> */}
              <th scope="col" className="text-end">
                Investment
              </th>
              <th className="text-end">Action</th>
            </tr>
          </thead>
          <tbody>
            {accounts.length === 0 && (
              <tr>
                <td>No items found!</td>
              </tr>
            )}
            {accounts.map((item, idx) => (
              <tr className="status-param-table" key={idx}>
                <td scope="row">{idx + 1}</td>
                <td>{item["account_id"]}</td>
                <td>{item["account_name"]}</td>
                <td>{item["accountsets"]}</td>
                <td className="text-end">
                  <NumericFormat
                    value={item["investment"]}
                    displayType={"text"}
                    thousandSeparator={true}
                    prefix={"$"}
                  />
                </td>
                <td className="text-end">
                  <ButtonGroup aria-label="Basic example">
                    <Button variant="primary" className="px-4">
                      Edit
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => popupDeletionModal(item["account_id"])}
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
    ) : (
      <div className="py-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  };

  return (
    <>
      <h5 className="py-3">Accounts</h5>
      <Container fluid>
        {DeleteModal()}
        <Row>
          <Col>{}</Col>
          <Col xs={5}>
            <Button
              variant="primary"
              href="/accounts-add"
              className="mx-3 float-end"
            >
              Add Account
            </Button>
          </Col>
        </Row>
      </Container>

      {accounts.length > 0 ? RenderAccountsTable() : <></>}
    </>
  );
}
