

const Dashboard = () => {
  const summaryData = {
    totalTasks: 25,
    completedPercentage: 40,
    pendingPercentage: 60,
    avgTime: 3.5,
  };

  const pendingData = {
    pendingTasks: 15,
    totalTimeLapsed: 56,
    totalTimeToFinish: 24,
    prioritySummary: [
      { priority: 1, pendingTasks: 3, timeLapsed: 12, timeToFinish: 8 },
      { priority: 2, pendingTasks: 5, timeLapsed: 6, timeToFinish: 3 },
      { priority: 3, pendingTasks: 1, timeLapsed: 8, timeToFinish: 7 },
      { priority: 4, pendingTasks: 0, timeLapsed: 0, timeToFinish: 0 },
      { priority: 5, pendingTasks: 6, timeLapsed: 30, timeToFinish: 6 },
    ],
  };

  return (
    <div className="p-4 max-w-screen-lg mx-auto">
      {/* Summary Section */}
      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="text-center">
          <p className="text-lg font-bold">{summaryData.totalTasks}</p>
          <p className="text-gray-500">Total tasks</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold">
            {summaryData.completedPercentage}%
          </p>
          <p className="text-gray-500">Tasks completed</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold">{summaryData.pendingPercentage}%</p>
          <p className="text-gray-500">Tasks pending</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold">{summaryData.avgTime} hrs</p>
          <p className="text-gray-500">Average time per task</p>
        </div>
      </div>

      {/* Pending Task Summary */}
      <div>
        <h2 className="text-xl font-bold mb-4">Pending task summary</h2>
        <div className="grid sm:grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <p className="text-lg font-bold">{pendingData.pendingTasks}</p>
            <p className="text-gray-500">Pending tasks</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold">
              {pendingData.totalTimeLapsed} hrs
            </p>
            <p className="text-gray-500">Total time lapsed</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold">
              {pendingData.totalTimeToFinish} hrs
            </p>
            <p className="text-gray-500">Estimated time to finish</p>
          </div>
        </div>

        {/* Priority Table */}
        <table className="w-full border border-gray-300 text-center">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2">Task priority</th>
              <th className="border px-4 py-2">Pending tasks</th>
              <th className="border px-4 py-2">Time lapsed (hrs)</th>
              <th className="border px-4 py-2">Time to finish (hrs)</th>
            </tr>
          </thead>
          <tbody>
            {pendingData.prioritySummary.map((row) => (
              <tr key={row.priority}>
                <td className="border px-4 py-2">{row.priority}</td>
                <td className="border px-4 py-2">{row.pendingTasks}</td>
                <td className="border px-4 py-2">{row.timeLapsed}</td>
                <td className="border px-4 py-2">{row.timeToFinish}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
