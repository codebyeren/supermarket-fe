import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import type { ChartData, ChartOptions } from "chart.js";
import type { DashboardData, Product } from "../../../types";
import { fetchDashboardData } from "../../../services/dashborad";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import ProductCard from "../../../components/Card/productCard";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const DashboardPage: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  useEffect(() => {
    fetchDashboardData().then((data) => {
      setDashboardData(data);
      const firstCategory = Object.keys(data.topProductByParentCategory).find(
        (key) => data.topProductByParentCategory[key].length > 0
      );
      if (firstCategory) setSelectedCategory(firstCategory);
    });
  }, []);

  if (!dashboardData) return <div className="text-center p-5">Loading...</div>;

  const { totalIncome, totalOrder, topProductByParentCategory, revenueChart } = dashboardData;

  const chartData: ChartData<"bar"> = {
    labels: revenueChart.map((item) => item.date),
    datasets: [{
      label: "Revenue",
      data: revenueChart.map((item) => item.total),
      backgroundColor: "#4e73df"
    }]
  };

  return (
    <div className="container py-4">
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card shadow h-100 p-3">
            <h5 className="text-primary">Total Revenue</h5>
            <h3>{totalIncome} $</h3>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card shadow h-100 p-3">
            <h5 className="text-success">Total Orders</h5>
            <h3>{totalOrder}</h3>
          </div>
        </div>
      </div>

      <div className="card shadow p-3 mb-4">
        <h5 className="mb-3">Revenue Chart</h5>
        <Bar data={chartData} options={{ responsive: true } as ChartOptions<"bar">} />
      </div>

      <div className="mb-3">
        {Object.entries(topProductByParentCategory).map(([category, products]) =>
          products.length > 0 ? (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`btn ${selectedCategory === category ? "btn-primary" : "btn-outline-primary"} me-2 mb-2`}
            >
              {category}
            </button>
          ) : null
        )}
      </div>

      {selectedCategory && (
        <div className="card shadow p-3">
          <h5 className="mb-3">{selectedCategory}</h5>
          <div className="row">
            {topProductByParentCategory[selectedCategory].map((product: Product) => (
              <div key={product.productId} className="col-md-3 mb-3">
               <ProductCard product={product} hideAddToCartButton></ProductCard>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
