const { createApp } = Vue;

createApp({
    data() {
        return {
            isLoggedIn: false,
            games: [
                {
                    id: 1,
                    name: 'RPG',
                    image: 'assets/images/rpg_preview.jpg'
                },
                {
                    id: 2,
                    name: 'Escape Game',
                    image: 'assets/images/escape_preview.jpg'
                }
            ],
            loginForm: {
                email: '',
                password: ''
            },
            registerForm: {
                username: '',
                email: '',
                password: ''
            },
            notification: {
                message: '',
                type: 'success'
            },
            toast: null,
            username: ''
        }
    },
    async mounted() {
        this.toast = new bootstrap.Toast(this.$refs.toast, {
            delay: 4000, // Increased display time
            animation: true,
            autohide: true
        });
        await this.checkSession();
    },
    methods: {
        async checkSession() {
            try {
                const response = await fetch('auth/check_session.php');
                const data = await response.json();
                if (data.success && data.isLoggedIn) {
                    this.isLoggedIn = true;
                    this.username = data.username;
                }
            } catch (error) {
                console.error('Session check error:', error);
            }
        },
        showNotification(message, type = 'success') {
            this.notification.message = message;
            this.notification.type = type;
            this.toast.show();
        },
        showLoginModal() {
            const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
            loginModal.show();
        },
        showRegisterModal() {
            const registerModal = new bootstrap.Modal(document.getElementById('registerModal'));
            registerModal.show();
        },
        async login(event) {
            event.preventDefault();
            try {
                const response = await fetch('auth/login.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(this.loginForm)
                });
                const data = await response.json();
                if (data.success) {
                    this.isLoggedIn = true;
                    const loginModal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
                    loginModal.hide();
                    this.loginForm = { email: '', password: '' };
                    this.showNotification(data.message, 'success');
                } else {
                    this.showNotification(data.message, 'error');
                }
            } catch (error) {
                console.error('Login error:', error);
                this.showNotification('An error occurred during login', 'error');
            }
        },
        async register(event) {
            event.preventDefault();
            try {
                const response = await fetch('auth/register.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(this.registerForm)
                });
                const data = await response.json();
                if (data.success) {
                    const registerModal = bootstrap.Modal.getInstance(document.getElementById('registerModal'));
                    registerModal.hide();
                    this.showLoginModal();
                    this.registerForm = { username: '', email: '', password: '' };
                    this.showNotification(data.message, 'success');
                } else {
                    this.showNotification(data.message, 'error');
                }
            } catch (error) {
                console.error('Registration error:', error);
                this.showNotification('An error occurred during registration', 'error');
            }
        },
        async logout() {
            try {
                const response = await fetch('auth/logout.php');
                const data = await response.json();
                if (data.success) {
                    this.isLoggedIn = false;
                    this.username = '';
                    this.showNotification(data.message, 'success');
                }
            } catch (error) {
                console.error('Logout error:', error);
                this.showNotification('An error occurred during logout', 'error');
            }
        },
        playGame(gameId) {
            if (!this.isLoggedIn) {
                this.showLoginModal();
                return;
            }
            window.location.href = gameId === 1 ? 'rpg/' : 'escape/';
        }
    }
}).mount('#app');
