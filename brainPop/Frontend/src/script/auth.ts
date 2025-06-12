import { defineStore} from "pinia";

export const useAuthStore = defineStore("auth", {
    state: () => ({
        isLoggedIn: false,
        user: null as null | { name: string, id: number }
    }),
    actions: {
        async login(username: string, password: string): Promise<{ success: boolean; message: string }> {
            try {
                const response = await fetch('http://localhost:3000/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username, password }),
                });

                const data = await response.json();

                if (data.success) {
                    this.isLoggedIn = true;
                    this.user = { 
                        name: username, 
                        id: data.userId 
                    };
                    return { success: true, message: data.message };
                } else {
                    return { success: false, message: data.message };
                }
            } catch (error) {
                console.error('Login error:', error);
                return { 
                    success: false, 
                    message: 'Verbindungsfehler. Bitte versuchen Sie es später erneut.' 
                };
            }
        },
        async register(username: string, password: string, repeatPassword: string): Promise<{ success: boolean; message: string }> {
            try {
                const response = await fetch('http://localhost:3000/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username, password, repeatPassword }),
                });

                const data = await response.json();
                return { 
                    success: response.ok, 
                    message: data.message 
                };
            } catch (error) {
                console.error('Registration error:', error);
                return { 
                    success: false, 
                    message: 'Verbindungsfehler. Bitte versuchen Sie es später erneut.' 
                };
            }
        },
        async logout() {
            this.isLoggedIn = false;
            this.user = null;
        }
    },
    getters: {
        userName: state => state.user?.name ?? "Nicht angemeldet",
        isUserLoggedIn: state => state.isLoggedIn
    }
});
