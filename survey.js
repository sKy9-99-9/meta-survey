document.getElementById('surveyForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting the traditional way

    // Collect survey answers
    const formData = new FormData(event.target);
    let surveyData = {};
    formData.forEach((value, key) => {
        surveyData[key] = value;
    });

    // Function to collect metadata and send the data
    function collectMetadataAndSend(position) {
        // Collect user metadata, including geolocation
        const metadata = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            userAgent: navigator.userAgent,
            language: navigator.language,
            screenSize: {
                width: window.screen.width,
                height: window.screen.height
            },
            viewportSize: {
                width: window.innerWidth,
                height: window.innerHeight
            },
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
        };

        // Combine survey data and metadata
        const dataToSend = {
            survey: surveyData,
            metadata: metadata
        };

        // Send data to the server
        fetch('/submit-survey', {  // Update with your server's endpoint
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataToSend)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            alert('Survey submitted successfully!');
            // Clear the form after successful submission
            document.getElementById('surveyForm').reset();
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('There was an error submitting the survey.');
        });
    }

    // Check if Geolocation is supported
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(collectMetadataAndSend, function(error) {
            console.error('Geolocation error:', error);
            alert('Unable to retrieve your location. Please try again.');
        });
    } else {
        alert('Geolocation is not supported by your browser.');
    }
});
