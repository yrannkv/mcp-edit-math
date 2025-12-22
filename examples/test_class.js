class DataHandler {
    process() {
        const data = this.fetchData();
        this.save(data);
    }

    fetchData() {
        return { id: 1, value: "test" };
    }

    save(item) {
        console.log("Saved:", item);
    }
}