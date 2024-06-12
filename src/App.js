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

  function handlePriceChange(rowIndex, price) {
    const tableRowsCopy = tableRows.map((row) => ({ ...row }));
    tableRowsCopy[rowIndex].price = price;
    const bestPriceRow = findBestPriceRow(tableRowsCopy);
    tableRowsCopy[rowIndex].rate = getPriceToUnitRate(
      price,
      tableRowsCopy[rowIndex].unit,
    );
    setTableRows(tableRowsCopy);
    bestPriceRow
      ? setBestRowIndex(bestPriceRow.index)
      : setBestRowIndex(undefined);
  }
  function handleUnitChange(rowIndex, unit) {
    const tableRowsCopy = tableRows.map((row) => ({ ...row }));
    tableRowsCopy[rowIndex].unit = unit;
    const bestPriceRow = findBestPriceRow(tableRowsCopy);
    tableRowsCopy[rowIndex].rate = getPriceToUnitRate(
      tableRowsCopy[rowIndex].price,
      unit,
    );
    setTableRows(tableRowsCopy);
    bestPriceRow
      ? setBestRowIndex(bestPriceRow.index)
      : setBestRowIndex(undefined);
  }

  function getPriceToUnitRate(price, unit) {
    if (!price || !unit) return;
    return price / unit;
  }

  function findBestPriceRow(tableRows) {
    let rates = tableRows.map((row, index) => {
      let newrow = { ...row, index: index };
      return newrow;
    });
    rates = rates.filter((row) => row.price && row.unit);
    //
    if (!rates.length) return;

    rates = rates.map((row) => {
      row.rate = row.price / row.unit;
      return row;
    });

    //const rates2 = rates.map((value, index) => ({ value, index }));
    rates.sort((a, b) => a.rate - b.rate);
    //console.log(rates);
    return rates[0];
  }

  //console.log(tableRows);

  const allrows = tableRows.map((row, index) => {
    return (
      <div key={index} className={bestRowIndex == index ? "bestrow" : ""}>
        <span>
          <input
            type="number"
            onChange={(e) => handlePriceChange(index, e.target.value)}
          />
        </span>
        <span>
          <input
            type="number"
            onChange={(e) => handleUnitChange(index, e.target.value)}
          />
        </span>
        <span>
          <input type="number" placeholder={row.rate} disabled />
        </span>
      </div>
    );
  });

  return <>{allrows}</>;
}
