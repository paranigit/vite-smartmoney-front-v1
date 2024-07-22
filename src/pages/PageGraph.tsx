import { useEffect, useState } from "react";
import BsFormSelect from "../components/bootstrap/BsFormSelect";
import moment from "moment-timezone";

/** React Bootstrap */
import Spinner from "react-bootstrap/Spinner";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

/** Chart JS */
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from "chart.js";

import { Line } from "react-chartjs-2";
import "chartjs-adapter-moment";
import zoomPlugin from "chartjs-plugin-zoom";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  zoomPlugin
);

export default function PageGraph() {
  const [accountSets, setAccountSets] = useState<string[]>([]);
  const [accountSetSelected, setAccountSetSelected] = useState<number>(-1);
  const [displayChart, setDisplayChart] = useState(true);
  const [statusParameterSelected, setStatusParameterSelected] =
    useState<number>(-1);
  let statusParameters = [
    "balance",
    "equity",
    "runningpnl",
    "closedpnl",
    "drawdown",
    // "freemargin",
    // "quantity",
    // "trades",
    // "usedmargin",
  ];
  const [statusData, setStatusData] = useState({
    labels: [],
    datasets: [],
  });

  // Functions
  const getAccountSets = async () => {
    // console.log("getAccountSets");
    fetch(
      "https://brqob3sip5oc3i56vzigoeua3u0knvdl.lambda-url.eu-west-2.on.aws"
    )
      .then((response) => response.json()) // Fetch JSON data
      // .then((jsondata) => console.log(jsondata["accountsets"]))
      .then((jsondata) => setAccountSets([...jsondata["accountsets"]]))
      .catch((err) => console.log(err));
  };

  // const getAccounts = async (accountset: string) => {
  //   console.log("getAccounts");
  //   fetch(
  //     "https://6ndhiz7dnsldvktfgpsqi2d72a0xehwm.lambda-url.eu-west-2.on.aws/?accountset=" +
  //       accountset
  //   )
  //     .then((response) => response.json()) // Fetch JSON data
  //     // .then((jsondata) => console.log(jsondata))
  //     .then((jsondata) => {
  //       if (jsondata.accounts) {
  //         setAccounts(jsondata.accounts);
  //       }
  //     })
  //     .catch((err) => console.log(err));
  // };

  //   API call to fetch data
  const getGraphPoints = async () => {
    if (accountSetSelected > -1 && statusParameterSelected > -1) {
      try {
        let fetch_from_6hrs = moment().subtract(6, "hours");
        let fetch_from_iso = fetch_from_6hrs
          .utc()
          .format("YYYY-MM-DDTHH:mm:SSSZZ");
        let params = {
          fetch_from_iso: fetch_from_6hrs
            .utc()
            .format("YYYY-MM-DDTHH:mm:SSSZZ"),
          // fetch_from_iso: "2024-02-28T14:16:45.720766+00:00",
          // fetch_from_iso: fetch_from.utc().format("YYYY-MM-DDTHH:mm:SSSZZ"),
          accountset: accountSets[accountSetSelected],
          status_parameter: statusParameters[statusParameterSelected],
        };
        console.log(JSON.stringify(params));
        fetch(
          "https://f2xuavolazelhbbfrrnlmf2hkq0sjdak.lambda-url.eu-west-2.on.aws/?fetch_from_iso=" +
            fetch_from_iso +
            "&accountset=" +
            accountSets[accountSetSelected] +
            "&status_parameter=" +
            statusParameters[statusParameterSelected]
        )
          .then((response) => response.json()) // Fetch JSON data
          .then((jsondata) => {
            console.log(jsondata);
            if (jsondata.content) {
              setStatusData(jsondata.content);
              setDisplayChart(true);
            }
          });
      } catch (e) {
        console.log(e);
      }
    }
  };

  // For componentDidMount
  useEffect(() => {
    getAccountSets();
  }, []);

  // For componentDidUpdate + componentWillUnmount
  useEffect(() => {
    if (statusParameterSelected > -1 && accountSetSelected > -1) {
      setDisplayChart(false);
      getGraphPoints();
      // let intervalId = setInterval(getGraphPoints, 60000);
      // componentWillUnmount
      return () => {
        console.log("clearing");
        // clearInterval(intervalId);
      };
    }
  }, [statusParameterSelected, accountSetSelected]);

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

  const funcRenderChart = () => {
    return (
      <div className="py-4">
        {displayChart ? (
          <div className="py-4">
            <Line data={statusData} height={130} />
          </div>
        ) : (
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        )}
      </div>
    );
  };

  return (
    <>
      <h5 className="py-3">Status Parameters</h5>
      <Container fluid>
        <Row>
          <Col>{AccountSetSelector()}</Col>
          <Col>
            <BsFormSelect
              title="Select Parameter"
              options={statusParameters}
              onChange={(e) => setStatusParameterSelected(e)}
            ></BsFormSelect>
          </Col>
        </Row>
        <Container>{funcRenderChart()}</Container>
      </Container>
    </>
  );
}
