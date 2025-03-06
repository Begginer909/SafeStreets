  //CHART
  Chart.register(ChartDataLabels);

  const ctx = document.getElementById('crimeChart').getContext('2d');
  let chart;

      // Fetch and update chart data
      const fetchChartData = async (timeFrame, startDate, endDate, viewMode) => {
        try {
          const response = await fetch('safestreets-production.up.railway.app/api/reports', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ timeFrame, startDate, endDate, viewMode }),
          });
          return await response.json();
        } catch (error) {
          alert("Error fetching chart Data");
          return [];
        }
      };
      
const updateChart = (data, viewMode, timeFrame) => {
    
      // Helper function to capitalize each word in the crimeType
      const capitalize = (str) => {
        return str
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ');
      };
      
        // Format data and generate datasets for Chart.js
        const labels = [...new Set(data.map(item => timeFrame === 'month' ? item.date.slice(0, 7) : item.date))];
        
        const filteredData = data.filter(item => item.area !== 0);
        const circleIDs = [...new Set(filteredData.map(item => item.area))]; // Unique circle IDs
        const datasets = [];
        
        const threshold = timeFrame === 'year' ? 1000 : 
                  timeFrame === 'month' ? 78 : 40; // Initialize threshold value 
      
        if(timeFrame == 'year'){
          if(viewMode == 'total'){
            const datasetData = labels.map(date => {
              const entry = data.find(item => item.date === date);
              return entry ? Number(entry.totalReportYear) : 0; // Get total reports for that date
            });

            // Calculate total count for all entries
            const totalCount = datasetData.reduce((sum, count) => sum + count, 0);

            // Calculate percentage based on the threshold
            const percentageData = datasetData.map(count => {
              return totalCount > 0 ? ((count / threshold) * 100).toFixed(2) : 0; // Convert to percentage
            });

            datasets.push({
              label: `Total Reports`,
              data: percentageData,
              backgroundColor: `rgba(54, 162, 235, 0.6)`, // Blue color
              borderColor: `rgba(54, 162, 235, 1)`,
              borderWidth: 1,
              counts: datasetData, // Store counts for later use
              totalCount
            });
          }
          else{
            // Create a dataset for each circleID
            circleIDs.forEach(circleID => {
              const datasetData = labels.map(date => {
              const entry = data.find(item => item.date === date && item.area === circleID);
              return entry ? Number(entry.totalReportArea) : 0; // Count for this date and circleID
            });

            // Calculate total count for this circleID
            const totalCount = datasetData.reduce((sum, count) => sum + count, 0);

            // Calculate percentage based on the threshold
            const percentageData = datasetData.map(count => {
            return totalCount > 0 ? ((count / threshold) * 100).toFixed(2) : 0; // Convert to percentage
            });

            datasets.push({
              label: `Area: ${circleID}`,
              data: percentageData,
              backgroundColor: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.6)`,
              borderColor: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 1)`,
              borderWidth: 1,
              counts: datasetData, // Set counts for later use
              totalCount 
              });
            }); 
          }

            // Sort datasets based on totalCount in descending order
            datasets.sort((a, b) => b.totalCount - a.totalCount);
        }
        else if(timeFrame == 'month'){

            if(viewMode == 'total'){
              const datasetData = labels.map(date => {
                const entry = data.find(item => item.date.startsWith(date)); // Match by month
                return entry ? Number(entry.totalReportMonth) : 0;
              });              

              // Calculate total count for all entries
              const totalCount = datasetData.reduce((sum, count) => sum + count, 0);

              // Calculate percentage based on the threshold
              const percentageData = datasetData.map(count => {
                return totalCount > 0 ? ((count / threshold) * 100).toFixed(2) : 0; // Convert to percentage
              });

              datasets.push({
                label: `Total Reports`,
                data: percentageData,
                backgroundColor: `rgba(54, 162, 235, 0.6)`, // Blue color
                borderColor: `rgba(54, 162, 235, 1)`,
                borderWidth: 1,
                counts: datasetData, // Store counts for later use
                totalCount
              });
            }
            else{
              circleIDs.forEach(circleID => {
                const datasetData = labels.map(date => {
                  const entry = data.find(item => item.date === date && item.area === circleID);
                  return entry ? Number(entry.totalReportArea) : 0; // Count for this date and circleID
                });

                // Calculate total count for this circleID
                const totalCount = datasetData.reduce((sum, count) => sum + count, 0);

                // Calculate percentage based on the threshold
                const percentageData = datasetData.map(count => {
                  return totalCount > 0 ? ((count / threshold) * 100).toFixed(2) : 0; // Convert to percentage
                });

                datasets.push({
                  label: `Area: ${circleID}`,
                  data: percentageData,
                  backgroundColor: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.6)`,
                  borderColor: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 1)`,
                  borderWidth: 1,
                  counts: datasetData, // Set counts for later use
                  totalCount 
                });
              });
            }
              // Sort datasets based on totalCount in descending order
              datasets.sort((a, b) => b.totalCount - a.totalCount);

              console.log("Time Frame: " + timeFrame);
          }
          else if(timeFrame == 'day'){
            if(viewMode == 'total'){
              const datasetData = labels.map(date => {
                const entry = data.find(item => item.date === date);
                  return entry ? Number(entry.totalReportDay) : 0; // Get total reports for that date
                });
    
                // Calculate total count for all entries
                const totalCount = datasetData.reduce((sum, count) => sum + count, 0);
    
                // Calculate percentage based on the threshold
                const percentageData = datasetData.map(count => {
                  return totalCount > 0 ? ((count / threshold) * 100).toFixed(2) : 0; // Convert to percentage
                });
    
                datasets.push({
                  label: `Total Reports`,
                  data: percentageData,
                  backgroundColor: `rgba(54, 162, 235, 0.6)`, // Blue color
                  borderColor: `rgba(54, 162, 235, 1)`,
                  borderWidth: 1,
                  counts: datasetData, // Store counts for later use
                  totalCount
                }); 
              }
              else{
                // Create a dataset for each circleID
                circleIDs.forEach(circleID => {
                  const datasetData = labels.map(date => {
                    const entry = data.find(item => item.date === date && item.area === circleID);
                    return entry ? Number(entry.totalReportArea) : 0; // Count for this date and circleID
                  });

                  // Calculate total count for this circleID
                  const totalCount = datasetData.reduce((sum, count) => sum + count, 0);

                  // Calculate percentage based on the threshold
                  const percentageData = datasetData.map(count => {
                    return totalCount > 0 ? ((count / threshold) * 100).toFixed(2) : 0; // Convert to percentage
                  });

                  datasets.push({
                    label: `Area: ${circleID}`,
                    data: percentageData,
                    backgroundColor: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.6)`,
                    borderColor: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 1)`,
                    borderWidth: 1,
                    counts: datasetData, // Set counts for later use
                    totalCount 
                  });
                });
              }
                // Sort datasets based on totalCount in descending order
                datasets.sort((a, b) => b.totalCount - a.totalCount);

                console.log("Time Frame: " + timeFrame);
          }

        // Dynamically adjust the chart's width
        const canvas = document.getElementById('crimeChart');
      
        const chartWidth = Math.max(900, labels.length * 80); // 80px per label
        const chartHeight = 500; // Fixed height in pixels
      
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
          type: 'line',
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
                
                ticks:{
                  font: {
                    size: Math.max(10, Math.min(14, chartHeight / 20)), // Adjust font size based on height
                  },
                  callback: function (index) {
                    const dataset = this.chart.data.datasets;
                    const hasValue = dataset.some(ds => ds.data[index] > 0);
                    if (!hasValue) return '';

                    const rawDate = labels[index];
                    const date = new Date(rawDate);
                    
                    console.log("Raw value:", rawDate, "Parsed date:", date);

                    if (timeFrame === 'day') return formatDate(new Date(date), 'MM-DD-YY');
                    if (timeFrame === 'month') return new Date(date).toLocaleString('default', { month: 'short', year: 'numeric' });
                    if (timeFrame === 'year') return rawDate;

                    
                  }
                },
              },
              y: {
                  beginAtZero: true,
                  max: 100,
                  ticks: {
                    callback: value => `${value}%`,
                    font: {
                      size: Math.max(10, Math.min(14, chartHeight / 20)), // Adjust font size based on height
                  },
                },
              },
            },
            plugins: {
              datalabels: {
                display: false,
              },
              tooltip: {
                callbacks: {
                  title: function (tooltipItems) {
                    // Get the date from the tooltip label
                    const rawDate = tooltipItems[0].label;
                    const dateObj = new Date(rawDate);
                    
                    if (timeFrame == "month") {
                      return dateObj.toLocaleString('default', { year: 'numeric', month: 'long' });
                    }
                    else if(timeFrame == "year"){
                      return dateObj.toLocaleString('default', { year: 'numeric'});
                    }
                    else{
                      return dateObj.toLocaleString('default', { year: 'numeric', day: 'numeric', month: 'long'}); 
                    }
                  },
                  label: function (tooltipItem) {
                    const dataset = tooltipItem.dataset;
                    const percentage = tooltipItem.raw; // Percentage value
                    const count = dataset.counts[tooltipItem.dataIndex]; // Raw count
                    const area = dataset.label.split(': ')[1]; // Extract Area ID

                    const reportDate = tooltipItem.label; // Extract the date from the tooltip

                    // Filter data for the specific date
                    const dateData = data.filter(item => item.date == reportDate && item.area !== 0);

                    // Calculate total reports for this date
                    const totalReports = dateData.reduce((sum, item) => sum + item.totalReportType, 0) || 1;

                    // Group reports per area
                    const areaGroups = {};
                    dateData.forEach(item => {
                        if (!areaGroups[item.area]) {
                            areaGroups[item.area] = { total: 0, crimes: {} };
                        }
                        areaGroups[item.area].total += item.totalReportType;
                        areaGroups[item.area].crimes[item.crimeType] = 
                            (areaGroups[item.area].crimes[item.crimeType] || 0) + item.totalReportType;
                      });

                      // Format total count
                      if (viewMode === 'total') {
                          const summary = [`Total Counts: ${totalReports} Percentage: ${percentage}%`];

                          Object.entries(areaGroups).forEach(([areaID, areaData]) => {
                              // Find top crime(s)
                              const maxCrimeCount = Math.max(...Object.values(areaData.crimes), 0);
                              const topCrimes = Object.entries(areaData.crimes)
                                  .filter(([_, count]) => count === maxCrimeCount)
                                  .map(([crimeType, crimeCount]) => 
                                      `${capitalize(crimeType)} (${((crimeCount / areaData.total) * 100).toFixed(2)}%)`
                                  )
                                  .join(", ");

                              summary.push(`Area ${areaID}: ${areaData.total} | Crime Trends: ${topCrimes || "N/A"}`);
                          });

                          return summary;
                      }
                      else{
                        // Ensure filtering includes both date and area
                        const areaData = data.filter(item => item.area == area && item.date == reportDate);

                        // Group crimes and count occurrences
                        const crimesInArea = areaData.reduce((acc, item) => {
                          acc[item.crimeType] = (acc[item.crimeType] || 0) + item.totalReportType;
                          return acc;
                        }, {});

                        // Format crime report summary
                        const crimeReportList = Object.entries(crimesInArea)
                        .map(([crimeType, crimeCount]) => `${capitalize(crimeType)}: ${crimeCount}`)
                        .join(", ");

                        return [
                          `Area: ${area}`,
                          `Report Count: ${count}`,
                          `Percentage: ${percentage}%`,
                          `Crime Reports: ${crimeReportList}`,
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

                        const text = viewMode === 'total' ? `Total Counts: ${totalCount}`
                        :`Area: ${dataset.label.split(': ')[1]} | Total Counts: ${totalCount}`;
            
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
                  }
                },  
              },
            },
          },
        });

  // Add event listener for window resize
  window.addEventListener('resize', () => {
    if (chart) {
        chart.resize();
    }
  });

  // Function to format date dynamically
  function formatDate(date, format) {
    const d = new Date(date);
    const yy = String(d.getFullYear()).slice(-2); // Last 2 digits of year
    const mm = String(d.getMonth() + 1).padStart(2, '0'); // Month (01-12)
    const dd = String(d.getDate()).padStart(2, '0'); // Day (01-31)

    if (format === 'MM-DD-YY') return `${mm}-${dd}-${yy}`;
    if (format === 'MM-YY') return `${mm}-${yy}`;
    if (format === 'YY') return `${yy}`;
    return date; // Default case
  }

};

document.addEventListener("DOMContentLoaded", function() {

    const dateRangePicker = document.getElementById('dateRange');
    const timeFrameSelect = document.getElementById('timeFrame');

    const updateDatePicker = () => {
      if (!dateRangePicker) return; // Prevent errors if the element is missing

      flatpickr(dateRangePicker, {
          mode: 'range',
          dateFormat: 'Y-m-d',
          enableTime: false
      });

      window.addEventListener('resize', function () {
        if (window.myChart) {
            window.myChart.resize();
        }
    });
  };

  // Update the date picker when the time frame changes
  timeFrameSelect.addEventListener('change', updateDatePicker);

  // Initialize with the default value
  updateDatePicker();

  document.getElementById('filterButton').addEventListener('click', async () => {
  const dateRange = dateRangePicker.value.split(' to ');
  const viewMode = document.getElementById('viewMode').value;
  const timeFrame = timeFrameSelect.value;
  let [startDate, endDate] = dateRange;

  if (startDate && endDate) {
    const data = await fetchChartData(timeFrame, startDate, endDate, viewMode,);
    updateChart(data, viewMode, timeFrame);
  } else {
      alert('Please select a valid date range.');
    }

  });

});



    