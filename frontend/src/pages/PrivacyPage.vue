<template>
    <main class="container py-5">
        <div class="row justify-content-center">
            <div class="col-lg-10 col-xl-8">

                <header class="text-center mb-5">
                    <h1 class="display-5 fw-bold">Politique de confidentialité</h1>
                    <p class="lead text-muted">
                        La protection de vos données personnelles est notre priorité.
                        Cette page vous explique comment nous les traitons en toute transparence.
                    </p>
                    <hr class="my-4 w-25 mx-auto">
                </header>

                <div class="card shadow-sm mb-4">
                    <div class="card-header bg-body-tertiary fw-bold">
                        <i class="bi bi-person-badge-fill me-2"></i> 1. Responsable du traitement
                    </div>
                    <div class="card-body">
                        <p class="card-text">
                            <strong>Brendan Fleurdelys</strong><br />
                            Développeur indépendant<br />
                            Contact : <a target="_blank" :href="contactEmail" class="text-decoration-none">
                                Via le formulaire de contact <i class="bi bi-box-arrow-up-right small ms-1"></i>
                            </a>
                        </p>
                    </div>
                </div>

                <div class="card shadow-sm mb-4">
                    <div class="card-header bg-body-tertiary fw-bold">
                        <i class="bi bi-archive-fill me-2"></i> 2. Données collectées
                    </div>
                    <div class="card-body">
                        <div class="mb-3">
                            <h3 class="h5 fw-bold">2.1 Compte utilisateur</h3>
                            <ul>
                                <li>Nom d’utilisateur (username)</li>
                                <li>Adresse e-mail</li>
                                <li>Mot de passe (chiffré)</li>
                            </ul>
                        </div>

                        <div class="mb-3">
                            <h3 class="h5 fw-bold">2.2 Données techniques</h3>
                            <ul>
                                <li>Adresse IP (sécurité)</li>
                                <li>Logs serveurs (erreurs, connexion, anti-abus)</li>
                            </ul>
                        </div>

                        <div class="mb-3">
                            <h3 class="h5 fw-bold">2.3 Formulaires</h3>
                            <ul>
                                <li>Adresse e-mail</li>
                                <li>Contenu du message</li>
                                <li>Métadonnées (date, IP)</li>
                            </ul>
                        </div>

                        <div>
                            <h3 class="h5 fw-bold">2.4 Cookies</h3>
                            <p class="card-text">
                                Ce site utilise uniquement des cookies techniques nécessaires, tels que
                                les cookies de session. Aucun cookie publicitaire ou analytique n’est installé.
                            </p>
                        </div>
                    </div>
                </div>

                <div class="row g-4 mb-4">
                    <div class="col-md-6">
                        <div class="card shadow-sm h-100">
                            <div class="card-header bg-body-tertiary fw-bold">
                                <i class="bi bi-bullseye me-2"></i> 3. Finalités du traitement
                            </div>
                            <div class="card-body">
                                <p class="card-text mb-2">Les données sont utilisées pour :</p>
                                <ul>
                                    <li>Créer et gérer un compte utilisateur</li>
                                    <li>Assurer l'accès aux services</li>
                                    <li>Répondre aux messages envoyés via les formulaires</li>
                                    <li>Garantir la sécurité du site (anti-fraude, logs)</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div class="col-md-6">
                        <div class="card shadow-sm h-100">
                            <div class="card-header bg-body-tertiary fw-bold">
                                <i class="bi bi-journal-text me-2"></i> 4. Base légale
                            </div>
                            <div class="card-body">
                                <ul>
                                    <li>Exécution contractuelle (gestion du compte)</li>
                                    <li>Intérêt légitime (sécurité)</li>
                                    <li>Consentement (formulaire de contact)</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>


                <div class="card shadow-sm mb-4">
                    <div class="card-header bg-body-tertiary fw-bold">
                        <i class="bi bi-server me-2"></i> 5. Hébergement et sécurité
                    </div>
                    <div class="card-body">
                        <p class="card-text">
                            Le site est hébergé chez <strong>Infomaniak (Suisse)</strong>, garantissant un haut niveau
                            de protection des données. Les mots de passe sont chiffrés, les communications
                            se font en HTTPS et les accès aux données sont strictement limités.
                        </p>
                    </div>
                </div>

                <div class="card shadow-sm mb-4">
                    <div class="card-header bg-body-tertiary fw-bold">
                        <i class="bi bi-hourglass-split me-2"></i> 6. Durée de conservation
                    </div>
                    <div class="card-body">
                        <ul class="mb-0">
                            <li>Compte utilisateur : tant que le compte est actif</li>
                            <li>Logs techniques : jusqu'à 12 mois</li>
                            <li>Messages de contact : jusqu'à 6 mois</li>
                            <li>Cookies de session : supprimés à la fin de la session</li>
                        </ul>
                    </div>
                </div>

                <div class="card shadow-sm border-primary mb-4">
                    <div class="card-header bg-primary text-white fw-bold">
                        <i class="bi bi-shield-check me-2"></i> 7. Vos droits
                    </div>
                    <div class="card-body bg-primary-subtle text-primary-emphasis">
                        <p class="card-text">
                            Conformément au RGPD et à la LPD, vous disposez de droits sur vos données :
                        </p>
                        <div class="row">
                            <div class="col-md-6">
                                <ul>
                                    <li>L’accès à vos données</li>
                                    <li>La correction de vos données</li>
                                    <li>La suppression de vos données</li>
                                </ul>
                            </div>
                            <div class="col-md-6">
                                <ul>
                                    <li>La fermeture de votre compte</li>
                                    <li>Une copie de vos données personnelles</li>
                                </ul>
                            </div>
                        </div>
                        <div class="mt-3 fw-bold">
                            Pour exercer un droit, contactez-moi via :
                            <a target="_blank" :href="contactEmail"
                                class="text-decoration-underline link-primary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover">
                                le formulaire de contact <i class="bi bi-box-arrow-up-right small"></i>
                            </a>
                        </div>
                    </div>
                </div>

                <div class="card shadow-sm mb-4">
                    <div class="card-body">
                        <h2 class="h5 fw-bold mb-3"><i class="bi bi-box-arrow-up-right me-2"></i> 8. Transmission des
                            données</h2>
                        <p class="card-text text-muted">
                            Les données ne sont ni vendues ni transmises à des tiers commerciaux.
                            Les seules transmissions concernent les services techniques nécessaires
                            au fonctionnement du site (hébergeur, sécurité).
                        </p>
                        <hr>
                        <h2 class="h5 fw-bold mb-3 mt-4"><i class="bi bi-puzzle-fill me-2"></i> 9. Services tiers
                            utilisés</h2>
                        <ul class="text-muted">
                            <li>PHPMailer (envoi d’e-mails)</li>
                            <li>reCAPTCHA (anti-bot)</li>
                            <li>API internes</li>
                        </ul>
                        <hr>
                        <h2 class="h5 fw-bold mb-3 mt-4"><i class="bi bi-cookie me-2"></i> 10. Cookies</h2>
                        <p class="card-text text-muted">
                            Le site principal n'utilise que des cookies techniques de session. Cependant, notre
                            formulaire de contact (hébergé sur un domaine dédié) est protégé par Google reCAPTCHA. Ce
                            service peut déposer des cookies d'analyse et collecter des données techniques (IP,
                            comportement) conformément aux <a href='https://policies.google.com/privacy'
                                target='_blank'>règles de confidentialité de Google</a> pour distinguer les humains des
                            robots.
                        </p>
                    </div>
                </div>

                <div class="text-center mt-5">
                    <p class="lead">
                        Des questions ?
                        <a target="_blank" :href="contactEmail" class="btn btn-primary ms-2">
                            Accéder au formulaire de contact <i class="bi bi-box-arrow-up-right ms-1"></i>
                        </a>
                    </p>
                </div>

            </div>
        </div>
    </main>
</template>

<script setup lang="ts">
const contactEmail = "https://contact.brendanfleurdelys.ch/"
</script>