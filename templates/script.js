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

const btnRespond = document.getElementById('btnRespond');
const commentFormWrapper = document.getElementById('commentFormWrapper');
const commentForm = document.getElementById('commentForm');
const btnCancelComment = document.getElementById('btnCancelComment');
const commentsList = document.getElementById('commentsList');
const commentTextInput = document.getElementById('commentTextInput');

if (btnRespond) {
    btnRespond.addEventListener('click', function() {
        commentFormWrapper.style.display = 'block';
        commentTextInput.focus();
    });
}

if (btnCancelComment) {
    btnCancelComment.addEventListener('click', function() {
        commentFormWrapper.style.display = 'none';
        commentForm.reset();
    });
}

if (commentForm) {
    commentForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const commentText = commentTextInput.value.trim();
        if (!commentText) {
            alert('Scrivi un commento prima di inviare.');
            return;
        }

        const newComment = document.createElement('div');
        newComment.className = 'card spotted-comment mb-3';
        newComment.innerHTML = `
            <div class="card-body d-flex flex-column">
                <div class="d-flex justify-content-between align-items-center mb-1">
                    <span class="comment-user">anonimo</span>
                    <span class="comment-time">Ora</span>
                </div>
                <p class="comment-text mb-1">
                    ${escapeHtml(commentText)}
                </p>
                <div class="d-flex justify-content-end">
                    <button type="button" class="btn-like-sm">
                        <i class="far fa-heart"></i>
                    </button>
                </div>
            </div>
        `;
        
        commentFormWrapper.insertAdjacentElement('afterend', newComment);
   
        commentFormWrapper.style.display = 'none';
        commentForm.reset();
    });
}
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
