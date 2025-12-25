class DataProcessor:
    def process(self, data):
        self.check_data(data)
        return self.transform(data)

    def check_data(self, data):
        if not data:
            raise ValueError("Empty")

    def transform(self, data):
        return data * 2