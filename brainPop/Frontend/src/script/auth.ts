import { defineStore} from "pinia";

export const useAuthStore = defineStore("auth", {
    state: () => ({
        isLoggedIn: false,
        user: null as null | { name : string}//,
        //token: null as null | string
    }),
    actions: {
        async login(email: string, password: string) {
            //BACKEND CALLS



            this.isLoggedIn = true;

            //Test Data
            this.user = { name: "Test User" };
        },
        async logout() {
            this.isLoggedIn = false;
            this.user = null;
            //this.token = null;
        }
    },
    getters: {
        userName: state => state.user?.name ?? "Nicht angemeldet",
        isUserLoggedIn: state => state.isLoggedIn
    }
});