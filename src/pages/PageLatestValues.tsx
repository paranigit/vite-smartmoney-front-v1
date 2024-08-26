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
import BreadcrumbItem from "react-bootstrap/BreadcrumbItem";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import Button from "react-bootstrap/Button";

export default function PageLatestValues() {
  const [accountsets, setAccountsets] = useState<string[]>([]);
  const [accountSetSelected, setAccountSetSelected] = useState<number>(-1);
  const [latestValues, setLatestValues] = useState<AccountParameters[]>([]);
  const [sortedValues, setSortedValues] = useState<AccountParameters[]>([]);
  const [displayTable, setDisplayTable] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const [sortConfig, setSortConfig] = useState<{
    key: keyof AccountParameters;
    direction: string;
  }>({ key: "account_id", direction: "ascending" });

  // Functions
  const getAccountsets = async () => {
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
          setLatestValues(jsondata.accounts);
          setLastUpdated(new Date());
          setDisplayTable(true);
        }
      })
      .catch((err) => console.log(err));
  };

  // Sort fuctionality
  const requestSort = (key: keyof AccountParameters) => {
    let direction = "ascending";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }
    setSortConfig({ key: key, direction: direction });
  };

  const getSortIcon = (key: keyof AccountParameters) => {
    if (!sortConfig) {
      return;
    }
    return sortConfig.key === key
      ? sortConfig.direction === "ascending"
        ? "bi bi-sort-alpha-down"
        : "bi bi-sort-alpha-down-alt"
      : "bi bi-sort-alpha-down";
  };

  const getSortVarient = (key: keyof AccountParameters) => {
    return sortConfig.key === key ? "primary" : "secondary";
  };

  useEffect(() => {
    getAccountsets();
    if (accountSetSelected > -1) {
      setDisplayTable(false);
      getLatestValues();
      let intervalId = setInterval(function () {
        getLatestValues();
      }, 30000);
      return () => {
        clearInterval(intervalId);
      };
    }
  }, [accountSetSelected]);

  useEffect(() => {
    // console.log(latestValues);
    console.log(sortConfig);
    setDisplayTable(false);
    let sortedItems = [...latestValues];
    sortedItems.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? 1 : -1;
      }
      return 0;
    });
    // console.log(sortedItems);
    setSortedValues(sortedItems);
    setDisplayTable(true);
  }, [latestValues, sortConfig]);

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
        {sortedValues.length === 0 && <p>No items found!</p>}
        <Table striped bordered hover className="my-3">
          <thead>
            <tr>
              <th>#</th>
              <th>Accountset Id</th>
              <th>
                <Button
                  variant={getSortVarient("account_id")}
                  size="sm"
                  onClick={() => requestSort("account_id")}
                >
                  {/* {getSortIcon("account_id")} */}
                  Account Id <i className={getSortIcon("account_id")}></i>
                </Button>
              </th>
              <th>Name</th>
              {/* <th scope="col">Last updated date</th> */}
              <th>Last updated</th>
              <th className="text-end">Investment</th>
              <th>
                <Button
                  variant={getSortVarient("balance")}
                  size="sm"
                  onClick={() => requestSort("balance")}
                >
                  {/* {getSortIcon("account_id")} */}
                  Balance <i className={getSortIcon("balance")}></i>
                </Button>
              </th>
              <th>
                <Button
                  variant={getSortVarient("equity")}
                  size="sm"
                  onClick={() => requestSort("equity")}
                >
                  {/* {getSortIcon("account_id")} */}
                  Equity <i className={getSortIcon("equity")}></i>
                </Button>
              </th>
              <th>
                <Button
                  variant={getSortVarient("runningpnl")}
                  size="sm"
                  onClick={() => requestSort("runningpnl")}
                >
                  {/* {getSortIcon("account_id")} */}
                  Running P&L <i className={getSortIcon("runningpnl")}></i>
                </Button>
              </th>
              <th>
                <Button
                  variant={getSortVarient("closedpnl")}
                  size="sm"
                  onClick={() => requestSort("closedpnl")}
                >
                  {/* {getSortIcon("account_id")} */}
                  Closed P&L <i className={getSortIcon("closedpnl")}></i>
                </Button>
              </th>
              <th>
                <Button
                  variant={getSortVarient("drawdown")}
                  size="sm"
                  onClick={() => requestSort("drawdown")}
                >
                  {/* {getSortIcon("account_id")} */}
                  Drawdown <i className={getSortIcon("drawdown")}></i>
                </Button>
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedValues.map((item, idx) => (
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
      <Breadcrumb>
        <BreadcrumbItem href={"/"}> Home</BreadcrumbItem>
        <BreadcrumbItem active> Latest Values </BreadcrumbItem>
      </Breadcrumb>
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
