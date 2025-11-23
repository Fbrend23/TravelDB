<template>
    <main class="container py-5">
        <div class="row justify-content-center">
            <div class="col-lg-10 col-xl-8">

                <header class="text-center mb-5">
                    <h1 class="display-5 fw-bold">Mentions légales</h1>
                    <p class="lead text-muted">
                        Informations légales concernant l'éditeur, l'hébergement et les conditions d'utilisation du
                        site.
                    </p>
                    <hr class="my-4 w-25 mx-auto">
                </header>

                <div class="card shadow-sm mb-4">
                    <div class="card-header bg-body-tertiary fw-bold">
                        <i class="bi bi-person-vcard-fill me-2"></i> 1. Éditeur du site
                    </div>
                    <div class="card-body">
                        <p class="card-text">
                            <strong>{{ siteOwner }}</strong><br />
                            Développeur indépendant<br />
                            Suisse<br />
                            Contact : <a :href="'mailto:' + contactEmail" class="text-decoration-none">
                                {{ contactEmail }} <i class="bi bi-envelope-fill small ms-1"></i>
                            </a>
                        </p>
                    </div>
                </div>

                <div class="card shadow-sm mb-4">
                    <div class="card-header bg-body-tertiary fw-bold">
                        <i class="bi bi-hdd-network-fill me-2"></i> 2. Hébergement
                    </div>
                    <div class="card-body">
                        <p class="card-text">
                            Le site est hébergé par :<br />
                            <strong>{{ hostingProvider }}</strong><br />
                            Rue Eugène-Marziano 25, 1227 Genève, Suisse<br />
                            Site web : <a href="https://www.infomaniak.com" target="_blank" rel="noopener noreferrer"
                                class="text-decoration-none">
                                https://www.infomaniak.com <i class="bi bi-box-arrow-up-right small ms-1"></i>
                            </a>
                        </p>
                    </div>
                </div>

                <div class="row g-4 mb-4">
                    <div class="col-md-6">
                        <div class="card shadow-sm h-100">
                            <div class="card-header bg-body-tertiary fw-bold">
                                <i class="bi bi-pen-fill me-2"></i> 3. Propriété intellectuelle
                            </div>
                            <div class="card-body">
                                <p class="card-text mb-3">
                                    L’ensemble du contenu présent sur ce site (textes, images, code source, logo, etc.)
                                    est, sauf mention contraire, la propriété exclusive de {{ siteOwner }}.
                                </p>
                                <p class="card-text text-muted small">
                                    Toute reproduction ou réutilisation sans autorisation écrite préalable est
                                    strictement interdite.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div class="col-md-6">
                        <div class="card shadow-sm h-100">
                            <div class="card-header bg-body-tertiary fw-bold">
                                <i class="bi bi-exclamation-triangle-fill me-2"></i> 4. Responsabilité
                            </div>
                            <div class="card-body">
                                <p class="card-text mb-3">
                                    Malgré le soin apporté à la mise à jour du contenu, {{ siteOwner }} ne peut garantir
                                    l’exactitude absolue des informations publiées.
                                </p>
                                <p class="card-text text-muted small">
                                    La responsabilité de l’éditeur ne saurait être engagée en cas d’erreur ou de dommage
                                    résultant de l’utilisation du site.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="card shadow-sm mb-4">
                    <div class="card-header bg-body-tertiary fw-bold">
                        <i class="bi bi-link-45deg me-2"></i> 5. Liens externes
                    </div>
                    <div class="card-body">
                        <p class="card-text">
                            Le site peut contenir des liens hypertextes vers d’autres sites web. {{ siteOwner }}
                            n’exerce aucun contrôle sur ces sites et décline toute responsabilité quant à leur contenu
                            ou leurs pratiques.
                        </p>
                    </div>
                </div>

                <div class="card shadow-sm border-primary mb-4">
                    <div class="card-header bg-primary text-white fw-bold">
                        <i class="bi bi-shield-lock-fill me-2"></i> 6. Données personnelles et Cookies
                    </div>
                    <div class="card-body bg-primary-subtle text-primary-emphasis">
                        <p class="card-text mb-4">
                            Le traitement des données personnelles collectées via ce site ainsi que les informations
                            concernant l’utilisation des cookies sont détaillés sur notre page dédiée.
                        </p>
                        <div class="text-center">
                            <router-link to="/privacy" class="btn btn-primary">
                                <i class="bi bi-eye-fill me-2"></i> Voir la Politique de confidentialité
                            </router-link>
                        </div>
                    </div>
                </div>

                <div class="card shadow-sm mb-4">
                    <div class="card-header bg-body-tertiary fw-bold">
                        <i class="bi bi-hammer me-2"></i> 7. Droit applicable et juridiction
                    </div>
                    <div class="card-body">
                        <p class="card-text">
                            Le présent site est soumis au <strong>droit suisse</strong>.
                        </p>
                        <p class="card-text mb-0">
                            En cas de litige, les tribunaux compétents du canton de <strong>Vaud</strong> seront seuls
                            compétents.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    </main>
</template>

<script setup lang="ts">
const siteOwner = 'Brendan Fleurdelys'
const contactEmail = 'contact@brendanfleurdelys.ch'
const hostingProvider = 'Infomaniak Network SA'
</script>