import { useState, useEffect } from "react";
import "./input.css";
import * as icon from "./icons";

const style = {
  button:
    "bg-blue-500 hover:bg-blue-700 disabled:bg-gray-300 text-white py-2 px-4 rounded",
  buttonRed: "bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded",
  input:
    "dark:bg-gray-700 dark:opacity-80 dark:text-white border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
  highlightTableRow: "bg-green-400",
};

export default function App() {
  return (
    <div className="flex flex-col justify-center min-h-svh container mx-auto px-4">
      <Table />
    </div>
  );
}

const Table = () => {
  // do: join emptyRow obj and addEmptyRow
  // do: add description input
  // do: click back button then add new row. add new row button works as forward.
  // do: disable input negative numbers

  const emptyRow = {
    // cols:
    price: { index: "price", value: undefined },
    unit: { index: "unit", value: undefined },
    rate: { index: "rate", value: undefined },
    addEmptyRow() {
      return {
        [this.price.index]: this.price.value,
        [this.unit.index]: this.unit.value,
        [this.rate.index]: this.rate.value,
      };
    },
  };

  const initialTableRows = [emptyRow.addEmptyRow(), emptyRow.addEmptyRow()];

  const [history, setHistory] = useState([initialTableRows]);
  const [historyPoint, setHistoryPoint] = useState(history.length - 1);
  const [bestRowIndex, setBestRowIndex] = useState();

  useEffect(() => {
    setBestRowIndex(findBestPriceRowIndex(history[historyPoint]));
  }, [history]);

  const handleInputChange = (rowIndex, colIndex, inputValue) => {
    const tableRowsCopy = history[historyPoint].map((row) => ({ ...row }));

    tableRowsCopy[rowIndex][colIndex] = inputValue;

    tableRowsCopy[rowIndex].rate = getPriceToUnitRate(
      tableRowsCopy[rowIndex].price,
      tableRowsCopy[rowIndex].unit,
    );

    if (historyPoint < history.length - 1) {
      const newHistory = [...history.slice(0, historyPoint + 1), tableRowsCopy];
      setHistoryPoint(historyPoint + 1);
      setHistory(newHistory);
    } else {
      const newHistory = [...history.slice(0, -1), tableRowsCopy];
      setHistory(newHistory);
    }
  };

  const addNewRow = () => {
    const newTableRows = [...history[historyPoint], emptyRow.addEmptyRow()];
    setHistoryPoint(historyPoint + 1);
    setHistory([...history, newTableRows]);
  };

  const removeRow = (rowIndex) => {
    const newTableRows = history[historyPoint].filter(
      (row, index) => index != rowIndex,
    );
    setHistoryPoint(historyPoint + 1);
    setHistory([...history, newTableRows]);
  };

  const goBack = () => setHistoryPoint(historyPoint - 1);
  const goForward = () => setHistoryPoint(historyPoint + 1);

  console.log("historyPoint", historyPoint);
  console.log(history);

  return (
    <>
      {history[historyPoint].map((row, index) => (
        <TableRow
          key={index}
          index={index}
          price={row.price}
          unit={row.unit}
          rate={row.rate}
          priceIndex={emptyRow.price.index}
          unitIndex={emptyRow.unit.index}
          bestRowIndex={bestRowIndex}
          handleInputChange={handleInputChange}
          removeRow={removeRow}
        />
      ))}

      <div className="my-7 text-center">
        <button
          className={`mx-2 ${style.button}`}
          onClick={goBack}
          disabled={historyPoint > 0 ? false : true}
        >
          {icon.arrowLeft}
        </button>
        <button
          className={`mx-2 ${style.button}`}
          onClick={goForward}
          disabled={historyPoint < history.length - 1 ? false : true}
        >
          {icon.arrowRight}
        </button>
        <button className={`mx-2 ${style.button}`} onClick={addNewRow}>
          {icon.plus}
        </button>
      </div>
    </>
  );
};

const TableRow = ({
  index,
  price,
  unit,
  rate,
  priceIndex,
  unitIndex,
  bestRowIndex,
  handleInputChange,
  removeRow,
}) => {
  const isBestRow = bestRowIndex === index;

  return (
    <div
      className={`flex mt-4 first:mt-0 rounded ${isBestRow ? style.highlightTableRow : ""}`}
    >
      <div className="flex">
        <button
          onClick={() => {
            removeRow(index);
          }}
          className={style.buttonRed}
        >
          {icon.trash}
        </button>
      </div>

      <div className="grow ml-2">
        <input
          type="number"
          placeholder={rate}
          disabled
          className={`w-full ${style.input}`}
        />
      </div>
      <div className="grow ml-2">
        <input
          type="number"
          value={price ? price : ""}
          onChange={(e) => handleInputChange(index, priceIndex, e.target.value)}
          className={`w-full ${style.input}`}
          placeholder={priceIndex}
        />
      </div>
      <div className="grow ml-2">
        <input
          type="number"
          value={unit ? unit : ""}
          onChange={(e) => handleInputChange(index, unitIndex, e.target.value)}
          className={`w-full ${style.input}`}
          placeholder={unitIndex}
        />
      </div>
    </div>
  );
};

function getPriceToUnitRate(price, unit) {
  if (!price || !unit) return;
  return (price / unit).toFixed(2);
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
