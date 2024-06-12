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
  //const newRow = (price = "", unit = null) => ({ price: price, unit: unit });
  const [tableRows, setTableRows] = useState([
    { price: "", unit: "" },
    { price: "", unit: "" },
  ]);
  const [bestRowIndex, setBestRowIndex] = useState();

  function handlePriceChange(rowIndex, price) {
    const tableRowsCopy = tableRows.map((row) => ({ ...row }));
    tableRowsCopy[rowIndex].price = price;
    const bestPriceRow = findBestPriceRow(tableRowsCopy);
    setTableRows(tableRowsCopy);
    setBestRowIndex(bestPriceRow.index);
  }
  function handleUnitChange(rowIndex, unit) {
    const tableRowsCopy = tableRows.map((row) => ({ ...row }));
    tableRowsCopy[rowIndex].unit = unit;
    const bestPriceRow = findBestPriceRow(tableRowsCopy);
    setTableRows(tableRowsCopy);
    setBestRowIndex(bestPriceRow.index);
  }

  function findBestPriceRow(tableRows) {
    const rates = tableRows.map((row) => {
      if (!row.price || !row.unit) return;
      return row.price / row.unit;
    });

    const rates2 = rates.map((value, index) => ({ value, index }));
    rates2.sort((a, b) => a.value - b.value);
    console.log(rates2);
    return rates2[0];
  }

  //console.log(tableRows);

  return (
    <div>
      <div className={bestRowIndex ? "bestrow" : ""}>
        <span>
          <input
            type="number"
            onChange={(e) => handlePriceChange(0, e.target.value)}
          />
        </span>
        <span>
          <input
            type="number"
            onChange={(e) => handleUnitChange(0, e.target.value)}
          />
        </span>
      </div>
      <div>
        <span>
          <input
            type="number"
            onChange={(e) => handlePriceChange(1, e.target.value)}
          />
        </span>
        <span>
          <input
            type="number"
            onChange={(e) => handleUnitChange(1, e.target.value)}
          />
        </span>
      </div>
    </div>
  );
}
