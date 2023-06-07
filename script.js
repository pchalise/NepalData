document.addEventListener('DOMContentLoaded', function() {
  // Load the data
  fetch('https://raw.githubusercontent.com/pchalise/NepalData/main/nepal.csv')
    .then(response => response.text())
    .then(data => {
      const parsedData = Papa.parse(data, { header: true, dynamicTyping: true });
      const df = parsedData.data;

      const dropdown = document.getElementById('indicator-dropdown');
      dropdown.style.width = '300px'; // Adjust the width as needed

      const searchInput = document.getElementById('search-input');

      // Function to update the dropdown options based on the search term
      function updateDropdownOptions(searchTerm) {
        const filteredOptions = parsedData.meta.fields.filter(indicator => indicator.toLowerCase().includes(searchTerm.toLowerCase()));

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

      // Function to plot the line graph
      function plotLineGraph(indicator) {
        const canvas = document.getElementById('chart-canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 700; // Adjust the width as needed
        canvas.height = 620; // Adjust the height as needed

        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const data = df.map(row => row[indicator]);
        const years = df.map(row => row['Year']);

        const chart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: years,
            datasets: [{
              label: `Trend of ${indicator} from 2000 to 2020`,
              data: data,
              fill: false,
              borderColor: 'blue',
              backgroundColor: 'transparent',
              pointBackgroundColor: 'blue',
              pointRadius: 4,
              pointHoverRadius: 6,
              pointHitRadius: 6,
              pointBorderWidth: 2,
              pointHoverBorderWidth: 2
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              x: {
                title: {
                  display: true,
                  text: 'Year'
                }
              },
              y: {
                title: {
                  display: true,
                  text: indicator
                }
              }
            }
          }
        });
      }

      // Display the initial plot
      const initialIndicator = parsedData.meta.fields[1];
      updateDropdownOptions('');
      plotLineGraph(initialIndicator);
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
});
