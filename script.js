// Initialize Supabase client
const supabase = supabase.createClient('YOUR_SUPABASE_URL', 'YOUR_SUPABASE_ANON_KEY');

document.getElementById('loginBtn').addEventListener('click', async function() {
    const email = document.getElementById('emailInput').value;
    
    if (!email) {
        alert('Please enter your email address.');
        return;
    }

    try {
        const { error } = await supabase.auth.signInWithOtp({ email });
        if (error) throw error;
        
        // Call the Supabase Edge Function to add the email to Beehiiv
        const { data, error: funcError } = await supabase.functions.invoke('add-to-beehiiv', {
            body: JSON.stringify({ email }),
        });

        if (funcError) {
            console.error('Error adding to newsletter:', funcError);
        } else {
            console.log('Successfully added to newsletter');
        }

        alert('Magic link sent! Check your email. You have also been added to our newsletter.');
    } catch (error) {
        alert(error.message);
    }
});

// Check authentication state on page load
window.addEventListener('load', async function() {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
        window.location.href = 'dashboard.html';
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const table = document.querySelector('#ideasTable tbody');
    const upgradeBtn = document.getElementById('upgradeBtn');
    
    const SHEET_ID = 'YOUR_GOOGLE_SHEET_ID';
    const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv`;

    // Function to populate table
    function populateTable(data, limit = 10) {
        table.innerHTML = ''; // Clear existing rows
        data.slice(0, limit).forEach(function(row) {
            let tableRow = table.insertRow();
            tableRow.insertCell(0).textContent = row.Keyword;
            tableRow.insertCell(1).textContent = row['Search Volume'];
            tableRow.insertCell(2).textContent = '$' + parseFloat(row.CPC).toFixed(2);
            tableRow.insertCell(3).textContent = row.Competition;
        });
    }

    // Fetch data from Google Sheets
    Papa.parse(SHEET_URL, {
        download: true,
        header: true,
        complete: function(results) {
            populateTable(results.data);
        }
    });

    // Upgrade button click event
    upgradeBtn.addEventListener('click', function() {
        alert('Full list access coming soon!');
    });
});