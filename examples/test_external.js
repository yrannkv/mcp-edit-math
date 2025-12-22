import { externalLib } from 'some-lib';

function runTask() {
    // Мы не знаем код externalLib.execute, это черный ящик
    externalLib.execute("task_1");
}