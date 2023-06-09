import '@fortawesome/fontawesome-free/js/all';
import {Modal, Collapse} from 'bootstrap';
import './css/bootstrap.css';
import './css/style.css';

import CalorieTracker from './Tracker';
import { Workout, Meal } from './Item';







class App{
    #tracker = new CalorieTracker();
    constructor(){
        // this._tracker = new CalorieTracker();

        // moved eventListeners to thier own functions
        // document.getElementById('meal-form').addEventListener('submit', this.#newItem.bind(this, 'meal'));
        // document.getElementById('workout-form').addEventListener('submit', this.#newItem.bind(this, 'workout'));
        // document.getElementById('meal-items').addEventListener('click', this.#removeItem.bind(this, 'meal'));
        // document.getElementById('workout-items').addEventListener('click', this.#removeItem.bind(this, 'workout'));
        // document.getElementById('filter-meals').addEventListener('keyup', this.#filterItems.bind(this, 'meal'));
        // document.getElementById('filter-workouts').addEventListener('keyup', this.#filterItems.bind(this, 'workout'));
        // document.getElementById('reset').addEventListener('click', this.#reset.bind(this));
        // document.getElementById('limit-form').addEventListener('submit', this.#setLimit.bind(this));
        this.#loadEventListeners();
        this.#tracker.loadItems();
    }
    #loadEventListeners(){
        document.getElementById('meal-form').addEventListener('submit', this.#newItem.bind(this, 'meal'));
        document.getElementById('workout-form').addEventListener('submit', this.#newItem.bind(this, 'workout'));
        document.getElementById('meal-items').addEventListener('click', this.#removeItem.bind(this, 'meal'));
        document.getElementById('workout-items').addEventListener('click', this.#removeItem.bind(this, 'workout'));
        document.getElementById('filter-meals').addEventListener('keyup', this.#filterItems.bind(this, 'meal'));
        document.getElementById('filter-workouts').addEventListener('keyup', this.#filterItems.bind(this, 'workout'));
        document.getElementById('reset').addEventListener('click', this.#reset.bind(this));
        document.getElementById('limit-form').addEventListener('submit', this.#setLimit.bind(this));
    }
    #newItem(type, e){
        e.preventDefault();
        const name = document.getElementById(`${type}-name`);
        const calories = document.getElementById(`${type}-calories`);

        // Validating inputs
        if(name.value === '' || calories.value === ''){
            alert('Please fill in all details');
            return;
        }
        if(type === 'meal'){
            const meal = new Meal(name.value, +calories.value);
            this.#tracker.addMeal(meal);
        }else{
            const workout = new Workout(name.value, +calories.value);
            this.#tracker.addWorkout(workout);
        }

        name.value = '';
        calories.value = '';

        // closing form
        const collapseItem = document.getElementById(`collapse-${type}`);
        const bsCollapse = new Collapse(collapseItem, {
            toggle: true
        })
    }

    #removeItem(type, e){
        if(e.target.classList.contains('delete') || e.target.classList.contains('fa-xmark')){
            if(confirm('Are You Sure?')){
                const id = e.target.closest('.card').getAttribute('data-id');
                type === 'meal' ? this.#tracker.removeMeal(id) : this.#tracker.removeWorkout(id);
                e.target.closest('.card').remove();
            }
        }
    }

    #filterItems(type, e){
        const text = e.target.value.toLowerCase();
        document.querySelectorAll(`#${type}-items .card`).forEach(item => {
            const name = item.firstElementChild.firstElementChild.textContent;
            if(name.toLowerCase().indexOf(text) !== -1){
                item.style.display = 'block';
            }else{
                item.style.display = 'none';
            }
        })
    }

    #reset(){
        this.#tracker.reset();
        document.getElementById('meal-items').innerHTML = '';
        document.getElementById('workout-items').innerHTML = '';
        document.getElementById('filter-meals').value = '';
        document.getElementById('filter-workouts').value = '';
    }

    #setLimit(e){
        e.preventDefault();
        const limit = document.getElementById('limit');
        if(limit.value === ''){
            alert('Please add a limit!');
            return;
        }
        this.#tracker.setLimit(+limit.value);
        limit.value = '';

        const modalEl = document.getElementById('limit-modal');
        const modal = Modal.getInstance(modalEl);
        modal.hide();
    }

    // Replaced newMeal() and newWorkout() with newItem
    // #newMeal(e){
    //     e.preventDefault();
    //     const name = document.getElementById('meal-name');
    //     const calories = document.getElementById('meal-calories');

    //     // Validating inputs
    //     if(name.value === '' || calories.value === ''){
    //         alert('Please fill in all details');
    //         return;
    //     }

    //     const meal = new Meal(name.value, +calories.value);
    //     this.#tracker.addMeal(meal);

    //     name.value = '';
    //     calories.value = '';

    //     // closing form
    //     const collapseMeal = document.getElementById('collapse-meal');
    //     const bsCollapse = new bootstrap.Collapse(collapseMeal, {
    //         toggle: true
    //     })
    // }
    // #newWorkout(e){
    //     e.preventDefault();
    //     const name = document.getElementById('workout-name');
    //     const calories = document.getElementById('workout-calories');

    //     // Validating inputs
    //     if(name.value === '' || calories.value === ''){
    //         alert('Please fill in all details');
    //         return;
    //     }

    //     const workout = new Workout(name.value, +calories.value);
    //     this.#tracker.addWorkout(workout);

    //     name.value = '';
    //     calories.value = '';

    //     // closing form
    //     const collapseWorkout = document.getElementById('collapse-workout');
    //     const bsCollapse = new bootstrap.Collapse(collapseWorkout, {
    //         toggle: true
    //     })
    // }
}
const app = new App();
