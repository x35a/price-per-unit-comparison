import { useState } from "react";
import "./styles.css";

export default function App() {
  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
      <Table />
    </div>
  );
}

function Table() {
  const tableRow = {
    addRow() {
      return { price: undefined, unit: undefined, rate: undefined };
    },
    priceKey: "price",
    unitKey: "unit",
  };

  const [tableRows, setTableRows] = useState([
    tableRow.addRow(),
    tableRow.addRow(),
  ]);
  const [bestRowIndex, setBestRowIndex] = useState();

  function handleInputChange(rowIndex, inputKey, value) {
    const tableRowsCopy = tableRows.map((row) => ({ ...row }));

    tableRowsCopy[rowIndex][inputKey] = value;

    tableRowsCopy[rowIndex].rate = getPriceToUnitRate(
      tableRowsCopy[rowIndex].price,
      tableRowsCopy[rowIndex].unit,
    );

    const bestPriceRowIndex = findBestPriceRowIndex(tableRowsCopy);

    setTableRows(tableRowsCopy);
    setBestRowIndex(bestPriceRowIndex);
  }

  const tableRowsMarkup = tableRows.map((row, index) => {
    return (
      <div key={index} className={bestRowIndex == index ? "bestrow" : ""}>
        <span>
          <input
            type="number"
            onChange={(e) =>
              handleInputChange(index, tableRow.priceKey, e.target.value)
            }
          />
        </span>
        <span>
          <input
            type="number"
            onChange={(e) =>
              handleInputChange(index, tableRow.unitKey, e.target.value)
            }
          />
        </span>
        <span>
          <input type="number" placeholder={row.rate} disabled />
        </span>
      </div>
    );
  });

  return <>{tableRowsMarkup}</>;
}

function getPriceToUnitRate(price, unit) {
  if (!price || !unit) return;
  return price / unit;
}

function findBestPriceRowIndex(tableRows) {
  let rows = tableRows
    .map((row, index) => ({ ...row, index: index }))
    .filter((row) => row.price && row.unit);
  if (!rows.length) return;
  rows = rows.map((row) => ({ ...row, rate: row.price / row.unit }));
  rows.sort((a, b) => a.rate - b.rate);
  return rows[0].index;
}
