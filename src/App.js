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
      return { price: undefined, unit: undefined };
    },
    priceKey: "price",
    unitKey: "unit",
  };
  const [tableRows, setTableRows] = useState([
    tableRow.addRow(),
    tableRow.addRow(),
  ]);
  const [bestRowIndex, setBestRowIndex] = useState();

  function handlePriceChange(rowIndex, price) {
    const tableRowsCopy = tableRows.map((row) => ({ ...row }));
    tableRowsCopy[rowIndex].price = price;
    const bestPriceRow = findBestPriceRow(tableRowsCopy);
    setTableRows(tableRowsCopy);
    bestPriceRow
      ? setBestRowIndex(bestPriceRow.index)
      : setBestRowIndex(undefined);
  }
  function handleUnitChange(rowIndex, unit) {
    const tableRowsCopy = tableRows.map((row) => ({ ...row }));
    tableRowsCopy[rowIndex].unit = unit;
    const bestPriceRow = findBestPriceRow(tableRowsCopy);
    setTableRows(tableRowsCopy);
    bestPriceRow
      ? setBestRowIndex(bestPriceRow.index)
      : setBestRowIndex(undefined);
  }

  function findBestPriceRow(tableRows) {
    let rates = tableRows.filter((row) => row.price && row.unit);

    if (!rates.length) return;
    rates = rates.map((row) => row.price / row.unit);

    const rates2 = rates.map((value, index) => ({ value, index }));
    rates2.sort((a, b) => a.value - b.value);

    console.log(rates2);
    return rates2[0];
  }

  //console.log(tableRows);

  return (
    <div>
      <div className={bestRowIndex == 0 ? "bestrow" : ""}>
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
      <div className={bestRowIndex == 1 ? "bestrow" : ""}>
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
