<!DOCTYPE html>
<html lang="en" data-bs-theme="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Furosha's Games</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</head>
<body class="bg-dark">
    <div id="app">
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark border-bottom">
            <div class="container">
                <a class="navbar-brand" href="index.php">Furosha's Games</a>
                <div class="ms-auto">
                    <button v-if="!isLoggedIn" @click="showLoginModal" class="btn btn-outline-light me-2">Sign In</button>
                    <button v-if="!isLoggedIn" @click="showRegisterModal" class="btn btn-primary">Sign Up</button>
                    <button v-else @click="logout" class="btn btn-outline-light">Logout</button>
                </div>
            </div>
        </nav>

        <div class="container my-5">
            <div class="row g-4">
                <div class="col-md-6" v-for="game in games" :key="game.id">
                    <div class="card bg-dark h-100">
                        <div class="position-relative game-tile">
                            <img :src="game.image" class="card-img-top" :alt="game.name" 
                                 style="filter: blur(3px); height: 300px; object-fit: cover;">
                            <div class="position-absolute top-50 start-50 translate-middle text-center">
                                <h2 class="text-white fw-bold">{{ game.name }}</h2>
                                <button class="btn btn-primary mt-3" @click="playGame(game.id)">Play Now</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Toast Container -->
        <div class="toast-container position-fixed bottom-0 end-0 p-3">
            <div class="toast align-items-center border-0" 
                 :class="{'bg-success': notification.type === 'success', 'bg-danger': notification.type === 'error'}"
                 role="alert" 
                 aria-live="assertive" 
                 aria-atomic="true"
                 ref="toast">
                <div class="d-flex">
                    <div class="toast-body text-white">
                        {{ notification.message }}
                    </div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
                </div>
            </div>
        </div>

        <!-- Login Modal -->
        <div class="modal fade" id="loginModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content bg-dark text-light">
                    <div class="modal-header border-secondary">
                        <h5 class="modal-title">Sign In</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form @submit.prevent="login">
                            <div class="mb-3">
                                <label class="form-label">Email</label>
                                <input type="email" v-model="loginForm.email" class="form-control bg-dark text-light">
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Password</label>
                                <input type="password" v-model="loginForm.password" class="form-control bg-dark text-light">
                            </div>
                            <button type="submit" class="btn btn-primary w-100">Sign In</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>

        <!-- Register Modal -->
        <div class="modal fade" id="registerModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content bg-dark text-light">
                    <div class="modal-header border-secondary">
                        <h5 class="modal-title">Sign Up</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form @submit.prevent="register">
                            <div class="mb-3">
                                <label class="form-label">Username</label>
                                <input type="text" v-model="registerForm.username" class="form-control bg-dark text-light">
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Email</label>
                                <input type="email" v-model="registerForm.email" class="form-control bg-dark text-light">
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Password</label>
                                <input type="password" v-model="registerForm.password" class="form-control bg-dark text-light">
                            </div>
                            <button type="submit" class="btn btn-primary w-100">Sign Up</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <script src="assets/js/vue.js"></script>
</body>
</html>