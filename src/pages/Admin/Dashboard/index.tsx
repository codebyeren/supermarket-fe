import React, { useEffect, useState, useMemo } from "react";
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
  Legend,
} from "chart.js";
import ProductCard from "../../../components/Card/productCard";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const DashboardPage: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<{
    category: string;
    products: Product[];
  } | null>(null);
  const [selectedYear, setSelectedYear] = useState<string | number>("all");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [totalIncomeByYear, setTotalIncomeByYear] = useState<number>(0);

  useEffect(() => {
    setIsLoading(true);
    fetchDashboardData()
      .then((data) => {
        setDashboardData(data);
        const categories = Object.entries(data.topProductByParentCategory).map(
          ([category, products]) => ({ category, products })
        );
        if (categories.length > 0) {
          setSelectedCategory(categories[0]);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error loading dashboard data", err);
        setIsLoading(false);
      });
  }, []);

  const availableYears = useMemo(() => {
    if (!dashboardData) return [];
    const years = new Set<number>();
    dashboardData.revenueChart.forEach((item, index) => {
      // Validate date string
      if (item.date && typeof item.date === "string") {
        const date = new Date(item.date);
 
        if (!isNaN(date.getTime())) {
          const year = date.getFullYear();
          years.add(year);
        } else {
          console.warn(`Invalid date at index ${index}: ${item.date}`);
        }
      } else {
        console.warn(`Missing or invalid date at index ${index}: ${item.date}`);
      }
    });
    const sortedYears = Array.from(years).sort((a, b) => b - a);
    return sortedYears.length > 0 ? sortedYears : [new Date().getFullYear()];
  }, [dashboardData]);

  const chartData: ChartData<"bar"> = useMemo(() => {
    if (!dashboardData) return { labels: [], datasets: [] };
    const revenueChart = dashboardData.revenueChart;

    if (selectedYear === "all") {
      const revenueByYearMap = new Map<number, number>();
      revenueChart.forEach((item) => {
        const date = new Date(item.date);
        if (!isNaN(date.getTime())) {
          const year = date.getFullYear();
          revenueByYearMap.set(year, (revenueByYearMap.get(year) || 0) + item.total);
        }
      });

      const sortedYears = Array.from(revenueByYearMap.keys()).sort((a, b) => a - b);
      const revenues = sortedYears.map((year) => revenueByYearMap.get(year) || 0);

      setTotalIncomeByYear(revenues.reduce((sum, val) => sum + val, 0));

      return {
        labels: sortedYears.map((year) => year.toString()),
        datasets: [
          {
            label: "Doanh thu",
            data: revenues,
            backgroundColor: "#4e73df",
          },
        ],
      };
    } else {
      const monthlyRevenue = new Array(12).fill(0);
      revenueChart.forEach((item) => {
        const date = new Date(item.date);
        if (!isNaN(date.getTime()) && date.getFullYear() === Number(selectedYear)) {
          const monthIndex = date.getMonth();
          monthlyRevenue[monthIndex] += item.total;
        }
      });

      setTotalIncomeByYear(monthlyRevenue.reduce((sum, val) => sum + val, 0));

      return {
        labels: [
          "Tháng 1",
          "Tháng 2",
          "Tháng 3",
          "Tháng 4",
          "Tháng 5",
          "Tháng 6",
          "Tháng 7",
          "Tháng 8",
          "Tháng 9",
          "Tháng 10",
          "Tháng 11",
          "Tháng 12",
        ],
        datasets: [
          {
            label: "Doanh thu",
            data: monthlyRevenue,
            backgroundColor: "#4e73df",
          },
        ],
      };
    }
  }, [dashboardData, selectedYear]);

  const chartOptions: ChartOptions<"bar"> = useMemo(
    () => ({
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (context) => {
              const value = context.raw as number;
              return value.toLocaleString("en-US") + " $";
            },
          },
        },
      },
    }),
    []
  );

  if (isLoading) return <div className="text-center p-5">Loading...</div>;

  if (!dashboardData) return <div className="text-center p-5">Error loading data</div>;

  const { totalIncome, totalOrder, topProductByParentCategory } = dashboardData;
  const categories = Object.entries(topProductByParentCategory).map(([category, products]) => ({
    category,
    products,
  }));
  return (
    <div className="container py-4">
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card shadow h-100 p-3">
            <h5 className="text-primary">Total Revenue</h5>
            <h3>{totalIncome.toLocaleString("en-US")} $</h3>
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
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0">Revenue Chart</h5>
          <select
            className="form-select w-auto"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            <option value="all">All Years</option>
            {availableYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
        <h6>Total Revenue (Selected Period): {totalIncomeByYear.toLocaleString("en-US")} $</h6>
        <Bar data={chartData} options={chartOptions} />
      </div>

      <div className="mb-3">
        {categories.map((category) =>
          category.products.length > 0 ? (
            <button
              key={category.category}
              onClick={() => setSelectedCategory(category)}
              className={`btn ${
                selectedCategory?.category === category.category
                  ? "btn-primary"
                  : "btn-outline-primary"
              } me-2 mb-2`}
            >
              {category.category}
            </button>
          ) : null
        )}
      </div>

      {selectedCategory && (
        <div className="card shadow p-3">
          <h5 className="mb-3">{selectedCategory.category}</h5>
          <div className="row">
            {selectedCategory.products.map((product: Product) => (
              <div key={product.productId} className="col-md-3 mb-3">
                <ProductCard product={product} hideAddToCartButton />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;