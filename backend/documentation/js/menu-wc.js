'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">backend documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search">
    <input type="text" placeholder="Type to search">
    <button type="button"
        class="search-input-clear"
        aria-label="Clear search"
        data-search-input-clear>&times;</button>
</div>
` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                                <li class="link">
                                    <a href="overview.html" data-type="chapter-link">
                                        <span class="icon ion-ios-keypad"></span>Overview
                                    </a>
                                </li>

                            <li class="link">
                                <a href="index.html" data-type="chapter-link">
                                    <span class="icon ion-ios-paper"></span>
                                        README
                                </a>
                            </li>
                                <li class="link">
                                    <a href="architecture.html" data-type="chapter-link">
                                        <span class="icon ion-ios-git-branch"></span>Architecture
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>

                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-bs-toggle="collapse" ${ isNormalMode ?
                                'data-bs-target="#modules-links"' : 'data-bs-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-AppModule-b83182441ef15600aa604241cdbd0dd72750c68bc1f50585932e9da3e6289144fe402bd892b233117a647b9fabaa24489b77936bef2992880426b72ebeefc3ae"' : 'data-bs-target="#xs-controllers-links-module-AppModule-b83182441ef15600aa604241cdbd0dd72750c68bc1f50585932e9da3e6289144fe402bd892b233117a647b9fabaa24489b77936bef2992880426b72ebeefc3ae"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AppModule-b83182441ef15600aa604241cdbd0dd72750c68bc1f50585932e9da3e6289144fe402bd892b233117a647b9fabaa24489b77936bef2992880426b72ebeefc3ae"' :
                                            'id="xs-controllers-links-module-AppModule-b83182441ef15600aa604241cdbd0dd72750c68bc1f50585932e9da3e6289144fe402bd892b233117a647b9fabaa24489b77936bef2992880426b72ebeefc3ae"' }>
                                            <li class="link">
                                                <a href="controllers/AppController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AppModule-b83182441ef15600aa604241cdbd0dd72750c68bc1f50585932e9da3e6289144fe402bd892b233117a647b9fabaa24489b77936bef2992880426b72ebeefc3ae"' : 'data-bs-target="#xs-injectables-links-module-AppModule-b83182441ef15600aa604241cdbd0dd72750c68bc1f50585932e9da3e6289144fe402bd892b233117a647b9fabaa24489b77936bef2992880426b72ebeefc3ae"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AppModule-b83182441ef15600aa604241cdbd0dd72750c68bc1f50585932e9da3e6289144fe402bd892b233117a647b9fabaa24489b77936bef2992880426b72ebeefc3ae"' :
                                        'id="xs-injectables-links-module-AppModule-b83182441ef15600aa604241cdbd0dd72750c68bc1f50585932e9da3e6289144fe402bd892b233117a647b9fabaa24489b77936bef2992880426b72ebeefc3ae"' }>
                                        <li class="link">
                                            <a href="injectables/AppService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AuthModule.html" data-type="entity-link" >AuthModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-AuthModule-edc52ba9eaadc6f00ca022d27f1dbe4d194c9f555639940e78b316e58d9e0ddefdbf16cf28aa8eb18d84b9e89676b3a16dcbc77711beea752318313036033c8e"' : 'data-bs-target="#xs-controllers-links-module-AuthModule-edc52ba9eaadc6f00ca022d27f1dbe4d194c9f555639940e78b316e58d9e0ddefdbf16cf28aa8eb18d84b9e89676b3a16dcbc77711beea752318313036033c8e"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AuthModule-edc52ba9eaadc6f00ca022d27f1dbe4d194c9f555639940e78b316e58d9e0ddefdbf16cf28aa8eb18d84b9e89676b3a16dcbc77711beea752318313036033c8e"' :
                                            'id="xs-controllers-links-module-AuthModule-edc52ba9eaadc6f00ca022d27f1dbe4d194c9f555639940e78b316e58d9e0ddefdbf16cf28aa8eb18d84b9e89676b3a16dcbc77711beea752318313036033c8e"' }>
                                            <li class="link">
                                                <a href="controllers/AuthController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AuthModule-edc52ba9eaadc6f00ca022d27f1dbe4d194c9f555639940e78b316e58d9e0ddefdbf16cf28aa8eb18d84b9e89676b3a16dcbc77711beea752318313036033c8e"' : 'data-bs-target="#xs-injectables-links-module-AuthModule-edc52ba9eaadc6f00ca022d27f1dbe4d194c9f555639940e78b316e58d9e0ddefdbf16cf28aa8eb18d84b9e89676b3a16dcbc77711beea752318313036033c8e"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AuthModule-edc52ba9eaadc6f00ca022d27f1dbe4d194c9f555639940e78b316e58d9e0ddefdbf16cf28aa8eb18d84b9e89676b3a16dcbc77711beea752318313036033c8e"' :
                                        'id="xs-injectables-links-module-AuthModule-edc52ba9eaadc6f00ca022d27f1dbe4d194c9f555639940e78b316e58d9e0ddefdbf16cf28aa8eb18d84b9e89676b3a16dcbc77711beea752318313036033c8e"' }>
                                        <li class="link">
                                            <a href="injectables/AuthService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/MedicosModule.html" data-type="entity-link" >MedicosModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-MedicosModule-2e0cd920e1483b4f42463092cf25edb1ad30cf937bdd6686484fbf4ccc849c2c9160329a28bdd5f96c8731873a660605ef47d45fe3e9fd8ad8f1d6d16b53e8a3"' : 'data-bs-target="#xs-controllers-links-module-MedicosModule-2e0cd920e1483b4f42463092cf25edb1ad30cf937bdd6686484fbf4ccc849c2c9160329a28bdd5f96c8731873a660605ef47d45fe3e9fd8ad8f1d6d16b53e8a3"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-MedicosModule-2e0cd920e1483b4f42463092cf25edb1ad30cf937bdd6686484fbf4ccc849c2c9160329a28bdd5f96c8731873a660605ef47d45fe3e9fd8ad8f1d6d16b53e8a3"' :
                                            'id="xs-controllers-links-module-MedicosModule-2e0cd920e1483b4f42463092cf25edb1ad30cf937bdd6686484fbf4ccc849c2c9160329a28bdd5f96c8731873a660605ef47d45fe3e9fd8ad8f1d6d16b53e8a3"' }>
                                            <li class="link">
                                                <a href="controllers/MedicosController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MedicosController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-MedicosModule-2e0cd920e1483b4f42463092cf25edb1ad30cf937bdd6686484fbf4ccc849c2c9160329a28bdd5f96c8731873a660605ef47d45fe3e9fd8ad8f1d6d16b53e8a3"' : 'data-bs-target="#xs-injectables-links-module-MedicosModule-2e0cd920e1483b4f42463092cf25edb1ad30cf937bdd6686484fbf4ccc849c2c9160329a28bdd5f96c8731873a660605ef47d45fe3e9fd8ad8f1d6d16b53e8a3"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-MedicosModule-2e0cd920e1483b4f42463092cf25edb1ad30cf937bdd6686484fbf4ccc849c2c9160329a28bdd5f96c8731873a660605ef47d45fe3e9fd8ad8f1d6d16b53e8a3"' :
                                        'id="xs-injectables-links-module-MedicosModule-2e0cd920e1483b4f42463092cf25edb1ad30cf937bdd6686484fbf4ccc849c2c9160329a28bdd5f96c8731873a660605ef47d45fe3e9fd8ad8f1d6d16b53e8a3"' }>
                                        <li class="link">
                                            <a href="injectables/MedicosService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MedicosService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ReservasModule.html" data-type="entity-link" >ReservasModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-ReservasModule-ec601b6b59583a53f4f4715528177b36ba7cb95fb3d85257a979b98ad96f8c2576ad7039056ac89ed64a0ecc4d019f55e1ea74ba94bb909539be5f3ffe58024d"' : 'data-bs-target="#xs-controllers-links-module-ReservasModule-ec601b6b59583a53f4f4715528177b36ba7cb95fb3d85257a979b98ad96f8c2576ad7039056ac89ed64a0ecc4d019f55e1ea74ba94bb909539be5f3ffe58024d"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-ReservasModule-ec601b6b59583a53f4f4715528177b36ba7cb95fb3d85257a979b98ad96f8c2576ad7039056ac89ed64a0ecc4d019f55e1ea74ba94bb909539be5f3ffe58024d"' :
                                            'id="xs-controllers-links-module-ReservasModule-ec601b6b59583a53f4f4715528177b36ba7cb95fb3d85257a979b98ad96f8c2576ad7039056ac89ed64a0ecc4d019f55e1ea74ba94bb909539be5f3ffe58024d"' }>
                                            <li class="link">
                                                <a href="controllers/ReservasController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ReservasController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-ReservasModule-ec601b6b59583a53f4f4715528177b36ba7cb95fb3d85257a979b98ad96f8c2576ad7039056ac89ed64a0ecc4d019f55e1ea74ba94bb909539be5f3ffe58024d"' : 'data-bs-target="#xs-injectables-links-module-ReservasModule-ec601b6b59583a53f4f4715528177b36ba7cb95fb3d85257a979b98ad96f8c2576ad7039056ac89ed64a0ecc4d019f55e1ea74ba94bb909539be5f3ffe58024d"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ReservasModule-ec601b6b59583a53f4f4715528177b36ba7cb95fb3d85257a979b98ad96f8c2576ad7039056ac89ed64a0ecc4d019f55e1ea74ba94bb909539be5f3ffe58024d"' :
                                        'id="xs-injectables-links-module-ReservasModule-ec601b6b59583a53f4f4715528177b36ba7cb95fb3d85257a979b98ad96f8c2576ad7039056ac89ed64a0ecc4d019f55e1ea74ba94bb909539be5f3ffe58024d"' }>
                                        <li class="link">
                                            <a href="injectables/ReservasService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ReservasService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/UsuariosModule.html" data-type="entity-link" >UsuariosModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-UsuariosModule-db26760844f1f276b1a00e510f2a678844837cb8d2a9d28622fe54d3f8ac7ace1586fd041b3516eaaee99efa58a07589f25ae62e7e0d698946aee6c163896afb"' : 'data-bs-target="#xs-controllers-links-module-UsuariosModule-db26760844f1f276b1a00e510f2a678844837cb8d2a9d28622fe54d3f8ac7ace1586fd041b3516eaaee99efa58a07589f25ae62e7e0d698946aee6c163896afb"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-UsuariosModule-db26760844f1f276b1a00e510f2a678844837cb8d2a9d28622fe54d3f8ac7ace1586fd041b3516eaaee99efa58a07589f25ae62e7e0d698946aee6c163896afb"' :
                                            'id="xs-controllers-links-module-UsuariosModule-db26760844f1f276b1a00e510f2a678844837cb8d2a9d28622fe54d3f8ac7ace1586fd041b3516eaaee99efa58a07589f25ae62e7e0d698946aee6c163896afb"' }>
                                            <li class="link">
                                                <a href="controllers/UsuariosController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UsuariosController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-UsuariosModule-db26760844f1f276b1a00e510f2a678844837cb8d2a9d28622fe54d3f8ac7ace1586fd041b3516eaaee99efa58a07589f25ae62e7e0d698946aee6c163896afb"' : 'data-bs-target="#xs-injectables-links-module-UsuariosModule-db26760844f1f276b1a00e510f2a678844837cb8d2a9d28622fe54d3f8ac7ace1586fd041b3516eaaee99efa58a07589f25ae62e7e0d698946aee6c163896afb"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-UsuariosModule-db26760844f1f276b1a00e510f2a678844837cb8d2a9d28622fe54d3f8ac7ace1586fd041b3516eaaee99efa58a07589f25ae62e7e0d698946aee6c163896afb"' :
                                        'id="xs-injectables-links-module-UsuariosModule-db26760844f1f276b1a00e510f2a678844837cb8d2a9d28622fe54d3f8ac7ace1586fd041b3516eaaee99efa58a07589f25ae62e7e0d698946aee6c163896afb"' }>
                                        <li class="link">
                                            <a href="injectables/UsuariosService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UsuariosService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                </ul>
                </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#controllers-links"' :
                                'data-bs-target="#xs-controllers-links"' }>
                                <span class="icon ion-md-swap"></span>
                                <span>Controllers</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="controllers-links"' : 'id="xs-controllers-links"' }>
                                <li class="link">
                                    <a href="controllers/AppController.html" data-type="entity-link" >AppController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/AuthController.html" data-type="entity-link" >AuthController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/MedicosController.html" data-type="entity-link" >MedicosController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/ReservasController.html" data-type="entity-link" >ReservasController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/UsuariosController.html" data-type="entity-link" >UsuariosController</a>
                                </li>
                            </ul>
                        </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#entities-links"' :
                                'data-bs-target="#xs-entities-links"' }>
                                <span class="icon ion-ios-apps"></span>
                                <span>Entities</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="entities-links"' : 'id="xs-entities-links"' }>
                                <li class="link">
                                    <a href="entities/Medico.html" data-type="entity-link" >Medico</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Reserva.html" data-type="entity-link" >Reserva</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Usuario.html" data-type="entity-link" >Usuario</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#classes-links"' :
                            'data-bs-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/ActualizarReservaDTO.html" data-type="entity-link" >ActualizarReservaDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/CrearReservaDTO.html" data-type="entity-link" >CrearReservaDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/LoginDTO.html" data-type="entity-link" >LoginDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/MedicoResponseDTO.html" data-type="entity-link" >MedicoResponseDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/ReservaFechaDTO.html" data-type="entity-link" >ReservaFechaDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/ReservaResponseDTO.html" data-type="entity-link" >ReservaResponseDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateValorConsultaDTO.html" data-type="entity-link" >UpdateValorConsultaDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/UsuarioResponseDTO.html" data-type="entity-link" >UsuarioResponseDTO</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#injectables-links"' :
                                'data-bs-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/AppService.html" data-type="entity-link" >AppService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AuthService.html" data-type="entity-link" >AuthService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/MedicosService.html" data-type="entity-link" >MedicosService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ReservasService.html" data-type="entity-link" >ReservasService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UsuariosService.html" data-type="entity-link" >UsuariosService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#guards-links"' :
                            'data-bs-target="#xs-guards-links"' }>
                            <span class="icon ion-ios-lock"></span>
                            <span>Guards</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="guards-links"' : 'id="xs-guards-links"' }>
                            <li class="link">
                                <a href="guards/JwtAuthGuard.html" data-type="entity-link" >JwtAuthGuard</a>
                            </li>
                            <li class="link">
                                <a href="guards/RolesGuard.html" data-type="entity-link" >RolesGuard</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#miscellaneous-links"'
                            : 'data-bs-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <a data-type="chapter-link" href="routes.html"><span class="icon ion-ios-git-branch"></span>Routes</a>
                        </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank" rel="noopener noreferrer">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});
