// Load the data
fetch('nepal.csv')
  .then(response => response.text())
  .then(data => {
    const parsedData = Papa.parse(data, { header: true, dynamicTyping: true });
    const df = parsedData.data;

    // Create a dropdown widget for selecting the indicator
    const dropdown = document.createElement('select');
    dropdown.id = 'indicator-dropdown';
    dropdown.className = 'dropdown';
    dropdown.style.width = '350px';
    document.body.appendChild(dropdown);

    // Create a text input widget for searching
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search Indicator...';
    searchInput.className = 'search-input';
    searchInput.style.width = '300px';
    document.body.appendChild(searchInput);

    // Function to update the dropdown options based on the search term
    function updateDropdownOptions(searchTerm) {
      const filteredOptions = df.columns.filter(indicator => indicator.toLowerCase().includes(searchTerm.toLowerCase()));

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
      const output = document.getElementById('output');
      output.innerHTML = '';

      const data = df.map(row => row[indicator]);
      const years = df.map((_, index) => 2000 + index);

      const canvas = document.createElement('canvas');
      canvas.id = 'chart-canvas';
      canvas.width = 800;
      canvas.height = 500;
      output.appendChild(canvas);

      const ctx = canvas.getContext('2d');

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

    // Output element to display the plot
    const output = document.createElement('div');
    output.id = 'output';
    document.body.appendChild(output);

    // Display the initial plot
    plotLineGraph(df.columns[0]);
  })
  .catch(error => console.error('Error fetching data:', error));
