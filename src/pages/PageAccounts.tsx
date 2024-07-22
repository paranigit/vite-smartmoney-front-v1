import { useEffect, useState } from "react";
import { NumericFormat } from "react-number-format";
import { Account } from "../components/AccountInfo";

/** React Bootstrap */
import Spinner from "react-bootstrap/Spinner";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

export default function PageAccounts() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [displayTable, setDisplayTable] = useState(true);

  // Functions
  const getAccounts = async () => {
    console.log("getAccounts");
    setDisplayTable(false);
    fetch(
      "https://6ndhiz7dnsldvktfgpsqi2d72a0xehwm.lambda-url.eu-west-2.on.aws"
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

  useEffect(() => {
    // console.log("useEffect called.");
    getAccounts();
  }, []);

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
        <Row>
          <Col>{}</Col>
          <Col xs={5}>
            <Button
              variant="primary"
              href="/accounts/add"
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
