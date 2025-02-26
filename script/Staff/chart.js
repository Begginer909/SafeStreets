  //CHART
  Chart.register(ChartDataLabels);

  const ctx = document.getElementById('crimeChart').getContext('2d');
  let chart;

      // Fetch and update chart data
      const fetchChartData = async ( viewMode, timeFrame, startDate, endDate) => {
        try {
          const response = await fetch('http://localhost:3000/api/reports', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ viewMode, timeFrame, startDate, endDate }),
          });
          return await response.json();
        } catch (error) {
          console.error('Error fetching chart data:', error);
          return [];
        }
      };
      
const updateChart = (data, viewMode, timeFrame) => {
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
      
        // Format data and generate datasets for Chart.js
        const labels = [...new Set(data.map(item => item.date))]; // Unique dates
        const filteredData = data.filter(item => item.area !== 0);
        const circleIDs = [...new Set(filteredData.map(item => item.area))]; // Unique circle IDs
        const datasets = [];
        const threshold = 40; // Initialize threshold value 
      
        if (viewMode === 'totalReports') {

          if(timeFrame == 'year'){

          }
          else if(timeFrame == 'month'){

          }
          else{
              // Create a dataset for each circleID
              circleIDs.forEach(circleID => {
                const datasetData = labels.map(date => {
                  const entry = data.find(item => item.date === date && item.area === circleID);
                  return entry ? Number(entry.totalReportArea) : 0; // Count for this date and circleID
                });

                console.log("DataSetData: " + datasetData);

              // Calculate total count for this circleID
              const totalCount = datasetData.reduce((sum, count) => sum + count, 0);

              console.log("Total Count: " + totalCount);

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
              // Sort datasets based on totalCount in descending order
              datasets.sort((a, b) => b.totalCount - a.totalCount);
          }


          // Check if datasets are created correctly
          console.log("Datasets:", datasets);
          console.log("Fetched Data:", data);
        } 
        else if (viewMode === 'totalCategory') {
          const crimeTypes = [...new Set(data.map(item => item.crimeType))]; // Unique crime types
          const crimeData = crimeTypes.map(crimeType => {
            const counts = labels.map(date => {
              const entry = data.find(item => item.date === date && item.crimeType === crimeType);
              return entry ? entry.count : 0; // Count for this date and crimeType
            });
            console.log(counts);

            // Calculate total count for this crime type
            const totalCount = counts.reduce((sum, count) => sum + count, 0);

            return {
              crimeType,
              counts,
              totalCount,
            };
          });

            // Sort crime data based on totalCount in descending order
            crimeData.sort((a, b) => b.totalCount - a.totalCount);

              // Create datasets based on sorted crime data
              crimeData.forEach(({ crimeType, counts }) => {
                datasets.push({
                  label: `Crime: ${crimeType}`,
                  data: counts.map(count => ((count / threshold) * 100).toFixed(2)), // Convert to percentage
                  backgroundColor: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.6)`,
                  borderColor: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 1)`,
                  borderWidth: 1,
                  counts, // Store raw counts for later use
                });
              });
        }
      
        // Dynamically adjust the chart's width
        const canvas = document.getElementById('crimeChart');
      
        const chartWidth = Math.max(900, labels.length * 80); // 80px per label
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
                  callback: function (value, index, values) {
                    const dataset = this.chart.data.datasets;
                    const hasValue = dataset.some(ds => ds.data[index] > 0);
                    if (!hasValue) return '';
        
                    // Format X-axis labels based on selected timeframe
                    const date = labels[index];
                    if (timeFrame === 'day') return formatDate(date, 'MM-DD-YY');
                    if (timeFrame === 'month') return formatDate(date, 'MM-YY');
                    if (timeFrame === 'year') return formatDate(date, 'YY');
                    return date; // Fallback to default
                  }
                },
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
              datalabels: {
                display: false,
              },
              tooltip: {
                callbacks: {
                  title: function (tooltipItems) {
                    // Get the date from the tooltip label
                    const rawDate = tooltipItems[0].label;
              
                    // Format the date properly
                    return formatDate(rawDate, 'MM-DD-YY'); 
                  },
                  label: function (tooltipItem) {
                    const dataset = tooltipItem.dataset;
                    const percentage = tooltipItem.raw; // Percentage value
                    const count = dataset.counts[tooltipItem.dataIndex]; // Raw count
                    const area = dataset.label.split(': ')[1]; // Extract Area ID

                    if(viewMode == "totalReports"){

                      const reportDate = tooltipItem.label; // Extract the date from the tooltip

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
                        ? `Area: ${dataset.label.split(': ')[1]} | Total Count: ${totalCount}`
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
      const selectedTimeFrame = timeFrameSelect.value;

      flatpickr(dateRangePicker, {
          mode: 'range',
          dateFormat: selectedTimeFrame === 'day' ? 'Y-m-d' :
                      selectedTimeFrame === 'month' ? 'Y-m' :
                      'Y',
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
    const data = await fetchChartData(viewMode, timeFrame, startDate, endDate);
    updateChart(data, viewMode, timeFrame);
    console.log("Data: " + data);
  } else {
      alert('Please select a valid date range.');
    }

  console.log(`Filtering data by: ${timeFrame}, Start: ${startDate}, End: ${endDate}`);
  });

});



    