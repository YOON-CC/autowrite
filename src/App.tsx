import React, { useEffect, useState } from "react";
import { getMountains } from "./libs/googleSheet";
import "./App.css";

type DataRow = {
  A: string;
  B: string;
  C: string;
  D: string;
  E: string;
  F: string;
  G: string;
  H: string;
  I: string;
  J: string;
  K: string;
};

type Data = {
  [key: string]: DataRow;
};

// type Cosmetic = {
//   cosmetic: string;
//   image: string;
//   costRange: string;
//   url: string;
//   maxReview: {
//     score: string;
//     summary: string;
//   };
//   minReview: {
//     score: string;
//     summary: string;
//   };
// };

// type References = {
//   youtube: string[];
//   blog: string[];
//   etc: string[];
// };

const App: React.FC = () => {
  const [data, setData] = useState<Data | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getMountains();
        setData(result);
      } catch (e) {
        setError("Failed to fetch data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  if (!data) return <div>No data available</div>;

  // Transform the data
  const transformedData = {
    answer: data["0"]?.A || "",
    cosmeticList: Object.keys(data)
      .filter((key) => key !== "0")
      .map((key) => ({
        cosmetic: data[key].A || "",
        image: data[key].B || "",
        costRange: data[key].C || "",
        url: data[key].D || "",
        maxReview: {
          score: data[key].E || "", // Assuming maxReview score is in column E
          summary: data[key].F || "", // Adjust if needed
        },
        minReview: {
          score: data[key].G || "", // Assuming minReview score is in column G
          summary: data[key].H || "", // Adjust if needed
        },
      })),
    references: {
      youtube: Object.keys(data)
        .filter((key) => key !== "0") // Exclude header row or any specific key if needed
        .map((key) => data[key].I) // Collect YouTube links
        .filter(Boolean), // Remove empty values
      blog: Object.keys(data)
        .filter((key) => key !== "0") // Exclude header row or any specific key if needed
        .map((key) => data[key].J) // Collect Blog links
        .filter(Boolean), // Remove empty values
      etc: Object.keys(data)
        .filter((key) => key !== "0") // Exclude header row or any specific key if needed
        .map((key) => data[key].K) // Collect Other links
        .filter(Boolean), // Remove empty values
    },
  };

  const jsonData = JSON.stringify(transformedData, null, 2);

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(jsonData).then(
      () => {
        alert("복사되었습니다");
      },
      (err) => {
        alert("Failed to copy JSON data: " + err);
      }
    );
  };

  return (
    <div className="flex-container">
      <h2>클린프리 업무 자동화</h2>
      {/* <pre className="json-text">{jsonData}</pre>{" "} */}
      {/* Use <pre> to format the JSON output */}
      {/* Combined Table to display the data */}
      {/* <h2>Data Table</h2> */}
      <table cellPadding="5">
        <thead>
          <tr>
            <th>Cosmetic</th>
            <th>Image</th>
            <th>Cost Range</th>
            <th>URL</th>
            <th>Max Review Score</th>
            <th>Max Review Summary</th>
            <th>Min Review Score</th>
            <th>Min Review Summary</th>
            <th>YouTube Links</th>
            <th>Blog Links</th>
            <th>Other Links</th>
          </tr>
        </thead>
        <tbody>
          {transformedData.cosmeticList.map((cosmetic, index) => (
            <tr key={index}>
              <td>{cosmetic.cosmetic}</td>
              <td>{cosmetic.image}</td>
              <td>{cosmetic.costRange}</td>
              <td>{cosmetic.url}</td>
              <td>{cosmetic.maxReview.score}</td>
              <td>{cosmetic.maxReview.summary}</td>
              <td>{cosmetic.minReview.score}</td>
              <td>{cosmetic.minReview.summary}</td>
              <td>
                {transformedData.references.youtube[index] ? (
                  <a
                    href={transformedData.references.youtube[index]}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {transformedData.references.youtube[index]}
                  </a>
                ) : (
                  ""
                )}
              </td>
              <td>
                {transformedData.references.blog[index] ? (
                  <a
                    href={transformedData.references.blog[index]}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {transformedData.references.blog[index]}
                  </a>
                ) : (
                  ""
                )}
              </td>
              <td>
                {transformedData.references.etc[index] ? (
                  <a
                    href={transformedData.references.etc[index]}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {transformedData.references.etc[index]}
                  </a>
                ) : (
                  ""
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
        <button onClick={handleCopyToClipboard}>JSON으로 복사</button>
      </div>
    </div>
  );
};

export default App;
