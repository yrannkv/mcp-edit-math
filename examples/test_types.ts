interface User {
    id: number;
    username: string;
}

function printUser(user: User) {
    console.log(user.username);
}

function main() {
    const u: User = { id: 1, username: "Admin" };
    printUser(u);
}