// dashboard.js

// Function to get the JWT token from local storage
function getToken() {
    return localStorage.getItem('token');
}

// Function to fetch user data
async function fetchUserData() {
    try {
        const response = await fetch('/api/user', {
            headers: {
                'Authorization': `Bearer ${getToken()}`
            }
        });
        if (!response.ok) {
            throw new Error('Failed to fetch user data');
        }
        const userData = await response.json();
        document.getElementById('username').textContent = userData.name;
        document.getElementById('useremail').textContent = `Email: ${userData.email}`;
        document.getElementById('user-name').textContent = userData.name;
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
}


document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/login.html';
        return;
    }

    // Fetch user info
    fetch('/api/user', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('username').textContent = data.name;
        document.getElementById('useremail').textContent = `Email: ${data.email}`;
    })
    .catch(error => console.error('Error fetching user data:', error));

    // Fetch additional user data
    fetch('/api/user-data', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('userAge').textContent = data.age;
        document.getElementById('userWeight').textContent = data.weight;
        document.getElementById('userHeight').textContent = data.height;
        document.getElementById('fitnessGoal').textContent = data.fitnessGoal;
        document.getElementById('activityLevel').textContent = data.activityLevel;
    })
    .catch(error => console.error('Error fetching additional user data:', error));
});


// Function to calculate BMI
document.getElementById('calculateBMI').addEventListener('click', function () {
    const weight = parseFloat(document.getElementById('weight').value);
    const height = parseFloat(document.getElementById('height').value);
    if (weight && height) {
        const bmi = (weight / (height * height)).toFixed(2);
        alert(`Your BMI is: ${bmi}`);
        // Here you would typically send this data to the backend
        // For now, we'll just update the chart with a dummy value
        updateBMIChart(bmi);
    } else {
        alert('Please enter valid weight and height.');
    }
});

// Function to update BMI chart
function updateBMIChart(newBMI) {
    if (window.bmiChart) {
        window.bmiChart.data.datasets[0].data.push(newBMI);
        window.bmiChart.data.labels.push(new Date().toLocaleDateString());
        window.bmiChart.update();
    }
}

// Function to initialize charts
function initializeCharts() {
    const bmiCtx = document.getElementById('bmiChart').getContext('2d');
    window.bmiChart = new Chart(bmiCtx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'BMI',
                data: [],
                borderColor: 'rgba(255, 159, 64, 1)',
                fill: false,
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: false
                }
            }
        }
    });

    const foodGroupCtx = document.getElementById('foodGroupChart').getContext('2d');
    new Chart(foodGroupCtx, {
        type: 'pie',
        data: {
            labels: ['Fruits', 'Vegetables', 'Grains', 'Protein', 'Dairy'],
            datasets: [{
                label: 'Food Group Breakdown',
                data: [20, 30, 25, 15, 10], // Sample data
                backgroundColor: [
                    'rgba(54, 162, 235, 0.8)',
                    'rgba(75, 192, 192, 0.8)',
                    'rgba(255, 206, 86, 0.8)',
                    'rgba(255, 99, 132, 0.8)',
                    'rgba(255, 105, 180, 0.8)'
                ],
                borderColor: [
                    'rgba(54, 162, 235, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(255, 105, 180, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Food Group Breakdown'
                }
            }
        }
    });
}

// Initialize everything when the page loads
document.addEventListener('DOMContentLoaded', () => {
    fetchUserData();
    initializeCharts();
});

  function handleLogin(event) {
    event.preventDefault();
    console.log('Login form submitted');
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    console.log('Attempting login for:', username);
  
    fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    })
    .then(response => {
      console.log('Response status:', response.status);
      return response.json();
    })
    .then(data => {
      console.log('Response data:', data);
      if (data.token) {
        console.log('Login successful, token received');
        localStorage.setItem('token', data.token);
        console.log('Token saved to localStorage');
        window.location.href = '/dashboard.html';
      } else {
        console.error('Login failed:', data.message);
        alert('Login failed: ' + data.message);
      }
    })
    .catch(error => {
      console.error('Error during login:', error);
      alert('An error occurred during login. Please check the console for details.');
    });
  }
  
  // Test server connection
  fetch('/api/test')
    .then(response => response.json())
    .then(data => console.log('Server test response:', data))
    .catch(error => console.error('Server test failed:', error));
  
  // Attach this function to your login form's submit event
  document.getElementById('loginForm').addEventListener('submit', handleLogin);


  document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/login.html';
        return;
    }

    // Fetch user info
    fetch('/api/user', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('username').textContent = data.name;
        document.getElementById('useremail').textContent = `Email: ${data.email}`;
    })
    .catch(error => console.error('Error fetching user data:', error));

    // BMI calculation
    const calculateBMIButton = document.getElementById('calculateBMI');
    calculateBMIButton.addEventListener('click', () => {
        const weight = parseFloat(document.getElementById('weight').value);
        const height = parseFloat(document.getElementById('height').value);
        const bmiResultElement = document.getElementById('bmiResult');

        if (isNaN(weight) || isNaN(height) || weight <= 0 || height <= 0) {
            bmiResultElement.textContent = 'Please enter valid weight and height.';
            return;
        }

        const bmi = weight / (height * height);
        bmiResultElement.textContent = `Your BMI is: ${bmi.toFixed(2)}`;

        // Optional: Send BMI data to server
        fetch('/api/bmi', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ bmi: bmi.toFixed(2) })
        })
        .then(response => response.json())
        .then(data => console.log('BMI data saved:', data))
        .catch(error => console.error('Error saving BMI data:', error));
    });
});