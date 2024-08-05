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
  const [accountsets, setAccountsets] = useState<string[]>([]);
  const [accountsetSelected, setaccountsetSelected] = useState<number>(-1);
  const [displayChart, setDisplayChart] = useState(false);
  const [loadingChart, setLoadingChart] = useState(false);
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
    datasets: [],
  });
  const [paramDatasets, setParamDatasets] = useState<any[]>([]);

  const ChartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: statusParameters[statusParameterSelected],
      },
    },
    scales: {
      xAxes: {
        type: "time",
        time: {
          unit: "hour",
          // min: minDate,
          // max: maxDate,
          displayFormats: {
            hour: "DD-MMM HH:MM",
          },
          // parser: function (utcMoment) {
          //   return utcMoment.utcOffset("+0100");
          // },
        },
      },
    },
  };

  // Functions
  const getaccountsets = async () => {
    console.log("getaccountsets");
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

  setInterval(() => {}, 5000);

  //   API call to fetch data
  const getGraphPoints = async () => {
    if (accountsetSelected > -1 && statusParameterSelected > -1) {
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
          accountset: accountsets[accountsetSelected],
          status_parameter: statusParameters[statusParameterSelected],
        };
        console.log(JSON.stringify(params));
        setDisplayChart(true);
        fetch(
          "https://f2xuavolazelhbbfrrnlmf2hkq0sjdak.lambda-url.eu-west-2.on.aws/?fetch_from_iso=" +
            fetch_from_iso +
            "&accountset_id=" +
            accountsets[accountsetSelected] +
            "&status_parameter=" +
            statusParameters[statusParameterSelected]
        )
          .then((response) => response.json()) // Fetch JSON data
          .then((jsondata) => {
            console.log(jsondata);
            if (jsondata["error"]) {
              setParamDatasets([]);
            } else {
              setParamDatasets(jsondata.content["datasets"]);
              setLoadingChart(false);
            }
          });
      } catch (e) {
        console.log(e);
      }
    }
  };

  // For componentDidMount
  useEffect(() => {
    getaccountsets();
  }, []);

  // For componentDidUpdate + componentWillUnmount
  useEffect(() => {
    if (statusParameterSelected > -1 && accountsetSelected > -1) {
      setDisplayChart(false);
      setLoadingChart(true);
      getGraphPoints();
      // let intervalId = setInterval(getGraphPoints, 60000);
      // componentWillUnmount
      return () => {
        console.log("clearing");
        // clearInterval(intervalId);
      };
    }
  }, [statusParameterSelected, accountsetSelected]);

  const accountsetSelector = () => {
    return accountsets.length > 0 ? (
      <Row>
        <Col>
          <BsFormSelect
            title="Select accountset"
            options={accountsets}
            onChange={(e) => setaccountsetSelected(e)}
          ></BsFormSelect>
        </Col>
        <Col>
          <BsFormSelect
            title="Select Parameter"
            options={statusParameters}
            onChange={(e) => setStatusParameterSelected(e)}
          ></BsFormSelect>
        </Col>
      </Row>
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
          loadingChart ? (
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          ) : (
            <Line
              data={{ datasets: paramDatasets }}
              height={130}
              options={ChartOptions}
            />
          )
        ) : (
          <></>
        )}
      </div>
    );
  };

  return (
    <>
      <h5 className="py-3">Status Parameters</h5>
      <Container fluid>
        {accountsetSelector()}
        <Container>{funcRenderChart()}</Container>
      </Container>
    </>
  );
}
