document.addEventListener('DOMContentLoaded', function() {
    var detailsButtons = document.querySelectorAll('.detailsButton'); // Select all detail buttons
    detailsButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            var content = this.closest('.subtitle').querySelector('.detailsContent'); // Find the closest .detailsContent to the button
            if (content.style.maxHeight) {
                content.style.maxHeight = null; // Collapse the section
                content.classList.remove('expanded');
            } else {
                content.style.maxHeight = content.scrollHeight + "px"; // Expand the section
                content.classList.add('expanded');
            }
        });
    });
});
