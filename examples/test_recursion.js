function parseExpression(tokens) {
    const token = tokens.shift();
    if (token === '(') {
        // Зависимость: вызывает parseGroup
        return parseGroup(tokens);
    }
    return { type: 'literal', value: token };
}

function parseGroup(tokens) {
    // Зависимость: вызывает parseExpression (цикл!)
    const expr = parseExpression(tokens);
    const next = tokens.shift();
    if (next !== ')') throw new Error("Expected )");
    return { type: 'group', content: expr };
}