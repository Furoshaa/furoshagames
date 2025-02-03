const { createApp } = Vue;

createApp({
    data() {
        return {
            isLoggedIn: false,
            games: [
                {
                    id: 1,
                    name: 'RPG Adventure',
                    image: 'assets/images/rpg-preview.jpg'
                },
                {
                    id: 2,
                    name: 'Escape Room',
                    image: 'assets/images/escape-preview.jpg'
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
            toast: null
        }
    },
    mounted() {
        this.toast = new bootstrap.Toast(this.$refs.toast, {
            delay: 3000,
            animation: true
        });
    },
    methods: {
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
        logout() {
            this.isLoggedIn = false;
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
