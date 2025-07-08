// store.ts
import { defineStore } from 'pinia';

interface Card {
    id: number;
    question: string;
    answer: string;
    category: string;
    setId: number | null | undefined; // Optional setId to associate cards with sets
}

interface Set {
    id: number;
    name: string;
    userId?: number;
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

// New store for managing sets
export const useSetStore = defineStore('setStore', {
    state: () => ({
        sets: [] as Set[],
        currentSet: null as Set | null
    }),
    actions: {
        // Add a set to the store
        addSet(set: Set) {
            // Check if set already exists
            const existingSetIndex = this.sets.findIndex(s => s.id === set.id);
            if (existingSetIndex >= 0) {
                // Update existing set
                this.sets[existingSetIndex] = set;
            } else {
                // Add new set
                this.sets.push(set);
            }
        },
        // Remove a set from the store
        removeSet(setId: number) {
            const index = this.sets.findIndex(s => s.id === setId);
            if (index >= 0) {
                this.sets.splice(index, 1);
            }
            // If current set is removed, reset currentSet
            if (this.currentSet && this.currentSet.id === setId) {
                this.currentSet = null;
            }
        },
        // Set the current set
        setCurrentSet(set: Set | null) {
            this.currentSet = set;
            // Also update the cardStore's currentSetId
            const cardStore = useCardStore();
            cardStore.setCurrentSet(set ? set.id : null);
        },
        // Get a set by ID
        getSetById(setId: number): Set | undefined {
            return this.sets.find(s => s.id === setId);
        },
        // Clear all sets
        clearSets() {
            this.sets = [];
            this.currentSet = null;
        }
    }
});
