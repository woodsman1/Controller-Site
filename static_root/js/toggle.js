// toggle.js

document.addEventListener('DOMContentLoaded', function() {
    var toggleSwitch = document.getElementById('toggle-switch');
    var toggleStatus = document.getElementById('toggle-status');
    var previousState = toggleSwitch.checked; // Store the previous state of the toggle button
    

    toggleSwitch.addEventListener('change', function() {
        var status = toggleSwitch.checked ? 'On' : 'Off';
        toggleStatus.innerText = status;
        

        // Get CSRF token from cookies
        var csrftoken = getCookie('csrftoken');

        // Send AJAX request to backend to update Redis key-value pair
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/toggle/', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('X-CSRFToken', csrftoken); // Set CSRF token in request header
        xhr.onreadystatechange = function() {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    var response = JSON.parse(xhr.responseText);
                    if (response.status === 'success') {
                        // Update label text on success
                        toggleStatus.innerText = toggleSwitch.checked ? 'On' : 'Off';
                    } else {
                        // Display error message on screen
                        alert('Error: ' + response.message);
                        // Revert toggle button to its previous state
                        toggleSwitch.checked = previousState;
                        toggleStatus.innerText = previousState ? 'On' : 'Off';
                    }
                } else {
                    // Display error message on screen
                    alert('Error: Failed to update toggle status');
                    // Revert toggle button to its previous state
                    toggleSwitch.checked = previousState;
                    toggleStatus.innerText = previousState ? 'On' : 'Off';
                }
            }
        };
        xhr.send(JSON.stringify({ status: toggleSwitch.checked }));
    });
});

// Function to get CSRF token from cookies
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            // Check if cookie name matches the CSRF token cookie name
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
