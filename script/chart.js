  //CHART
  Chart.register(ChartDataLabels);

  const ctx = document.getElementById('crimeChart').getContext('2d');
  let chart;

  // Initialize Flatpickr
  flatpickr('#dateRange', { mode: 'range', dateFormat: 'Y-m-d' });

      // Fetch and update chart data
      const fetchChartData = async ( viewMode, startDate, endDate) => {
        try {
          const response = await fetch('http://localhost:3000/api/reports', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ viewMode, startDate, endDate }),
          });
          return await response.json();
        } catch (error) {
          console.error('Error fetching chart data:', error);
          return [];
        }
      };
      
const updateChart = (data, viewMode, startDate, endDate) => {
      if (!data.length) {
        alert('No data available for the selected range.');
        return;
      }

      // Helper to format dates for display
      const formatDateLabel = (dateStr) => {
        const date = new Date(dateStr);
        return new Intl.DateTimeFormat('en-PH', { month: 'short', day: 'numeric', year:'numeric'}).format(date);
      };
    
      // Helper function to capitalize each word in the crimeType
      const capitalize = (str) => {
        return str
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ');
      };

      const threshold = 40; // Initialize threshold value
      
        // Format data and generate datasets for Chart.js
        const labels = [...new Set(data.map(item => item.date))]; // Unique dates
        const datasets = [];
      
        if (viewMode === 'totalReports') {
          datasets.push({
            label: 'Total Reports (as % of Threshold)',
            data: labels.map(date => {
              const entry = data.find(item => item.date === date);
              const count = entry ? entry.count : 0;
              return ((count / threshold) * 100).toFixed(2); // Convert to percentage
            }),
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,

            counts: labels.map(date => {
              const entry = data.find(item => item.date === date);
              return entry ? entry.count : 0;
            }), // Store raw counts

          });
        } else if (viewMode === 'totalCategory') {
          const crimeTypes = [...new Set(data.map(item => item.crimeType))]; // Unique crime types
          crimeTypes.forEach(crimeType => {
            datasets.push({
              label: `Crime: ${crimeType}`,
              data: labels.map(date => {
                const entry = data.find(item => item.date === date && item.crimeType === crimeType);
                const count = entry ? entry.count : 0;
                return ((count / threshold) * 100).toFixed(2); // Convert to percentage
              }),
              backgroundColor: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.6)`,
              borderColor: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 1)`,
              borderWidth: 1,

              counts: labels.map(date => {
                const entry = data.find(item => item.date === date && item.crimeType === crimeType);
                return entry ? entry.count : 0;
              }), // Store raw counts
            });
          });
        }
      
        // Dynamically adjust the chart's width
        const canvas = document.getElementById('crimeChart');
      
        const chartWidth = Math.max(1100, labels.length * 80); // 80px per label
        const chartHeight = 400; // Fixed height in pixels
      
        canvas.style.width = `${chartWidth}px`; // CSS width
        canvas.style.height = `${chartHeight}px`; // CSS height
      
        // Adjust for high-resolution screens
        const devicePixelRatio = window.devicePixelRatio || 1;
        canvas.width = chartWidth * devicePixelRatio;
        canvas.height = chartHeight * devicePixelRatio;
      
        const ctx = canvas.getContext('2d');
        ctx.scale(devicePixelRatio, devicePixelRatio);
      
        // Destroy existing chart
        if (chart) {
          chart.destroy();
        }
      
        // Create the chart
        chart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels, // Use `labels` directly here
            datasets,
          },
          options: {
            responsive: false,
            maintainAspectRatio: false,
            scales: {
              x: {
                maxRotation: 90,
                minRotation: 45,
              },
              y: {
                  beginAtZero: true,
                  max: 100,
                  ticks: {
                    callback: value => `${value}%`,
                },
              },
            },
            plugins: {
              tooltip: {
                callbacks: {
                  label: function (tooltipItem) {
                    const dataset = tooltipItem.dataset;
                    const percentage = tooltipItem.raw; // Percentage value
                    const count = dataset.counts[tooltipItem.dataIndex]; // Raw count
                    
                    if(viewMode == "totalReports"){
                      return [
                        `Report Count: ${count}`,
                        `Percentage: ${percentage}%`,
                      ];
                    }
                    else if(viewMode == "totalCategory"){
                      // Determine crime type from dataset label or fallback to Total Reports
                      const crimeType = dataset.label.includes(': ')
                      ? capitalize(dataset.label.split(': ')[1])
                      : 'Total Reports';
                
                      return [
                        `Crime Type: ${crimeType}`,
                        `Report Count: ${count}`,
                        `Percentage: ${percentage}%`,
                      ];
                    }
                  },
                },
              },
              legend: {
                display: true,
                labels: {
                  generateLabels: function (chart) {
                    return chart.data.datasets.map((dataset, i) => {
                      const meta = chart.getDatasetMeta(i);
                      const totalCount = dataset.counts.reduce((sum, count) => sum + count, 0);
                      const crimeType = dataset.label.includes(': ')
                        ? capitalize(dataset.label.split(': ')[1])
                        : 'Total Reports';

                        const text = viewMode === "totalReports"
                        ? `Total Count: ${totalCount}`
                        : `Crime Type: ${crimeType} | Total Count: ${totalCount}`;
            
                      return {
                        text: text,
                        fillStyle: dataset.backgroundColor,
                        strokeStyle: dataset.borderColor,
                        datasetIndex: i,
                        hidden: meta.hidden, // Keep track of visibility
                        fontColor: meta.hidden ? '#999' : '#000', // Change color to indicate visibility
                        textDecoration: meta.hidden ? 'line-through' : 'none', // Add line-through for hidden datasets
                      };
                    });
                  },
                },
                onClick: function (e, legendItem) {
                  const datasetIndex = legendItem.datasetIndex; // Directly use datasetIndex
                  if (typeof datasetIndex !== 'undefined') {
                    const meta = chart.getDatasetMeta(datasetIndex);
                    meta.hidden = !meta.hidden; // Toggle visibility
                    chart.update(); // Re-render the chart
                  } else {
                    console.error("Dataset index is undefined for legend item:", legendItem);
                  }
                },  
              },
            },
          },
        });
      };
      
    
      

    document.getElementById('filterButton').addEventListener('click', async () => {
      const dateRange = document.getElementById('dateRange').value.split(' to ');
      const viewMode = document.getElementById('viewMode').value;
      const [startDate, endDate] = dateRange;

      if (startDate && endDate) {
        const data = await fetchChartData(viewMode, startDate, endDate);
        updateChart(data, viewMode, startDate, endDate);
        console.log("Data: " + data);
      } else {
        alert('Please select a valid date range.');
      }
    });


    