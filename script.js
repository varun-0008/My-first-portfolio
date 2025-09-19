document.addEventListener("DOMContentLoaded", function () {
    // Helper function to update element text content
    const updateText = (id, value) => {
        const element = document.getElementById(id);
        if (element) element.innerText = value;
    };

    // Home Section
    updateText('home-name', portfolioData.home.name);
    updateText('home-bio', portfolioData.home.short_bio);

    // About Section
    document.getElementById('about-image').src = portfolioData.about.image;
    document.getElementById('about-image').alt = `A photo of ${portfolioData.about.name}`;
    updateText('about-name', portfolioData.about.name);
    updateText('about-role', portfolioData.about.role);
    updateText('about-p', portfolioData.about.description);
    document.getElementById('cv-link').href = portfolioData.about.cv_link;

    // Projects Section
    const projectsContainer = document.getElementById('projects-container');
    portfolioData.projects.forEach(project => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
            <img src="${project.image}" alt="${project.title}">
            <div class="box">
                <div class="text">${project.title}</div>
                <p>${project.description}</p>
            </div>
        `;
        projectsContainer.appendChild(card);
    });

    // Skills Section
    const skillsIntroData = portfolioData.skills_section;
    updateText('skills-title', skillsIntroData.title);
    // Use innerHTML for the skills text to render the HTML tags from data.js
    const skillsTextElement = document.getElementById('skills-text');
    if (skillsTextElement) skillsTextElement.innerHTML = skillsIntroData.text;

    document.getElementById('skills-read-more').href = skillsIntroData.read_more_link;

    const skillsGridContainer = document.getElementById('skills-grid');
    portfolioData.skills.forEach(skill => {
        const skillBox = document.createElement('div');
        skillBox.classList.add('skill-box');
        skillBox.innerHTML = `
            <img src="${skill.image}" alt="${skill.name} icon">
            <div class="skill-name">${skill.name}</div>
        `;
        skillsGridContainer.appendChild(skillBox);
    });

    // Contact Section
    const contactInfoContainer = document.getElementById('contact-info');
    contactInfoContainer.innerHTML = `
        <div class="row">
            <i class="fas fa-user"></i>
            <div class="info">
                <div class="head">Name</div>
                <div class="sub-title">${portfolioData.contact.name}</div>
            </div>
        </div>
        <div class="row">
            <i class="fas fa-map-marker-alt"></i>
            <div class="info">
                <div class="head">Address</div>
                <div class="sub-title">${portfolioData.contact.address}</div>
            </div>
        </div>
        <div class="row">
            <i class="fas fa-envelope"></i>
            <div class="info">
                <div class="head">Email</div>
                <div class="sub-title">${portfolioData.contact.email}</div>
            </div>
        </div>
    `;

    // Social Media Icons
    const socialIconsContainer = document.getElementById('social-icons-container');
    if (portfolioData.socials && portfolioData.socials.length > 0) {
        portfolioData.socials.forEach(social => {
            const socialLink = document.createElement('a');
            socialLink.href = social.url;
            socialLink.target = '_blank';
            socialLink.rel = 'noopener noreferrer'; // Security best practice
            socialLink.setAttribute('aria-label', social.name);
            socialLink.innerHTML = `<i class="${social.icon}"></i>`;
            socialIconsContainer.appendChild(socialLink);
        });
    }

    // Footer
    const footerNameLink = document.getElementById('footer-name-link');
    footerNameLink.innerText = portfolioData.home.name;
    footerNameLink.href = "#home"; // Or your LinkedIn/GitHub URL

    // Sticky navbar on scroll script
    const navbar = document.querySelector(".navbar");
    window.addEventListener("scroll", () => {
        if (window.scrollY > 20) {
            navbar.classList.add("sticky");
        } else {
            navbar.classList.remove("sticky");
        }
    });

    // toggle menu/navbar script
    const menuBtn = document.querySelector("button.menu-btn");
    const menu = document.querySelector(".navbar .menu");
    menuBtn.addEventListener("click", () => {
        menu.classList.toggle("active");
        menuBtn.querySelector("i").classList.toggle("active");
    });

    // Close mobile menu on link click
    document.querySelectorAll(".navbar .menu a").forEach(link => {
        link.addEventListener("click", () => {
            menu.classList.remove("active");
            menuBtn.querySelector("i").classList.remove("active");
        });
    });

    // Scroll reveal animation script
    const elementsToReveal = document.querySelectorAll('.home-content, .about .title, .about .about-content, .projects .title, .projects .projects-grid, .skills .title, .skills-content, .contact .title, .contact-content, .skill-name');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1 // Trigger when 10% of the element is visible
    });

    elementsToReveal.forEach(element => {
        element.classList.add('reveal'); // Set initial state for animation
        revealObserver.observe(element);
    });

    // Typing animation script
    if (portfolioData.home.roles && portfolioData.home.roles.length > 0) {
        new Typed("#home-role", {
            strings: portfolioData.home.roles,
            typeSpeed: 100,
            backSpeed: 60,
            loop: true
        });
    }

    // Contact Form Submission
    const form = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    const submitButton = form.querySelector('button[type="submit"]');

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        try {
            // Disable button and show sending status
            submitButton.disabled = true;
            submitButton.innerHTML = "Sending...";
            formStatus.innerHTML = "Sending...";
            formStatus.style.display = "block";
            formStatus.className = "";

            // --- EmailJS Integration ---
            const emailjsConfig = portfolioData.emailjs;

            if (!emailjsConfig || !emailjsConfig.serviceID || !emailjsConfig.templateID || !emailjsConfig.publicKey) {
                throw new Error("EmailJS configuration is missing or incomplete in data.js");
            }

            emailjs.sendForm(emailjsConfig.serviceID, emailjsConfig.templateID, form, emailjsConfig.publicKey)
                .then(() => {
                    formStatus.innerHTML = "Message sent successfully!";
                    formStatus.classList.add('success');
                    alert("Message sent successfully!");
                    form.reset();
                })
                .catch((err) => {
                    formStatus.innerHTML = `Failed to send message.`;
                    formStatus.classList.add('error');
                    alert(`An error occurred. Please try again later. Error: ${JSON.stringify(err)}`);
                })
                .finally(() => {
                    submitButton.disabled = false;
                    submitButton.innerHTML = "Send message";
                    setTimeout(() => { formStatus.style.display = 'none'; }, 5000);
                });
        } catch (error) {
            // This will catch synchronous errors, like a missing config
            alert(`A critical error occurred: ${error.message}`);
            submitButton.disabled = false;
            submitButton.innerHTML = "Send message";
        }
    });
});