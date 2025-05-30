// Script para funcionalidades interativas da landing page
document.addEventListener('DOMContentLoaded', function() {
    // Funcionalidade do botão de cookies
    const cookieBanner = document.getElementById('cookieBanner');
    const acceptCookies = document.getElementById('acceptCookies');
    
    if (acceptCookies) {
        acceptCookies.addEventListener('click', function() {
            cookieBanner.style.opacity = '0';
            setTimeout(function() {
                cookieBanner.style.display = 'none';
            }, 300);
            // Salvar a preferência em localStorage
            localStorage.setItem('cookiesAccepted', 'true');
        });
    }
    
    // Verificar se os cookies já foram aceitos
    if (localStorage.getItem('cookiesAccepted') === 'true') {
        cookieBanner.style.display = 'none';
    }
    
    // Funcionalidade de voltar ao topo
    const backToTop = document.getElementById('backToTop');
    
    if (backToTop) {
        // Mostrar/ocultar botão de voltar ao topo com base na rolagem
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTop.classList.add('show');
            } else {
                backToTop.classList.remove('show');
            }
        });
        
        backToTop.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Funcionalidade de acessibilidade - tamanho da fonte
    const increaseFontBtn = document.querySelector('.accessibility button:nth-child(1)');
    const decreaseFontBtn = document.querySelector('.accessibility button:nth-child(2)');
    const contrastBtn = document.querySelector('.accessibility button:nth-child(3)');
    
    // Recuperar tamanho da fonte salvo
    let fontSize = localStorage.getItem('fontSize') ? parseInt(localStorage.getItem('fontSize')) : 16;
    document.body.style.fontSize = fontSize + 'px';
    
    if (increaseFontBtn) {
        increaseFontBtn.addEventListener('click', function() {
            if (fontSize < 24) { // Limite máximo
                fontSize += 1;
                document.body.style.fontSize = fontSize + 'px';
                localStorage.setItem('fontSize', fontSize);
                // Feedback visual
                showFeedback('Tamanho da fonte aumentado');
            } else {
                showFeedback('Tamanho máximo da fonte atingido');
            }
        });
    }
    
    if (decreaseFontBtn) {
        decreaseFontBtn.addEventListener('click', function() {
            if (fontSize > 12) { // Limite mínimo
                fontSize -= 1;
                document.body.style.fontSize = fontSize + 'px';
                localStorage.setItem('fontSize', fontSize);
                // Feedback visual
                showFeedback('Tamanho da fonte diminuído');
            } else {
                showFeedback('Tamanho mínimo da fonte atingido');
            }
        });
    }
    
    // Funcionalidade de contraste
    let highContrast = localStorage.getItem('highContrast') === 'true';
    
    // Aplicar contraste salvo
    if (highContrast) {
        document.body.classList.add('high-contrast');
    }
    
    if (contrastBtn) {
        contrastBtn.addEventListener('click', function() {
            highContrast = !highContrast;
            
            if (highContrast) {
                document.body.classList.add('high-contrast');
                localStorage.setItem('highContrast', 'true');
                showFeedback('Alto contraste ativado');
            } else {
                document.body.classList.remove('high-contrast');
                localStorage.setItem('highContrast', 'false');
                showFeedback('Alto contraste desativado');
            }
        });
    }
    
    // Adicionar classe ativa ao menu atual
    const currentLocation = window.location.href;
    const menuItems = document.querySelectorAll('.main-nav a');
    
    menuItems.forEach(item => {
        if (item.href === currentLocation) {
            item.classList.add('active');
            item.setAttribute('aria-current', 'page');
        }
    });
    
    // Menu mobile
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mainMenu = document.getElementById('main-menu');
    
    if (mobileMenuToggle && mainMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            const expanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !expanded);
            mainMenu.classList.toggle('show');
            
            // Alternar ícone
            const icon = this.querySelector('i');
            if (icon.classList.contains('fa-bars')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }
    
    // Melhorar acessibilidade dos dropdowns
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
        const link = dropdown.querySelector('a');
        const content = dropdown.querySelector('.dropdown-content');
        
        // Adicionar suporte a teclado
        link.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const expanded = this.getAttribute('aria-expanded') === 'true';
                this.setAttribute('aria-expanded', !expanded);
                
                if (!expanded) {
                    content.style.display = 'block';
                    const firstLink = content.querySelector('a');
                    if (firstLink) firstLink.focus();
                } else {
                    content.style.display = 'none';
                }
            }
        });
        
        // Fechar dropdown ao pressionar Escape
        dropdown.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                link.setAttribute('aria-expanded', 'false');
                content.style.display = 'none';
                link.focus();
            }
        });
        
        // Gerenciar foco dentro do dropdown
        content.addEventListener('keydown', function(e) {
            if (e.key === 'Tab' && !e.shiftKey) {
                const links = content.querySelectorAll('a');
                const lastLink = links[links.length - 1];
                
                if (document.activeElement === lastLink) {
                    link.setAttribute('aria-expanded', 'false');
                    content.style.display = 'none';
                }
            }
        });
    });
    
    // Animação de elementos ao entrar na viewport
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.highlight-card, .service-item, .info-card, .hero-content');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementPosition < windowHeight - 50) {
                element.classList.add('visible');
            }
        });
    };
    
    // Executar uma vez na carga da página
    animateOnScroll();
    
    // Executar durante a rolagem
    window.addEventListener('scroll', animateOnScroll);
    
    // Função para mostrar feedback visual
    function showFeedback(message) {
        // Verificar se já existe um feedback
        let feedback = document.querySelector('.feedback-message');
        
        if (!feedback) {
            feedback = document.createElement('div');
            feedback.className = 'feedback-message';
            document.body.appendChild(feedback);
        }
        
        // Atualizar mensagem e mostrar
        feedback.textContent = message;
        feedback.classList.add('show');
        
        // Ocultar após 2 segundos
        setTimeout(function() {
            feedback.classList.remove('show');
        }, 2000);
    }
    
    // Adicionar estilos para o feedback
    const style = document.createElement('style');
    style.textContent = `
        .feedback-message {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background-color: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 10px 20px;
            border-radius: 4px;
            z-index: 1000;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        .feedback-message.show {
            opacity: 1;
        }
        
        .back-to-top {
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.3s ease, visibility 0.3s ease;
        }
        
        .back-to-top.show {
            opacity: 1;
            visibility: visible;
        }
        
        .highlight-card, .service-item, .info-card, .hero-content {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .highlight-card.visible, .service-item.visible, .info-card.visible, .hero-content.visible {
            opacity: 1;
            transform: translateY(0);
        }
        
        @media (max-width: 768px) {
            .main-nav ul {
                display: none;
                flex-direction: column;
                position: absolute;
                top: 100%;
                left: 0;
                width: 100%;
                background-color: var(--primary-blue);
                z-index: 100;
            }
            
            .main-nav ul.show {
                display: flex;
            }
            
            .mobile-menu-toggle {
                display: block;
                background: none;
                border: none;
                color: white;
                font-size: 1.5rem;
                cursor: pointer;
                padding: 0.5rem;
            }
            
            .dropdown-content {
                position: static;
                width: 100%;
                box-shadow: none;
                display: none;
            }
            
            .dropdown:hover .dropdown-content {
                display: none;
            }
            
            .dropdown.active .dropdown-content {
                display: block;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Adicionar classe para mobile-menu-toggle
    if (!document.querySelector('.mobile-menu-toggle')) {
        const nav = document.querySelector('.main-nav .container');
        if (nav) {
            const toggle = document.createElement('button');
            toggle.className = 'mobile-menu-toggle';
            toggle.setAttribute('aria-expanded', 'false');
            toggle.setAttribute('aria-controls', 'main-menu');
            toggle.setAttribute('aria-label', 'Abrir menu');
            toggle.innerHTML = '<i class="fas fa-bars"></i>';
            nav.prepend(toggle);
        }
    }
});
