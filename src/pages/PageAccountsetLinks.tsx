import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { NumericFormat } from "react-number-format";
import { Account } from "../components/AccountInfo";
import BsFormSelect from "../components/bootstrap/BsFormSelect";

/** React Bootstrap */
import Spinner from "react-bootstrap/Spinner";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

export default function PageAccountsetLinks() {
  const [accountsets, setAccountsets] = useState<string[]>([]);
  const [accountSetSelected, setAccountSetSelected] = useState<number>(-1);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [displayTable, setDisplayTable] = useState(true);

  //   Fetch Accountset from URL params
  let { accountset } = useParams();

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
        if (accountset) {
          console.log(accountsets.indexOf(accountset));
          setAccountSetSelected(accountsets.indexOf(accountset));
        }
      })
      .catch((err) => {
        console.log(err);
        setAccountsets([]);
      });
  };

  const getAccounts = async (accountset: string) => {
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
    if (accountSetSelected > -1) {
      getAccounts(accountsets[accountSetSelected]);
    } else {
      getAccountsets();
    }
  }, [accountSetSelected]);

  const AccountSetSelector = () => {
    return accountsets.length > 0 ? (
      <BsFormSelect
        title="Select AccountSet"
        options={accountsets}
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
                <td colSpan={5}>No items found!</td>
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
        <p>{}</p>
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
