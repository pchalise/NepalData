document.addEventListener('DOMContentLoaded', function() {
  let chart; // Variable to store the chart instance

  // Load the data
  fetch('https://raw.githubusercontent.com/pchalise/NepalData/main/nepal.csv')
    .then(response => response.text())
    .then(data => {
      const parsedData = Papa.parse(data, { header: true });
      const df = parsedData.data;

      const dropdown = document.getElementById('indicator-dropdown');
      dropdown.style.width = '35%';

      const searchInput = document.getElementById('search-input');

      // Function to update the dropdown options based on the search term
      function updateDropdownOptions(searchTerm) {
        const filteredOptions = parsedData.meta.fields.filter(indicator =>
          indicator.toLowerCase().includes(searchTerm.toLowerCase())
        );

        dropdown.innerHTML = '';
        filteredOptions.forEach(option => {
          const dropdownOption = document.createElement('option');
          dropdownOption.value = option;
          dropdownOption.text = option;
          dropdown.appendChild(dropdownOption);
        });
      }

      // Function to handle the dropdown value change
      function dropdownEventHandler() {
        const selectedIndicator = dropdown.value;
        plotLineGraph(selectedIndicator);
      }

      // Function to handle the search input value change
      function searchInputEventHandler() {
        const searchTerm = searchInput.value;
        updateDropdownOptions(searchTerm);
      }

      // Attach the event handlers
      dropdown.addEventListener('change', dropdownEventHandler);
      searchInput.addEventListener('input', searchInputEventHandler);

      // Function to plot the Line graph
      function plotLineGraph(indicator) {
        const canvas = document.getElementById('chart-canvas');
        const ctx = canvas.getContext('2d');

        // Destroy the existing chart if it exists
        if (chart) {
          chart.destroy();
        }

        const data = df.map((row, index) => parseFloat(row[indicator]));
        const years = df.map((row, index) => String(index + 2000)); // Generate years dynamically

        chart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: years.slice(0, -1), // Display up to 2020
            datasets: [
              {
                label: `Trend of ${indicator} from 2000 to 2020`,
                data: data.slice(0, -1), // Display up to 2020
                backgroundColor: 'transparent',
                borderColor: 'gray',
                borderWidth: 2,
                fill: false
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              x: {
                title: {
                  display: true,
                  text: 'Year',
                  font: {
                    size: 12 // Increase the heading size
                  }
                },
                grid: {
                  color: 'gray',
                  borderColor: 'gray',
                  borderWidth: 1
                }
              },
              y: {
                title: {
                  display: false
                },
                grid: {
                  color: 'gray',
                  borderColor: 'gray',
                  borderWidth: 0.3
                }
              }
            }
          }
        });
      }

      // Display the initial plot
      const initialIndicator = parsedData.meta.fields[0];
      updateDropdownOptions('');
      plotLineGraph(initialIndicator);
    });
});
