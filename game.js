const all_cards_names = ["Maple", "Plum", "Chestnut", "Dogwood"]


class Random {
    static int(max) {
        return Math.floor(Math.random() * max);
    }
}


class TriviaAnswer {
    constructor(first, second, correct_idx) {
        this.first = first
        this.second = second
        this.correct_idx = correct_idx
    }
}

let trivia_questions = [
    ["q1", new TriviaAnswer("1", "2", 0)],
    ["q2", new TriviaAnswer("2", "2", 1)],
    ["q3", new TriviaAnswer("3", "2", 0)],
    ["q4", new TriviaAnswer("4", "2", 1)],
    ["q5", new TriviaAnswer("5", "2", 0)],
]



class Card {
    constructor(
        name_of_leaf,
        trivia_question="",
        trivia_answer=null,
    ) {
        this.name_of_leaf = name_of_leaf
        this.trivia_question = trivia_question
        this.trivia_answer = trivia_answer
        this.owned = false
    }

    switch_to_owned() {
        self.owned = true
    }

    is_correct_answer(selected_idx) {
        return selected_idx == this.trivia_answer.correct_idx
    }
}


class Tile {
    constructor() {
        this.cards = this._init_cards()
    }

    _init_cards() {
        let card_name_to_do = {}
        for(let i in all_cards_names) {
            let card_name = all_cards_names[i]
            card_name_to_do[card_name] = new Card(card_name)

        }
        return card_name_to_do
    }
}


class Player {
    constructor(number) {
        this.number = number;
        this.tile = new Tile()
    }
}


class GameMaster {
    constructor(num_players) {
        this.game_complete = false

        this._num_players = num_players
        this._player_num_to_do = this._init_players()
        this._current_player_num = 0
        this._current_player = null
        this._current_card = null
        this._update_current_player()
    }

    _init_players() {
        let player_num_to_do = {}
        for(let i = 0; i < self.num_players; ++i) {
            player_num_to_do[i] = new Player(i)
        }
        return player_num_to_do
    }

    _update_current_player() {
        this._current_player = this._player_num_to_do[this._current_player_num]
    }

    increment_current_player() {
        this._current_player_num = (this._current_player_num + 1) % this._num_players
        this._update_current_player()
    }

    generate_new_card() {
        let trivia_question_idx = Random.int(trivia_questions.length)
        let trivia_question = trivia_questions[trivia_question_idx]
        trivia_question.slice(trivia_question_idx)

        let question, answer
        [question, answer] = trivia_question

        let leaf_idx = Random.int(all_cards_names.length)
        let leaf_name = all_cards_names[leaf_idx]

        return new Card(leaf_name, question, answer)
    }

    update_tile() {
        let current_leaf_name = this._current_card.name_of_leaf 
        let current_player_card = this._current_player.tile.cards[current_leaf_name]
        if (current_player_card.owned) {
            console.log(`already owns ${current_leaf_name}`)
        } else {
            console.log(`need to add ${current_leaf_name}`)
            this._current_card.owned = true
            this._current_player.tile.cards[current_leaf_name] = this._current_card
        }
    }

    is_correct_answer(answer_idx) {
        let is_correct = this._current_card.is_correct_answer(answer_idx)
        Displayer.update_correct(is_correct)
        if (is_correct) {
            this.update_tile()
        }
    }

    game_is_over() {
        let player_complete = true
        for(let i in this._current_player.tile.cards) {
            let card = this._current_player.tile.cards[i]
            player_complete &= card.owned
        }
        if (player_complete) {
            console.log("Player complete!")
            console.log(this._current_player)
            Displayer.update_complete(this._current_player)
        }
        return player_complete
    }

    step_game() {
        this._current_card = this.generate_new_card()
        Displayer.update_player(this._current_player)
        Displayer.update_card(this._current_card)

        this.increment_current_player()
    }
}

class Displayer {
    constructor() {
        self.player_num = document.getElementById("player_num")
        self.tile = document.getElementById("tile")
        self.card = document.getElementById("card")
        self.card_option1 = document.getElementById("card_option1")
        self.card_option2 = document.getElementById("card_option2")
    }

    static update_player(player) {
        document.getElementById("player_num").innerHTML = `Player ${player.number + 1}'s turn!`
        document.getElementById("tile").innerHTML = JSON.stringify(player.tile)

        let checked_radio_buttons = document.querySelector('input[name="trivia-answer"]:checked')
        if (checked_radio_buttons) {
            checked_radio_buttons.checked = false
        }
    }

    static update_card(card) {
        document.getElementById("card").innerHTML = card.trivia_question
        document.getElementById("card-option1").innerHTML = card.trivia_answer.first
        document.getElementById("card-option2").innerHTML = card.trivia_answer.second
    }

    static update_correct(is_correct) {
        document.getElementById("correct").innerHTML = `Answer is: ${is_correct}`
    }

    static update_complete(player) {
        this.update_player(player)
        document.getElementById("complete").innerHTML = "Game over!"
    }
}


let game_master = new GameMaster(num_players=3)
game_master.step_game()


function check_answer_and_step(answer_idx) {
    game_master.is_correct_answer(answer_idx)
    let game_is_over = game_master.game_is_over()
    if(!game_is_over) {
        game_master.step_game()
    }
}