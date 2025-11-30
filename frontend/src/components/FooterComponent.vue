<template>
    <footer class="footer mt-auto py-3 bg-dark text-light">
        <div class="container">
            <div class="row align-items-center gy-3">

                <div class="col-md-6 text-center text-md-start">
                    <small class="text-white-50">
                        © {{ currentYear }} — Tous droits réservés.
                    </small>
                </div>

                <div class="col-md-6">
                    <nav
                        class="d-flex justify-content-center justify-content-md-end align-items-center flex-wrap gap-3 footer-nav">
                        <RouterLink to="/privacy" class="footer-link">
                            Confidentialité
                        </RouterLink>

                        <RouterLink to="/legal" class="footer-link">
                            Mentions légales
                        </RouterLink>

                        <a :href="'mailto:' + contactEmail" class="footer-link d-flex align-items-center">
                            <i class="bi bi-envelope-fill me-1 small"></i> Contact
                        </a>

                        <a :href="githubUrl" target="_blank" rel="noopener noreferrer" class="footer-link github-icon"
                            aria-label="GitHub">
                            <i class="bi bi-github h4 mb-0"></i>
                        </a>
                    </nav>
                </div>

            </div>
        </div>
    </footer>
</template>

<script setup lang="ts">
const currentYear = new Date().getFullYear()
const contactEmail = 'contact@brendanfleurdelys.ch'
const githubUrl = 'https://github.com/Fbrend23/TravelDB'
</script>

<style scoped>
.footer-link {
    color: rgba(255, 255, 255, 0.6) !important;
    text-decoration: none;
    transition: color 0.3s ease, transform 0.3s ease;
    font-size: 0.9rem;
    font-weight: 500;
}

.footer-link:hover {
    color: #ffffff !important;

}

.github-icon {
    color: rgba(255, 255, 255, 0.8) !important;
}
</style>