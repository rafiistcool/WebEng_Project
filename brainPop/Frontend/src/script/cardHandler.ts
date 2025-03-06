
import {ref} from "vue";

class Card {
    id: number;
    question: string;
    answer: string;
    category: string;

    constructor(id: number, question: string, answer: string, category: string) {
        this.id = id;
        this.question = question;
        this.answer = answer;
        this.category = category;
    }
}

const cards: Card[] = [];
const showPopup = ref(false);

const question = ref("");
const answer = ref("");
const category = ref("");

const startLearningmode = () => {

}

const addCard = () => {
    showPopup.value = true;
}
const saveCard = () => {
    cards.push(new Card(0, question.value, answer.value, category.value));
    console.log(cards);
}
const edit = () => {

}
const closePopup = () => {
    showPopup.value = false;
}

export default {
    startLearningmode,
    addCard,
    saveCard,
    edit,
    closePopup,
    question,
    answer,
    category,
    showPopup,
};
