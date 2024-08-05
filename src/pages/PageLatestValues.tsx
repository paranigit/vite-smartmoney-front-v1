import { useEffect, useState } from "react";
import { NumericFormat } from "react-number-format";
import { AccountParameters } from "../components/AccountInfo";
import BsFormSelect from "../components/bootstrap/BsFormSelect";
import moment from "moment";

/** React Bootstrap */
import Spinner from "react-bootstrap/Spinner";
import Container from "react-bootstrap/Container";
import Table from "react-bootstrap/Table";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { date } from "yup";

export default function PageLatestValues() {
  const [accountsets, setAccountsets] = useState<string[]>([]);
  const [accountSetSelected, setAccountSetSelected] = useState<number>(-1);
  const [ParametersList, setParametersList] = useState<AccountParameters[]>([]);
  const [displayTable, setDisplayTable] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Functions
  const getAccountsets = async () => {
    console.log("getAccountsets");
    fetch(
      "https://33qbh4wk7y7bd4rdhylok5er4a0ftbbq.lambda-url.eu-west-2.on.aws/?action=read&accountset-ids-only=true"
    )
      .then((response) => response.json()) // Fetch JSON data
      //   .then((jsondata) => console.log(jsondata["accountsets"]))
      .then((jsondata) => {
        setAccountsets([...jsondata["accountsets"], "ALLSETS"]);
      })
      .catch((err) => {
        console.log(err);
        setAccountsets([]);
      });
  };

  const getLatestValues = async () => {
    // setDisplayTable(false);
    fetch(
      "https://6czzalumjfxq2uvrm5nlogxlzy0ejegb.lambda-url.eu-west-2.on.aws?accountset_id=" +
        accountsets[accountSetSelected]
    )
      .then((response) => response.json()) // Fetch JSON data
      // .then((jsondata) => console.log(jsondata))
      .then((jsondata) => {
        if (jsondata.accounts) {
          setParametersList(jsondata.accounts);
          setLastUpdated(new Date());
          setDisplayTable(true);
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getAccountsets();
    if (accountSetSelected > -1) {
      setDisplayTable(false);
      getLatestValues();
      let intervalId = setInterval(getLatestValues, 30000);
      return () => {
        console.log("clearing");
        clearInterval(intervalId);
      };
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
        <p className="text-end">
          Last Updated on: {lastUpdated.toLocaleTimeString()}
        </p>
        {ParametersList.length === 0 && <p>No items found!</p>}
        <Table striped bordered hover className="my-3">
          <thead>
            <tr>
              <th>#</th>
              <th>Accountset Id</th>
              <th>Account Id</th>
              <th>Name</th>
              {/* <th scope="col">Last updated date</th> */}
              <th>Last updated</th>
              <th className="text-end">Investment</th>
              <th className="text-end">Balance</th>
              <th className="text-end">Equity</th>
              <th className="text-end">Running P&L</th>
              <th className="text-end">Closed P&L</th>
              <th className="text-end">Drawdown</th>
            </tr>
          </thead>
          <tbody>
            {ParametersList.map((item, idx) => (
              <tr className="status-param-table" key={idx}>
                <th scope="row">{idx + 1}</th>
                <td>{item["accountset_id"]}</td>
                <td>{item["account_id"]}</td>
                <td>{item["account_name"]}</td>
                <td>
                  {item["insertedOn"]
                    ? moment.utc(item["insertedOn"]).local().fromNow()
                    : ""}
                </td>
                <td className="text-end">
                  <NumericFormat
                    value={item["investment"]}
                    displayType={"text"}
                    thousandSeparator={true}
                    prefix={"$"}
                  />
                </td>
                <td className="text-end">
                  <NumericFormat
                    value={item["balance"]}
                    displayType={"text"}
                    thousandSeparator={true}
                    prefix={"$"}
                  />
                </td>
                <td className="text-end">
                  <NumericFormat
                    value={item["equity"]}
                    displayType={"text"}
                    thousandSeparator={true}
                    prefix={"$"}
                  />
                </td>
                <td className="text-end">
                  <NumericFormat
                    value={item["runningpnl"]}
                    displayType={"text"}
                    thousandSeparator={true}
                    prefix={"$"}
                  />
                </td>
                <td className="text-end">
                  <NumericFormat
                    value={item["closedpnl"]}
                    displayType={"text"}
                    thousandSeparator={true}
                    prefix={"$"}
                  />
                </td>
                <td className="text-end">{item["drawdown"]}</td>
              </tr>
            ))}
          </tbody>
        </Table>
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
      <h5 className="py-3">Latest Values</h5>
      <Container fluid>
        <Row>
          <Col>{AccountSetSelector()}</Col>
          <Col xs={5}></Col>
        </Row>
      </Container>

      {accountSetSelected > -1 ? RenderAccountsTable() : <></>}
    </>
  );
}
