// nav bar js 
document.addEventListener("DOMContentLoaded", function() {
    const dropdownButtons = document.querySelectorAll('.dropdown-button');
    
    dropdownButtons.forEach(button => {
      button.addEventListener('click', function(event) {
        event.preventDefault();
        const subMenu = this.nextElementSibling;
        if (subMenu.classList.contains('the-dropdown')) {
          subMenu.classList.toggle('show-dropdown');
        }
      });
    });
  
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('nav ul');
    const mobileNav = document.getElementById('jsMobileNav');
  
    hamburger.addEventListener('click', function() {
      navMenu.classList.toggle('open');
      mobileNav.classList.toggle('open');
    });
  
    document.addEventListener('click', function(event) {
      if (!event.target.closest('.dropdown-button') && !event.target.closest('.the-dropdown')) {
        document.querySelectorAll('.the-dropdown').forEach(dropdown => {
          dropdown.classList.remove('show-dropdown');
        });
      }
    });
  });

  document.addEventListener("DOMContentLoaded", function() {
    const menuId = document.querySelector('.menu-id');
    const loginDropdown = document.querySelector('.menu-login-dropdown');
  
    // Show the dropdown when hovering over the .menu-id
    menuId.addEventListener('mouseenter', function() {
      loginDropdown.classList.add('show-dropdown');
    });
  
    // Hide the dropdown when mouse leaves the .menu-id or the dropdown itself
    menuId.addEventListener('mouseleave', function() {
      loginDropdown.classList.remove('show-dropdown');
    });
  
    loginDropdown.addEventListener('mouseenter', function() {
      loginDropdown.classList.add('show-dropdown');
    });
  
    loginDropdown.addEventListener('mouseleave', function() {
      loginDropdown.classList.remove('show-dropdown');
    });
  });
  
//sign up page js
// document.getElementById('signUpForm').addEventListener('submit', function(event) {

// const password = document.getElementById('password').value;
// const confirmPassword = document.getElementById('confirm-password').value;

// Basic password verification
// if (password.length < 6) {
//     alert('Password must be at least 6 characters long.');
//     } else if (password !== confirmPassword) {
//         alert('Passwords do not match.');
//     } else {
        // If verification passes, submit the form (you can also redirect or handle sign-up)
        // alert('Account created successfully!');
        // Uncomment the line below to actually submit the form (if using a backend)
        // this.submit();
// }
// });
























 
// Example of how to render a user analysis graph using Chart.js
// const ctx = document.getElementById('user-progress-graph').getContext('2d');
// const userProgressChart = new Chart(ctx, {
//     type: 'line',
//     data: {
//         labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
//         datasets: [{
//             label: 'Workouts Completed',
//             data: [3, 5, 2, 6],
//             borderColor: 'rgba(75, 192, 192, 1)',
//             borderWidth: 2,
//             fill: false
//         }]
//     },
//     options: {
//         responsive: true,
//         scales: {
//             y: {
//                 beginAtZero: true
//             }
//         }
//     }
// });