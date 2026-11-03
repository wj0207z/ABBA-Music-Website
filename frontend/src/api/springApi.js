import axios from "axios";

const springApi = axios.create({
    baseURL: "/api",
    headers: {
        Accept: "application/json"
    }
});

export async function getCsrf() {
    const response = await springApi.get("/csrf");
    return response.data;
}

export async function loginToSpring(email, password) {
    const csrf = await getCsrf();

    const form = new URLSearchParams();
    form.set("email", email);
    form.set("password", password);

    await springApi.post("/login", form, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            [csrf.headerName]: csrf.token
        }
    });

    await getCsrf();

    const response = await springApi.get("/me");
    return response.data;
}

export async function logoutFromSpring() {
    const csrf = await getCsrf();

    await springApi.post("/logout", null, {
        headers: {
            [csrf.headerName]: csrf.token
        }
    });
}


export default springApi;