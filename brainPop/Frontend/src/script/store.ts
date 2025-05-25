// store.ts
import { defineStore } from 'pinia';

interface Card {
    id: number;
    question: string;
    answer: string;
    category: string;
    setId: number | null | undefined; // Optional setId to associate cards with sets
}

export const useCardStore = defineStore('cardStore', {
    state: () => ({
        cards: [] as Card[],
        nextId: 1,
        currentSetId: null as number | null // Store the current set ID
    }),
    actions: {
        addCard(question: string, answer: string, category: string) {
            this.cards.push({
                id: this.nextId++,
                question,
                answer,
                category,
                setId: this.currentSetId // Associate card with current set
            });
            console.log(this.cards);
        },
        setCurrentSet(setId: number | null) {
            this.currentSetId = setId;
        },
        getCardsForCurrentSet() {
            if (this.currentSetId === null) {
                return this.cards;
            }
            return this.cards.filter(card => card.setId === this.currentSetId);
        }
    }
});