import { useState, useEffect } from "react";
import "./input.css";
import * as icon from "./icons";

const style = {
  button:
    "bg-blue-500 hover:bg-blue-700 disabled:bg-gray-300 text-white py-2 px-4 rounded",
  buttonRed: "bg-red-500 hover:bg-red-700 text-white px-1 rounded",
  input:
    "dark:bg-gray-700 dark:opacity-80 dark:text-white border border-gray-300 rounded-md py-2 px-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
  highlightTableRow: "bg-green-400",
};

export default function App() {
  return <Table />;
}

const Table = () => {
  const emptyRow = {
    // cols:
    price: { index: "price", value: undefined },
    unit: { index: "unit", value: undefined },
    rate: { index: "rate", value: undefined },
    description: { index: "description", value: undefined, active: false },
    addEmptyRow() {
      return {
        [this.price.index]: this.price.value,
        [this.unit.index]: this.unit.value,
        [this.rate.index]: this.rate.value,
        descriptionIsActive: this.description.active,
      };
    },
  };

  class Row {
    constructor() {
      this.price = { index: "price", value: undefined };
      this.unit = { index: "unit", value: undefined };
      this.rate = { index: "rate", value: undefined };
      this.description = {
        index: "description",
        value: undefined,
        active: false,
      };
    }
  }

  // const initialTableRows = [emptyRow.addEmptyRow(), emptyRow.addEmptyRow()];
  const initialTableRows = [new Row(), new Row()];

  const [history, setHistory] = useState([initialTableRows]);
  const [historyPoint, setHistoryPoint] = useState(history.length - 1);
  const [bestRowIndex, setBestRowIndex] = useState();

  useEffect(() => {
    setBestRowIndex(findBestPriceRowIndex(history[historyPoint]));
  }, [history, historyPoint]);

  const replaceLastHistorySnap = (history, newTableRows) => {
    const newHistory = [...history.slice(0, -1), newTableRows];
    setHistory(newHistory);
    return newHistory;
  };

  const replaceAllHistorySnapsAfterHistoryPoint = (
    history,
    historyPoint,
    newTableRows,
  ) => {
    const newHistory = [...history.slice(0, historyPoint + 1), newTableRows];
    setHistoryPoint(historyPoint + 1);
    setHistory(newHistory);
    return newHistory;
  };

  const handleInputChange = (rowIndex, colIndex, inputValue) => {
    const newTableRows = history[historyPoint].map((row) =>
      structuredClone(row),
    );

    newTableRows[rowIndex][colIndex].value = inputValue;

    newTableRows[rowIndex].rate.value =
      newTableRows[rowIndex].price.value && newTableRows[rowIndex].unit.value
        ? (
            newTableRows[rowIndex].price.value /
            newTableRows[rowIndex].unit.value
          ).toFixed(2)
        : undefined;

    // if historyPoint is somewhere in the middle of the history array
    // then discard everything after historyPoint
    if (historyPoint < history.length - 1) {
      replaceAllHistorySnapsAfterHistoryPoint(
        history,
        historyPoint,
        newTableRows,
      );
    } else {
      // replace the last item in the history array
      replaceLastHistorySnap(history, newTableRows);
    }
  };

  const addNewRow = () => {
    const newTableRows = [...history[historyPoint], new Row()];
    replaceAllHistorySnapsAfterHistoryPoint(
      history,
      historyPoint,
      newTableRows,
    );
  };

  const removeRow = (rowIndex) => {
    const newTableRows = history[historyPoint].filter(
      (row, index) => index != rowIndex,
    );
    replaceAllHistorySnapsAfterHistoryPoint(
      history,
      historyPoint,
      newTableRows,
    );
  };

  const clearTable = () => {
    const newTableRows = [new Row(), new Row()];
    replaceAllHistorySnapsAfterHistoryPoint(
      history,
      historyPoint,
      newTableRows,
    );
  };

  const goBack = () => setHistoryPoint(historyPoint - 1);
  const goForward = () => setHistoryPoint(historyPoint + 1);

  console.log("historyPoint", historyPoint);
  console.log(history);

  return (
    <div className="flex flex-col justify-center min-h-svh container mx-auto px-4">
      {history[historyPoint].map((row, index) => (
        <TableRow
          key={index}
          rowIndex={index}
          price={row.price}
          unit={row.unit}
          rate={row.rate}
          description={row.description}
          bestRowIndex={bestRowIndex}
          handleInputChange={handleInputChange}
          removeRow={removeRow}
        />
      ))}

      <div className="my-7 flex justify-center">
        <button className={`mx-2 ${style.button}`} onClick={clearTable}>
          clear
        </button>
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
    </div>
  );
};

const TableRow = ({
  rowIndex,
  price,
  unit,
  rate,
  description,
  bestRowIndex,
  handleInputChange,
  removeRow,
}) => {
  const isBestRow = bestRowIndex === rowIndex;

  return (
    <div
      className={`
      flex 
      overflow-x-auto	
      snap-x 
      snap-mandatory
      mt-4 
      first:mt-0 
      ${isBestRow ? style.highlightTableRow : ""}`}
    >
      <div className="flex snap-start">
        <button
          onClick={() => {
            removeRow(rowIndex);
          }}
          className={style.buttonRed}
        >
          {icon.trash}
        </button>
      </div>

      <div className="pl-2 shrink-0	basis-1/5 snap-start">
        <input
          type="number"
          placeholder={rate.value ?? rate.index}
          readOnly
          className={`w-full ${style.input}`}
        />
      </div>
      <div className="pl-2 shrink-0	basis-1/5 snap-start">
        <input
          type="number"
          value={price.value ?? price.index}
          onChange={(event) =>
            handleInputChange(rowIndex, price.index, event.target.value)
          }
          className={`w-full ${style.input}`}
          placeholder={price.index}
        />
      </div>
      <div className="pl-2 shrink-0	basis-1/5 snap-start">
        <input
          type="number"
          value={unit.value ?? unit.index}
          onChange={(event) =>
            handleInputChange(rowIndex, unit.index, event.target.value)
          }
          className={`w-full ${style.input}`}
          placeholder={unit.index}
        />
      </div>
      <div className="pl-2 shrink-0	basis-1/2 snap-start">
        <input
          type="text"
          value={description.value}
          placeholder="D"
          className={`w-full ${style.input}`}
          onChange={(event) =>
            handleInputChange(rowIndex, description.index, event.target.value)
          }
        />
      </div>
    </div>
  );
};

function findBestPriceRowIndex(tableRows) {
  let rows = tableRows
    .map((row, index) => ({ ...row, index: index }))
    .filter((row) => row.price.value && row.unit.value && row.rate.value);
  // leave row.rate.value only

  if (!rows.length) return;
  rows.sort((a, b) => a.rate.value - b.rate.value);
  return rows[0].index;
}
