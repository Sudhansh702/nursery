// Load navbar
fetch('commponents/navbar.html')
  .then(response => response.text())
  .then(data => {
    document.getElementById('navbar').innerHTML = data;

    // Now attach event listeners after the navbar has been loaded
    const menuButton = document.getElementById('menu-button');
    const closeButton = document.getElementById('close-button');
    const sidebar = document.getElementById('sidebar');

    if (menuButton && closeButton && sidebar) {
      // Attach the event listeners only if the elements are found
      menuButton.addEventListener('click', () => {
        sidebar.classList.add('sidebar-open');
      });

      closeButton.addEventListener('click', () => {
        sidebar.classList.remove('sidebar-open');
      });
    } else {
      console.error('Menu button, close button, or sidebar not found');
    }
  })
  .catch(error => console.error('Error loading navbar:', error));

// Load footer
fetch('commponents/footer.html')
  .then(response => response.text())
  .then(data => {
    document.getElementById('footer').innerHTML = data;
  })
  .catch(error => console.error('Error loading footer:', error));
