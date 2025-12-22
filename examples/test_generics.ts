interface ApiResponse<T> {
    data: T;
    status: number;
}

interface User {
    id: number;
    name: string;
}

// Функция-обертка
function wrapResponse<T>(item: T): ApiResponse<T> {
    return {
        data: item,
        status: 200
    };
}

function handleUser() {
    const user: User = { id: 1, name: "Alice" };
    // Зависимость: wrapResponse
    const response = wrapResponse(user);
    
    // Зависимость от структуры ApiResponse
    console.log(response.data.name); 
}