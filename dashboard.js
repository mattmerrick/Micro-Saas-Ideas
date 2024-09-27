const supabase = supabase.createClient('YOUR_SUPABASE_URL', 'YOUR_SUPABASE_ANON_KEY');

window.addEventListener('load', async function() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        window.location.href = 'index.html';
    } else {
        document.getElementById('userEmail').textContent = user.email;
    }
});

document.getElementById('logoutBtn').addEventListener('click', async function() {
    await supabase.auth.signOut();
    window.location.href = 'index.html';
});