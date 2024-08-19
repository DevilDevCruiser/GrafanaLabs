import React, { useState } from "react";
import { css } from "@emotion/css";
import { fetchLastLocation } from "./backend/fetchLastLocations";

interface Address {
  street: string;
  city: string;
}

interface Result {
  timestamp: number;
  address: Address;
  executionTime: number;
}

// Get styles using Emotion CSS
const getStyles = () => ({
  button: css`
    border: 1px solid black;
    background: transparent;
    padding: 5px;
  `,
  container: css`
    margin: 10px;
  `,
  table: css`
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;
  `,
  th: css`
    border: 1px solid black;
    padding: 8px;
    text-align: left;
  `,
  td: css`
    border: 1px solid black;
    padding: 8px;
    text-align: left;
  `,
  stats: css`
    margin-top: 10px;
  `,
});

function App() {
  const [responses, setResponses] = useState<Result[]>([]);
  const [fastest, setFastest] = useState<number | null>(null);
  const [slowest, setSlowest] = useState<number | null>(null);
  const [average, setAverage] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleOnClick = async () => {
    setIsLoading(true);
    const startTime = Date.now();
    const result = await fetchLastLocation();
    const endTime = Date.now();

    const executionTime = endTime - startTime;

    const newResult: Result = {
      timestamp: startTime,
      address: result.address,
      executionTime,
    };

    setResponses((prevResponses) => {
      const updatedResponses = [...prevResponses, newResult];
      updateStats(updatedResponses);
      return updatedResponses;
    });
    setIsLoading(false);
  };

  const updateStats = (responses: Result[]) => {
    const executionTimes = responses.map((r) => r.executionTime);
    const minTime = Math.min(...executionTimes);
    const maxTime = Math.max(...executionTimes);
    const avgTime =
      executionTimes.reduce((total, time) => total + time, 0) /
      executionTimes.length;

    setFastest(minTime);
    setSlowest(maxTime);
    setAverage(avgTime);
  };

  const s = getStyles();
  return (
    <div className={s.container}>
      <button className={s.button} disabled={isLoading} onClick={handleOnClick}>
        {`${isLoading ? "Loading..." : "Get Last Location"}`}
      </button>
      <table className={s.table}>
        <thead>
          <tr>
            <th className={s.th}>Timestamp</th>
            <th className={s.th}>Street</th>
            <th className={s.th}>City</th>
            <th className={s.th}>Execution Time (ms)</th>
          </tr>
        </thead>
        <tbody>
          {responses.map((res, index) => (
            <tr key={index}>
              <td className={s.td}>
                {new Date(res.timestamp).toLocaleString()}
              </td>
              <td className={s.td}>{res.address.street}</td>
              <td className={s.td}>{res.address.city}</td>
              <td className={s.td}>{res.executionTime}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className={s.stats}>
        <div>Fastest: {fastest ? fastest + " ms" : "N/A"}</div>
        <div>Slowest: {slowest ? slowest + " ms" : "N/A"}</div>
        <div>Average: {average ? average.toFixed(2) + " ms" : "N/A"}</div>
      </div>
    </div>
  );
}

export default App;
