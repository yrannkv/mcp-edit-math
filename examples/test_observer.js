class NotificationService {
    constructor() {
        this.subscribers = [];
    }

    subscribe(callback) {
        this.subscribers.push(callback);
    }

    notify(message) {
        // Сложность: вызов функции, которая является элементом массива
        this.subscribers.forEach(callback => {
            // Зависимость: callback ожидает строку 'message'
            callback(message);
        });
    }
}

const service = new NotificationService();

// Подписчик 1
service.subscribe((msg) => {
    console.log("Log:", msg.toUpperCase());
});

// Подписчик 2
function alertUser(text) {
    console.log("Alert:", text.length);
}
service.subscribe(alertUser);