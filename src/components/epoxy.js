import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

const EpoxyComponent = () => {
  // State variables
  const [time, setTime] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [temperature, setTemperature] = useState(0);
  const [notification, setNotification] = useState('');
  const [timeData, setTimeData] = useState([]);
  const [temperatureData, setTemperatureData] = useState([]);

  // Method to set the time
  const setTimeHandler = (hours, minutes, seconds) => {
    setTime({ hours, minutes, seconds });
  };

  // Method to set the temperature
  const setTemperatureHandler = (temp) => {
    setTemperature(temp);
  };

  // Method to check time and trigger notifications if time is between 15-20 minutes
  const checkTimeAndNotify = () => {
    const totalMinutes = time.hours * 60 + time.minutes + time.seconds / 60;

    // Check if time is within the 15–20 minute range
    if (totalMinutes >= 15 && totalMinutes <= 20) {
      setNotification('The epoxy is within range and no loose.');
    }
  };

  // Method to detect the epoxy level based on temperature
  const detectEpoxyLevel = () => {
    return temperature >= 70 ? "High" : "Low"; // Simple detection based on temperature
  };

  // Method to update the trend chart with the latest data
  const updateChart = () => {
    const totalMinutes = time.hours * 60 + time.minutes + time.seconds;
    setTimeData((prevTimeData) => {
      const updatedTimeData = [...prevTimeData, totalMinutes];
      if (updatedTimeData.length > 10) updatedTimeData.shift(); // Keep the last 10 data points
      return updatedTimeData;
    });
    setTemperatureData((prevTemperatureData) => {
      const updatedTemperatureData = [...prevTemperatureData, temperature];
      if (updatedTemperatureData.length > 10) updatedTemperatureData.shift();
      return updatedTemperatureData;
    });
  };

  // Chart data
  const chartData = {
    labels: timeData.map((_, index) => `Point ${index + 1}`),
    datasets: [
      {
        label: 'Time (Minutes)',
        data: timeData,
        borderColor: 'rgba(75, 192, 192, 1)',
        fill: false,
      },
      {
        label: 'Temperature (°C)',
        data: temperatureData,
        borderColor: 'rgba(255, 99, 132, 1)',
        fill: false,
      },
    ],
  };

  // Handle button click to update epoxy
  const handleUpdateEpoxy = () => {
    checkTimeAndNotify();
    updateChart();
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-semibold text-center mb-6">Epoxy Monitoring</h1>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Set Time (Hours, Minutes, Seconds):</label>
        <div className="flex space-x-2">
          <input
            type="number"
            className="w-16 p-2 border border-gray-300 rounded"
            placeholder="Hours"
            value={time.hours}
            onChange={(e) => setTimeHandler(parseInt(e.target.value), time.minutes, time.seconds)}
          />
          <input
            type="number"
            className="w-16 p-2 border border-gray-300 rounded"
            placeholder="Minutes"
            value={time.minutes}
            onChange={(e) => setTimeHandler(time.hours, parseInt(e.target.value), time.seconds)}
          />
          <input
            type="number"
            className="w-16 p-2 border border-gray-300 rounded"
            placeholder="Seconds"
            value={time.seconds}
            onChange={(e) => setTimeHandler(time.hours, time.minutes, parseInt(e.target.value))}
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Set Temperature (°C):</label>
        <input
          type="number"
          className="w-32 p-2 border border-gray-300 rounded"
          placeholder="Temperature"
          value={temperature}
          onChange={(e) => setTemperatureHandler(parseInt(e.target.value))}
        />
      </div>

      <button
        onClick={handleUpdateEpoxy}
        className="w-full py-2 bg-blue-500 text-white rounded-lg mt-4 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Update Epoxy
      </button>

      <div className="mt-6">
        <h2 className="text-xl font-semibold">Epoxy Details</h2>
        <p className="text-gray-700">{notification}</p>
        <p className="text-gray-700">
          Cartridge: SMO <br />
          Epoxy Level: {detectEpoxyLevel()} <br />
          Temperature: {temperature}°C
        </p>
      </div>

      {/* Mini Trend Chart */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold">Time and Temperature Trend</h2>
        <Line data={chartData} />
      </div>
    </div>
  );
};

export default EpoxyComponent;
