import { useEffect, useState } from "react";
import { NumericFormat } from "react-number-format";
import { Account } from "../components/AccountInfo";
import BsFormSelect from "../components/bootstrap/BsFormSelect";

/** React Bootstrap */
import Spinner from "react-bootstrap/Spinner";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

export default function PageAccountSets() {
  const [accountSets, setAccountSets] = useState<string[]>([]);
  const [accountSetSelected, setAccountSetSelected] = useState<number>(-1);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [displayTable, setDisplayTable] = useState(true);

  // Functions
  const getAccountSets = async () => {
    console.log("getAccountSets");
    fetch(
      "https://brqob3sip5oc3i56vzigoeua3u0knvdl.lambda-url.eu-west-2.on.aws/"
    )
      .then((response) => response.json()) // Fetch JSON data
      // .then((jsondata) => console.log(jsondata["accountsets"]))
      .then((jsondata) => setAccountSets(jsondata["accountsets"]))
      .catch((err) => console.log(err));
  };

  const getAccounts = async (accountset: string) => {
    console.log("getAccounts");
    setDisplayTable(false);
    fetch(
      "https://6ndhiz7dnsldvktfgpsqi2d72a0xehwm.lambda-url.eu-west-2.on.aws/?accountset=" +
        accountset
    )
      .then((response) => response.json()) // Fetch JSON data
      // .then((jsondata) => console.log(jsondata))
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
    getAccountSets();
    if (accountSetSelected > -1) {
      getAccounts(accountSets[accountSetSelected]);
    }
  }, [accountSetSelected]);

  const AccountSetSelector = () => {
    return accountSets.length > 0 ? (
      <BsFormSelect
        title="Select AccountSet"
        options={accountSets}
        onChange={(e) => setAccountSetSelected(e)}
      ></BsFormSelect>
    ) : (
      <div className="py-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  };

  const RenderAccountsTable = () => {
    return displayTable ? (
      <>
        <table className="table table-striped">
          <thead>
            <tr className="status-param-table">
              <th scope="col">#</th>
              <th scope="col">Accountset</th>
              <th scope="col">Account</th>
              <th scope="col">Name</th>
              {/* <th scope="col">Last updated date</th> */}
              <th scope="col">Investment</th>
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
                <td>{item["accountsets"]}</td>
                <td>{item["account_id"]}</td>
                <td>{item["account_name"]}</td>
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
      <h5 className="py-3">Accountsets</h5>
      <Container fluid>
        <Row>
          <Col>{AccountSetSelector()}</Col>
          {/* <Col xs={5}>
            <Button variant="primary" href="" className="mx-3">
              Add Account
            </Button>
            <Button variant="secondary" href="/accountsets/add">
              Add Accountset
            </Button>
          </Col> */}
        </Row>
      </Container>

      {accountSetSelected > -1 ? RenderAccountsTable() : <></>}
    </>
  );
}
