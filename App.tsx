import { useState } from "react";
import Header from "./components/Header";
import PredictionControls from "./components/PredictionControls";
import TrendChart from "./components/TrendChart";
import PredictionLogs from "./components/PredictionLogs";
import { fetchPrediction, fetchSixMonthTrend } from "./services/api";


interface HistoryItem {
  currency: string;
  date: string;
  rate: number;
  amount: number;
  converted: number;
}

interface ChartItem {
  month: string;
  predicted_value: number;
}

function App() {
  const [currency, setCurrency] = useState("usd");
  const [amount, setAmount] = useState("1");
  const [year, setYear] = useState("2026");
  const [month, setMonth] = useState("9");
  const [day, setDay] = useState("22");

  const [result, setResult] = useState<HistoryItem | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [sixMonthData, setSixMonthData] = useState<ChartItem[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const predictCurrency = async () => {
    setError("");
    setResult(null);
    setSixMonthData([]);
    setLoading(true);

    try {
      const inputData = {
        Year: Number(year),
        Month: Number(month),
        Day: Number(day),
      };

      const data = await fetchPrediction(currency, inputData);
      const rate = Number(data.predicted_value);//res,predictesd currency rate
      const converted = Number(amount) * rate;

      const formattedMonth = String(month).padStart(2, "0");
      const formattedDay = String(day).padStart(2, "0");

      const newResult: HistoryItem = {
        currency: currency.toUpperCase(),
        date: `${year}-${formattedMonth}-${formattedDay}`,
        rate,
        amount: Number(amount),
        converted,
      };

      setResult(newResult);
      setHistory((oldHistory) => [newResult, ...oldHistory]);

      const sixMonthResult = await fetchSixMonthTrend(currency, inputData);

      const chartData = sixMonthResult.predictions.map((item: any) => ({
        month: `${item.year}-${String(item.month).padStart(2, "0")}`,
        predicted_value: Number(item.predicted_value.toFixed(2)),
      }));

      setSixMonthData(chartData);
    } catch (err) {
      setError("Backend connection error. Please check FastAPI.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <Header />

      <div className="dashboard-grid">
        <div className="left-panel">
          <PredictionControls
            currency={currency} setCurrency={setCurrency}
            amount={amount} setAmount={setAmount}
            year={year} setYear={setYear}
            month={month} setMonth={setMonth}
            day={day} setDay={setDay}
            onPredict={predictCurrency}
            loading={loading}
            error={error}
            result={result}
          />
        </div>

        <div className="right-panel">
          <TrendChart sixMonthData={sixMonthData} currency={currency} />
          <PredictionLogs history={history} />
        </div>
      </div>
    </div>
  );
}

export default App;