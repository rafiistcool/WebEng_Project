// store.ts
import { defineStore } from 'pinia';

interface Card {
    id: number;
    question: string;
    answer: string;
    category: string;
}

export const useCardStore = defineStore('cardStore', {
    state: () => ({
        cards: [] as Card[],
        nextId: 1
    }),
    actions: {
        addCard(question: string, answer: string, category: string) {
            this.cards.push({ id: this.nextId++, question, answer, category });
            console.log(this.cards);
        }
    }
});