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
document.addEventListener('click', function(e){
    if(e.target.closest('.card-icon')) {
        const btn = e.target.closest('.card-icon');
        const icon = btn.querySelector('i');

        if(icon.classList.contains('far')) {
            icon.classList.remove('far');
            icon.classList.add('fas');  // cambia cuore vuoto in pieno
            btn.setAttribute('aria-pressed', 'true');
        } else {
            icon.classList.remove('fas');
            icon.classList.add('far');  // torna cuore vuoto
            btn.setAttribute('aria-pressed', 'false');
        }
    }
});

