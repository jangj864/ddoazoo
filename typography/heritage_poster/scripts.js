document.addEventListener('DOMContentLoaded', function() {
    var detailsButtons = document.querySelectorAll('.detailsButton'); // Select all detail buttons
    detailsButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            var content = this.closest('.subtitle').querySelector('.detailsContent'); // Find the closest .detailsContent to the button
            if (content.style.maxHeight && content.classList.contains('expanded')) {
                content.style.maxHeight = null; // Collapse the section
                content.classList.remove('expanded');
            } else {
                content.style.maxHeight = content.scrollHeight + "px"; // Expand the section
                content.classList.add('expanded');
            }
        });
    });

    // Manually expand the first .detailsContent
    var firstDetailsContent = document.querySelector('.subtitle .detailsContent');
    if (firstDetailsContent) {
        firstDetailsContent.style.maxHeight = firstDetailsContent.scrollHeight + "px";
        firstDetailsContent.classList.add('expanded');
    }
});
