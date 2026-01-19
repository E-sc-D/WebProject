window.addEventListener('DOMContentLoaded', () => {
    const sidebarToggle = document.getElementById('sidebarToggle');
    // Toggle con bottone
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation(); // evita chiusura immediata
            document.body.classList.toggle('sb-sidenav-toggled');
        });
    }
    // Click fuori dalla sidebar → chiudi
    document.addEventListener('click', (e) => {
        
        if (window.innerWidth < 992) {
            document.body.classList.remove('sb-sidenav-toggled');
        }
    });
})
